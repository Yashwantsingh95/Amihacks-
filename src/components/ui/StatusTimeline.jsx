import React from 'react';
import { Check } from 'lucide-react';

export default function StatusTimeline({ currentStep = 3, orientation = 'horizontal' }) {
  // Steps:
  // 0: POSTED
  // 1: MATCHED
  // 2: DRIVER ASSIGNED
  // 3: PICKED UP
  // 4: ON THE WAY
  // 5: DELIVERED

  const steps = [
    { label: 'Posted', desc: 'Surplus food logged' },
    { label: 'Matched', desc: 'Shelter A assigned' },
    { label: 'Driver Assigned', desc: 'Rahul en-route' },
    { label: 'Picked Up', desc: 'Boxes secured' },
    { label: 'On The Way', desc: 'En-route to shelter' },
    { label: 'Delivered', desc: 'Handover complete' }
  ];

  if (orientation === 'vertical') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
        {steps.map((s, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={s.label} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
              {/* Vertical line connecting nodes */}
              {index < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  left: '13px',
                  bottom: '-24px',
                  width: '3px',
                  background: isDone ? 'var(--color-primary)' : '#d5ceba',
                  zIndex: 1
                }} />
              )}

              {/* Node indicator */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '2px solid var(--color-dark)',
                background: isDone ? 'var(--color-primary)' : isCurrent ? 'var(--color-dark)' : '#ffffff',
                color: isDone || isCurrent ? '#ffffff' : 'var(--color-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                boxShadow: isCurrent ? 'var(--shadow-neo-sm)' : 'none',
                fontWeight: 800,
                fontSize: '0.8rem'
              }}>
                {isDone ? <Check size={16} strokeWidth={3} /> : isCurrent ? '●' : '○'}
              </div>

              {/* Label & Description */}
              <div>
                <p style={{
                  fontSize: '0.95rem',
                  fontWeight: isCurrent ? 800 : 600,
                  color: isCurrent ? 'var(--color-dark)' : isDone ? 'var(--color-primary)' : 'var(--color-muted)'
                }}>
                  {s.label}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Timeline (Matches bottom bar in mockup)
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      padding: '16px 20px'
    }}>
      {/* Connecting background bar */}
      <div style={{
        position: 'absolute',
        top: '28px',
        left: '40px',
        right: '40px',
        height: '4px',
        background: '#d5ceba',
        zIndex: 1
      }}>
        {/* Filled active segment */}
        <div style={{
          width: `${Math.min(100, (currentStep / (steps.length - 1)) * 100)}%`,
          height: '100%',
          background: 'var(--color-primary)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {steps.map((s, index) => {
        const isDone = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div 
            key={s.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2,
              position: 'relative'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '2px solid var(--color-dark)',
              background: isDone ? 'var(--color-primary)' : isCurrent ? 'var(--color-dark)' : '#ffffff',
              color: isDone || isCurrent ? '#ffffff' : 'var(--color-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              boxShadow: isCurrent ? 'var(--shadow-neo-sm)' : 'none',
              marginBottom: '6px',
              transition: 'all 0.2s ease'
            }}>
              {isDone ? <Check size={14} strokeWidth={3} /> : isCurrent ? '●' : '○'}
            </div>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: isCurrent ? 800 : 600,
              color: isCurrent ? 'var(--color-dark)' : isDone ? 'var(--color-primary)' : 'var(--color-muted)',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
