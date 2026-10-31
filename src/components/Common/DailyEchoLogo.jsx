import React from 'react';

/**
 * DailyEchoLogo
 * Renders the new futuristic cyan/teal 3D 'D' emblem with orbiting ring
 * and central luminance star, provided by the user.
 * 
 * NOTE: Remains completely upright with NO rotation.
 */
export default function DailyEchoLogo({ 
  size = 38, 
  className = '', 
  variant = 'brand',
  glow = true 
}) {
  const borderRadius = Math.round(size * 0.22);

  return (
    <div 
      className={`dailyecho-logo-badge ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        userSelect: 'none',
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        backgroundColor: '#030712',
        border: '1px solid rgba(45, 212, 191, 0.25)',
        boxShadow: glow 
          ? `0 0 ${Math.max(10, size * 0.35)}px rgba(20, 184, 166, 0.45), 0 2px 8px rgba(0, 0, 0, 0.5)` 
          : '0 2px 6px rgba(0, 0, 0, 0.4)'
      }}
      title="DailyEcho - From Instruction to Execution"
    >
      <img
        src="/assets/dailyecho-d-logo.jpg"
        alt="DailyEcho Brand Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        onError={(e) => {
          if (!e.target.dataset.fallback) {
            e.target.dataset.fallback = 'true';
            e.target.src = '/assets/dailyecho-logo.jpg';
          }
        }}
      />
    </div>
  );
}
