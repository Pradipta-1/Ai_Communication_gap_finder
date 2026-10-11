import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface HealthScoreGaugeProps {
  score: number; // 0 - 100
  size?: number;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score,
  size = 170,
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#16a34a'; // Status Green
    if (score >= 60) return '#0284c7'; // Blueprint Cyan
    if (score >= 40) return '#d97706'; // Machine Amber
    return '#ff4757'; // Safety Orange/Red
  };

  const color = getColor();

  return (
    <div className="relative flex flex-col items-center text-center p-6 bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] rounded-2xl corner-screws border border-[#ffffff]/40 font-sans">
      {/* Recessed Gauge Dial Well */}
      <div
        className="relative rounded-full p-2.5 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center"
        style={{ width: size + 20, height: size + 20 }}
      >
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track groove */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#babecc"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress dial */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>

        {/* Center Readout Module */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
          <span
            className="text-4xl font-extrabold tracking-tight text-embossed"
            style={{ color }}
          >
            {score}%
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#4a5568] mt-0.5">
            CALIBRATION
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2d3436] flex items-center justify-center gap-1.5 text-embossed">
          {score >= 70 ? (
            <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#d97706]" />
          )}
          <span>COMMUNICATION HEALTH: {score}%</span>
        </h4>
        <p className="text-[11px] font-mono text-[#4a5568] max-w-xs leading-relaxed">
          Structural ratio of answered inquiries and confirmed decisions vs. unresolved debate.
        </p>
      </div>
    </div>
  );
};
