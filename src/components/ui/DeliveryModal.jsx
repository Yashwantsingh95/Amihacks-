import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle2, Heart, Award, X } from 'lucide-react';

export default function DeliveryModal({ isOpen, onClose, onViewImpact, donation }) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d1321', '#1d2d44', '#3e5c76', '#748cab', '#f0ebd8', '#2a9d8f']
        });
      } catch (err) {
        console.log('Confetti effect');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const meals = donation?.quantity || 40;
  const foodType = donation?.foodType || 'Veg Biryani';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(13, 19, 33, 0.75)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px'
    }}>
      <div 
        className="neo-card" 
        style={{
          width: '100%',
          maxWidth: '480px',
          textAlign: 'center',
          padding: '36px 30px',
          position: 'relative',
          animation: 'popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
            color: 'var(--color-muted)'
          }}
        >
          <X size={20} />
        </button>

        {/* Hand-drawn celebration package illustration */}
        <div style={{
          width: '120px',
          height: '110px',
          margin: '0 auto 20px',
          position: 'relative'
        }}>
          {/* Burst lines */}
          <div style={{
            position: 'absolute',
            inset: '-10px',
            pointerEvents: 'none'
          }}>
            <svg viewBox="0 0 140 130" style={{ width: '100%', height: '100%' }}>
              <line x1="20" y1="20" x2="10" y2="10" stroke="#0d1321" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="120" y1="20" x2="130" y2="10" stroke="#0d1321" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="70" y1="10" x2="70" y2="2" stroke="#0d1321" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="10" y1="65" x2="2" y2="65" stroke="#0d1321" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="130" y1="65" x2="138" y2="65" stroke="#0d1321" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Rescue Box SVG */}
          <svg viewBox="0 0 100 90" style={{ width: '100%', height: '100%' }}>
            {/* Box shadow */}
            <rect x="18" y="28" width="68" height="52" rx="8" fill="#0d1321" />
            {/* Box Body */}
            <rect x="14" y="24" width="68" height="52" rx="8" fill="#1d2d44" stroke="#0d1321" strokeWidth="2.5" />
            {/* Box Lid Ribbon */}
            <rect x="42" y="24" width="12" height="52" fill="#748cab" stroke="#0d1321" strokeWidth="1.5" />
            {/* Cute Ribbon Bow */}
            <path d="M 40 24 C 30 10, 44 8, 48 24 Z" fill="#3e5c76" stroke="#0d1321" strokeWidth="2" />
            <path d="M 56 24 C 66 10, 52 8, 48 24 Z" fill="#3e5c76" stroke="#0d1321" strokeWidth="2" />
            <circle cx="48" cy="24" r="5" fill="#f0ebd8" stroke="#0d1321" strokeWidth="2" />
            {/* Food badge on box */}
            <rect x="24" y="44" width="22" height="18" rx="4" fill="#f0ebd8" stroke="#0d1321" strokeWidth="1.5" />
            <path d="M 31 49 L 39 49 M 35 49 L 35 57" stroke="#0d1321" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <span className="neo-badge neo-badge-matched" style={{ marginBottom: '12px', fontSize: '0.8rem' }}>
          ✓ Verified Handover
        </span>

        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--color-dark)',
          marginBottom: '6px'
        }}>
          Delivery Completed
        </h2>

        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '2.2rem',
          fontWeight: 900,
          color: 'var(--color-primary)',
          letterSpacing: '-0.02em',
          margin: '8px 0 12px 0'
        }}>
          {meals} Meals Rescued!
        </div>

        <p style={{
          fontSize: '0.95rem',
          color: 'var(--color-muted)',
          maxWidth: '360px',
          margin: '0 auto 24px auto',
          lineHeight: 1.5
        }}>
          Successfully handed over from <strong>ABC Restaurant</strong> to <strong>Shelter A</strong>. Thank you for making a real difference today!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              onClose();
              if (onViewImpact) onViewImpact();
            }}
            className="neo-btn neo-btn-dark"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            <span>View Impact</span>
            <ArrowRight size={18} />
          </button>
          
          <button
            onClick={onClose}
            className="neo-btn neo-btn-outline"
            style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
