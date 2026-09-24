import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X, 
  Award,
  Navigation,
  ExternalLink
} from 'lucide-react';
import MapContainer from '../components/ui/MapContainer';
import DeliveryModal from '../components/ui/DeliveryModal';

export default function LiveTrackingPage({ donation, onNavigate, onDeliveryCompleted }) {
  const [progress, setProgress] = useState(55); // 0% to 100%
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const d = donation || {
    id: "DON-1024",
    foodType: "Veg Biryani",
    quantity: 40,
    unit: "meals",
    pickupLocation: "ABC Restaurant, Delhi",
    shelter: { name: "Shelter A", distance: "2.1 km away" },
    driver: {
      name: "Rahul",
      fullName: "Rahul Sharma",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
      statusText: "On the way to Shelter A",
      eta: "8 min away",
      distanceRemaining: "2.4 km"
    },
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80"
  };

  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
    if (newProgress >= 100) {
      setTimeout(() => {
        setShowDeliveryModal(true);
      }, 500);
    }
  };

  const handleSimulateDelivery = () => {
    setProgress(100);
    setShowDeliveryModal(true);
    if (onDeliveryCompleted) onDeliveryCompleted(d.id);
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1300px', margin: '0 auto' }} className="page-container">
      {/* Top Header Row (Matches reference screenshot) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onNavigate('donor-dashboard')}
            className="neo-btn neo-btn-outline"
            style={{ padding: '8px 12px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--color-dark)'
          }}>
            Live Tracking
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleSimulateDelivery}
            className="neo-btn neo-btn-cream"
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 800 }}
          >
            ⚡ Complete Delivery Demo
          </button>

          <span className="neo-badge neo-badge-live" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            <span className="pulse-dot" />
            LIVE
          </span>
        </div>
      </div>

      {/* Large Map Container */}
      <div style={{ marginBottom: '24px' }}>
        <MapContainer 
          driverProgress={progress}
          onProgressChange={handleProgressChange}
          height="450px"
          interactive={true}
        />
      </div>

      {/* Bottom Panel Card (Matches reference screenshot!) */}
      <div 
        className="neo-card" 
        style={{
          padding: '24px',
          background: '#ffffff'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          {/* Driver Profile & ETA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={d.driver?.avatar}
              alt={d.driver?.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: 'var(--border-dark)',
                objectFit: 'cover',
                boxShadow: 'var(--shadow-neo-sm)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--color-dark)'
                }}>
                  {d.driver?.name || 'Rahul'}
                </h3>
                <span className="neo-badge neo-badge-matched" style={{ fontSize: '0.7rem' }}>
                  ★ 4.95
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                {progress >= 100 ? 'Arrived at Shelter A' : (d.driver?.statusText || 'On the way to Shelter A')}
              </p>
            </div>
          </div>

          {/* Real-time ETA Metrics */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            background: 'var(--color-bg)',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'var(--border-dark)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--color-primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  ETA
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                  {progress >= 100 ? 'Arrived' : `${Math.max(1, Math.round(8 * (1 - progress / 100)))} min away`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={20} color="var(--color-primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  Distance
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                  {progress >= 100 ? '0.0 km' : `${(2.4 * (1 - progress / 100)).toFixed(1)} km`}
                </div>
              </div>
            </div>
          </div>

          {/* Food Item Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={d.image}
              alt={d.foodType}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '10px',
                border: 'var(--border-dark)',
                objectFit: 'cover'
              }}
            />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark)' }}>
                {d.foodType}
              </h4>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {d.quantity} {d.unit}
              </p>
            </div>
          </div>

          {/* Contact Button */}
          <div>
            <button
              onClick={() => setShowContactModal(true)}
              className="neo-btn neo-btn-dark"
              style={{ width: '100%', padding: '12px' }}
            >
              <Phone size={18} />
              <span>Contact Driver</span>
            </button>
          </div>
        </div>

        {/* 3-Step Compact Timeline (Matches reference screenshot bottom!) */}
        <div style={{
          borderTop: '1px solid #e2dcc8',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}>
          {/* Horizontal line */}
          <div style={{
            position: 'absolute',
            top: '32px',
            left: '50px',
            right: '50px',
            height: '3px',
            background: '#d5ceba',
            zIndex: 1
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--color-primary)',
              transition: 'width 0.2s ease'
            }} />
          </div>

          {/* Step 1: Picked Up */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: '#ffffff',
              border: '2px solid var(--color-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '6px'
            }}>
              ✓
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              Picked Up
            </span>
          </div>

          {/* Step 2: On The Way */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: progress < 100 ? 'var(--color-dark)' : 'var(--color-primary)',
              color: '#ffffff',
              border: '2px solid var(--color-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              boxShadow: progress < 100 ? 'var(--shadow-neo-sm)' : 'none',
              marginBottom: '6px'
            }}>
              {progress < 100 ? '●' : '✓'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              On the way
            </span>
          </div>

          {/* Step 3: Delivered */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: progress >= 100 ? 'var(--color-primary)' : '#ffffff',
              color: progress >= 100 ? '#ffffff' : 'var(--color-dark)',
              border: '2px solid var(--color-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '6px'
            }}>
              {progress >= 100 ? '✓' : '○'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: progress >= 100 ? 'var(--color-dark)' : 'var(--color-muted)' }}>
              Delivered
            </span>
          </div>
        </div>
      </div>

      {/* Driver Contact Modal */}
      {showContactModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(13, 19, 33, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div className="neo-card" style={{ width: '100%', maxWidth: '400px', padding: '28px', background: '#ffffff', position: 'relative' }}>
            <button
              onClick={() => setShowContactModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={d.driver?.avatar}
                alt={d.driver?.name}
                style={{ width: '70px', height: '70px', borderRadius: '50%', border: 'var(--border-dark)', margin: '0 auto 12px' }}
              />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{d.driver?.fullName || 'Rahul Sharma'}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Volunteer Rescue Partner • 142 Deliveries</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`tel:${d.driver?.phone || '+919876543210'}`}
                className="neo-btn neo-btn-dark"
                style={{ textDecoration: 'none' }}
              >
                <Phone size={18} />
                <span>Call {d.driver?.phone || '+91 98765 43210'}</span>
              </a>
              <button
                onClick={() => {
                  alert('Quick SMS dispatch notification sent to driver.');
                  setShowContactModal(false);
                }}
                className="neo-btn neo-btn-outline"
              >
                <MessageSquare size={18} />
                <span>Send Quick Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Completed Celebration Modal */}
      <DeliveryModal
        isOpen={showDeliveryModal}
        donation={d}
        onClose={() => setShowDeliveryModal(false)}
        onViewImpact={() => {
          setShowDeliveryModal(false);
          onNavigate('donor-impact');
        }}
      />
    </div>
  );
}
