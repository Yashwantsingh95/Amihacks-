import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Truck, 
  Home, 
  Utensils, 
  ShieldCheck, 
  Share2, 
  Printer, 
  Navigation,
  ArrowRight 
} from 'lucide-react';
import StatusTimeline from '../components/ui/StatusTimeline';

export default function DonationDetailsPage({ donation, onNavigate }) {
  const d = donation || {
    id: "DON-1024",
    foodType: "Veg Biryani",
    quantity: 40,
    unit: "meals",
    pickupLocation: "ABC Restaurant, Delhi",
    safeUntil: "7:30 PM",
    remainingTime: "1h 42m remaining",
    category: "Vegetarian",
    status: "ON_THE_WAY",
    donor: "ABC Restaurant",
    shelter: {
      name: "Shelter A",
      distance: "2.1 km away",
      address: "Plot 14, Karol Bagh, New Delhi"
    },
    driver: {
      name: "Rahul",
      fullName: "Rahul Sharma",
      vehicle: "Hero Electric Eco-Van",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80"
    },
    notes: "Packed in 4 insulated stainless containers. Keep upright."
  };

  // Timeline step calculation based on status
  let currentStep = 4;
  if (d.status === 'POSTED') currentStep = 0;
  else if (d.status === 'MATCHED') currentStep = 1;
  else if (d.status === 'DRIVER_ASSIGNED') currentStep = 2;
  else if (d.status === 'PICKED_UP') currentStep = 3;
  else if (d.status === 'ON_THE_WAY') currentStep = 4;
  else if (d.status === 'DELIVERED') currentStep = 5;

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px', margin: '0 auto' }} className="page-container">
      {/* Back button + Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          onClick={() => onNavigate('/donor/dashboard')}
          className="neo-btn neo-btn-outline"
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => window.print()}
            className="neo-btn neo-btn-outline" 
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            <Printer size={16} />
            <span>Print Manifest</span>
          </button>
          <button
            onClick={() => onNavigate('/donor/tracking')}
            className="neo-btn neo-btn-dark"
            style={{ padding: '8px 18px', fontSize: '0.9rem' }}
          >
            <Navigation size={16} />
            <span>Track Live</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="neo-card" style={{ padding: '36px', background: '#ffffff', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span className="neo-badge neo-badge-dark" style={{ fontSize: '0.85rem' }}>
                {d.id}
              </span>
              <span className="neo-badge neo-badge-live">
                <span className="pulse-dot" />
                {d.status.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2.4rem',
              fontWeight: 900,
              color: 'var(--color-dark)'
            }}>
              {d.foodType}
            </h1>
          </div>

          <div style={{
            textAlign: 'right',
            background: 'var(--color-bg)',
            border: 'var(--border-dark)',
            borderRadius: '10px',
            padding: '12px 20px',
            boxShadow: 'var(--shadow-neo-sm)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Quantity Logged
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.8rem',
              fontWeight: 900,
              color: 'var(--color-primary)'
            }}>
              {d.quantity} {d.unit}
            </div>
          </div>
        </div>

        {/* Timeline Component */}
        <div style={{
          background: 'var(--color-bg)',
          border: 'var(--border-dark)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '32px'
        }}>
          <StatusTimeline currentStep={currentStep} orientation="horizontal" />
        </div>

        {/* 3-Column Logistics Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Pickup Details */}
          <div style={{
            padding: '20px',
            borderRadius: '10px',
            border: 'var(--border-dark)',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-muted)' }}>
              <Utensils size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Donor Location</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-dark)', marginBottom: '4px' }}>
              {d.donor}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
              {d.pickupLocation}
            </p>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#e63946' }}>
              <Clock size={16} />
              <span>Safe Until: {d.safeUntil}</span>
            </div>
          </div>

          {/* Recipient Details */}
          <div style={{
            padding: '20px',
            borderRadius: '10px',
            border: 'var(--border-dark)',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-muted)' }}>
              <Home size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Matched Recipient</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-dark)', marginBottom: '4px' }}>
              {d.shelter?.name || 'Shelter A'}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
              {d.shelter?.address || 'Plot 14, Karol Bagh, New Delhi'}
            </p>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              <MapPin size={16} />
              <span>Distance: {d.shelter?.distance || '2.1 km'}</span>
            </div>
          </div>

          {/* Assigned Driver */}
          <div style={{
            padding: '20px',
            borderRadius: '10px',
            border: 'var(--border-dark)',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-muted)' }}>
              <Truck size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Assigned Volunteer</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <img
                src={d.driver?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'}
                alt={d.driver?.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'var(--border-dark)' }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-dark)' }}>
                  {d.driver?.fullName || d.driver?.name || 'Rahul Sharma'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  {d.driver?.vehicle || 'Hero Electric Eco-Van'}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              Tel: {d.driver?.phone || '+91 98765 43210'}
            </p>
          </div>
        </div>

        {/* Notes */}
        {d.notes && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '8px',
            background: 'var(--color-bg)',
            border: '1px solid #d5ceba'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '4px' }}>
              Special Handling Notes
            </span>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 500 }}>
              {d.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
