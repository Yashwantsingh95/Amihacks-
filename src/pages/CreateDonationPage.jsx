import React, { useState } from 'react';
import { Clock, MapPin, ArrowRight, Crosshair, Loader2, Check } from 'lucide-react';
import { requestCurrentPosition } from '../services/locationService';

export default function CreateDonationPage({ onNavigate, onDonationCreated }) {
  const [foodType, setFoodType] = useState('Veg Biryani');
  const [quantity, setQuantity] = useState('40');
  const [unit, setUnit] = useState('Meals');
  const [pickupLocation, setPickupLocation] = useState('ABC Restaurant, Connaught Place, New Delhi');
  const [coords, setCoords] = useState([77.2197, 28.6328]);
  const [safeUntilHours, setSafeUntilHours] = useState('2.5');
  const [category, setCategory] = useState('Vegetarian');
  const [notes, setNotes] = useState('Freshly prepared for banquet, packed in insulated warm containers.');
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locStatus, setLocStatus] = useState('');

  // Detect real device location
  const handleDetectGPS = async () => {
    setLocLoading(true);
    setLocStatus('Detecting device GPS...');
    try {
      const pos = await requestCurrentPosition();
      setCoords([pos.longitude, pos.latitude]);
      setLocStatus(`GPS acquired (${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)})`);
      setPickupLocation(`GPS Location: ${pos.latitude.toFixed(4)}°N, ${pos.longitude.toFixed(4)}°E`);
    } catch (err) {
      setLocStatus(`Notice: ${err.message}`);
    } finally {
      setLocLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const futureTime = new Date(Date.now() + Number(safeUntilHours) * 60 * 60 * 1000);

    const donationData = {
      foodType,
      quantity: Number(quantity) || 40,
      unit,
      pickupLocation,
      coords,
      safeUntil: futureTime.toISOString(),
      remainingTime: `${safeUntilHours}h remaining`,
      category,
      notes
    };

    if (onDonationCreated) {
      await onDonationCreated(donationData);
    }
    setLoading(false);
    onNavigate('/donor/matching');
  };

  const handleQuickPreset = (type, qty, cat, hrs) => {
    setFoodType(type);
    setQuantity(qty);
    setCategory(cat);
    setSafeUntilHours(hrs);
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
          Create a Real Donation
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', fontWeight: 500 }}>
          Post surplus food into MongoDB with real GPS coordinates and real-time shelter matching.
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
              ⚡ 1-Click Rescue Presets:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickPreset('Veg Biryani', '40', 'Vegetarian', '2.5')}
                className="neo-btn neo-btn-cream"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                🍛 40 Meals Biryani (2.5h)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('Paneer Butter Masala', '30', 'Vegetarian', '2')}
                className="neo-btn neo-btn-cream"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                🫓 30 Meals Paneer (2h)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('Produce & Bakery Crates', '60', 'Other', '4')}
                className="neo-btn neo-btn-cream"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                🍎 60 kg Fresh Produce (4h)
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

            {/* Pickup Location with Real GPS detector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  Pickup Address
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={locLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Crosshair size={13} />
                  <span>Use Device GPS</span>
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="neo-input"
                  placeholder="ABC Restaurant, Connaught Place, New Delhi"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              </div>
              {locStatus && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                  {locStatus}
                </span>
              )}
            </div>

            {/* Safe Until (Hours from now) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  Safe Until / Expiry Duration
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e63946' }}>
                  ⚡ Perishable Window
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['1.5', '2.5', '3.5', '5.0'].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setSafeUntilHours(hrs)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'var(--border-dark)',
                      background: safeUntilHours === hrs ? 'var(--color-dark)' : '#ffffff',
                      color: safeUntilHours === hrs ? '#ffffff' : 'var(--color-dark)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    +{hrs}h
                  </button>
                ))}
              </div>
            </div>

            {/* Food Category Pills */}
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
                        boxShadow: isSelected ? 'var(--shadow-neo-sm)' : 'none'
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
                Handling Instructions
              </label>
              <textarea
                rows={2}
                className="neo-input"
                placeholder="Insulation details, dispatch gate, allergies..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right Tactile Card */}
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
                <circle cx="50" cy="18" r="6" fill="#0d1321" />
                <path d="M 15 54 C 15 26, 85 26, 85 54 Z" fill="#3e5c76" stroke="#0d1321" strokeWidth="2.5" />
                <path d="M 28 46 C 30 34, 45 30, 52 30" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
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
              Real-time geospatial matching immediately queries verified shelters within range via MongoDB 2dsphere indexing.
            </p>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="neo-btn neo-btn-dark"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.05rem',
                boxShadow: 'var(--shadow-neo)'
              }}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Post Donation</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
