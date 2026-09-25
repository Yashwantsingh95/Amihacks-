import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Leaf, 
  Award, 
  Download, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { weeklyImpactChart } from '../data/mockData';
import { getCurrentUser } from '../services/api';

export default function ImpactPage({ onNavigate }) {
  const [filterPeriod, setFilterPeriod] = useState('This Month');
  const [activeTab, setActiveTab] = useState('meals'); // 'meals' or 'kg'

  const maxMeals = Math.max(...weeklyImpactChart.map(d => d.meals));
  const activeUser = getCurrentUser();
  const role = activeUser?.role?.toUpperCase() || 'DONOR';

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px', margin: '0 auto' }} className="page-container">
      {/* Title & Filter (Matches mockup bottom right) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--color-dark)'
          }}>
            {role === 'SHELTER' ? 'Shelter Meal Intake & Impact' : role === 'DRIVER' ? 'Volunteer Rescue Mileage & Impact' : 'Your Surplus Food Rescue Impact'}
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', fontWeight: 500, marginTop: '4px' }}>
            Tangible social and environmental difference made by {activeUser?.name || 'Your Organization'}.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="neo-input"
            style={{ width: 'auto', padding: '10px 16px', cursor: 'pointer', fontWeight: 700 }}
          >
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Quarter">This Quarter</option>
            <option value="All Time">All Time</option>
          </select>

          <button
            onClick={() => alert('RescueFlow Impact Certificate generated and downloaded as PDF.')}
            className="neo-btn neo-btn-outline"
            style={{ padding: '10px 18px', fontSize: '0.9rem', background: '#ffffff' }}
          >
            <Download size={16} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* 3 Prominent Stat Cards (Matches mockup) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {/* Meals Rescued */}
        <div className="neo-card" style={{ padding: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'var(--color-dark)',
            border: 'var(--border-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-neo-sm)'
          }}>
            <HeartHandshake size={32} />
          </div>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2.3rem',
              fontWeight: 900,
              color: 'var(--color-dark)',
              lineHeight: 1
            }}>
              1,240
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-muted)', marginTop: '4px' }}>
              Meals Rescued
            </p>
          </div>
        </div>

        {/* Food Diverted */}
        <div className="neo-card" style={{ padding: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: '#2a9d8f',
            border: 'var(--border-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-neo-sm)'
          }}>
            <Leaf size={32} />
          </div>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2.3rem',
              fontWeight: 900,
              color: 'var(--color-dark)',
              lineHeight: 1
            }}>
              430 kg
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-muted)', marginTop: '4px' }}>
              Food Diverted
            </p>
          </div>
        </div>

        {/* Successful Rescues */}
        <div className="neo-card" style={{ padding: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'var(--color-primary)',
            border: 'var(--border-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-neo-sm)'
          }}>
            <Award size={32} />
          </div>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2.3rem',
              fontWeight: 900,
              color: 'var(--color-dark)',
              lineHeight: 1
            }}>
              28
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-muted)', marginTop: '4px' }}>
              Successful Rescues
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart Section (Matches mockup illustration) */}
      <div className="neo-card" style={{ padding: '32px', background: '#ffffff', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 800,
              color: 'var(--color-dark)'
            }}>
              Rescue Activity Breakdown
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '2px' }}>
              Daily meals safely channeled to registered shelter partners
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('meals')}
              className={`neo-btn ${activeTab === 'meals' ? 'neo-btn-dark' : 'neo-btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Meals Diverted
            </button>
            <button
              onClick={() => setActiveTab('kg')}
              className={`neo-btn ${activeTab === 'kg' ? 'neo-btn-dark' : 'neo-btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Weight (kg)
            </button>
          </div>
        </div>

        {/* Custom Neo-Brutalist Bar Chart */}
        <div style={{
          height: '240px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          paddingBottom: '32px',
          borderBottom: '2px solid var(--color-dark)',
          position: 'relative'
        }}>
          {weeklyImpactChart.map((item) => {
            const val = activeTab === 'meals' ? item.meals : item.kg;
            const maxVal = activeTab === 'meals' ? 450 : 600;
            const heightPercent = (val / maxVal) * 100;

            return (
              <div 
                key={item.day}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  position: 'relative'
                }}
              >
                {/* Tooltip on bar */}
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--color-dark)',
                  marginBottom: '8px'
                }}>
                  {val}
                </div>

                {/* Bar element */}
                <div 
                  style={{
                    width: '100%',
                    maxWidth: '44px',
                    height: `${heightPercent}%`,
                    background: item.day === 'Sat' ? 'var(--color-primary)' : 'var(--color-dark)',
                    border: 'var(--border-dark)',
                    borderRadius: '6px 6px 0 0',
                    boxShadow: 'var(--shadow-neo-sm)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scaleY(1.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1)'}
                />

                {/* Day label */}
                <span style={{
                  position: 'absolute',
                  bottom: '-28px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-dark)'
                }}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="pulse-dot" style={{ background: '#2a9d8f' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark)' }}>
              Top Recipient: <strong>Shelter A (520 meals rescued)</strong>
            </span>
          </div>

          <button
            onClick={() => {
              if (role === 'SHELTER') onNavigate('/shelter/available');
              else if (role === 'DRIVER') onNavigate('/driver/requests');
              else onNavigate('/donor/create');
            }}
            className="neo-btn neo-btn-dark"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <span>{role === 'SHELTER' ? 'View Available Intake →' : role === 'DRIVER' ? 'View Pickup Missions →' : '+ Donate More Surplus'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Sustainability & Environmental equivalencies */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        <div className="neo-card-cream" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
            🌍 Greenhouse Gases Prevented
          </h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2a9d8f' }}>
            1,075 kg CO₂e
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '4px' }}>
            Equivalent to removing 230 car miles from city roads.
          </p>
        </div>

        <div className="neo-card-cream" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
            💧 Water Footprint Conserved
          </h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)' }}>
            86,000 Liters
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '4px' }}>
            Embedded water saved across agricultural supply chains.
          </p>
        </div>
      </div>
    </div>
  );
}
