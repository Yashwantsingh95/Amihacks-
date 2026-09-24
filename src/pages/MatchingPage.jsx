import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ShieldCheck, Home, MapPin, Users, HeartHandshake, Loader2 } from 'lucide-react';
import { mockShelters } from '../data/mockData';

export default function MatchingPage({ donation, onNavigate, onMatchConfirmed }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [matched, setMatched] = useState(false);

  const checklistItems = [
    { label: 'Nearby shelters found', sub: 'Scanning 5 km radius in New Delhi' },
    { label: 'Capacity checked', sub: 'Verified 80+ cold storage & warm distribution capacity' },
    { label: 'Current need checked', sub: 'Matching immediate evening meal demand' },
    { label: 'Distance calculated', sub: 'Optimal route: 2.1 km via Connaught Place' },
    { label: 'Food preference checked', sub: 'Requires cooked vegetarian meals' }
  ];

  // Progressive simulation of the matching algorithm
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < checklistItems.length) {
          return prev + 1;
        } else {
          setMatched(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(timer);
  }, []);

  const selectedShelter = mockShelters[0];

  const handleConfirm = () => {
    if (onMatchConfirmed) {
      onMatchConfirmed(selectedShelter);
    }
    onNavigate('donor-tracking');
  };

  return (
    <div style={{ padding: '40px 36px', maxWidth: '1080px', margin: '0 auto' }} className="page-container">
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: '#ffffff',
          border: 'var(--border-dark)',
          boxShadow: 'var(--shadow-neo-sm)',
          marginBottom: '16px',
          fontSize: '0.85rem',
          fontWeight: 800
        }}>
          {!matched ? (
            <>
              <span className="pulse-dot" style={{ background: '#3e5c76' }} />
              <span>REAL-TIME ROUTING ENGINE</span>
            </>
          ) : (
            <>
              <span className="pulse-dot" style={{ background: '#2a9d8f' }} />
              <span style={{ color: '#1b4332' }}>OPTIMAL MATCH RESOLVED</span>
            </>
          )}
        </div>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(2rem, 4vw, 2.7rem)',
          fontWeight: 800,
          color: 'var(--color-dark)',
          marginBottom: '8px'
        }}>
          {!matched ? 'Finding the best rescue match...' : 'Optimal Rescue Match Found!'}
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', fontWeight: 500 }}>
          Evaluating recipient capacity, travel distance, and immediate meal need.
        </p>
      </div>

      {/* Main Grid: Checklist (Left) + Best Match Card (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '32px',
        alignItems: 'center'
      }}>
        {/* Left: Progressive Animated Checklist */}
        <div className="neo-card" style={{ padding: '36px 32px', background: '#ffffff' }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            marginBottom: '24px',
            color: 'var(--color-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Matching Criteria</span>
            {!matched && <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {checklistItems.map((item, index) => {
              const isDone = index < currentStep;
              const isChecking = index === currentStep;

              return (
                <div 
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    opacity: isDone || isChecking ? 1 : 0.4,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    border: 'var(--border-dark)',
                    background: isDone ? 'var(--color-primary)' : isChecking ? 'var(--color-bg)' : '#ffffff',
                    color: isDone ? '#ffffff' : 'var(--color-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    boxShadow: isDone ? 'var(--shadow-neo-sm)' : 'none'
                  }}>
                    {isDone ? <Check size={18} strokeWidth={3} /> : index + 1}
                  </div>

                  <div>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: isDone ? 800 : 600,
                      color: isDone ? 'var(--color-dark)' : 'var(--color-muted)'
                    }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                      {item.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Best Match Found Card (Matches Screenshot!) */}
        <div>
          <div 
            className="neo-card" 
            style={{
              padding: '36px 32px',
              textAlign: 'center',
              background: '#d8e2dc',
              position: 'relative',
              boxShadow: 'var(--shadow-neo-lg)'
            }}
          >
            {/* Top Pill */}
            <span className="neo-badge neo-badge-dark" style={{ marginBottom: '20px', padding: '6px 14px' }}>
              BEST MATCH FOUND
            </span>

            {/* Shelter Graphic */}
            <div style={{
              width: '90px',
              height: '80px',
              margin: '0 auto 16px auto',
              background: '#ffffff',
              border: 'var(--border-dark)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neo-sm)'
            }}>
              <Home size={44} strokeWidth={2.2} color="var(--color-dark)" />
            </div>

            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--color-dark)',
              marginBottom: '4px'
            }}>
              {selectedShelter.name}
            </h3>

            <p style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--color-muted)',
              marginBottom: '16px'
            }}>
              {selectedShelter.distance} • Karol Bagh
            </p>

            {/* Badges: High Need & Capacity Available */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
              <span style={{
                background: '#ffd6d6',
                color: '#9e2a2b',
                border: '1.5px solid #0d1321',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                High Need
              </span>

              <span style={{
                background: '#d8f3dc',
                color: '#1b4332',
                border: '1.5px solid #0d1321',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                Capacity Available
              </span>
            </div>

            <button
              onClick={handleConfirm}
              className="neo-btn neo-btn-dark"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.05rem',
                boxShadow: 'var(--shadow-neo)'
              }}
            >
              <span>Confirm Match</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
