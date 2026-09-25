import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Navigation, 
  BarChart3, 
  User, 
  HeartHandshake,
  LogOut,
  X,
  Building2,
  CheckCircle2,
  Truck,
  Clock,
  Layers,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { api, getCurrentUser } from '../../services/api';
import { InstallAppButton } from '../ui/PWAInstallBanner';

export default function Sidebar({ activeRoute, onNavigate, onLogout, mobileOpen, setMobileOpen }) {
  const currentUser = getCurrentUser();
  const userRole = currentUser?.role?.toUpperCase() || 'DONOR';

  // Role-specific navigation items (Strict separation - No crossover)
  const donorNavItems = [
    { id: '/donor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/donor/map', label: 'Live Network Map', icon: MapPin },
    { id: '/donor/create', label: 'Create Donation', icon: PlusCircle },
    { id: '/donor/donations', label: 'My Donations', icon: Package },
    { id: '/donor/tracking', label: 'Live Tracking', icon: Navigation },
    { id: '/donor/impact', label: 'Impact', icon: BarChart3 },
    { id: '/donor/profile', label: 'Profile', icon: User }
  ];

  const shelterNavItems = [
    { id: '/shelter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/shelter/map', label: 'Live Network Map', icon: MapPin },
    { id: '/shelter/available', label: 'Available Donations', icon: Package },
    { id: '/shelter/accepted', label: 'Accepted Donations', icon: CheckCircle2 },
    { id: '/shelter/capacity', label: 'Capacity & Need', icon: Layers },
    { id: '/shelter/tracking', label: 'Live Tracking', icon: Navigation },
    { id: '/shelter/impact', label: 'Shelter Impact', icon: BarChart3 },
    { id: '/shelter/profile', label: 'Profile', icon: User }
  ];

  const driverNavItems = [
    { id: '/driver/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/driver/map', label: 'Live Logistics Map', icon: MapPin },
    { id: '/driver/requests', label: 'Pickup Requests', icon: Package },
    { id: '/driver/rescue', label: 'Active Rescue', icon: Truck },
    { id: '/driver/route', label: 'Live Route & GPS', icon: Navigation },
    { id: '/driver/history', label: 'History', icon: Clock },
    { id: '/driver/profile', label: 'Profile', icon: User }
  ];

  // Select ONLY current role items
  let navItems = donorNavItems;
  let portalBadge = 'DONOR PORTAL';
  let portalBadgeColor = '#2a9d8f';

  if (userRole === 'SHELTER') {
    navItems = shelterNavItems;
    portalBadge = 'SHELTER PORTAL';
    portalBadgeColor = '#e76f51';
  } else if (userRole === 'DRIVER') {
    navItems = driverNavItems;
    portalBadge = 'DRIVER PORTAL';
    portalBadgeColor = '#3a86ff';
  }

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      api.auth.logout();
      onNavigate('/login');
    }
    setMobileOpen(false);
  };

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
          width: '265px',
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
          padding: '0 8px 16px 8px',
          borderBottom: '1px solid rgba(116, 140, 171, 0.25)',
          marginBottom: '16px'
        }}>
          <div 
            onClick={() => onNavigate(navItems[0].id)}
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
            <div>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--color-bg)',
                display: 'block',
                lineHeight: 1.1
              }}>
                RESCUEFLOW
              </span>
            </div>
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

        {/* Role Portal Badge */}
        <div style={{
          background: 'rgba(29, 45, 68, 0.85)',
          border: '1px solid rgba(116, 140, 171, 0.3)',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: portalBadgeColor,
              display: 'inline-block'
            }} />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: '#ffffff',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              {portalBadge}
            </span>
          </div>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--color-muted)',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            {currentUser?.name ? currentUser.name.split(' ')[0] : 'Verified'}
          </span>
        </div>

        {/* Main Navigation (Strictly Role-Aware) */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check active route match
            const isActive = activeRoute === item.id || 
              (item.id.endsWith('dashboard') && (activeRoute === item.id || activeRoute.endsWith('dashboard'))) ||
              (item.id.endsWith('donations') && (activeRoute === item.id || activeRoute.includes('donation-details'))) ||
              (item.id.endsWith('tracking') && activeRoute.includes('tracking')) ||
              (item.id.endsWith('route') && activeRoute.includes('route'));

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
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 800 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile, Install App and Sign Out Section */}
        <div style={{
          borderTop: '1px solid rgba(116, 140, 171, 0.25)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <InstallAppButton variant="sidebar" />

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s ease'
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
