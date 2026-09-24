import React, { useState } from 'react';
import { HeartHandshake, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('partner@abcrestaurant.in');
  const [password, setPassword] = useState('rescue2026');
  const [showPassword, setShowPassword] = useState(false);

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
      padding: '24px'
    }}>
      {/* Brand Header */}
      <div 
        onClick={() => onNavigate('landing')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          marginBottom: '28px'
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

      {/* Login Card (Matches Mockup in screenshot) */}
      <div 
        className="neo-card" 
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 32px',
          background: '#ffffff'
        }}
      >
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.85rem',
          fontWeight: 800,
          color: 'var(--color-dark)',
          marginBottom: '6px'
        }}>
          Welcome back
        </h2>
        <p style={{
          color: 'var(--color-muted)',
          fontSize: '0.95rem',
          marginBottom: '28px'
        }}>
          Log in to continue your food rescue journey.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Password
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', cursor: 'pointer', fontWeight: 600 }}>
                Forgot?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="neo-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-muted)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="neo-btn neo-btn-dark"
            style={{ width: '100%', padding: '13px', marginTop: '6px', fontSize: '1rem' }}
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '24px 0 20px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e2dcc8' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
            or continue with
          </span>
          <div style={{ flex: 1, height: '1px', background: '#e2dcc8' }} />
        </div>

        {/* Mock Quick Social / Passkey Icons (Matches screenshot) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { if (onLogin) onLogin(); onNavigate('donor-dashboard'); }}
            className="neo-btn neo-btn-outline"
            style={{ padding: '10px', fontSize: '0.85rem', background: '#ffffff', fontWeight: 800 }}
          >
            G
          </button>
          <button
            type="button"
            onClick={() => { if (onLogin) onLogin(); onNavigate('donor-dashboard'); }}
            className="neo-btn neo-btn-outline"
            style={{ padding: '10px', fontSize: '0.85rem', background: '#ffffff', fontWeight: 800 }}
          >
            
          </button>
          <button
            type="button"
            onClick={() => { if (onLogin) onLogin(); onNavigate('donor-dashboard'); }}
            className="neo-btn neo-btn-outline"
            style={{ padding: '10px', fontSize: '0.85rem', background: '#ffffff', fontWeight: 800 }}
          >
            ⚿
          </button>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--color-muted)' }}>Don't have an account? </span>
          <span 
            onClick={() => onNavigate('signup')}
            style={{ fontWeight: 800, color: 'var(--color-dark)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create one
          </span>
        </div>
      </div>
    </div>
  );
}
