import React from 'react';

export default function StatCard({ value, label, subtext, icon: Icon, badgeText }) {
  return (
    <div 
      className="neo-card" 
      style={{
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '2.4rem',
          fontWeight: 800,
          color: 'var(--color-dark)',
          lineHeight: 1
        }}>
          {value}
        </span>
        {badgeText && (
          <span className="neo-badge neo-badge-matched" style={{ fontSize: '0.7rem' }}>
            {badgeText}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--color-dark)'
          }}>
            {label}
          </p>
          {subtext && (
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--color-muted)',
              marginTop: '2px'
            }}>
              {subtext}
            </p>
          )}
        </div>
        {Icon && (
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            border: 'var(--border-dark)',
            background: 'var(--color-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-dark)'
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
