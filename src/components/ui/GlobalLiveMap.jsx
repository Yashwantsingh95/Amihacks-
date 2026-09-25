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
  Crosshair, 
  Plus, 
  Minus, 
  Maximize2, 
  Minimize2, 
  MapPin, 
  Building2, 
  Truck, 
  Package, 
  Navigation, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  RefreshCw,
  Clock,
  Radio,
  Home
} from 'lucide-react';
import { requestCurrentPosition, startWatchingPosition, stopWatchingPosition, formatCoordinates } from '../../services/locationService';
import { getSocket } from '../../services/socket';
import { api } from '../../services/api';

// Custom Neo-Brutalist Pins for Leaflet
const createShelterIcon = (name, need) => L.divIcon({
  className: 'custom-leaflet-pin shelter-pin',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="background: #ffffff; color: #0d1321; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px; border: 1.5px solid #0d1321; white-space: nowrap; box-shadow: 2px 2px 0px #0d1321; margin-bottom: 2px;">
        🏠 ${name}
      </div>
      <div style="width: 36px; height: 36px; background: #2a9d8f; border: 2.5px solid #0d1321; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #0d1321;">
        <span style="font-size: 18px;">🏢</span>
      </div>
    </div>
  `,
  iconSize: [80, 56],
  iconAnchor: [40, 46],
  popupAnchor: [0, -46]
});

const createDonationIcon = (foodType, qty) => L.divIcon({
  className: 'custom-leaflet-pin donation-pin',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="background: #ffffff; color: #0d1321; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px; border: 1.5px solid #0d1321; white-space: nowrap; box-shadow: 2px 2px 0px #0d1321; margin-bottom: 2px;">
        📦 ${qty ? `${qty} • ` : ''}${foodType}
      </div>
      <div style="width: 36px; height: 36px; background: #e76f51; border: 2.5px solid #0d1321; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #0d1321;">
        <span style="font-size: 18px;">🍲</span>
      </div>
    </div>
  `,
  iconSize: [100, 56],
  iconAnchor: [50, 46],
  popupAnchor: [0, -46]
});

const createDriverIcon = (name, isAvailable) => L.divIcon({
  className: 'custom-leaflet-pin driver-pin',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="background: #0d1321; color: #f0ebd8; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px; border: 1.5px solid #f0ebd8; white-space: nowrap; box-shadow: 2px 2px 0px #0d1321; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">
        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${isAvailable ? '#2a9d8f' : '#e63946'};"></span>
        ${name}
      </div>
      <div style="width: 36px; height: 36px; background: ${isAvailable ? '#3a86ff' : '#6c757d'}; border: 2.5px solid #0d1321; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #0d1321;">
        <span style="font-size: 18px;">🚐</span>
      </div>
    </div>
  `,
  iconSize: [80, 56],
  iconAnchor: [40, 46],
  popupAnchor: [0, -46]
});

const createUserIcon = () => L.divIcon({
  className: 'custom-leaflet-pin user-pin',
  html: `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(230, 57, 70, 0.25); border: 2px solid #e63946; animation: pulse 2s infinite;"></div>
      <div style="width: 18px; height: 18px; border-radius: 50%; background: #e63946; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
      <div style="position: absolute; bottom: -20px; background: #0d1321; color: #ffffff; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 9px; padding: 1px 6px; border-radius: 4px; border: 1px solid #ffffff; white-space: nowrap; box-shadow: 1px 1px 0px #0d1321;">
        📍 You Are Here
      </div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22]
});

// Map controller bridge for pan/zoom and initial fit
function GlobalMapBridge({ boundsPoints, onMapReady }) {
  const map = useMap();
  const hasFitBounds = useRef(false);

  useEffect(() => {
    if (onMapReady) onMapReady(map);
  }, [map, onMapReady]);

  useEffect(() => {
    if (!map || hasFitBounds.current || !boundsPoints || boundsPoints.length === 0) return;
    try {
      const validPoints = boundsPoints.filter(p => p && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1]));
      if (validPoints.length > 0) {
        const latLngs = validPoints.map(p => [p[1], p[0]]);
        map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50], maxZoom: 15 });
        hasFitBounds.current = true;
      }
    } catch (err) {
      console.warn('[GlobalMap fitBounds notice]', err.message);
    }
  }, [map, boundsPoints]);

  return null;
}

