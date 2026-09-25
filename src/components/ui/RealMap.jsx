import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  Circle,
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Plus, 
  Minus, 
  Crosshair, 
  Maximize2, 
  Minimize2, 
  Navigation,
  Clock,
  Radio,
  Home,
  Truck,
  Package,
  CheckCircle2
} from 'lucide-react';
import { formatCoordinates, calculateDistanceKm } from '../../services/locationService';

// Custom Neo-Brutalist Leaflet Marker Icons using L.divIcon
const createUserIcon = () => L.divIcon({
  className: 'custom-leaflet-pin user-pin',
  html: `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(42, 157, 143, 0.25); border: 2px solid #2a9d8f; animation: pulse 2s infinite;"></div>
      <div style="width: 18px; height: 18px; border-radius: 50%; background: #2a9d8f; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
      <div style="position: absolute; bottom: -20px; background: #0d1321; color: #ffffff; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 9px; padding: 1px 6px; border-radius: 4px; border: 1px solid #ffffff; white-space: nowrap; box-shadow: 1px 1px 0px #0d1321;">
        You Are Here
      </div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22]
});

const createDriverIcon = (name) => L.divIcon({
  className: 'custom-leaflet-pin driver-pin',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="background: #0d1321; color: #f0ebd8; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px; border: 1.5px solid #f0ebd8; white-space: nowrap; box-shadow: 2px 2px 0px #0d1321; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">
        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #2a9d8f;"></span>
        ${name || 'Driver'}
      </div>
      <div style="width: 38px; height: 38px; background: #1d2d44; border: 2.5px solid #0d1321; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #0d1321;">
        <span style="font-size: 20px;">🚐</span>
      </div>
    </div>
  `,
  iconSize: [80, 60],
  iconAnchor: [40, 48],
  popupAnchor: [0, -48]
});

const createShelterIcon = (name) => L.divIcon({
  className: 'custom-leaflet-pin shelter-pin',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="background: #ffffff; color: #0d1321; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px; border: 1.5px solid #0d1321; white-space: nowrap; box-shadow: 2px 2px 0px #0d1321; margin-bottom: 2px;">
        🏠 ${name || 'Shelter'}
      </div>
      <div style="width: 38px; height: 38px; background: #e9e3d0; border: 2.5px solid #0d1321; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #0d1321;">
        <span style="font-size: 20px;">🏢</span>
      </div>
    </div>
  `,
  iconSize: [80, 60],
  iconAnchor: [40, 48],
  popupAnchor: [0, -48]
});

const createDonorIcon = (name) => L.divIcon({
  className: 'custom-leaflet-pin donor-pin',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="background: #ffffff; color: #0d1321; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px; border: 1.5px solid #0d1321; white-space: nowrap; box-shadow: 2px 2px 0px #0d1321; margin-bottom: 2px;">
        📍 ${name || 'Pickup Point'}
      </div>
      <div style="width: 38px; height: 38px; background: #3e5c76; border: 2.5px solid #0d1321; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #0d1321;">
        <span style="font-size: 20px;">🍲</span>
      </div>
    </div>
  `,
  iconSize: [90, 60],
  iconAnchor: [45, 48],
  popupAnchor: [0, -48]
});

// Inner controller to bridge Leaflet Map methods (zoom, pan, fitBounds)
function LeafletMapBridge({ 
  boundsPoints, 
  routeCoordinates,
  userCoords, 
  driverCoords,
  onMapReady 
}) {
  const map = useMap();
  const hasFitInitialBounds = useRef(false);
  const prevRouteCount = useRef(0);

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  // Fit bounds when new road route coordinates arrive or initial nodes mount
  useEffect(() => {
    if (!map) return;
    try {
      if (Array.isArray(routeCoordinates) && routeCoordinates.length > 1 && routeCoordinates.length !== prevRouteCount.current) {
        prevRouteCount.current = routeCoordinates.length;
        const validCoords = routeCoordinates.filter(p => p && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1]));
        if (validCoords.length > 0) {
          const latLngs = validCoords.map(p => [p[1], p[0]]); // Leaflet uses [lat, lng]
          const bounds = L.latLngBounds(latLngs);
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
          return;
        }
      }

      if (!hasFitInitialBounds.current && boundsPoints && boundsPoints.length > 0) {
        const validPoints = boundsPoints.filter(p => p && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1]));
        if (validPoints.length > 0) {
          const latLngs = validPoints.map(p => [p[1], p[0]]); // Leaflet uses [lat, lng]
          const bounds = L.latLngBounds(latLngs);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
          hasFitInitialBounds.current = true;
        }
      }
    } catch (err) {
      console.warn('[Leaflet fitBounds notice]', err.message);
    }
  }, [map, boundsPoints, routeCoordinates]);

  return null;
}

