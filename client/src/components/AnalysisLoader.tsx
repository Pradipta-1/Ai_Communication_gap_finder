import React, { useState, useEffect } from 'react';
import { Check, Loader2, Sparkles, Cpu } from 'lucide-react';

interface AnalysisLoaderProps {
  onComplete?: () => void;
  durationMs?: number;
  mode?: string;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({
  onComplete,
  durationMs = 2600,
  mode,
}) => {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { label: 'CALIBRATING SYNTAX & CHRONOLOGICAL TIMESTAMPS' },
    { label: 'PARSING SPEAKER IDENTITIES & INTERLEAVED TURNS' },
    { label: 'MAPPING INQUIRY DEPENDENCY GRAPHS' },
    { label: 'DETECTING DROPPED THREADS & REPEATED QUERIES' },
    {
      label: mode === 'openrouter'
        ? 'QUERYING OPENROUTER LLM & SYNTHESIZING QUOTE EVIDENCE'
        : 'SYNTHESIZING VERIFIED QUOTE EVIDENCE & METRICS',
    },
  ];

  useEffect(() => {
    const stepInterval = durationMs / (stages.length + 1);
    const timers: ReturnType<typeof setTimeout>[] = [];

    stages.forEach((_, idx) => {
      timers.push(
        setTimeout(() => {
          setCurrentStage(idx + 1);
        }, (idx + 1) * stepInterval)
      );
    });

    let completionTimer: ReturnType<typeof setTimeout> | undefined;
    if (onComplete) {
      completionTimer = setTimeout(() => {
        onComplete();
      }, durationMs);
    }

    return () => {
      timers.forEach(t => clearTimeout(t));
      if (completionTimer) clearTimeout(completionTimer);
    };
  }, [durationMs, onComplete, stages.length]);

  const percentage = Math.min(100, Math.round((currentStage / stages.length) * 100));

  return (
    <div className="relative p-4 sm:p-6 md:p-8 bg-[#e0e5ec] shadow-[12px_12px_24px_#babecc,-12px_-12px_24px_#ffffff] rounded-xl sm:rounded-2xl border border-[#ffffff]/60 max-w-xl mx-auto overflow-hidden font-sans corner-screws">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] text-[#ff4757]">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
              NEURAL INGESTION IN PROGRESS
            </h3>
            <p className="text-[11px] font-mono text-[#4a5568]">
              PARSING CONVERSATIONAL GRAPH
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-sm font-extrabold text-[#ff4757]">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Recessed Progress Bar */}
      <div className="w-full h-3 bg-[#d1d9e6] rounded-full shadow-[inset_1px_1px_3px_#babecc,inset_-1px_-1px_3px_#ffffff] overflow-hidden mb-6 p-0.5">
        <div
          className="h-full bg-[#ff4757] rounded-full shadow-[1px_1px_2px_rgba(166,50,60,0.5)] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Multi-Stage Steps */}
      <div className="space-y-2.5 font-mono text-xs">
        {stages.map((stage, idx) => {
          const isDone = currentStage > idx;
          const isCurrent = currentStage === idx;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                isDone
                  ? 'border-[#16a34a]/30 bg-[#16a34a]/5 text-[#15803d]'
                  : isCurrent
                  ? 'border-[#ff4757]/40 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] text-[#2d3436] font-bold'
                  : 'border-transparent bg-[#e0e5ec] text-[#4a5568]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  {isDone ? (
                    <Check className="w-4 h-4 text-[#16a34a] stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-[#ff4757] animate-spin" />
                  ) : (
                    <span className="text-[10px] text-[#4a5568]">0{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[11px] ${isCurrent ? 'font-bold text-[#ff4757]' : ''}`}>
                  {stage.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
