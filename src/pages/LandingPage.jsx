import React from 'react';
import { ArrowRight, Utensils, HeartHandshake, ShieldCheck, Sparkles, Clock, CheckCircle2, ChevronRight, Truck, Home } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Top Navbar */}
      <Navbar onNavigate={onNavigate} />

      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 24px 72px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Column: Bold Copy & CTAs */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: '#ffffff',
              border: 'var(--border-dark)',
              boxShadow: 'var(--shadow-neo-sm)',
              marginBottom: '20px',
              fontSize: '0.85rem',
              fontWeight: 800
            }}>
              <span className="pulse-dot" style={{ background: '#e63946' }} />
              <span>REAL-TIME FOOD RESCUE PLATFORM</span>
            </div>

            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-dark)',
              marginBottom: '22px'
            }}>
              TURN <br />
              SURPLUS FOOD <br />
              INTO SOMEONE’S <br />
              NEXT MEAL.
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: 'var(--color-dark-panel)',
              lineHeight: 1.55,
              fontWeight: 500,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Connect surplus edible food with nearby shelters before good food goes to waste. Real-time matching, fast pickup, and maximum impact.
            </p>

            {/* Hero Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
              <button
                onClick={() => onNavigate('donor-dashboard')}
                className="neo-btn neo-btn-dark"
                style={{ padding: '14px 28px', fontSize: '1.05rem' }}
              >
                <span>Donate Food</span>
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="neo-btn neo-btn-outline"
                style={{ padding: '14px 26px', fontSize: '1.05rem', background: '#ffffff' }}
              >
                How It Works
              </button>
            </div>

            {/* Impact Statistics Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              paddingTop: '24px',
              borderTop: 'var(--border-dark)'
            }}>
              <div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--color-dark)',
                  lineHeight: 1
                }}>
                  1.2M
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-muted)', marginTop: '4px' }}>
                  Meals Rescued
                </div>
              </div>

              <div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--color-dark)',
                  lineHeight: 1
                }}>
                  430T
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-muted)', marginTop: '4px' }}>
                  Food Diverted
                </div>
              </div>

              <div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--color-dark)',
                  lineHeight: 1
                }}>
                  28K
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-muted)', marginTop: '4px' }}>
                  Successful Rescues
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stylized Neo-Brutalist Map Visual (Matches Reference Screenshot) */}
          <div style={{ position: 'relative' }}>
            {/* Real Impact Speech bubble */}
            <div style={{
              position: 'absolute',
              top: '-16px',
              right: '24px',
              zIndex: 10,
              background: '#ffffff',
              border: 'var(--border-dark)',
              borderRadius: '12px',
              padding: '12px 18px',
              boxShadow: 'var(--shadow-neo)',
              transform: 'rotate(2deg)'
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1.2,
                color: 'var(--color-dark)'
              }}>
                REAL FOOD<br />
                REAL PEOPLE<br />
                REAL IMPACT
              </div>
            </div>

            {/* Stylized Hero Map Card */}
            <div 
              className="neo-card" 
              style={{
                background: '#e9e3ce',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <svg viewBox="0 0 500 440" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  <pattern id="hero-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ded8c4" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="500" height="440" fill="#eae4d2" />
                <rect width="500" height="440" fill="url(#hero-grid)" />

                {/* City Blocks */}
                <rect x="30" y="40" width="120" height="90" rx="8" fill="#fdfbf5" stroke="#d5ceba" strokeWidth="1.5" />
                <rect x="300" y="30" width="160" height="120" rx="8" fill="#fdfbf5" stroke="#d5ceba" strokeWidth="1.5" />
                <rect x="40" y="260" width="140" height="140" rx="8" fill="#fdfbf5" stroke="#d5ceba" strokeWidth="1.5" />

                {/* Stylized River */}
                <path d="M 340 0 C 370 120, 320 220, 420 320 C 470 370, 480 400, 500 440 L 500 0 Z" fill="#9db6cb" stroke="#0d1321" strokeWidth="2" />

                {/* Roads */}
                <path d="M 0 180 L 340 180" stroke="#ffffff" strokeWidth="14" />
                <path d="M 0 180 L 340 180" stroke="#0d1321" strokeWidth="2" strokeDasharray="4 6" />

                {/* Route Path connecting Restaurant -> Driver -> Shelter */}
                <path 
                  d="M 120 120 Q 230 180, 240 220 T 380 340" 
                  fill="none" 
                  stroke="#0d1321" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 120 120 Q 230 180, 240 220 T 380 340" 
                  fill="none" 
                  stroke="#3e5c76" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  className="anim-route-line" 
                />

                {/* Restaurant Landmark */}
                <g transform="translate(100, 90)">
                  <rect x="3" y="3" width="56" height="56" rx="10" fill="#0d1321" />
                  <rect x="0" y="0" width="56" height="56" rx="10" fill="#1d2d44" stroke="#0d1321" strokeWidth="2.5" />
                  <path d="M 18 40 L 18 24 L 28 16 L 38 24 L 38 40 Z" fill="#3e5c76" stroke="#ffffff" strokeWidth="2" />
                  <rect x="25" y="30" width="6" height="10" fill="#f0ebd8" />
                </g>
                {/* Speech Bubble Tag */}
                <g transform="translate(80, 48)">
                  <rect x="2" y="2" width="96" height="26" rx="6" fill="#0d1321" />
                  <rect x="0" y="0" width="96" height="26" rx="6" fill="#ffffff" stroke="#0d1321" strokeWidth="2" />
                  <text x="48" y="17" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="11" fill="#0d1321">
                    Restaurant
                  </text>
                  <polygon points="45,26 48,31 51,26" fill="#ffffff" stroke="#0d1321" strokeWidth="2" />
                </g>

                {/* Driver Van Landmark */}
                <g transform="translate(230, 195)">
                  <rect x="3" y="3" width="48" height="28" rx="6" fill="#0d1321" />
                  <rect x="0" y="0" width="48" height="28" rx="6" fill="#0d1321" stroke="#ffffff" strokeWidth="1.5" />
                  <rect x="4" y="4" width="20" height="18" rx="3" fill="#3e5c76" />
                  <rect x="28" y="7" width="12" height="12" rx="2" fill="#748cab" />
                  <circle cx="12" cy="28" r="4" fill="#1d2d44" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="36" cy="28" r="4" fill="#1d2d44" stroke="#ffffff" strokeWidth="1.5" />
                </g>

                {/* Shelter Landmark */}
                <g transform="translate(360, 310)">
                  <rect x="3" y="3" width="56" height="56" rx="10" fill="#0d1321" />
                  <rect x="0" y="0" width="56" height="56" rx="10" fill="#ffffff" stroke="#0d1321" strokeWidth="2.5" />
                  <path d="M 18 40 L 18 26 L 28 17 L 38 26 L 38 40 Z" fill="#e9e3d0" stroke="#0d1321" strokeWidth="2" />
                  <path d="M 15 28 L 28 17 L 41 28" fill="none" stroke="#0d1321" strokeWidth="2.5" />
                  <rect x="25" y="29" width="6" height="11" fill="#0d1321" />
                </g>
                {/* Speech Bubble Tag */}
                <g transform="translate(345, 380)">
                  <rect x="2" y="2" width="86" height="26" rx="6" fill="#0d1321" />
                  <rect x="0" y="0" width="86" height="26" rx="6" fill="#ffffff" stroke="#0d1321" strokeWidth="2" />
                  <text x="43" y="17" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="11" fill="#0d1321">
                    Shelter
                  </text>
                </g>
              </svg>

              {/* Bottom Quick Action Banner */}
              <div style={{
                marginTop: '16px',
                background: '#ffffff',
                border: 'var(--border-dark)',
                borderRadius: '10px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-neo-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="pulse-dot" style={{ background: '#2a9d8f' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Active Network: <strong>14 Shelters Ready</strong>
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('donor-dashboard')}
                  className="neo-btn neo-btn-dark"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Live Demo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        background: '#ffffff',
        borderTop: 'var(--border-dark)',
        borderBottom: 'var(--border-dark)',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <span className="neo-badge neo-badge-dark" style={{ marginBottom: '14px' }}>
              HOW IT WORKS
            </span>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--color-dark)',
              letterSpacing: '-0.02em',
              marginBottom: '14px'
            }}>
              Rescue Food in 4 Simple Steps
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              Food donations have an urgent 2–6 hour shelf life. RescueFlow coordinates donors, shelters, and drivers instantly.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {/* Step 1 */}
            <div className="neo-card-cream" style={{ padding: '28px 24px', position: 'relative' }}>
              <div style={{
                width: '42px',
                height: '42px',
                background: 'var(--color-dark)',
                color: '#ffffff',
                border: 'var(--border-dark)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-neo-sm)'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                Post in 60 Seconds
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Enter food type, quantity, safe consumption window, and pickup instructions with rapid presets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="neo-card-cream" style={{ padding: '28px 24px', position: 'relative' }}>
              <div style={{
                width: '42px',
                height: '42px',
                background: 'var(--color-primary)',
                color: '#ffffff',
                border: 'var(--border-dark)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-neo-sm)'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                Instant Smart Match
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                System calculates distance, shelter hunger needs, dietary requirements, and storage capacity.
              </p>
            </div>

            {/* Step 3 */}
            <div className="neo-card-cream" style={{ padding: '28px 24px', position: 'relative' }}>
              <div style={{
                width: '42px',
                height: '42px',
                background: 'var(--color-dark-panel)',
                color: '#ffffff',
                border: 'var(--border-dark)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-neo-sm)'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                Driver Dispatched
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Nearest verified volunteer driver accepts the rescue route, collects boxes, and confirms pickup.
              </p>
            </div>

            {/* Step 4 */}
            <div className="neo-card-cream" style={{ padding: '28px 24px', position: 'relative' }}>
              <div style={{
                width: '42px',
                height: '42px',
                background: '#2a9d8f',
                color: '#ffffff',
                border: 'var(--border-dark)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-neo-sm)'
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                Live Impact Tracked
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Track delivery live on the GPS map and earn verified impact metrics (meals rescued, carbon prevented).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact CTA Strip */}
      <section id="impact" style={{
        maxWidth: '1280px',
        margin: '64px auto',
        padding: '0 24px'
      }}>
        <div 
          className="neo-card" 
          style={{
            background: 'var(--color-dark)',
            color: '#ffffff',
            padding: '56px 40px',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <span className="neo-badge neo-badge-matched" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
            AMIHACKS 2026 INITIATIVE
          </span>

          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            marginBottom: '16px',
            color: 'var(--color-bg)'
          }}>
            Every Minute Counts When Food is Fresh.
          </h2>

          <p style={{
            color: 'var(--color-muted)',
            fontSize: '1.1rem',
            maxWidth: '620px',
            marginBottom: '32px',
            lineHeight: 1.6
          }}>
            Join restaurants, banquet halls, and food businesses routing surplus nourishment to those who need it most.
          </p>

          <button
            onClick={() => onNavigate('signup')}
            className="neo-btn neo-btn-cream"
            style={{ padding: '16px 36px', fontSize: '1.1rem' }}
          >
            <span>Register as a Food Donor</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--color-dark)',
        color: 'var(--color-muted)',
        borderTop: 'var(--border-dark)',
        padding: '36px 24px',
        textAlign: 'center'
      }} id="about">
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--color-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <HeartHandshake size={16} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: 'var(--color-bg)', fontSize: '1.1rem' }}>
              RESCUEFLOW
            </span>
          </div>

          <div style={{ fontSize: '0.85rem' }}>
            Surplus-to-Shelter: Real-Time Food Rescue Routing • AmiHacks Hackathon
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('donor-dashboard')}>Donor Portal</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('login')}>Partner Login</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
