import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Navigation, 
  BarChart3, 
  Settings, 
  User, 
  HeartHandshake,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ activeRoute, onNavigate, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'donor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donor-donations', label: 'Donations', icon: Package },
    { id: 'donor-create', label: 'Create Donation', icon: PlusCircle },
    { id: 'donor-tracking', label: 'Tracking', icon: Navigation },
    { id: 'donor-impact', label: 'Impact', icon: BarChart3 }
  ];

  const bottomItems = [
    { id: 'donor-settings', label: 'Settings', icon: Settings },
    { id: 'donor-profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(13, 19, 33, 0.7)',
            zIndex: 90
          }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        style={{
          width: '260px',
          background: 'var(--color-dark)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          borderRight: 'var(--border-dark)',
          padding: '24px 16px',
          flexShrink: 0,
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
        className={`donor-sidebar ${mobileOpen ? 'open' : ''}`}
      >
        {/* Header / Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 24px 8px',
          borderBottom: '1px solid rgba(116, 140, 171, 0.25)',
          marginBottom: '20px'
        }}>
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
              width: '36px',
              height: '36px',
              background: 'var(--color-primary)',
              borderRadius: '8px',
              border: '2px solid rgba(240, 235, 216, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <HeartHandshake size={20} strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-bg)'
            }}>
              RESCUEFLOW
            </span>
          </div>

          {/* Close for mobile */}
          <button 
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'none'
            }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id || 
              (item.id === 'donor-tracking' && (activeRoute.startsWith('donor-tracking') || activeRoute === 'donor-tracking')) ||
              (item.id === 'donor-donations' && activeRoute.startsWith('donor-donation-details'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isActive ? '2px solid rgba(240, 235, 216, 0.4)' : '2px solid transparent',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--color-muted)',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: isActive ? 'var(--shadow-neo-sm)' : 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(62, 92, 118, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--color-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(116, 140, 171, 0.25)',
          margin: '20px 8px'
        }} />

        {/* Bottom Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: isActive ? '2px solid rgba(240, 235, 216, 0.4)' : '2px solid transparent',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--color-muted)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => onNavigate('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              marginTop: '4px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#ef4444',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
