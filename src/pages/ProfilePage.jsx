import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Clock, 
  Save, 
  CheckCircle2,
  FileCheck,
  User,
  Truck
} from 'lucide-react';
import { donorProfile } from '../data/mockData';
import { getCurrentUser, api } from '../services/api';

export default function ProfilePage({ onNavigate, onLogout }) {
  const activeUser = getCurrentUser();
  const role = activeUser?.role?.toUpperCase() || 'DONOR';

  const [profile, setProfile] = useState({
    name: activeUser?.name || 'Verified User',
    email: activeUser?.email || 'user@rescueflow.com',
    contact: '+91 98765 43210',
    address: activeUser?.location?.address || 'Connaught Place, New Delhi',
    avatar: activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : 'U'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      api.auth.logout();
      onNavigate('/login');
    }
  };

  const roleTitle = role === 'SHELTER' 
    ? 'Shelter Organization Profile' 
    : role === 'DRIVER' 
    ? 'Driver Volunteer Profile' 
    : 'Food Donor Organization Profile';

  const roleDescription = role === 'SHELTER'
    ? 'Manage intake facility credentials, dispatch contact, and emergency delivery gate.'
    : role === 'DRIVER'
    ? 'Manage volunteer vehicle info, live dispatch phone, and safety certifications.'
    : 'Manage food donor credentials, primary dispatch address, and hygiene verification.';

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1000px', margin: '0 auto' }} className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="neo-badge neo-badge-matched">
            {role} PORTAL ACCOUNT
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 800,
          color: 'var(--color-dark)'
        }}>
          {roleTitle}
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', fontWeight: 500, marginTop: '4px' }}>
          {roleDescription}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Left Profile Card */}
        <div className="neo-card" style={{ padding: '32px', background: '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '20px',
              background: 'var(--color-dark)',
              border: 'var(--border-dark)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.4rem',
              fontWeight: 900,
              margin: '0 auto 16px auto',
              boxShadow: 'var(--shadow-neo)'
            }}>
              {profile.avatar}
            </div>

            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>
              {profile.name}
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
              Authenticated {role} Participant
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <span className="neo-badge neo-badge-matched">
                ✓ VERIFIED IDENTITY
              </span>
              <span className="neo-badge neo-badge-dark">
                ★ 4.95
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2dcc8', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
              <MapPin size={18} color="var(--color-primary)" />
              <span>{profile.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
              <Mail size={18} color="var(--color-primary)" />
              <span>{profile.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
              <Phone size={18} color="var(--color-primary)" />
              <span>{profile.contact}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
              <Clock size={18} color="var(--color-primary)" />
              <span>Active Network Hours: 24/7 Priority</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="neo-card" style={{ padding: '32px', background: '#ffffff' }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 800,
            marginBottom: '20px'
          }}>
            Account Details & Preferences
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                Account Display Name
              </label>
              <input
                type="text"
                className="neo-input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                Primary Registered Address
              </label>
              <input
                type="text"
                className="neo-input"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="neo-input"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px' }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  className="neo-input"
                  value={profile.contact}
                  onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                />
              </div>
            </div>

            {/* Compliance Badge */}
            <div style={{
              background: 'var(--color-bg)',
              border: 'var(--border-dark)',
              borderRadius: '10px',
              padding: '16px',
              marginTop: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FileCheck size={18} color="#2a9d8f" />
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Verified Platform Member</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                Certified under RescueFlow Safe Food Logistics Standard. Securely authorized for the {role} portal.
              </p>
            </div>

            <button
              type="submit"
              className="neo-btn neo-btn-dark"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            >
              <Save size={18} />
              <span>{saved ? 'Changes Saved Successfully!' : 'Save Profile Changes'}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '4px',
                background: '#fee2e2',
                border: 'var(--border-dark)',
                color: '#b91c1c',
                fontWeight: 800,
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Sign Out of Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
