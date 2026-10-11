import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  suffix = '',
  icon: Icon,
  color = '#ff4757',
  trend,
  description,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 25;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="relative p-6 bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#babecc,-12px_-12px_24px_#ffffff,inset_1px_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-1 rounded-2xl transition-all duration-300 group font-sans corner-screws border border-[#ffffff]/40">
      {/* Top row: Label + Vent Slots + Icon */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4a5568] block text-embossed">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mechanical Vent Slots */}
          <div className="flex gap-1">
            <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),0_1px_0_#ffffff]" />
            <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),0_1px_0_#ffffff]" />
            <div className="h-5 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),0_1px_0_#ffffff]" />
          </div>

          {/* Tactile Icon Housing */}
          <div
            className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] border border-[#ffffff]/60 flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ color }}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Numerical readout: Monospace technical display */}
      <div className="flex items-baseline gap-2.5">
        <span className="text-3xl sm:text-4xl font-mono font-extrabold tracking-tight text-[#2d3436] text-embossed">
          {displayValue}
          {suffix}
        </span>
        {trend && (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#d1d9e6] text-[#4a5568] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff]">
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-3 text-[11px] font-mono text-[#4a5568] line-clamp-1 border-t border-[#babecc]/50 pt-2 shadow-[0_1px_0_#ffffff]">
          {description}
        </p>
      )}
    </div>
  );
};