export default function RealMap({
  donorCoords = null, // [lng, lat]
  donorName = 'Donation Pickup',
  donorAddress = 'Connaught Place, New Delhi',
  shelterCoords = null, // [lng, lat]
  shelterName = 'Shelter',
  shelterAddress = '',
  shelterCapacity = null,
  shelterOccupancy = null,
  shelterNeed = 'HIGH',
  driverCoords = null, // [lng, lat]
  driverName = 'Rahul',
  driverVehicle = 'Hero Electric Eco-Van',
  driverPhone = '+91 98765 43210',
  driverStatus = 'ON_THE_WAY',
  driverUpdatedAt = null,
  userCoords = null, // [lng, lat]
  userAccuracy = null,
  userUpdatedAt = null,
  routeCoordinates = [], // [[lng, lat], ...]
  height = '460px',
  status = 'ON_THE_WAY',
  interactive = true,
  onLocateDevice = null,
  onRouteCalculated = null
}) {
  const mapWrapperRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [secondsSinceUserUpdate, setSecondsSinceUserUpdate] = useState(0);

  // Configurable OpenStreetMap Tile URL & Attribution
  const tileUrl = import.meta.env.VITE_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = import.meta.env.VITE_OSM_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Live seconds ticker for "Updated Xs ago" badge
  useEffect(() => {
    const timer = setInterval(() => {
      if (userUpdatedAt) {
        const diff = Math.max(0, Math.floor((Date.now() - new Date(userUpdatedAt).getTime()) / 1000));
        setSecondsSinceUserUpdate(diff);
      } else if (driverUpdatedAt) {
        const diff = Math.max(0, Math.floor((Date.now() - new Date(driverUpdatedAt).getTime()) / 1000));
        setSecondsSinceUserUpdate(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [userUpdatedAt, driverUpdatedAt]);

  // Determine initial center: User or Driver or Donor or Shelter or Delhi Central
  const defaultCenter = useMemo(() => {
    if (userCoords && userCoords.length === 2) return [userCoords[1], userCoords[0]];
    if (driverCoords && driverCoords.length === 2) return [driverCoords[1], driverCoords[0]];
    if (donorCoords && donorCoords.length === 2) return [donorCoords[1], donorCoords[0]];
    if (shelterCoords && shelterCoords.length === 2) return [shelterCoords[1], shelterCoords[0]];
    return [28.6139, 77.2090]; // Delhi Central fallback
  }, [userCoords, driverCoords, donorCoords, shelterCoords]);

  // Collect all valid bounding points
  const boundsPoints = useMemo(() => {
    return [donorCoords, shelterCoords, driverCoords, userCoords].filter(Boolean);
  }, [donorCoords, shelterCoords, driverCoords, userCoords]);

  // Format real road route for Leaflet Polyline: converts [[lng, lat], ...] to [[lat, lng], ...]
  const leafletPolylinePositions = useMemo(() => {
    if (routeCoordinates && routeCoordinates.length > 1) {
      return routeCoordinates.map(pt => [pt[1], pt[0]]);
    }
    // If no intermediate polyline, draw straight road link between driver/donor and shelter
    const start = driverCoords || donorCoords;
    const end = shelterCoords;
    if (start && end) {
      return [
        [start[1], start[0]],
        [end[1], end[0]]
      ];
    }
    return [];
  }, [routeCoordinates, driverCoords, donorCoords, shelterCoords]);

  // Custom Controls Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (userCoords) {
      mapInstanceRef.current.panTo([userCoords[1], userCoords[0]]);
      mapInstanceRef.current.setZoom(16);
    } else if (driverCoords) {
      mapInstanceRef.current.panTo([driverCoords[1], driverCoords[0]]);
      mapInstanceRef.current.setZoom(15);
    } else if (donorCoords) {
      mapInstanceRef.current.panTo([donorCoords[1], donorCoords[0]]);
    }
    if (onLocateDevice) {
      onLocateDevice();
    }
  };

  const toggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const activeDisplayCoords = userCoords || driverCoords || donorCoords;
  const isLiveGpsActive = Boolean(userCoords || driverCoords);
  const isRecentUpdate = secondsSinceUserUpdate < 15;

  return (
    <div
      ref={mapWrapperRef}
      className="neo-card"
      style={{
        position: 'relative',
        height: isFullscreen ? '100vh' : height,
        overflow: 'hidden',
        background: '#e9e3ce',
        padding: 0,
        borderRadius: isFullscreen ? '0' : undefined
      }}
    >
      {/* Real Leaflet Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={14}
        zoomControl={false}
        scrollWheelZoom={interactive}
        attributionControl={true}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        {/* Real OpenStreetMap Tile Layer */}
        <TileLayer
          url={tileUrl}
          attribution={tileAttribution}
          maxZoom={19}
        />

        {/* Bridge to control map imperatively */}
        <LeafletMapBridge
          boundsPoints={boundsPoints}
          routeCoordinates={routeCoordinates}
          userCoords={userCoords}
          driverCoords={driverCoords}
          onMapReady={(map) => { mapInstanceRef.current = map; }}
        />

        {/* Real Road Route Polyline */}
        {leafletPolylinePositions.length > 1 && (
          <>
            {/* Dark border shadow for route */}
            <Polyline
              positions={leafletPolylinePositions}
              pathOptions={{
                color: '#0d1321',
                weight: 8,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Primary active route line */}
            <Polyline
              positions={leafletPolylinePositions}
              pathOptions={{
                color: '#3e5c76',
                weight: 5,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </>
        )}

        {/* 1. DONOR / PICKUP MARKER */}
        {donorCoords && donorCoords.length === 2 && !isNaN(donorCoords[0]) && !isNaN(donorCoords[1]) && (
          <Marker
            position={[donorCoords[1], donorCoords[0]]}
            icon={createDonorIcon(donorName)}
          >
            <Popup className="neo-leaflet-popup">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", padding: '4px' }}>
                <span className="neo-badge neo-badge-matched" style={{ fontSize: '0.7rem' }}>
                  PICKUP LOCATION
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 2px' }}>{donorName}</h4>
                <p style={{ fontSize: '0.82rem', color: '#555', margin: '0 0 6px' }}>{donorAddress}</p>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3e5c76' }}>
                  GPS: {formatCoordinates(donorCoords[1], donorCoords[0])}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 2. SHELTER / DESTINATION MARKER */}
        {shelterCoords && shelterCoords.length === 2 && !isNaN(shelterCoords[0]) && !isNaN(shelterCoords[1]) && (
          <Marker
            position={[shelterCoords[1], shelterCoords[0]]}
            icon={createShelterIcon(shelterName)}
          >
            <Popup className="neo-leaflet-popup">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", padding: '4px' }}>
                <span className="neo-badge neo-badge-dark" style={{ fontSize: '0.7rem' }}>
                  SHELTER DESTINATION
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 2px' }}>{shelterName}</h4>
                <p style={{ fontSize: '0.82rem', color: '#555', margin: '0 0 4px' }}>{shelterAddress}</p>
                {shelterCapacity && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Capacity: {shelterOccupancy || 0} / {shelterCapacity} • Need: <span style={{ color: '#e63946' }}>{shelterNeed}</span>
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3e5c76' }}>
                  GPS: {formatCoordinates(shelterCoords[1], shelterCoords[0])}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 3. DRIVER LIVE GPS MARKER (Updates in real time from Socket.IO) */}
        {driverCoords && driverCoords.length === 2 && !isNaN(driverCoords[0]) && !isNaN(driverCoords[1]) && (
          <Marker
            position={[driverCoords[1], driverCoords[0]]}
            icon={createDriverIcon(driverName)}
            zIndexOffset={1000}
          >
            <Popup className="neo-leaflet-popup">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", padding: '4px' }}>
                <span className="neo-badge neo-badge-live" style={{ fontSize: '0.7rem' }}>
                  <span className="pulse-dot" /> LIVE RESCUE DRIVER
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 2px' }}>{driverName}</h4>
                <p style={{ fontSize: '0.82rem', color: '#555', margin: '0 0 4px' }}>{driverVehicle}</p>
                {driverPhone && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Contact: {driverPhone}
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2a9d8f' }}>
                  GPS: {formatCoordinates(driverCoords[1], driverCoords[0])}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 4. CURRENT USER ("You Are Here" Browser GPS Marker) */}
        {userCoords && userCoords.length === 2 && !isNaN(userCoords[0]) && !isNaN(userCoords[1]) && (
          <>
            <Marker
              position={[userCoords[1], userCoords[0]]}
              icon={createUserIcon()}
              zIndexOffset={900}
            >
              <Popup className="neo-leaflet-popup">
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", padding: '4px' }}>
                  <span className="neo-badge neo-badge-live" style={{ fontSize: '0.7rem' }}>
                    CURRENT DEVICE GPS
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 2px' }}>You Are Here</h4>
                  <div style={{ fontSize: '0.8rem', color: '#555', margin: '0 0 4px' }}>
                    Accuracy: {userAccuracy ? `±${Math.round(userAccuracy)} m` : 'High precision'}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2a9d8f' }}>
                    GPS: {formatCoordinates(userCoords[1], userCoords[0])}
                  </div>
                </div>
              </Popup>
            </Marker>
            {userAccuracy && (
              <Circle
                center={[userCoords[1], userCoords[0]]}
                radius={Math.min(userAccuracy, 300)}
                pathOptions={{
                  color: '#2a9d8f',
                  fillColor: '#2a9d8f',
                  fillOpacity: 0.12,
                  weight: 1.5
                }}
              />
            )}
          </>
        )}
      </MapContainer>

      {/* Top Left Live GPS Status & Coordinate Badges */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {/* Live GPS Status */}
        <div 
          className={`neo-badge ${isRecentUpdate && isLiveGpsActive ? 'neo-badge-live' : 'neo-badge-dark'}`}
          style={{ padding: '6px 12px', fontSize: '0.8rem', pointerEvents: 'auto' }}
        >
          <span className={isRecentUpdate && isLiveGpsActive ? 'pulse-dot' : ''} />
          {isRecentUpdate && isLiveGpsActive ? 'LIVE GPS (OSM)' : 'LAST SEEN'}
        </div>

        {/* Dynamic Coordinates Badge */}
        <div style={{
          background: '#ffffff',
          border: 'var(--border-dark)',
          borderRadius: '8px',
          padding: '6px 14px',
          fontSize: '0.78rem',
          fontWeight: 800,
          boxShadow: 'var(--shadow-neo-sm)',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Navigation size={14} color="var(--color-primary)" />
          <span>
            {activeDisplayCoords ? (
              <>GPS: {formatCoordinates(activeDisplayCoords[1], activeDisplayCoords[0])}</>
            ) : (
              'GPS: Detecting device...'
            )}
          </span>
          {userAccuracy && (
            <span style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
              (±{Math.round(userAccuracy)}m)
            </span>
          )}
        </div>

        {/* Last Updated Timestamp */}
        {secondsSinceUserUpdate > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.94)',
            border: 'var(--border-dark)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--color-muted)',
            boxShadow: 'var(--shadow-neo-sm)',
            pointerEvents: 'auto'
          }}>
            Updated {secondsSinceUserUpdate}s ago
          </div>
        )}
      </div>

      {/* Custom Neo-Brutalist Controls (Top Right: Zoom In, Zoom Out, Locate Me, Fullscreen) */}
      {interactive && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1000
        }}>
          <button
            onClick={handleZoomIn}
            className="neo-btn neo-btn-outline"
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neo-sm)'
            }}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus size={18} />
          </button>

          <button
            onClick={handleZoomOut}
            className="neo-btn neo-btn-outline"
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neo-sm)'
            }}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus size={18} />
          </button>

          <button
            onClick={handleRecenter}
            className="neo-btn neo-btn-outline"
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neo-sm)'
            }}
            title="Center on My Location"
            aria-label="Locate Me"
          >
            <Crosshair size={18} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="neo-btn neo-btn-outline"
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neo-sm)'
            }}
            title="Toggle Fullscreen"
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
