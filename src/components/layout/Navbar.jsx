import { ShieldAlert, ArrowRight, HeartHandshake, Layers } from 'lucide-react';
import { InstallAppButton } from '../ui/PWAInstallBanner';

export default function Navbar({ activeRoute, onNavigate }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 36px',
      background: 'var(--color-bg)',
      borderBottom: 'var(--border-dark)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand */}
      <div 
        onClick={() => onNavigate('landing')} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
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
          boxShadow: 'var(--shadow-neo-sm)',
          color: '#ffffff'
        }}>
          <HeartHandshake size={22} strokeWidth={2.5} />
        </div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.45rem',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: 'var(--color-dark)'
        }}>
          RESCUEFLOW
        </span>
      </div>

      {/* Nav Links */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px'
      }} className="desktop-nav">
        <a 
          href="#how-it-works" 
          onClick={(e) => { e.preventDefault(); onNavigate('landing'); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
          style={{ fontWeight: 600, color: 'var(--color-dark)', textDecoration: 'none', fontSize: '0.95rem' }}
        >
          How It Works
        </a>
        <a 
          href="#impact" 
          onClick={(e) => { e.preventDefault(); onNavigate('landing'); setTimeout(() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
          style={{ fontWeight: 600, color: 'var(--color-dark)', textDecoration: 'none', fontSize: '0.95rem' }}
        >
          Impact
        </a>
        <a 
          href="#about" 
          onClick={(e) => { e.preventDefault(); onNavigate('landing'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
          style={{ fontWeight: 600, color: 'var(--color-dark)', textDecoration: 'none', fontSize: '0.95rem' }}
        >
          About
        </a>
      </nav>

      {/* Auth & Install Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <InstallAppButton />

        <button 
          onClick={() => onNavigate('login')}
          className="neo-btn neo-btn-outline"
          style={{ padding: '8px 18px', fontSize: '0.9rem' }}
        >
          Log In
        </button>
        <button 
          onClick={() => onNavigate('signup')}
          className="neo-btn neo-btn-dark"
          style={{ padding: '8px 18px', fontSize: '0.9rem' }}
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}
