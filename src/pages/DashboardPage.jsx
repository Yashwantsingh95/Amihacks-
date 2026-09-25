import React from 'react';
import { 
  Bell, 
  Plus, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Truck, 
  ChevronRight, 
  Utensils, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import NotificationDropdown from '../components/ui/NotificationDropdown';
import { getCurrentUser } from '../services/api';

export default function DashboardPage({ donations, stats, onNavigate, onSelectDonation }) {
  const activeDonation = donations.find(d => d.id === 'DON-1024') || donations[0];
  const user = getCurrentUser() || { name: 'ABC Restaurant' };
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1400px', margin: '0 auto' }} className="page-container">
      {/* Top Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--color-dark)',
            lineHeight: 1.15
          }}>
            Good evening, <br />
            {user.name || 'ABC Restaurant'} <span style={{ display: 'inline-block' }}>👋</span>
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-muted)',
            marginTop: '6px',
            fontWeight: 500
          }}>
            Your food rescue activity this week.
          </p>
        </div>

        {/* Top Right Profile & Quick Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => onNavigate('/donor/create')}
            className="neo-btn neo-btn-dark"
            style={{ padding: '12px 20px', fontSize: '0.95rem' }}
          >
            <Plus size={18} strokeWidth={3} />
            <span>Create Donation</span>
          </button>

          {/* Real Notification Dropdown */}
          <NotificationDropdown onNavigate={onNavigate} />

          {/* User Avatar */}
          <div 
            onClick={() => onNavigate('/donor/profile')}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              border: 'var(--border-dark)',
              background: 'var(--color-dark)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: 'var(--shadow-neo-sm)',
              cursor: 'pointer'
            }}
          >
            {userInitial}
          </div>
        </div>
      </div>

      {/* Stats Row (4 Stat Cards - Matches Mockup) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '18px',
        marginBottom: '36px'
      }}>
        <StatCard
          value={stats.activeDonations}
          label="Active Donations"
          badgeText="LIVE NOW"
        />
        <StatCard
          value={stats.mealsRescued}
          label="Meals Rescued"
          subtext="This week"
        />
        <StatCard
          value={stats.successfulPickups}
          label="Successful Pickups"
          subtext="100% fulfilled"
        />
        <StatCard
          value={`${stats.foodDivertedKg} kg`}
          label="Food Diverted"
          subtext="From local landfills"
        />
      </div>

      {/* Live Global Map Radar Quick Access Banner */}
      <div 
        onClick={() => onNavigate('/donor/map')}
        className="neo-card"
        style={{
          background: 'linear-gradient(135deg, #1d2d44 0%, #0d1321 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--color-primary)',
            border: '2px solid rgba(240, 235, 216, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="neo-badge neo-badge-live" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                <span className="pulse-dot" /> LIVE NETWORK RADAR
              </span>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 800 }}>
              Live Regional Surplus-to-Shelter Network Map
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(240, 235, 216, 0.8)', marginTop: '2px' }}>
              Real-time geospatial visibility across nearby partner shelters, available volunteer drivers, and active rescues.
            </p>
          </div>
        </div>

        <button
          className="neo-btn"
          style={{ background: '#ffffff', color: '#0d1321', padding: '10px 18px', fontSize: '0.88rem', fontWeight: 800 }}
        >
          <span>Open Live Map →</span>
        </button>
      </div>

      {/* Active Rescues Section (Hero Card on Dashboard) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'var(--color-dark)'
          }}>
            Active Rescues
          </h2>
          <span 
            onClick={() => onNavigate('/donor/donations')}
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--color-dark)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View All →
          </span>
        </div>

        {/* Highlighted Live Rescue Card (Matches reference screenshot) */}
        {activeDonation && (
          <div 
            className="neo-card" 
            style={{
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'center',
              background: '#ffffff'
            }}
          >
            {/* Left: Food Photo + Details */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img
                src={activeDonation.image}
                alt={activeDonation.foodType}
                style={{
                  width: '120px',
                  height: '110px',
                  borderRadius: '12px',
                  border: 'var(--border-dark)',
                  objectFit: 'cover',
                  boxShadow: 'var(--shadow-neo-sm)'
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: 'var(--color-dark)'
                  }}>
                    {activeDonation.foodType}
                  </h3>
                  <span className="neo-badge neo-badge-live">
                    <span className="pulse-dot" />
                    LIVE
                  </span>
                </div>

                <p style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '10px'
                }}>
                  {activeDonation.quantity} {activeDonation.unit}
                </p>

                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--color-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>{activeDonation.donor}</span>
                  <span style={{ color: 'var(--color-muted)' }}>→</span>
                  <span>{activeDonation.shelter?.name || 'Shelter A'}</span>
                </div>
              </div>
            </div>

            {/* Middle: Driver Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'var(--color-bg)',
              border: 'var(--border-dark)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={activeDonation.driver?.avatar}
                  alt={activeDonation.driver?.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: 'var(--border-dark)',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                    {activeDonation.driver?.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                    {activeDonation.driver?.statusText || 'On the way'}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                  {activeDonation.driver?.eta || '8 min away'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                  {activeDonation.driver?.distanceRemaining || '2.4 km'}
                </div>
              </div>
            </div>

            {/* Right: Mini Map Route Preview & Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                style={{
                  height: '75px',
                  background: '#ede7d5',
                  border: 'var(--border-dark)',
                  borderRadius: '10px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 20px'
                }}
              >
                {/* Schematic mini route */}
                <svg viewBox="0 0 240 50" style={{ width: '100%', height: '100%' }}>
                  <path d="M 20 25 L 220 25" stroke="#0d1321" strokeWidth="4" />
                  <path d="M 20 25 L 220 25" stroke="#3e5c76" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Origin */}
                  <circle cx="20" cy="25" r="7" fill="#1d2d44" stroke="#0d1321" strokeWidth="2" />
                  {/* Truck */}
                  <rect x="110" y="16" width="22" height="16" rx="3" fill="#0d1321" />
                  {/* Destination */}
                  <circle cx="220" cy="25" r="7" fill="#ffffff" stroke="#0d1321" strokeWidth="2" />
                </svg>
              </div>

              <button
                onClick={() => {
                  if (onSelectDonation) onSelectDonation(activeDonation);
                  onNavigate('/donor/tracking');
                }}
                className="neo-btn neo-btn-dark"
                style={{ width: '100%', padding: '12px' }}
              >
                <span>Track Live</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Donations Table */}
      <div className="neo-card" style={{ padding: '24px', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--color-dark)'
          }}>
            All Logged Donations
          </h3>

          <span className="neo-badge neo-badge-dark">
            {donations.length} TOTAL RECORDS
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-dark)' }}>
                <th style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>ID & Item</th>
                <th style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Quantity</th>
                <th style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Expiry Window</th>
                <th style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Recipient Shelter</th>
                <th style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr 
                  key={d.id} 
                  style={{
                    borderBottom: '1px solid #e2dcc8',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px 14px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-dark)' }}>{d.foodType}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{d.id} • {d.category}</div>
                  </td>
                  <td style={{ padding: '16px 14px', fontWeight: 700 }}>
                    {d.quantity} {d.unit}
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Clock size={15} style={{ color: d.status === 'DELIVERED' ? 'var(--color-muted)' : '#e63946' }} />
                      <span>{d.safeUntil}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {d.shelter ? d.shelter.name : <span style={{ color: 'var(--color-muted)' }}>Matching in progress...</span>}
                    </div>
                    {d.shelter && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{d.shelter.distance}</div>
                    )}
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    {d.status === 'ON_THE_WAY' && (
                      <span className="neo-badge neo-badge-live">
                        <span className="pulse-dot" /> LIVE
                      </span>
                    )}
                    {d.status === 'MATCHED' && (
                      <span className="neo-badge neo-badge-matched">MATCHED</span>
                    )}
                    {d.status === 'POSTED' && (
                      <span className="neo-badge neo-badge-warning">MATCHING</span>
                    )}
                    {d.status === 'DELIVERED' && (
                      <span className="neo-badge neo-badge-dark">DELIVERED</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          if (onSelectDonation) onSelectDonation(d);
                          onNavigate('/donor/donation-details');
                        }}
                        className="neo-btn neo-btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Details
                      </button>
                      {d.status !== 'DELIVERED' && (
                        <button
                          onClick={() => {
                            if (onSelectDonation) onSelectDonation(d);
                            onNavigate('/donor/tracking');
                          }}
                          className="neo-btn neo-btn-dark"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          Track
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
