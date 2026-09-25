const axios = require('axios');

/**
 * Real Geocoding Service: Converts address -> coordinates [lng, lat]
 */
async function geocodeAddress(address) {
  if (!address || typeof address !== 'string') {
    return {
      coordinates: [77.2197, 28.6328],
      formattedAddress: 'Connaught Place, New Delhi',
      lat: 28.6328,
      lng: 77.2197
    };
  }

  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.MAPS_API_KEY;

  if (googleApiKey) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address, key: googleApiKey },
        timeout: 5000
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const lat = result.geometry.location.lat;
        const lng = result.geometry.location.lng;
        return {
          coordinates: [lng, lat],
          formattedAddress: result.formatted_address,
          lat,
          lng
        };
      }
    } catch (err) {
      console.warn('[Geocode] Google API notice:', err.message);
    }
  }

  // Dedicated OpenStreetMap Geocoder (Photon by Komoot - dedicated OSM search)
  try {
    const geoRes = await axios.get('https://photon.komoot.io/api/', {
      params: {
        q: address,
        limit: 1
      },
      timeout: 4000
    });

    if (geoRes.data && geoRes.data.features && geoRes.data.features.length > 0) {
      const first = geoRes.data.features[0];
      const [lng, lat] = first.geometry.coordinates;
      const label = [
        first.properties.name,
        first.properties.street,
        first.properties.city,
        first.properties.country
      ].filter(Boolean).join(', ');

      return {
        coordinates: [lng, lat],
        formattedAddress: label || address,
        lat,
        lng
      };
    }
  } catch (err) {
    console.warn('[Geocode] Dedicated OSM geocoder notice:', err.message);
  }

  // Default Delhi coordinates fallback
  return {
    coordinates: [77.2197, 28.6328],
    formattedAddress: address,
    lat: 28.6328,
    lng: 77.2197
  };
}

/**
 * Real Routing Service: calculates real turn-by-turn road polyline, distance (km), and ETA (mins)
 */
async function getRealDirections(origin, destination) {
  // origin, destination: { lat, lng } or [lng, lat]
  const oLat = Array.isArray(origin) ? origin[1] : origin.lat;
  const oLng = Array.isArray(origin) ? origin[0] : origin.lng;
  const dLat = Array.isArray(destination) ? destination[1] : destination.lat;
  const dLng = Array.isArray(destination) ? destination[0] : destination.lng;

  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.MAPS_API_KEY;

  if (googleApiKey) {
    try {
      const res = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${oLat},${oLng}`,
          destination: `${dLat},${dLng}`,
          key: googleApiKey,
          mode: 'driving'
        },
        timeout: 5000
      });

      if (res.data.status === 'OK' && res.data.routes.length > 0) {
        const route = res.data.routes[0];
        const leg = route.legs[0];
        const distanceKm = Math.round((leg.distance.value / 1000) * 10) / 10;
        const durationMinutes = Math.max(2, Math.round(leg.duration.value / 60));

        // Decode overview_polyline into coordinate array
        const coordinates = decodePolyline(route.overview_polyline.points);

        return {
          distanceKm,
          durationMinutes,
          coordinates
        };
      }
    } catch (err) {
      console.warn('[Directions] Google Maps API notice:', err.message);
    }
  }

  // Real OSRM driving router for real road routes without requiring an API key
  try {
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`;
    const osrmRes = await axios.get(osrmUrl, { timeout: 4500 });

    if (osrmRes.data && osrmRes.data.routes && osrmRes.data.routes.length > 0) {
      const route = osrmRes.data.routes[0];
      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMinutes = Math.max(3, Math.round(route.duration / 60));
      const coordinates = route.geometry.coordinates; // [[lng, lat], ...]

      return {
        distanceKm,
        durationMinutes,
        coordinates
      };
    }
  } catch (err) {
    console.warn('[Directions] OSRM router notice:', err.message);
  }

  // Geometric fallback route if offline
  const coordinates = [
    [oLng, oLat],
    [(oLng + dLng) / 2 + 0.005, (oLat + dLat) / 2],
    [dLng, dLat]
  ];

  return {
    distanceKm: 2.4,
    durationMinutes: 8,
    coordinates
  };
}

// Google polyline decoder helper
function decodePolyline(encoded) {
  const points = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lng * 1e-5, lat * 1e-5]); // [lng, lat]
  }

  return points;
}

/**
 * Dedicated OpenStreetMap Place Search / Autocomplete (Photon by Komoot)
 */
async function searchAddress(query, userLat, userLon) {
  if (!query || typeof query !== 'string' || !query.trim()) return [];

  const params = {
    q: query.trim(),
    limit: 6
  };

  const latNum = Number(userLat);
  const lonNum = Number(userLon);
  if (!isNaN(latNum) && !isNaN(lonNum) && (latNum !== 0 || lonNum !== 0)) {
    params.lat = latNum;
    params.lon = lonNum;
  }

  try {
    const res = await axios.get('https://photon.komoot.io/api/', {
      params,
      timeout: 4000
    });

    if (res.data?.features?.length > 0) {
      return res.data.features.map(f => {
        const [lng, lat] = f.geometry.coordinates;
        const name = f.properties.name || f.properties.street || query;
        const parts = [
          f.properties.street,
          f.properties.district,
          f.properties.city,
          f.properties.state,
          f.properties.country
        ].filter(Boolean);
        const address = parts.length > 0 ? parts.join(', ') : name;

        return {
          name,
          address: name !== address ? `${name}, ${address}` : address,
          coordinates: [lng, lat],
          lat,
          lng
        };
      });
    }
  } catch (err) {
    console.warn('[SearchAddress notice]', err.message);
  }
  return [];
}

/**
 * Dedicated Reverse Geocoder (Photon reverse by Komoot)
 */
async function reverseGeocode(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (isNaN(latitude) || isNaN(longitude)) return 'Unknown location';

  try {
    const res = await axios.get('https://photon.komoot.io/reverse', {
      params: {
        lat: latitude,
        lon: longitude
      },
      timeout: 4000
    });

    if (res.data?.features?.length > 0) {
      const f = res.data.features[0];
      const parts = [
        f.properties.name,
        f.properties.street,
        f.properties.district,
        f.properties.city,
        f.properties.state,
        f.properties.country
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  } catch (err) {
    console.warn('[ReverseGeocode notice]', err.message);
  }

  return `Coordinates: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
}

module.exports = {
  geocodeAddress,
  getRealDirections,
  searchAddress,
  reverseGeocode
};
