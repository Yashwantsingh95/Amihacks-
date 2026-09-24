import React, { useState } from 'react';
import { Clock, MapPin, ArrowRight, Sparkles, Check, AlertCircle, UtensilsCrossed } from 'lucide-react';

export default function CreateDonationPage({ onNavigate, onDonationCreated }) {
  const [foodType, setFoodType] = useState('Veg Biryani');
  const [quantity, setQuantity] = useState('40');
  const [unit, setUnit] = useState('Meals');
  const [pickupLocation, setPickupLocation] = useState('ABC Restaurant, Delhi');
  const [safeUntil, setSafeUntil] = useState('7:30 PM');
  const [category, setCategory] = useState('Vegetarian');
  const [notes, setNotes] = useState('Freshly prepared for banquet, packed in insulated warm containers.');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDonation = {
      id: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
      foodType,
      quantity: Number(quantity) || 40,
      unit,
      pickupLocation,
      safeUntil,
      remainingTime: '2h 15m remaining',
      category,
      status: 'MATCHED',
      statusLabel: 'MATCHED',
      donor: 'ABC Restaurant',
      notes,
      postedAt: 'Just now',
      image: category === 'Vegetarian' 
        ? 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80'
    };

    if (onDonationCreated) {
      onDonationCreated(newDonation);
    }
    // Navigate directly to the matching screen
    onNavigate('donor-matching');
  };

  // Quick preset helpers
  const handleQuickPreset = (type, qty, cat) => {
    setFoodType(type);
    setQuantity(qty);
    setCategory(cat);
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px', margin: '0 auto' }} className="page-container">
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
          fontWeight: 800,
          color: 'var(--color-dark)',
          marginBottom: '6px'
        }}>
          Create a Donation
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', fontWeight: 500 }}>
          Post surplus food in under one minute. Speed saves edible meals.
        </p>
      </div>

      {/* Main Grid: Form (Left) + Tactile Card (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Form Card */}
        <div className="neo-card" style={{ padding: '32px', background: '#ffffff' }}>
          {/* Quick presets strip */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '8px' }}>
              ⚡ Quick 1-Click Presets:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickPreset('Veg Biryani', '40', 'Vegetarian')}
                className="neo-btn neo-btn-cream"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                🍛 40 Meals Biryani
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('Paneer & Rotis', '30', 'Vegetarian')}
                className="neo-btn neo-btn-cream"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                🫓 30 Meals Paneer
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('Fresh Fruit Crates', '25', 'Other')}
                className="neo-btn neo-btn-cream"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                🍎 25 kg Produce
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Food Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                Food Type
              </label>
              <input
                type="text"
                required
                className="neo-input"
                placeholder="e.g. Veg Biryani, Cooked Curry & Rice"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
              />
            </div>

            {/* Quantity + Unit */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="neo-input"
                  placeholder="40"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="neo-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Meals">Meals</option>
                  <option value="kg">kg</option>
                  <option value="Boxes">Boxes</option>
                  <option value="Portions">Portions</option>
                </select>
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                Pickup Location
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="neo-input"
                  placeholder="ABC Restaurant, Delhi"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              </div>
            </div>

            {/* Safe Until / Expiry */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  Safe Until / Expiry Window
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e63946' }}>
                  ⚡ Perishable Window
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="neo-input"
                  placeholder="7:30 PM (or +2 hours)"
                  value={safeUntil}
                  onChange={(e) => setSafeUntil(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              </div>
            </div>

            {/* Food Category Pills (Matches Screenshot) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>
                Food Category
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Vegetarian', 'Non-Vegetarian', 'Other'].map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: 'var(--border-dark)',
                        background: isSelected ? 'var(--color-primary)' : '#ffffff',
                        color: isSelected ? '#ffffff' : 'var(--color-dark)',
                        fontFamily: 'inherit',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: isSelected ? 'var(--shadow-neo-sm)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                Additional Notes
              </label>
              <textarea
                rows={3}
                className="neo-input"
                placeholder="Any special handling instructions, allergens, or pickup gate..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </form>
        </div>

        {/* Right Tactile Card (Matches Screenshot illustration & quote) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div 
            className="neo-card" 
            style={{
              padding: '40px 32px',
              textAlign: 'center',
              background: '#f8f5ea',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Cloche Illustration SVG */}
            <div style={{ width: '90px', height: '80px', marginBottom: '20px' }}>
              <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%' }}>
                {/* Cloche knob */}
                <circle cx="50" cy="18" r="6" fill="#0d1321" />
                {/* Cloche dome */}
                <path d="M 15 54 C 15 26, 85 26, 85 54 Z" fill="#3e5c76" stroke="#0d1321" strokeWidth="2.5" />
                {/* Highlight */}
                <path d="M 28 46 C 30 34, 45 30, 52 30" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                {/* Cloche base plate */}
                <rect x="10" y="54" width="80" height="8" rx="3" fill="#1d2d44" stroke="#0d1321" strokeWidth="2.5" />
              </svg>
            </div>

            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--color-dark)',
              lineHeight: 1.35,
              maxWidth: '280px',
              marginBottom: '16px'
            }}>
              Good food should nourish people, not landfills.
            </h3>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--color-muted)',
              lineHeight: 1.5,
              maxWidth: '300px',
              marginBottom: '28px'
            }}>
              Once submitted, our real-time matching system will immediately query available shelters within a 5 km radius.
            </p>

            {/* Primary CTA Button (Matches mockup) */}
            <button
              onClick={handleSubmit}
              className="neo-btn neo-btn-dark"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.05rem',
                boxShadow: 'var(--shadow-neo)'
              }}
            >
              <span>Post Donation</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Rescue Flow Reminder Card */}
          <div className="neo-card" style={{ padding: '20px', background: '#ffffff' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ color: '#2a9d8f' }}>
                <Check size={20} strokeWidth={3} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '4px' }}>
                  Automatic Driver Dispatch
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                  As soon as the recipient shelter confirms acceptance, the nearest volunteer driver will be routed to your pickup location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
