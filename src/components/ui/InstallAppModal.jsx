import React from 'react';
import { X, Download, Share, PlusSquare, Smartphone, CheckCircle2 } from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose, isIOS }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(13, 19, 33, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div 
        className="neo-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          padding: '28px',
          position: 'relative',
          animation: 'fadeInUp 0.25s ease-out'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-dark)',
            padding: '4px'
          }}
          title="Close"
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'var(--color-primary)',
            borderRadius: '12px',
            border: 'var(--border-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '2px 2px 0px #0d1321'
          }}>
            <Smartphone size={24} />
          </div>
          <div>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-dark)',
              margin: 0
            }}>
              Install RESCUEFLOW
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '2px 0 0', fontWeight: 600 }}>
              Add to Home Screen for fast mobile access
            </p>
          </div>
        </div>

        {isIOS ? (
          /* iOS Safari Step-by-Step Instructions */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-panel)', margin: 0, lineHeight: 1.5 }}>
              To install <strong>RESCUEFLOW</strong> on your iPhone or iPad:
            </p>

            <div style={{
              background: 'var(--color-bg)',
              padding: '14px',
              borderRadius: '8px',
              border: 'var(--border-dark)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}>
                  1
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Tap the <strong>Share</strong> button <Share size={16} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> in Safari toolbar.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}>
                  2
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={16} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} />.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}>
                  3
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Tap <strong>"Add"</strong> in the top right corner.
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Chrome / Android / Desktop Manual Instructions */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-panel)', margin: 0, lineHeight: 1.5 }}>
              In your browser:
            </p>

            <div style={{
              background: 'var(--color-bg)',
              padding: '14px',
              borderRadius: '8px',
              border: 'var(--border-dark)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--color-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Tap the browser menu (<strong>⋮</strong> three dots at the top right).
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Download size={18} color="var(--color-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="neo-btn neo-btn-dark"
          style={{ width: '100%', padding: '12px', marginTop: '20px' }}
        >
          Got It!
        </button>
      </div>
    </div>
  );
}
