import React, { useState, useEffect } from 'react';
import { Plus, Minus, Crosshair, Navigation, Utensils, Home, Truck, ShieldCheck } from 'lucide-react';

export default function MapContainer({ 
  driverProgress = 55, // 0 (at restaurant) to 100 (at shelter)
  onProgressChange = null,
  showControls = true,
  height = '420px',
  interactive = true
}) {
  const [zoom, setZoom] = useState(1);
  const [currentProgress, setCurrentProgress] = useState(driverProgress);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setCurrentProgress(driverProgress);
  }, [driverProgress]);

  // Optional automatic movement simulation for demo WOW factor
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          const next = prev + 1;
          if (onProgressChange) onProgressChange(next);
          return next;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isSimulating, onProgressChange]);

  // Waypoints for the route line
  // Start: (120, 100) -> (240, 160) -> (360, 240) -> (480, 200) -> (600, 270) -> End: (680, 290)
  // We can calculate the driver's current position smoothly along this SVG path:
  // Route segments:
  const p0 = { x: 140, y: 110 }; // Restaurant
  const p1 = { x: 260, y: 170 };
  const p2 = { x: 380, y: 220 };
  const p3 = { x: 500, y: 240 };
  const p4 = { x: 670, y: 290 }; // Shelter

  const t = currentProgress / 100;
  
  // Piecewise linear interpolation for the truck position
  let truckX, truckY, truckAngle;
  if (t <= 0.25) {
    const subT = t / 0.25;
    truckX = p0.x + (p1.x - p0.x) * subT;
    truckY = p0.y + (p1.y - p0.y) * subT;
    truckAngle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);
  } else if (t <= 0.5) {
    const subT = (t - 0.25) / 0.25;
    truckX = p1.x + (p2.x - p1.x) * subT;
    truckY = p1.y + (p2.y - p1.y) * subT;
    truckAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  } else if (t <= 0.75) {
    const subT = (t - 0.5) / 0.25;
    truckX = p2.x + (p3.x - p2.x) * subT;
    truckY = p3.y + (p3.y - p2.y) * subT;
    truckAngle = Math.atan2(p3.y - p2.y, p3.x - p2.x) * (180 / Math.PI);
  } else {
    const subT = (t - 0.75) / 0.25;
    truckX = p3.x + (p4.x - p3.x) * subT;
    truckY = p3.y + (p4.y - p3.y) * subT;
    truckAngle = Math.atan2(p4.y - p3.y, p4.x - p3.x) * (180 / Math.PI);
  }

  return (
    <div 
      className="neo-card" 
      style={{
        position: 'relative',
        height: height,
        overflow: 'hidden',
        background: '#e9e3d0',
        padding: 0
      }}
    >
      {/* Top Bar Indicators */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '20px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div className="neo-badge neo-badge-live" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          <span className="pulse-dot" />
          LIVE GPS ROUTING
        </div>

        {interactive && (
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="neo-btn neo-btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#ffffff' }}
          >
            {isSimulating ? '⏸ Pause Sim' : '▶ Simulate Drive'}
          </button>
        )}
      </div>

      {/* Map Control Buttons */}
      {showControls && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 20
        }}>
          <button 
            onClick={() => setZoom(Math.min(zoom + 0.15, 1.4))}
            style={{
              width: '36px',
              height: '36px',
              background: '#ffffff',
              border: 'var(--border-dark)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-neo-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 800
            }}
          >
            <Plus size={18} />
          </button>
          <button 
            onClick={() => setZoom(Math.max(zoom - 0.15, 0.8))}
            style={{
              width: '36px',
              height: '36px',
              background: '#ffffff',
              border: 'var(--border-dark)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-neo-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 800
            }}
          >
            <Minus size={18} />
          </button>
          <button 
            onClick={() => { setZoom(1); setCurrentProgress(55); }}
            style={{
              width: '36px',
              height: '36px',
              background: '#ffffff',
              border: 'var(--border-dark)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-neo-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Recenter"
          >
            <Crosshair size={18} />
          </button>
        </div>
      )}

      {/* SVG Canvas Map */}
      <div style={{
        width: '100%',
        height: '100%',
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
        transition: 'transform 0.2s ease',
        cursor: 'grab'
      }}>
        <svg 
          viewBox="0 0 800 400" 
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ded8c4" strokeWidth="1" />
            </pattern>
            {/* Water drop shadow */}
            <filter id="neo-shadow" x="-5%" y="-5%" width="120%" height="120%">
              <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#0d1321" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="800" height="400" fill="#ede7d5" />
          <rect width="800" height="400" fill="url(#city-grid)" />

          {/* City Blocks (Tactile muted shapes) */}
          <rect x="40" y="30" width="130" height="110" rx="8" fill="#f8f5ea" stroke="#d5ceba" strokeWidth="1.5" />
          <rect x="200" y="40" width="160" height="80" rx="8" fill="#f8f5ea" stroke="#d5ceba" strokeWidth="1.5" />
          <rect x="400" y="30" width="140" height="110" rx="8" fill="#f8f5ea" stroke="#d5ceba" strokeWidth="1.5" />
          <rect x="60" y="180" width="120" height="160" rx="8" fill="#f8f5ea" stroke="#d5ceba" strokeWidth="1.5" />
          <rect x="220" y="240" width="180" height="110" rx="8" fill="#f8f5ea" stroke="#d5ceba" strokeWidth="1.5" />
          <rect x="440" y="260" width="160" height="100" rx="8" fill="#f8f5ea" stroke="#d5ceba" strokeWidth="1.5" />

          {/* Stylized River / Water Canal (Matches reference image) */}
          <path 
            d="M 590 0 C 610 80, 580 140, 630 200 C 670 250, 720 280, 750 400 L 800 400 L 800 0 Z" 
            fill="#a2bacf" 
            stroke="#0d1321" 
            strokeWidth="2" 
          />
          <path 
            d="M 640 20 C 660 60, 680 90, 720 120" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="2" 
            strokeDasharray="4 6" 
            opacity="0.6"
          />

          {/* Roads & Secondary Routes */}
          <path d="M 0 150 L 590 150" stroke="#fdfdfb" strokeWidth="16" />
          <path d="M 0 150 L 590 150" stroke="#0d1321" strokeWidth="2" strokeDasharray="6 8" />

          <path d="M 190 0 L 190 400" stroke="#fdfdfb" strokeWidth="14" />
          <path d="M 370 0 L 370 400" stroke="#fdfdfb" strokeWidth="14" />

          {/* Primary Route Line (Restaurant -> Shelter) */}
          {/* Base Thick Road */}
          <path 
            d={`M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`}
            fill="none" 
            stroke="#0d1321" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Active Flow Line */}
          <path 
            d={`M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`}
            fill="none" 
            stroke="#3e5c76" 
            strokeWidth="4" 
            className="anim-route-line" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Waypoint: RESTAURANT (Origin) */}
          <g transform={`translate(${p0.x - 24}, ${p0.y - 24})`}>
            {/* Hard shadow */}
            <rect x="3" y="3" width="48" height="48" rx="10" fill="#0d1321" />
            <rect x="0" y="0" width="48" height="48" rx="10" fill="#1d2d44" stroke="#0d1321" strokeWidth="2.5" />
            {/* Building Icon */}
            <path d="M 14 34 L 14 20 L 24 13 L 34 20 L 34 34 Z" fill="#3e5c76" stroke="#ffffff" strokeWidth="2" />
            <rect x="21" y="25" width="6" height="9" fill="#f0ebd8" />
          </g>
          {/* Speech bubble: Restaurant */}
          <g transform={`translate(${p0.x - 45}, ${p0.y - 58})`}>
            <rect x="2" y="2" width="105" height="28" rx="6" fill="#0d1321" />
            <rect x="0" y="0" width="105" height="28" rx="6" fill="#ffffff" stroke="#0d1321" strokeWidth="2" />
            <text x="52" y="18" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="11" fill="#0d1321">
              ABC Restaurant
            </text>
            {/* Pointer */}
            <polygon points="50,28 55,34 60,28" fill="#ffffff" stroke="#0d1321" strokeWidth="2" />
          </g>

          {/* Waypoint: SHELTER (Destination) */}
          <g transform={`translate(${p4.x - 24}, ${p4.y - 24})`}>
            <rect x="3" y="3" width="48" height="48" rx="10" fill="#0d1321" />
            <rect x="0" y="0" width="48" height="48" rx="10" fill="#ffffff" stroke="#0d1321" strokeWidth="2.5" />
            {/* Shelter/House Icon */}
            <path d="M 14 34 L 14 22 L 24 14 L 34 22 L 34 34 Z" fill="#e9e3d0" stroke="#0d1321" strokeWidth="2" />
            <path d="M 11 23 L 24 12 L 37 23" fill="none" stroke="#0d1321" strokeWidth="2.5" />
            <rect x="21" y="24" width="6" height="10" fill="#0d1321" />
          </g>
          {/* Speech bubble: Shelter */}
          <g transform={`translate(${p4.x - 40}, ${p4.y + 32})`}>
            <rect x="2" y="2" width="85" height="26" rx="6" fill="#0d1321" />
            <rect x="0" y="0" width="85" height="26" rx="6" fill="#ffffff" stroke="#0d1321" strokeWidth="2" />
            <text x="42" y="17" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="11" fill="#0d1321">
              Shelter A
            </text>
          </g>

          {/* DRIVER VAN (Moving along route) */}
          <g transform={`translate(${truckX}, ${truckY})`}>
            {/* Van body group with shadow */}
            <g transform="translate(-24, -20)">
              {/* Offset shadow */}
              <rect x="4" y="4" width="44" height="26" rx="6" fill="#0d1321" />
              {/* Truck body */}
              <rect x="0" y="0" width="44" height="26" rx="6" fill="#0d1321" stroke="#ffffff" strokeWidth="1.5" />
              <rect x="4" y="4" width="18" height="16" rx="3" fill="#3e5c76" />
              <rect x="26" y="6" width="12" height="12" rx="2" fill="#748cab" />
              {/* Wheels */}
              <circle cx="10" cy="26" r="4" fill="#1d2d44" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="34" cy="26" r="4" fill="#1d2d44" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            {/* Floating Driver Pill */}
            <g transform="translate(-60, -48)">
              <rect x="2" y="2" width="120" height="24" rx="12" fill="#0d1321" />
              <rect x="0" y="0" width="120" height="24" rx="12" fill="#1d2d44" stroke="#f0ebd8" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" fill="#2a9d8f" />
              <text x="22" y="16" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="10" fill="#ffffff">
                Rahul • {Math.max(1, Math.round(8 * (1 - t)))}m away
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Progress control bar for presentation demo */}
      {interactive && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          right: '16px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: 'var(--border-dark)',
          borderRadius: '10px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 20,
          boxShadow: 'var(--shadow-neo-sm)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Demo Control:
          </span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={currentProgress}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentProgress(val);
              if (onProgressChange) onProgressChange(val);
            }}
            style={{ flex: 1, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '45px', textAlign: 'right' }}>
            {currentProgress}%
          </span>
        </div>
      )}
    </div>
  );
}
