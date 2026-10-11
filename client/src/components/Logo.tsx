import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Tactile Hardware Icon Module */}
      <div
        className={`relative ${iconSizes[size]} bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] border border-[#ffffff]/60 flex items-center justify-center transition-all duration-200 group-hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] active:translate-y-[1px]`}
      >
        {/* Recessed well inside button */}
        <div className="w-5 h-5 rounded-full bg-[#d1d9e6] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center relative">
          {/* Active Safety-Orange Power/Sensor Core */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff4757] shadow-[0_0_8px_rgba(255,71,87,0.8)] animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-sans font-extrabold tracking-tight">
          <span className={`text-[#2d3436] ${textSizes[size]} uppercase tracking-wider text-embossed`}>
            Gap
          </span>
          <span className={`text-[#ff4757] ${textSizes[size]} uppercase tracking-wider font-mono`}>
            Lens
          </span>
          <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase bg-[#d1d9e6] text-[#4a5568] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] rounded">
            MOD-01
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-mono text-[#4a5568] uppercase tracking-wider">
            Industrial Diagnostic Engine
          </span>
        )}
      </div>
    </Link>
  );
};
