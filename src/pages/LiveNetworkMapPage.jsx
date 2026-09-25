import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Package, 
  Truck, 
  MapPin, 
  Crosshair, 
  RefreshCw, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import GlobalLiveMap from '../components/ui/GlobalLiveMap';
import { getCurrentUser, api } from '../services/api';

export default function LiveNetworkMapPage({ onNavigate }) {
  const currentUser = getCurrentUser();
  const role = currentUser?.role?.toUpperCase() || 'DONOR';

  const [networkSummary, setNetworkSummary] = useState({
    shelterCount: 0,
    donationCount: 0,
    driverCount: 0,
    activeMission: null
  });
  const [selectedEntity, setSelectedEntity] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await api.map.getNetwork();
      if (res && res.success) {
        setNetworkSummary({
          shelterCount: res.shelters?.length || 0,
          donationCount: res.donations?.length || 0,
          driverCount: res.drivers?.length || 0,
          activeMission: res.activeMission || null
        });
      }
    } catch (e) {
      console.warn('Network summary fetch fallback');
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const pageTitle = role === 'SHELTER'
    ? 'Regional Intake & Surplus Network Map'
    : role === 'DRIVER'
    ? 'Active Rescue Logistics & Dispatch Map'
    : 'Surplus-to-Shelter Live Network Map';

  const pageSubtitle = role === 'SHELTER'
    ? 'Monitor real-time inbound surplus food, nearby donors, and dispatch drivers.'
    : role === 'DRIVER'
    ? 'Locate pickup stations, verified shelter facilities, and active road routing.'
    : 'Real-time overview of nearby partner shelters, available volunteer drivers, and active rescues.';

  return (
    <div style={{ padding: '28px 36px', maxWidth: '1400px', margin: '0 auto' }} className="page-container">
      {/* Top Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="neo-badge neo-badge-matched">
              {role} NETWORK RADAR
            </span>
            <span className="neo-badge neo-badge-live">
              <span className="pulse-dot" /> REAL-TIME GPS SYNC
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
            fontWeight: 800,
            color: 'var(--color-dark)',
            lineHeight: 1.15
          }}>
            {pageTitle}
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--color-muted)',
            marginTop: '4px',
            fontWeight: 500
          }}>
            {pageSubtitle}
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {role === 'DONOR' && (
            <button
              onClick={() => onNavigate('/donor/create')}
              className="neo-btn neo-btn-dark"
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <span>+ Create Donation</span>
            </button>
          )}

          {role === 'SHELTER' && (
            <button
              onClick={() => onNavigate('/shelter/capacity')}
              className="neo-btn neo-btn-dark"
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <span>Manage Capacity</span>
            </button>
          )}

          {role === 'DRIVER' && (
            <button
              onClick={() => onNavigate('/driver/requests')}
              className="neo-btn neo-btn-dark"
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <span>Pickup Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* Network Overview Stat Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div className="neo-card-cream" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#2a9d8f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Verified Shelters
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {networkSummary.shelterCount} Facilities Active
            </div>
          </div>
        </div>

        <div className="neo-card-cream" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e76f51', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Package size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Surplus In Network
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {networkSummary.donationCount} Batches Available
            </div>
          </div>
        </div>

        <div className="neo-card-cream" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#3a86ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Truck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Drivers Ready
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {networkSummary.driverCount} Volunteers Online
            </div>
          </div>
        </div>
      </div>

      {/* Global Live Map Component */}
      <div style={{ marginBottom: '28px' }}>
        <GlobalLiveMap 
          role={role} 
          height="620px" 
          onSelectEntity={setSelectedEntity}
        />
      </div>

      {/* Instructions & Privacy Notice */}
      <div style={{
        background: '#ffffff',
        border: 'var(--border-dark)',
        borderRadius: '12px',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ShieldCheck size={28} color="#2a9d8f" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Real Logistics Privacy & Geo-Encryption Active
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>
              Coordinates are validated and stored using MongoDB 2dsphere indexing. Precise driver tracking is strictly restricted to assigned active rescue participants.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onNavigate(role === 'SHELTER' ? '/shelter/tracking' : role === 'DRIVER' ? '/driver/route' : '/donor/tracking')}
            className="neo-btn neo-btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <span>Open Delivery Route Tracking →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
