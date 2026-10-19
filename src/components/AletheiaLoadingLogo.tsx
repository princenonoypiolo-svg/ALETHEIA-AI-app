import React from 'react';
import { motion } from 'motion/react';

interface AletheiaLoadingLogoProps {
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

export const AletheiaLoadingLogo: React.FC<AletheiaLoadingLogoProps> = ({
  size = 'xl',
  className = '',
}) => {
  const sizeMap = {
    md: { box: 'w-20 h-20', svg: 80 },
    lg: { box: 'w-28 h-28', svg: 112 },
    xl: { box: 'w-36 h-36', svg: 144 },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${currentSize.box} ${className}`}>
      {/* Dynamic Deep Ambient Aura */}
      <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-600/30 via-cyan-400/25 to-indigo-600/30 blur-xl animate-pulse pointer-events-none" />

      {/* Main Vector Hologram SVG */}
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 filter drop-shadow-[0_0_15px_rgba(37,99,235,0.45)]"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="shieldGrad" x1="80" y1="20" x2="80" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="shieldBorder" x1="30" y1="20" x2="130" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="45%" stopColor="#2563eb" />
            <stop offset="85%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="facetGrad" x1="80" y1="35" x2="80" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="coreGrad" x1="60" y1="60" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          <radialGradient id="irisLight" cx="80" cy="80" r="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="scanBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>

          {/* Clip path for the shield so laser stays inside */}
          <clipPath id="shieldClip">
            <path d="M80 24L128 42V82C128 114 80 136 80 136C80 136 32 114 32 82V42L80 24Z" />
          </clipPath>
        </defs>

        {/* Outer Rotating Cryptographic Ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '80px 80px' }}
        >
          {/* Segmented Dashed Orbit */}
          <circle
            cx="80"
            cy="80"
            r="72"
            stroke="#1e3a8a"
            strokeWidth="1.2"
            strokeDasharray="4 8 12 8"
            strokeOpacity="0.6"
          />
          {/* Orbit Nodes */}
          <circle cx="80" cy="8" r="3" fill="#38bdf8" className="filter drop-shadow-[0_0_6px_#38bdf8]" />
          <circle cx="152" cy="80" r="2.5" fill="#60a5fa" />
          <circle cx="80" cy="152" r="3" fill="#38bdf8" className="filter drop-shadow-[0_0_6px_#38bdf8]" />
          <circle cx="8" cy="80" r="2.5" fill="#60a5fa" />
        </motion.g>

        {/* Counter-Rotating Precision Reticle */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '80px 80px' }}
        >
          <circle
            cx="80"
            cy="80"
            r="63"
            stroke="#0ea5e9"
            strokeWidth="0.8"
            strokeDasharray="2 18"
            strokeOpacity="0.5"
          />
        </motion.g>

        {/* Outer Hexagonal Tech Brackets */}
        <path d="M30 65V50L45 35" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        <path d="M130 65V50L115 35" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        <path d="M30 95V110L45 125" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        <path d="M130 95V110L115 125" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />

        {/* Main Solid Cyber Shield Body */}
        <path
          d="M80 24L128 42V82C128 114 80 136 80 136C80 136 32 114 32 82V42L80 24Z"
          fill="url(#shieldGrad)"
          stroke="url(#shieldBorder)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Geometric Shield Facets */}
        <path
          d="M80 32L120 47V80C120 106 80 126 80 126C80 126 40 106 40 80V47L80 32Z"
          fill="url(#facetGrad)"
          stroke="#38bdf8"
          strokeWidth="0.8"
          strokeOpacity="0.35"
        />

        {/* Center Vertical Crest Spine */}
        <line x1="80" y1="32" x2="80" y2="126" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />

        {/* Laser Scan Sweep inside shield */}
        <g clipPath="url(#shieldClip)">
          <motion.rect
            x="30"
            width="100"
            height="18"
            fill="url(#scanBeam)"
            animate={{ y: [15, 135, 15] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>

        {/* Central Neural Iris Core (Truth Aperture) */}
        <g transform="translate(80, 78)">
          {/* Outer Core Ring */}
          <circle cx="0" cy="0" r="22" fill="#0b1329" stroke="url(#shieldBorder)" strokeWidth="1.5" />
          
          {/* Concentric Aperture Leaves */}
          <path d="M0 -22 L15 -7 L7 15 L-15 7 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.6" />
          <path d="M0 22 L-15 7 L-7 -15 L15 -7 Z" fill="#111c33" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.6" />

          {/* Glowing Optical Core */}
          <circle cx="0" cy="0" r="12" fill="url(#coreGrad)" />
          <circle cx="0" cy="0" r="10" fill="url(#irisLight)" />

          {/* Verification Check / Precision Reticle Crosshair */}
          <motion.path
            d="M-5 0.5L-1.5 4L5 -3"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          />
        </g>

        {/* Micro Tech Data Coordinates */}
        <text x="80" y="148" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" letterSpacing="2">
          ALE-CORE::994
        </text>
      </svg>
    </div>
  );
};
