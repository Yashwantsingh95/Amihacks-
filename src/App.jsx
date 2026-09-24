import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateDonationPage from './pages/CreateDonationPage';
import MatchingPage from './pages/MatchingPage';
import DonationDetailsPage from './pages/DonationDetailsPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import ImpactPage from './pages/ImpactPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/layout/Sidebar';
import { initialDonations, initialStats, mockShelters } from './data/mockData';
import { Menu } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [donations, setDonations] = useState(initialDonations);
  const [stats, setStats] = useState(initialStats);
  const [selectedDonation, setSelectedDonation] = useState(initialDonations[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // New donation creation handler
  const handleDonationCreated = (newDonation) => {
    setDonations([newDonation, ...donations]);
    setSelectedDonation(newDonation);
    setStats((prev) => ({
      ...prev,
      activeDonations: prev.activeDonations + 1
    }));
  };

  // Match confirmed handler
  const handleMatchConfirmed = (matchedShelter) => {
    if (selectedDonation) {
      const updated = {
        ...selectedDonation,
        shelter: matchedShelter,
        status: 'ON_THE_WAY',
        statusLabel: 'LIVE'
      };
      setSelectedDonation(updated);
      setDonations(donations.map(d => d.id === updated.id ? updated : d));
    }
  };

  // Delivery completed handler
  const handleDeliveryCompleted = (donationId) => {
    setDonations(donations.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'DELIVERED',
          statusLabel: 'DELIVERED',
          deliveredAt: 'Just now'
        };
      }
      return d;
    }));
    setStats((prev) => ({
      ...prev,
      activeDonations: Math.max(0, prev.activeDonations - 1),
      successfulPickups: prev.successfulPickups + 1,
      mealsRescued: prev.mealsRescued + (selectedDonation?.quantity || 40),
      foodDivertedKg: prev.foodDivertedKg + 50
    }));
  };

  const isDonorApp = currentRoute.startsWith('donor-');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Public Pages: Landing, Login, Signup */}
      {!isDonorApp && (
        <main style={{ flex: 1 }}>
          {currentRoute === 'landing' && <LandingPage onNavigate={setCurrentRoute} />}
          {currentRoute === 'login' && <LoginPage onNavigate={setCurrentRoute} onLogin={() => setCurrentRoute('donor-dashboard')} />}
          {currentRoute === 'signup' && <SignupPage onNavigate={setCurrentRoute} onLogin={() => setCurrentRoute('donor-dashboard')} />}
        </main>
      )}

      {/* Donor App Layout: Dark Sidebar + Dynamic Content Container */}
      {isDonorApp && (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
          {/* Sidebar */}
          <Sidebar
            activeRoute={currentRoute}
            onNavigate={setCurrentRoute}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />

          {/* Main App Content Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Mobile Top Header */}
            <header className="mobile-header" style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'var(--color-dark)',
              color: '#ffffff',
              borderBottom: 'var(--border-dark)'
            }}>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <Menu size={24} />
              </button>

              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '1.2rem',
                color: 'var(--color-bg)'
              }}>
                RESCUEFLOW
              </span>

              <div 
                onClick={() => setCurrentRoute('donor-profile')}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                A
              </div>
            </header>

            {/* Screen Router */}
            <main style={{ flex: 1, overflowY: 'auto' }}>
              {currentRoute === 'donor-dashboard' && (
                <DashboardPage
                  donations={donations}
                  stats={stats}
                  onNavigate={setCurrentRoute}
                  onSelectDonation={setSelectedDonation}
                />
              )}

              {currentRoute === 'donor-donations' && (
                <DashboardPage
                  donations={donations}
                  stats={stats}
                  onNavigate={setCurrentRoute}
                  onSelectDonation={setSelectedDonation}
                />
              )}

              {currentRoute === 'donor-create' && (
                <CreateDonationPage
                  onNavigate={setCurrentRoute}
                  onDonationCreated={handleDonationCreated}
                />
              )}

              {currentRoute === 'donor-matching' && (
                <MatchingPage
                  donation={selectedDonation}
                  onNavigate={setCurrentRoute}
                  onMatchConfirmed={handleMatchConfirmed}
                />
              )}

              {currentRoute === 'donor-donation-details' && (
                <DonationDetailsPage
                  donation={selectedDonation}
                  onNavigate={setCurrentRoute}
                />
              )}

              {currentRoute === 'donor-tracking' && (
                <LiveTrackingPage
                  donation={selectedDonation}
                  onNavigate={setCurrentRoute}
                  onDeliveryCompleted={handleDeliveryCompleted}
                />
              )}

              {currentRoute === 'donor-impact' && (
                <ImpactPage onNavigate={setCurrentRoute} />
              )}

              {(currentRoute === 'donor-profile' || currentRoute === 'donor-settings') && (
                <ProfilePage onNavigate={setCurrentRoute} />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
