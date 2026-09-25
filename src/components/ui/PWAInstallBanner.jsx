import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { subscribePWAState, triggerPWAInstall } from '../../services/pwaService';
import InstallAppModal from './InstallAppModal';

// Reusable Install App Button for Navbar & Sidebar
export function InstallAppButton({ className = '', style = {}, variant = 'default' }) {
  const [pwaState, setPwaState] = useState({ isInstalled: false, isInstallable: false, isIOS: false });
  const [showModal, setShowModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    return subscribePWAState((state) => {
      setPwaState(state);
    });
  }, []);

  const handleInstallClick = async () => {
    const res = await triggerPWAInstall();
    if (res.outcome === 'accepted') {
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
    } else if (res.outcome === 'ios_instructions' || res.outcome === 'manual_instructions') {
      setShowModal(true);
    }
  };

  if (pwaState.isInstalled) {
    return (
      <span 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#2a9d8f',
          padding: '6px 12px',
          background: 'rgba(42, 157, 143, 0.1)',
          borderRadius: '8px',
          ...style
        }}
      >
        <CheckCircle2 size={16} />
        <span>App Installed</span>
      </span>
    );
  }

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '2px solid rgba(233, 196, 106, 0.6)',
            background: 'rgba(233, 196, 106, 0.15)',
            color: '#f0ebd8',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
            ...style
          }}
          title="Install RESCUEFLOW on your device"
        >
          <Download size={18} color="#e9c46a" />
          <span style={{ color: '#e9c46a' }}>Install Mobile App</span>
        </button>
        <InstallAppModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isIOS={pwaState.isIOS}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`neo-btn ${className}`}
        style={{
          padding: '8px 16px',
          fontSize: '0.88rem',
          background: '#e9c46a',
          color: '#0d1321',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          ...style
        }}
        title="Download and install RESCUEFLOW on your mobile/desktop"
      >
        <Download size={16} />
        <span>{installedSuccess ? 'Installed! 🎉' : 'Install App'}</span>
      </button>
      <InstallAppModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIOS={pwaState.isIOS}
      />
    </>
  );
}

// Floating Mobile Prompt Banner
export default function PWAInstallBanner() {
  const [pwaState, setPwaState] = useState({ isInstalled: false, isInstallable: false, isIOS: false });
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed today
    const lastDismissed = localStorage.getItem('rescueflow_pwa_dismissed');
    if (lastDismissed && Date.now() - Number(lastDismissed) < 24 * 60 * 60 * 1000) {
      setDismissed(true);
    }

    return subscribePWAState((state) => {
      setPwaState(state);
    });
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('rescueflow_pwa_dismissed', Date.now().toString());
  };

  const handleInstallClick = async () => {
    const res = await triggerPWAInstall();
    if (res.outcome === 'accepted') {
      setDismissed(true);
    } else if (res.outcome === 'ios_instructions' || res.outcome === 'manual_instructions') {
      setShowModal(true);
    }
  };

  // Do not show if already running as an installed standalone app or dismissed
  if (pwaState.isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      <div
        className="neo-card"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          maxWidth: '380px',
          width: 'calc(100% - 40px)',
          background: '#ffffff',
          padding: '16px 20px',
          zIndex: 9000,
          boxShadow: 'var(--shadow-neo-lg)',
          border: 'var(--border-dark)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              background: 'var(--color-primary)',
              borderRadius: '10px',
              border: '2px solid #0d1321',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <Smartphone size={22} />
            </div>
            <div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.98rem',
                fontWeight: 800,
                color: 'var(--color-dark)'
              }}>
                Install RESCUEFLOW
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                Direct mobile install from Chrome
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              padding: '2px'
            }}
            title="Dismiss"
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--color-dark-panel)', margin: 0, lineHeight: 1.4 }}>
          Install the app on your home screen for quick offline access, instant notifications & live GPS delivery tracking.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleInstallClick}
            className="neo-btn"
            style={{
              flex: 1,
              padding: '8px 14px',
              fontSize: '0.85rem',
              background: '#e9c46a',
              color: '#0d1321',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Download size={16} />
            <span>Install App</span>
          </button>

          <button
            onClick={handleDismiss}
            className="neo-btn neo-btn-outline"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              background: '#ffffff'
            }}
          >
            Not Now
          </button>
        </div>
      </div>

      <InstallAppModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIOS={pwaState.isIOS}
      />
    </>
  );
}
