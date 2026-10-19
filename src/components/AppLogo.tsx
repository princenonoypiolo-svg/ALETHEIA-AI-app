import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const dimensionMap = {
    sm: { box: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-sm', sub: 'text-[10px]' },
    md: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-base', sub: 'text-[11px]' },
    lg: { box: 'w-11 h-11', icon: 'w-6 h-6', text: 'text-lg', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-sm' },
  };

  const dim = dimensionMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Formal Minimalist Verification Shield */}
      <div
        className={`${dim.box} flex items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 group-hover:bg-blue-600/20 group-hover:border-blue-500/50 transition-colors flex-shrink-0 shadow-xs`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`${dim.icon} text-blue-400`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>

      {showText && (
        <div className="text-left select-none">
          <div className={`font-semibold tracking-tight text-slate-100 group-hover:text-white transition-colors leading-tight ${dim.text} flex items-center gap-2`}>
            <span>Aletheia</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          </div>
          <div className={`text-slate-400 font-medium ${dim.sub}`}>
            Truth Verification Platform
          </div>
        </div>
      )}
    </div>
  );
};
