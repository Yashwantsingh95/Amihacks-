import { api } from './api';

/**
 * Real Browser Geolocation Service
 */

export const requestCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: new Date(position.timestamp).toISOString()
        };
        resolve(coords);
      },
      (error) => {
        let message = 'Unable to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
};

/**
 * Throttled live position watcher (e.g. for active driver)
 */
let watchId = null;
let lastSyncTime = 0;

export const startWatchingPosition = (onLocationUpdate, intervalMs = 6000) => {
  if (!navigator.geolocation) return null;
  if (watchId !== null) return watchId;

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const now = Date.now();
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: new Date(position.timestamp).toISOString()
      };

      if (onLocationUpdate) {
        onLocationUpdate(coords);
      }

      // Throttle backend persistence to every intervalMs (5-8 seconds)
      if (now - lastSyncTime >= intervalMs) {
        lastSyncTime = now;
        api.locations.updateUserLocation(coords).catch((err) => {
          console.warn('[Location Sync notice]', err.message);
        });
      }
    },
    (err) => {
      console.warn('[WatchPosition warning]', err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );

  return watchId;
};

export const stopWatchingPosition = () => {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
};

/**
 * Format raw GPS coordinates into standard navigational notation
 * e.g. 28.6328° N, 77.2197° E
 */
export const formatCoordinates = (latitude, longitude) => {
  if (latitude == null || longitude == null || isNaN(latitude) || isNaN(longitude)) {
    return 'Acquiring GPS...';
  }
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lngDir}`;
};

/**
 * Haversine formula to compute geodesic distance between two points in km
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
};

