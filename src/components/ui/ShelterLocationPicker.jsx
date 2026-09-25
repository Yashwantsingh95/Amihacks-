import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  useMap, 
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Check, 
  AlertCircle, 
  Loader2, 
  Building2, 
  X,
  Plus,
  Minus
} from 'lucide-react';
import { api } from '../../services/api';
import { requestCurrentPosition, formatCoordinates } from '../../services/locationService';

// Custom Draggable Shelter Pin Icon
const shelterPinIcon = L.divIcon({
  className: 'shelter-draggable-pin',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: grab;">
      <div style="background: #0d1321; color: #ffffff; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 10.5px; padding: 3px 10px; border-radius: 6px; border: 1.5px solid #ffffff; white-space: nowrap; box-shadow: 2px 2px 0px #0d1321; margin-bottom: 2px;">
        🏠 Shelter Location (Drag to adjust)
      </div>
      <div style="width: 40px; height: 40px; background: #e76f51; border: 3px solid #0d1321; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #0d1321;">
        <span style="font-size: 20px;">🏢</span>
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #0d1321;"></div>
    </div>
  `,
  iconSize: [140, 70],
  iconAnchor: [70, 70]
});

// Map Click Handler Sub-component
function MapClickHandler({ onLocationClicked }) {
  useMapEvents({
    click(e) {
      onLocationClicked(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Map Controller for Pan / Zoom
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || 15, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function ShelterLocationPicker({
  initialLocation = null, // { coordinates: [lng, lat], address: string }
  nearbyCoords = null, // { lat, lng } for proximity-biased search
  onLocationConfirmed,
  onCancel = null,
  confirmButtonText = 'Confirm Shelter Location'
}) {
  const [selectedCoords, setSelectedCoords] = useState(
    initialLocation?.coordinates && initialLocation.coordinates.length === 2
      ? [initialLocation.coordinates[0], initialLocation.coordinates[1]]
      : null
  );
  const [selectedAddress, setSelectedAddress] = useState(initialLocation?.address || '');
  const [mapCenter, setMapCenter] = useState(
    initialLocation?.coordinates && initialLocation.coordinates.length === 2
      ? [initialLocation.coordinates[1], initialLocation.coordinates[0]] // [lat, lng]
      : (nearbyCoords?.lat && nearbyCoords?.lng ? [nearbyCoords.lat, nearbyCoords.lng] : [28.6139, 77.2090])
  );
  const [mapZoom, setMapZoom] = useState(
    initialLocation?.coordinates && initialLocation.coordinates.length === 2 ? 15 : 12
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const markerRef = useRef(null);

  const tileUrl = import.meta.env.VITE_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = import.meta.env.VITE_OSM_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Live real-time autocomplete as user types (debounced ~250ms with local proximity bias)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.locations.search(
          searchQuery.trim(),
          nearbyCoords?.lat,
          nearbyCoords?.lng
        );
        if (res?.results && res.results.length > 0) {
          setSearchResults(res.results);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.warn('[Shelter search notice]', err.message);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, nearbyCoords]);

  // 1. Search places using dedicated search
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setIsSearching(true);
    setErrorMessage('');
    try {
      const res = await api.locations.search(
        searchQuery.trim(),
        nearbyCoords?.lat,
        nearbyCoords?.lng
      );
      if (res?.results?.length > 0) {
        setSearchResults(res.results);
      } else {
        setSearchResults([]);
        setErrorMessage(`No matching locations found for "${searchQuery}". Try a landmark, street or city.`);
      }
    } catch (err) {
      setErrorMessage(`Search error: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Select place from suggestions
  const handleSelectSuggestion = (place) => {
    setSelectedCoords([place.lng, place.lat]);
    setSelectedAddress(place.address || place.name);
    setMapCenter([place.lat, place.lng]);
    setMapZoom(16);
    setSearchResults([]);
    setSearchQuery(place.name || place.address);
    setErrorMessage('');
  };

  // 3. User clicks map directly
  const handleMapClick = async (lat, lng) => {
    setSelectedCoords([lng, lat]);
    setMapCenter([lat, lng]);
    setErrorMessage('');
    setIsReverseGeocoding(true);

    try {
      const res = await api.locations.reverse(lat, lng);
      setSelectedAddress(res.address || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    } catch (err) {
      setSelectedAddress(`Custom Shelter Pin (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // 4. User drags marker to adjust exact position
  const handleMarkerDragEnd = async () => {
    const marker = markerRef.current;
    if (marker != null) {
      const latLng = marker.getLatLng();
      const lat = latLng.lat;
      const lng = latLng.lng;
      setSelectedCoords([lng, lat]);
      setIsReverseGeocoding(true);

      try {
        const res = await api.locations.reverse(lat, lng);
        setSelectedAddress(res.address || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
      } catch (err) {
        setSelectedAddress(`Adjusted Pin (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
      } finally {
        setIsReverseGeocoding(false);
      }
    }
  };

  // 5. Explicit "Use My Current Location" button (ONLY executes when explicitly clicked)
  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    setErrorMessage('');
    try {
      const pos = await requestCurrentPosition();
      const lat = pos.latitude;
      const lng = pos.longitude;
      setSelectedCoords([lng, lat]);
      setMapCenter([lat, lng]);
      setMapZoom(16);
      setIsReverseGeocoding(true);

      const res = await api.locations.reverse(lat, lng);
      setSelectedAddress(res.address || `Device Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
    } catch (err) {
      setErrorMessage(`GPS Notice: ${err.message}. You can still search for an address or click anywhere on the map.`);
    } finally {
      setIsLocating(false);
      setIsReverseGeocoding(false);
    }
  };

  // 6. Confirm Location action
  const handleConfirm = () => {
    if (!selectedCoords || selectedCoords.length !== 2) {
      setErrorMessage('Please select a valid location on the map before confirming.');
      return;
    }

    if (onLocationConfirmed) {
      onLocationConfirmed({
        coordinates: selectedCoords,
        address: selectedAddress || 'Registered Shelter Location',
        latitude: selectedCoords[1],
        longitude: selectedCoords[0]
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Search Bar & Actions Strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shelter address, landmark or area (e.g. Karol Bagh, Hope Home)..."
              className="neo-input"
              style={{ paddingLeft: '40px', width: '100%', fontSize: '0.9rem' }}
            />
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} 
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800
                }}
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="neo-btn neo-btn-dark"
            style={{ padding: '0 18px', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
          >
            {isSearching ? <Loader2 size={16} className="anim-spin" /> : <Search size={16} />}
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="neo-btn neo-btn-outline"
            style={{ padding: '0 16px', fontSize: '0.88rem', whiteSpace: 'nowrap', background: '#ffffff' }}
            title="Use device GPS if shelter is at your current location"
          >
            {isLocating ? <Loader2 size={16} className="anim-spin" /> : <Crosshair size={16} />}
            <span>Use My Location</span>
          </button>
        </form>

        {/* Autocomplete / Search Suggestions List */}
        {searchResults.length > 0 && (
          <div 
            className="neo-card"
            style={{
              background: '#ffffff',
              padding: '8px',
              border: 'var(--border-dark)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-neo)',
              maxHeight: '220px',
              overflowY: 'auto',
              zIndex: 1100
            }}
          >
            {searchResults.map((place, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(place)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  borderBottom: idx < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <MapPin size={18} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                    {place.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                    {place.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Leaflet Picker Map */}
      <div 
        style={{
          position: 'relative',
          height: '360px',
          width: '100%',
          border: 'var(--border-dark)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-neo-sm)'
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url={tileUrl}
            attribution={tileAttribution}
            maxZoom={19}
          />

          <MapViewController center={mapCenter} zoom={mapZoom} />
          <MapClickHandler onLocationClicked={handleMapClick} />

          {/* Draggable Shelter Marker (Only renders when user explicitly selected a location) */}
          {selectedCoords && selectedCoords.length === 2 && !isNaN(selectedCoords[0]) && !isNaN(selectedCoords[1]) && (
            <Marker
              position={[selectedCoords[1], selectedCoords[0]]}
              icon={shelterPinIcon}
              draggable={true}
              ref={markerRef}
              eventHandlers={{
                dragend: handleMarkerDragEnd
              }}
            />
          )}
        </MapContainer>

        {/* Map Instructions Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1.5px solid #0d1321',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '0.75rem',
          fontWeight: 800,
          boxShadow: 'var(--shadow-neo-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>👆 Click anywhere on the map or drag pin to position</span>
        </div>

        {/* Zoom Controls */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            type="button"
            onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
            className="neo-btn neo-btn-outline"
            style={{ width: '32px', height: '32px', padding: 0, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
            className="neo-btn neo-btn-outline"
            style={{ width: '32px', height: '32px', padding: 0, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* Selected Shelter Location Status Card */}
      {selectedCoords ? (
        <div 
          className="neo-card"
          style={{
            background: '#ffffff',
            padding: '16px 20px',
            border: '2px solid var(--color-dark)',
            borderRadius: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                background: '#e76f51',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1.5px solid #0d1321',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Building2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  Selected Shelter Location
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-dark)', marginTop: '2px' }}>
                  {isReverseGeocoding ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)' }}>
                      <Loader2 size={14} className="anim-spin" /> Resolving address...
                    </span>
                  ) : (
                    selectedAddress || 'Custom Location Selected'
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600, marginTop: '4px' }}>
                  Latitude: <strong>{selectedCoords[1].toFixed(5)}</strong> • Longitude: <strong>{selectedCoords[0].toFixed(5)}</strong> ({formatCoordinates(selectedCoords[1], selectedCoords[0])})
                </div>
              </div>
            </div>

            <span className="neo-badge neo-badge-matched" style={{ fontSize: '0.72rem', flexShrink: 0 }}>
              Ready to Confirm
            </span>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#fff9e6',
          border: '2px dashed #b45309',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={22} color="#b45309" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#b45309' }}>
              No location selected
            </div>
            <div style={{ fontSize: '0.82rem', color: '#78350f', marginTop: '2px' }}>
              Please select your shelter location by searching an address or clicking on the map. A shelter cannot be registered without an explicit location.
            </div>
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div style={{
          background: '#fff2f2',
          border: '1.5px solid #e63946',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '0.82rem',
          color: '#e63946',
          fontWeight: 700
        }}>
          {errorMessage}
        </div>
      )}

      {/* Confirm & Cancel Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="neo-btn neo-btn-outline"
            style={{ padding: '10px 20px' }}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedCoords || isReverseGeocoding}
          className="neo-btn neo-btn-dark"
          style={{
            padding: '12px 24px',
            fontSize: '0.92rem',
            opacity: !selectedCoords ? 0.5 : 1,
            cursor: !selectedCoords ? 'not-allowed' : 'pointer'
          }}
        >
          <Check size={18} />
          <span>{confirmButtonText}</span>
        </button>
      </div>
    </div>
  );
}
