import React from 'react';
import DailyEchoLogo from './DailyEchoLogo';

/**
 * Brand Logo Component (formerly RotatingLogo)
 * Renders the new DailyEcho 3D 'D' emblem with orbiting ring.
 * 
 * NOTE: Absolutely NO rotation is applied, keeping the logo upright, sharp,
 * and stable across all screen resolutions and zoom levels.
 */
export default function RotatingLogo({ 
  size = 38, 
  className = '', 
  glow = true, 
  variant = 'brand'
}) {
  return (
    <DailyEchoLogo 
      size={size} 
      className={className} 
      glow={glow} 
      variant={variant} 
    />
  );
}

export { DailyEchoLogo };