export default function GlobalLiveMap({
  role = 'DONOR',
  height = '580px',
  initialCenter = null,
  activeFilter = 'ALL',
  onSelectEntity = null
}) {
  const [networkData, setNetworkData] = useState({
    shelters: [],
    donations: [],
    drivers: [],
    currentUser: null,
    activeMission: null
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(activeFilter);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Standby');
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());

  const mapInstanceRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Configurable OpenStreetMap Tile URL & Attribution
  const tileUrl = import.meta.env.VITE_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = import.meta.env.VITE_OSM_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // 1. Fetch Real Network State from Backend MongoDB
  const loadNetwork = async () => {
    try {
      const res = await api.map.getNetwork();
      if (res && res.success) {
        setNetworkData({
          shelters: res.shelters || [],
          donations: res.donations || [],
          drivers: res.drivers || [],
          currentUser: res.currentUser || null,
          activeMission: res.activeMission || null
        });

        if (!userLocation && res.currentUser?.coordinates) {
          setUserLocation({
            longitude: res.currentUser.coordinates[0],
            latitude: res.currentUser.coordinates[1],
            accuracy: res.currentUser.accuracy || 10
          });
          setLocationStatus('Using database location');
        }

        setLastUpdatedTime(new Date());
      }
    } catch (err) {
      console.warn('[Map Network Load]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetwork();
  }, []);

  // 2. Continuous Device Location via Geolocation watchPosition
  useEffect(() => {
    const watchId = startWatchingPosition((coords) => {
      setUserLocation(coords);
      setLocationAccuracy(coords.accuracy);
      setLocationStatus(`Live GPS (±${Math.round(coords.accuracy)}m)`);

      api.locations.updateUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy
      }).catch(() => {});
    }, 8000);

    return () => {
      stopWatchingPosition();
    };
  }, []);

  // 3. Real-Time Socket.IO Location Updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleDriverMoved = (payload) => {
      const coords = payload.coordinates || (payload.longitude && payload.latitude ? [payload.longitude, payload.latitude] : null);
      if (!coords) return;

      setNetworkData((prev) => ({
        ...prev,
        drivers: prev.drivers.map((drv) => {
          if (drv.id === payload.driverId || drv._id === payload.driverId) {
            return {
              ...drv,
              coordinates: coords,
              accuracy: payload.accuracy,
              updatedAt: payload.timestamp || new Date().toISOString()
            };
          }
          return drv;
        }),
        activeMission: prev.activeMission ? {
          ...prev.activeMission,
          driverLocation: coords
        } : null
      }));
      setLastUpdatedTime(new Date());
    };

    const handleUserMoved = (payload) => {
      const coords = payload.coordinates || (payload.longitude && payload.latitude ? [payload.longitude, payload.latitude] : null);
      if (!coords) return;

      setNetworkData((prev) => ({
        ...prev,
        donations: prev.donations.map((d) => {
          if (d.donorId === payload.userId) {
            return { ...d, coordinates: coords };
          }
          return d;
        })
      }));
      setLastUpdatedTime(new Date());
    };

    socket.on('driver:location_updated', handleDriverMoved);
    socket.on('user:location_updated', handleUserMoved);

    return () => {
      socket.off('driver:location_updated', handleDriverMoved);
      socket.off('user:location_updated', handleUserMoved);
    };
  }, []);

  // 4. "Locate Me" Handler
  const handleLocateMe = async () => {
    setLocating(true);
    setLocationStatus('Acquiring high-precision GPS...');
    try {
      const pos = await requestCurrentPosition();
      setUserLocation(pos);
      setLocationAccuracy(pos.accuracy);
      setLocationStatus(`GPS Locked (±${Math.round(pos.accuracy)}m)`);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([pos.latitude, pos.longitude]);
        mapInstanceRef.current.setZoom(16);
      }

      await api.locations.updateUserLocation({
        latitude: pos.latitude,
        longitude: pos.longitude,
        accuracy: pos.accuracy
      });
    } catch (err) {
      setLocationStatus(`Location error: ${err.message}`);
    } finally {
      setLocating(false);
    }
  };

  // 5. Filter Entities based on active filter
  const visibleShelters = (filter === 'ALL' || filter === 'SHELTERS') ? networkData.shelters : [];
  const visibleDonations = (filter === 'ALL' || filter === 'DONATIONS') ? networkData.donations : [];
  const visibleDrivers = (filter === 'ALL' || filter === 'DRIVERS') ? networkData.drivers : [];

  // Determine map center coordinates: Leaflet uses [lat, lng]
  const mapCenter = useMemo(() => {
    if (initialCenter && initialCenter.length === 2) return [initialCenter[1], initialCenter[0]];
    if (userLocation) return [userLocation.latitude, userLocation.longitude];
    if (networkData.currentUser?.coordinates) return [networkData.currentUser.coordinates[1], networkData.currentUser.coordinates[0]];
    if (networkData.shelters.length > 0) return [networkData.shelters[0].coordinates[1], networkData.shelters[0].coordinates[0]];
    return [28.6139, 77.2090]; // Delhi Central
  }, [initialCenter, userLocation, networkData]);

  // Collect all points for fitBounds: [[lng, lat], ...]
  const boundsPoints = useMemo(() => {
    const pts = [];
    if (userLocation) pts.push([userLocation.longitude, userLocation.latitude]);
    visibleShelters.forEach(s => { if (s.coordinates) pts.push(s.coordinates); });
    visibleDonations.forEach(d => { if (d.coordinates) pts.push(d.coordinates); });
    visibleDrivers.forEach(drv => { if (drv.coordinates) pts.push(drv.coordinates); });
    return pts;
  }, [userLocation, visibleShelters, visibleDonations, visibleDrivers]);

  // Format active mission route for Leaflet
  const activeMissionPolyline = useMemo(() => {
    if (networkData.activeMission?.routeCoordinates?.length > 1) {
      return networkData.activeMission.routeCoordinates.map(c => [c[1], c[0]]);
    }
    return [];
  }, [networkData.activeMission]);

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : height,
        borderRadius: isFullscreen ? '0' : '16px',
        border: isFullscreen ? 'none' : 'var(--border-dark)',
        boxShadow: isFullscreen ? 'none' : 'var(--shadow-neo)',
        overflow: 'hidden',
        background: '#e9e3ce',
        fontFamily: "'Space Grotesk', sans-serif",
        zIndex: isFullscreen ? 9999 : 1
      }}
    >
      {/* Real OpenStreetMap Leaflet Container */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        zoomControl={false}
        attributionControl={true}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        {/* Real OpenStreetMap Tiles */}
        <TileLayer
          url={tileUrl}
          attribution={tileAttribution}
          maxZoom={19}
        />

        {/* Imperative Map Bridge */}
        <GlobalMapBridge
          boundsPoints={boundsPoints}
          onMapReady={(map) => { mapInstanceRef.current = map; }}
        />

        {/* Active Mission Polyline */}
        {activeMissionPolyline.length > 1 && (
          <Polyline
            positions={activeMissionPolyline}
            pathOptions={{
              color: '#0d1321',
              weight: 5,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {/* 1. Shelters Markers */}
        {visibleShelters.map((s) => {
          if (!s.coordinates || s.coordinates.length !== 2) return null;
          return (
            <Marker
              key={`shelter-${s.id}`}
              position={[s.coordinates[1], s.coordinates[0]]}
              icon={createShelterIcon(s.name, s.currentNeed)}
              eventHandlers={{
                click: () => {
                  setSelectedEntity(s);
                  if (onSelectEntity) onSelectEntity(s);
                }
              }}
            >
              <Popup className="neo-leaflet-popup">
                <div style={{ padding: '4px' }}>
                  <span className="neo-badge neo-badge-dark" style={{ fontSize: '0.7rem' }}>SHELTER</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 2px' }}>{s.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#555', margin: '0 0 4px' }}>{s.address}</p>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    Available: {s.availableCapacity} / {s.capacity} meals
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e76f51', marginTop: '2px' }}>
                    Need: {s.currentNeed}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 2. Surplus Donations Markers */}
        {visibleDonations.map((d) => {
          if (!d.coordinates || d.coordinates.length !== 2) return null;
          return (
            <Marker
              key={`donation-${d.id}`}
              position={[d.coordinates[1], d.coordinates[0]]}
              icon={createDonationIcon(d.foodType, `${d.quantity} ${d.unit}`)}
              eventHandlers={{
                click: () => {
                  setSelectedEntity(d);
                  if (onSelectEntity) onSelectEntity(d);
                }
              }}
            >
              <Popup className="neo-leaflet-popup">
                <div style={{ padding: '4px' }}>
                  <span className="neo-badge neo-badge-matched" style={{ fontSize: '0.7rem' }}>FOOD SURPLUS</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 2px' }}>{d.foodType}</h4>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e76f51' }}>
                    {d.quantity} {d.unit} • {d.category}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#555', margin: '2px 0 4px' }}>{d.pickupAddress}</p>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Safe until: {d.expiryLabel}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 3. Drivers Markers */}
        {visibleDrivers.map((drv) => {
          if (!drv.coordinates || drv.coordinates.length !== 2) return null;
          const isAvail = drv.availability === 'AVAILABLE';
          return (
            <Marker
              key={`driver-${drv.id}`}
              position={[drv.coordinates[1], drv.coordinates[0]]}
              icon={createDriverIcon(drv.name, isAvail)}
              eventHandlers={{
                click: () => {
                  setSelectedEntity(drv);
                  if (onSelectEntity) onSelectEntity(drv);
                }
              }}
            >
              <Popup className="neo-leaflet-popup">
                <div style={{ padding: '4px' }}>
                  <span className={`neo-badge ${isAvail ? 'neo-badge-live' : 'neo-badge-dark'}`} style={{ fontSize: '0.7rem' }}>
                    {isAvail ? 'AVAILABLE DRIVER' : 'BUSY ON RESCUE'}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 2px' }}>{drv.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#555', margin: '0 0 4px' }}>{drv.vehicle}</p>
                  {drv.phone && <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Phone: {drv.phone}</div>}
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3e5c76', marginTop: '2px' }}>
                    GPS: {formatCoordinates(drv.coordinates[1], drv.coordinates[0])}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 4. Current User Marker ("You Are Here") */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={createUserIcon()}
              zIndexOffset={999}
            >
              <Popup className="neo-leaflet-popup">
                <div style={{ padding: '4px' }}>
                  <span className="neo-badge neo-badge-live" style={{ fontSize: '0.7rem' }}>YOUR LOCATION</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '6px 0 2px' }}>You Are Here</h4>
                  <div style={{ fontSize: '0.78rem', color: '#555' }}>
                    GPS: {formatCoordinates(userLocation.latitude, userLocation.longitude)}
                  </div>
                  {locationAccuracy && (
                    <div style={{ fontSize: '0.75rem', color: '#2a9d8f', fontWeight: 700, marginTop: '2px' }}>
                      Accuracy: ±{Math.round(locationAccuracy)} m
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
            {locationAccuracy && (
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={Math.min(locationAccuracy, 500)}
                pathOptions={{
                  color: '#e63946',
                  fillColor: '#e63946',
                  fillOpacity: 0.12,
                  weight: 1.5
                }}
              />
            )}
          </>
        )}
      </MapContainer>

      {/* Top Filter Chips */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 1000,
        flexWrap: 'wrap',
        maxWidth: '85%'
      }}>
        {['ALL', 'SHELTERS', 'DONATIONS', 'DRIVERS'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '2px solid #0d1321',
              background: filter === f ? '#0d1321' : '#ffffff',
              color: filter === f ? '#ffffff' : '#0d1321',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-neo-sm)'
            }}
          >
            {f === 'ALL' && '🌐 Show All'}
            {f === 'SHELTERS' && `🏠 Shelters (${networkData.shelters.length})`}
            {f === 'DONATIONS' && `📦 Surplus (${networkData.donations.length})`}
            {f === 'DRIVERS' && `🚗 Drivers (${networkData.drivers.length})`}
          </button>
        ))}
      </div>

      {/* Floating GPS & Map Controls (Bottom Right) */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 1000
      }}>
        {/* Zoom In */}
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          title="Zoom In"
          style={{
            width: '44px',
            height: '44px',
            background: '#ffffff',
            border: '2.5px solid #0d1321',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-neo-sm)'
          }}
        >
          <Plus size={20} color="#0d1321" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          title="Zoom Out"
          style={{
            width: '44px',
            height: '44px',
            background: '#ffffff',
            border: '2.5px solid #0d1321',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-neo-sm)'
          }}
        >
          <Minus size={20} color="#0d1321" />
        </button>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          disabled={locating}
          title="Detect Current GPS Location"
          style={{
            width: '44px',
            height: '44px',
            background: '#ffffff',
            border: '2.5px solid #0d1321',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-neo-sm)'
          }}
        >
          <Crosshair size={22} color={locating ? "#e63946" : "#0d1321"} />
        </button>

        {/* Refresh Network Button */}
        <button
          onClick={loadNetwork}
          title="Refresh Network Positions"
          style={{
            width: '44px',
            height: '44px',
            background: '#ffffff',
            border: '2.5px solid #0d1321',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-neo-sm)'
          }}
        >
          <RefreshCw size={18} color="#0d1321" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Toggle Fullscreen"
          style={{
            width: '44px',
            height: '44px',
            background: '#ffffff',
            border: '2.5px solid #0d1321',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-neo-sm)'
          }}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* GPS Status & Live Network Strip (Bottom Left) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #0d1321',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1000,
        boxShadow: 'var(--shadow-neo-sm)'
      }}>
        <span className="pulse-dot" style={{ background: '#2a9d8f' }} />
        <span>Status: <strong>{locationStatus}</strong></span>
        <span style={{ color: 'var(--color-muted)' }}>•</span>
        <span style={{ color: 'var(--color-muted)' }}>
          Map: <strong>OpenStreetMap (Leaflet)</strong>
        </span>
      </div>

      {/* Selected Entity Popup Modal / Info Card */}
      {selectedEntity && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: '16px',
          maxWidth: '340px',
          background: '#ffffff',
          border: '3px solid #0d1321',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-neo)',
          zIndex: 1100
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span className="neo-badge neo-badge-matched" style={{ fontSize: '0.72rem' }}>
              {selectedEntity.type}
            </span>
            <button
              onClick={() => setSelectedEntity(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '4px' }}>
            {selectedEntity.name || selectedEntity.foodType}
          </h3>

          {selectedEntity.type === 'SHELTER' && (
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Address: <strong>{selectedEntity.address}</strong></div>
              <div>Available Capacity: <strong>{selectedEntity.availableCapacity} / {selectedEntity.capacity} meals</strong></div>
              <div>Emergency Need: <strong style={{ color: '#e76f51' }}>{selectedEntity.currentNeed}</strong></div>
            </div>
          )}

          {selectedEntity.type === 'DONATION' && (
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Quantity: <strong>{selectedEntity.quantity} {selectedEntity.unit}</strong></div>
              <div>Category: <strong>{selectedEntity.category}</strong></div>
              <div>Donor: <strong>{selectedEntity.donorName}</strong></div>
              <div>Safe Time: <strong>{selectedEntity.expiryLabel}</strong></div>
            </div>
          )}

          {selectedEntity.type === 'DRIVER' && (
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Vehicle: <strong>{selectedEntity.vehicle}</strong></div>
              <div>Status: <strong>{selectedEntity.availability}</strong></div>
              {selectedEntity.phone && <div>Contact: <strong>{selectedEntity.phone}</strong></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
