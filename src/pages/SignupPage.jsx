import React, { useState } from 'react';
import { HeartHandshake, MapPin, Building2, Store, Truck, ArrowRight } from 'lucide-react';

export default function SignupPage({ onNavigate, onLogin }) {
  const [orgName, setOrgName] = useState('ABC Restaurant & Catering');
  const [email, setEmail] = useState('partner@abcrestaurant.in');
  const [password, setPassword] = useState('••••••••');
  const [location, setLocation] = useState('Connaught Place, New Delhi');
  const [role, setRole] = useState('donor'); // donor, shelter, driver

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
    onNavigate('donor-dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px'
    }}>
      {/* Brand Header */}
      <div 
        onClick={() => onNavigate('landing')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          background: 'var(--color-primary)',
          border: 'var(--border-dark)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-neo-sm)'
        }}>
          <HeartHandshake size={22} strokeWidth={2.5} />
        </div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: 'var(--color-dark)'
        }}>
          RESCUEFLOW
        </span>
      </div>

      {/* Signup Card */}
      <div 
        className="neo-card" 
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '36px 32px',
          background: '#ffffff'
        }}
      >
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.9rem',
          fontWeight: 800,
          color: 'var(--color-dark)',
          marginBottom: '6px'
        }}>
          Create Account
        </h2>
        <p style={{
          color: 'var(--color-muted)',
          fontSize: '0.95rem',
          marginBottom: '24px'
        }}>
          Join the food rescue network. Connect surplus with those who need it.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Organization Name
              </label>
              <input
                type="text"
                required
                className="neo-input"
                placeholder="Your organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                required
                className="neo-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                required
                className="neo-input"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Location
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="neo-input"
                  placeholder="Search your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
                <MapPin size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              </div>
            </div>
          </div>

          {/* Role Selection (Matches Screenshot) */}
          <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>
              I am a
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {/* Donor */}
              <div
                onClick={() => setRole('donor')}
                style={{
                  padding: '12px 10px',
                  borderRadius: '10px',
                  border: 'var(--border-dark)',
                  background: role === 'donor' ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: role === 'donor' ? '#ffffff' : 'var(--color-dark)',
                  boxShadow: role === 'donor' ? 'var(--shadow-neo-sm)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Donor</div>
                <div style={{ fontSize: '0.72rem', opacity: role === 'donor' ? 0.9 : 0.65, marginTop: '2px' }}>Restaurant / Store</div>
              </div>

              {/* Shelter */}
              <div
                onClick={() => setRole('shelter')}
                style={{
                  padding: '12px 10px',
                  borderRadius: '10px',
                  border: 'var(--border-dark)',
                  background: role === 'shelter' ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: role === 'shelter' ? '#ffffff' : 'var(--color-dark)',
                  boxShadow: role === 'shelter' ? 'var(--shadow-neo-sm)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Shelter</div>
                <div style={{ fontSize: '0.72rem', opacity: role === 'shelter' ? 0.9 : 0.65, marginTop: '2px' }}>NGO / Shelter</div>
              </div>

              {/* Driver */}
              <div
                onClick={() => setRole('driver')}
                style={{
                  padding: '12px 10px',
                  borderRadius: '10px',
                  border: 'var(--border-dark)',
                  background: role === 'driver' ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: role === 'driver' ? '#ffffff' : 'var(--color-dark)',
                  boxShadow: role === 'driver' ? 'var(--shadow-neo-sm)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Driver</div>
                <div style={{ fontSize: '0.72rem', opacity: role === 'driver' ? 0.9 : 0.65, marginTop: '2px' }}>Volunteer Driver</div>
              </div>
            </div>
            {role !== 'donor' && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '6px' }}>
                Note: Member 2 is implementing Shelter & Driver interfaces. You will be directed to the Donor experience for this demo.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="neo-btn neo-btn-dark"
            style={{ width: '100%', padding: '14px', marginTop: '12px', fontSize: '1rem' }}
          >
            <span>Create Account</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '20px' }}>
          <span style={{ color: 'var(--color-muted)' }}>Already have an account? </span>
          <span 
            onClick={() => onNavigate('login')}
            style={{ fontWeight: 800, color: 'var(--color-dark)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
}
