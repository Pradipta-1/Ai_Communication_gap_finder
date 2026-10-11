import React from 'react';
import { Cloud, Cpu } from 'lucide-react';
import { AnalysisMode } from '../services/api';

interface AnalysisModeSelectorProps {
  value: AnalysisMode | null;
  onChange: (mode: AnalysisMode) => void;
}

const modes: {
  id: AnalysisMode;
  title: string;
  description: string;
  icon: typeof Cloud;
}[] = [
  {
    id: 'openrouter',
    title: 'OpenRouter API',
    description: 'Use the server API key and selected model. Requires a configured server connection.',
    icon: Cloud,
  },
  {
    id: 'local',
    title: 'Local AI',
    description: 'Analyze in this browser with the built-in heuristic engine. No API key or network request.',
    icon: Cpu,
  },
];

export const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({ value, onChange }) => (
  <fieldset className="space-y-2">
    <legend className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
      CHOOSE ANALYSIS MODE <span className="text-accent">REQUIRED</span>
    </legend>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {modes.map(mode => {
        const Icon = mode.icon;
        const selected = value === mode.id;

        return (
          <label
            key={mode.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
              selected
                ? 'border-accent bg-accent/5 shadow-pressed'
                : 'border-[#babecc]/60 bg-[#e0e5ec] shadow-card hover:border-accent/50'
            }`}
          >
            <input
              type="radio"
              name="analysis-mode"
              value={mode.id}
              checked={selected}
              onChange={() => onChange(mode.id)}
              className="mt-1 accent-accent"
            />
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span className="space-y-1">
              <span className="block text-xs font-bold text-foreground">{mode.title}</span>
              <span className="block text-[11px] leading-relaxed text-muted">{mode.description}</span>
            </span>
          </label>
        );
      })}
    </div>
    {value === null && (
      <p className="text-[11px] font-mono font-bold text-accent" role="status">
        Select one option before analyzing a conversation.
      </p>
    )}
  </fieldset>
);
