import React, { useState } from 'react';

/**
 * EchoClockLogo
 * A futuristic Art Deco vector logo inspired by the iconic vintage "E C H O" building clock.
 * Features streamline moderne casing, glowing capsule hour markers, beveled clock hands,
 * and bottom architectural fluting with sleek cyan/teal ambient illumination.
 */
export default function EchoClockLogo({ 
  size = 40, 
  glow = true, 
  animated = true, 
  className = '',
  variant = 'cyan' // 'cyan', 'amber', 'monochrome'
}) {
  const [isHovered, setIsHovered] = useState(false);

  // 12 capsule hour marker coordinates around center (50, 60) with radius 25
  const markers = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30; // 0 = 12 o'clock, 30 = 1 o'clock, etc.
    const rad = ((angle - 90) * Math.PI) / 180;
    const distance = 25.5;
    const x = 50 + distance * Math.cos(rad);
    const y = 60 + distance * Math.sin(rad);

    return {
      index: i,
      angle,
      x,
      y
    };
  });

  // Color schemes
  const colorSchemes = {
    cyan: {
      accent: '#06b6d4',
      accentGlow: 'rgba(6, 182, 212, 0.5)',
      secondary: '#0d9488',
      hand: '#e0f2fe',
      markerFill: '#22d3ee',
      text: '#f8fafc',
      grille: '#38bdf8'
    },
    amber: {
      accent: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.5)',
      secondary: '#d97706',
      hand: '#fef3c7',
      markerFill: '#fbbf24',
      text: '#fffbeb',
      grille: '#fbbf24'
    },
    monochrome: {
      accent: '#94a3b8',
      accentGlow: 'rgba(148, 163, 184, 0.3)',
      secondary: '#64748b',
      hand: '#f8fafc',
      markerFill: '#e2e8f0',
      text: '#ffffff',
      grille: '#cbd5e1'
    }
  };

  const scheme = colorSchemes[variant] || colorSchemes.cyan;
  const height = (size * 125) / 100;

  return (
    <div 
      className={`echo-clock-logo-wrapper ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${height}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        filter: glow ? `drop-shadow(0 2px 8px ${scheme.accentGlow})` : 'none',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="DailyEcho — Autonomous Workspace Intelligence"
    >
      <svg
        viewBox="0 0 100 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible'
        }}
      >
        <defs>
          {/* Subtle Outer Neon Glow Filter */}
          <filter id="echoNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Stepped Chassis Body Gradient */}
          <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="45%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Outer Border Chrome Gradient */}
          <linearGradient id="chromeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Inner Clock Face Radial Gradient */}
          <radialGradient id="clockDialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="75%" stopColor="#090d16" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Marker Pill Gradient */}
          <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor={scheme.markerFill} />
            <stop offset="100%" stopColor={scheme.secondary} />
          </linearGradient>

          {/* Hand 3D Shading */}
          <linearGradient id="handLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="handRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* 1. TOP STEPPED CORNICE / TERRACE (Streamline Moderne Crown) */}
        <path
          d="M 16 6 
             Q 16 2, 22 2 
             L 78 2 
             Q 84 2, 84 6 
             L 84 8 
             L 16 8 Z"
          fill="#334155"
          opacity="0.8"
        />
        <path
          d="M 12 11 
             Q 12 6, 18 6 
             L 82 6 
             Q 88 6, 88 11 
             L 88 14 
             L 12 14 Z"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="0.8"
        />

        {/* 2. MAIN CHASSIS BODY */}
        <rect
          x="8"
          y="12"
          width="84"
          height="102"
          rx="14"
          fill="url(#chassisGrad)"
          stroke="url(#chromeBorder)"
          strokeWidth="1.5"
        />

        {/* Inner Bevel Border */}
        <rect
          x="10.5"
          y="14.5"
          width="79"
          height="97"
          rx="12"
          fill="none"
          stroke="#334155"
          strokeWidth="0.75"
          opacity="0.7"
        />

        {/* 3. "E C H O" HEADER BAND */}
        <rect
          x="12"
          y="14"
          width="76"
          height="18"
          fill="#090d16"
          opacity="0.9"
        />
        <line
          x1="12"
          y1="32"
          x2="88"
          y2="32"
          stroke="#334155"
          strokeWidth="1"
        />

        {/* "E C H O" Typography with Art Deco Spacing */}
        <g id="echoLetters" filter="url(#echoNeonGlow)">
          <text
            x="50"
            y="27"
            textAnchor="middle"
            fill={scheme.text}
            fontSize="10"
            fontWeight="800"
            letterSpacing="5"
            fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif"
          >
            ECHO
          </text>
        </g>

        {/* 4. CLOCK FACE DIAL */}
        <circle
          cx="50"
          cy="63"
          r="30"
          fill="url(#clockDialGrad)"
          stroke="#1e293b"
          strokeWidth="1"
        />

        {/* Inner Dial Ring Guide */}
        <circle
          cx="50"
          cy="63"
          r="26"
          fill="none"
          stroke="#1e293b"
          strokeDasharray="1.5 3"
          strokeWidth="0.75"
          opacity="0.5"
        />

        {/* 5. 12 RADIAL PILL / CAPSULE HOUR MARKERS */}
        <g id="hourMarkers">
          {markers.map((m) => {
            const isMarkerActive = isHovered || m.index === 0 || m.index === 3 || m.index === 6 || m.index === 9;

            return (
              <g 
                key={m.index}
                transform={`translate(${m.x}, ${m.y + 3}) rotate(${m.angle})`}
              >
                {/* Outer Capsule Frame */}
                <rect
                  x="-2"
                  y="-4.5"
                  width="4"
                  height="9"
                  rx="2"
                  fill="#020617"
                  stroke={isMarkerActive ? scheme.accent : '#475569'}
                  strokeWidth="0.8"
                />

                {/* Glowing Capsule Core */}
                <rect
                  x="-1.2"
                  y="-3.5"
                  width="2.4"
                  height="7"
                  rx="1.2"
                  fill="url(#pillGrad)"
                  filter={isMarkerActive ? 'url(#echoNeonGlow)' : 'none'}
                  opacity={isMarkerActive ? '1' : '0.85'}
                />
              </g>
            );
          })}
        </g>

        {/* 6. ART DECO CLOCK HAND (Pointing to 12) */}
        <g 
          id="clockHands"
          transform={animated && isHovered ? 'rotate(15 50 63)' : 'rotate(0 50 63)'}
          style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* Main Pointer Body (Left Light / Right Shadow for 3D Bevel) */}
          {/* Left Bevel */}
          <path
            d="M 50 44 
               L 47.8 47 
               L 48.2 61 
               L 50 61 Z"
            fill="url(#handLeft)"
          />
          {/* Right Bevel */}
          <path
            d="M 50 44 
               L 52.2 47 
               L 51.8 61 
               L 50 61 Z"
            fill="url(#handRight)"
          />

          {/* Accent Line down the spine */}
          <line
            x1="50"
            y1="45"
            x2="50"
            y2="61"
            stroke={scheme.accent}
            strokeWidth="0.8"
            opacity="0.9"
          />

          {/* Central Pivot Hub Hub / Bezel */}
          <circle
            cx="50"
            cy="63"
            r="4.2"
            fill="#0f172a"
            stroke="#475569"
            strokeWidth="1"
          />
          <circle
            cx="50"
            cy="63"
            r="2.2"
            fill={scheme.accent}
            filter="url(#echoNeonGlow)"
          />
        </g>

        {/* 7. BOTTOM ARCHITECTURAL FLUTED RIDGES / GRILLE */}
        <g id="bottomGrille" opacity="0.85">
          {/* Grille Top Header Line */}
          <line
            x1="12"
            y1="96"
            x2="88"
            y2="96"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* 19 Fluted Vertical Ribs matching the reference building base */}
          {Array.from({ length: 19 }).map((_, idx) => {
            const ribX = 16 + idx * 3.8;
            return (
              <g key={idx}>
                {/* Rib shadow line */}
                <line
                  x1={ribX}
                  y1="97"
                  x2={ribX}
                  y2="111"
                  stroke="#020617"
                  strokeWidth="1"
                />
                {/* Rib highlight line */}
                <line
                  x1={ribX + 1}
                  y1="97"
                  x2={ribX + 1}
                  y2="111"
                  stroke={idx % 2 === 0 ? '#475569' : '#334155'}
                  strokeWidth="1.2"
                />
              </g>
            );
          })}

          {/* Bottom Sill Line */}
          <line
            x1="12"
            y1="112"
            x2="88"
            y2="112"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

