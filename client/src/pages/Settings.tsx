import React, { useState, useEffect } from 'react';
import {
  api,
  AnalysisMode,
  getAnalysisPreferences,
  getLocalConversations,
  saveAnalysisPreferences,
} from '../services/api';
import { PRESET_ANALYSES } from '../data/demoConversations';
import {
  Cpu,
  Database,
  Trash2,
  Download,
  RotateCcw,
  Check,
} from 'lucide-react';
import { AnalysisModeSelector } from '../components/AnalysisModeSelector';

interface HealthStatus {
  aiConnected: boolean;
  mode?: string;
  provider?: string;
  model?: string;
  database?: string;
}

export const Settings: React.FC = () => {
  const [preferences, setPreferences] = useState(getAnalysisPreferences);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  useEffect(() => {
    api.checkHealth().then(status => setHealthStatus(status));
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all archived conversations?')) {
      localStorage.removeItem('gaplens_conversations_v1');
      setSaveToast('Conversation archive cleared.');
      setTimeout(() => setSaveToast(null), 2500);
    }
  };

  const handleResetPresets = () => {
    localStorage.setItem('gaplens_conversations_v1', JSON.stringify(PRESET_ANALYSES));
    setSaveToast('Default demo conversations restored.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleExportAll = () => {
    const data = getLocalConversations();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaplens-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSaveToast('Backup archive exported.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleSaveConfigs = () => {
    saveAnalysisPreferences(preferences);
    setSaveToast('Analysis preferences saved on this device.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleAnalysisModeChange = (aiMode: AnalysisMode) => {
    const updated = { ...preferences, aiMode };
    setPreferences(updated);
    saveAnalysisPreferences(updated);
  };

  return (
    <div className="p-3.5 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* Header */}
      <div className="pb-4 sm:pb-6 border-b border-[#babecc]/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-accent tracking-widest uppercase">
            CALIBRATION // CONTROL_CONSOLE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight text-embossed">
          System Calibration
        </h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">
          Configure analysis behavior, inspect the active AI provider, and manage saved conversation data.
        </p>
      </div>

      {saveToast && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-mono font-bold rounded-xl flex items-center gap-2 shadow-card">
          <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* AI Engine & Model Settings */}
      <div className="p-3.5 sm:p-5 md:p-6 bg-[#e0e5ec] shadow-card rounded-xl sm:rounded-2xl border border-white/60 space-y-5 sm:space-y-6 corner-screws-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#babecc]/40">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-foreground text-embossed uppercase tracking-wide">
              Neural Processing Parameters
            </h3>
          </div>
          <span className="flex items-center gap-2 font-mono text-[11px] font-bold bg-[#d1d9e6]/60 shadow-recessed px-2.5 py-1 rounded-full self-start sm:self-auto">
            <span className={`w-2 h-2 rounded-full ${healthStatus?.aiConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-accent shadow-glow'}`} />
            <span className={healthStatus?.aiConnected ? 'text-emerald-700' : 'text-accent'}>
              {preferences.aiMode === 'local'
                ? 'LOCAL AI SELECTED'
                : preferences.aiMode === 'openrouter'
                  ? healthStatus?.aiConnected
                    ? `ONLINE // ${healthStatus.provider?.toUpperCase() || 'OPENROUTER'}`
                    : healthStatus?.mode === 'unavailable'
                      ? 'BACKEND OFFLINE'
                      : healthStatus
                        ? 'OPENROUTER KEY REQUIRED'
                        : 'CHECKING OPENROUTER'
                  : 'CHOOSE AN ANALYSIS MODE'}
            </span>
          </span>
        </div>

        <AnalysisModeSelector value={preferences.aiMode} onChange={handleAnalysisModeChange} />

        {preferences.aiMode === 'openrouter' && (
          <div className="rounded-xl bg-[#d1d9e6]/60 px-4 py-3 shadow-recessed">
            <p className="text-sm font-mono font-bold text-foreground">
              {healthStatus?.model || 'Checking server configuration…'}
            </p>
            <p className="mt-1 text-[11px] font-mono leading-relaxed text-muted">
              Set OPENROUTER_API_KEY in server/.env and restart the server. Your key stays on the server.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-foreground font-bold uppercase tracking-wider">REASONING DIVERSITY</span>
              <span className="text-accent font-bold px-2 py-0.5 rounded bg-[#d1d9e6] shadow-recessed">{preferences.temperature.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={preferences.temperature}
              onChange={e => setPreferences(current => ({ ...current, temperature: parseFloat(e.target.value) }))}
              className="w-full accent-accent bg-[#d1d9e6] h-2.5 rounded-lg cursor-pointer shadow-recessed"
            />
            <span className="text-[11px] font-mono text-muted block leading-relaxed">
              Low values (0.1 - 0.3) enforce strict determinism and verifiable evidence binding.
            </span>
          </div>

          {/* Confidence threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-foreground font-bold uppercase tracking-wider">CONFIDENCE THRESHOLD</span>
              <span className="text-accent font-bold px-2 py-0.5 rounded bg-[#d1d9e6] shadow-recessed">{Math.round(preferences.confidenceThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={preferences.confidenceThreshold}
              onChange={e => setPreferences(current => ({ ...current, confidenceThreshold: parseFloat(e.target.value) }))}
              className="w-full accent-accent bg-[#d1d9e6] h-2.5 rounded-lg cursor-pointer shadow-recessed"
            />
            <span className="text-[11px] font-mono text-muted block leading-relaxed">
              Only flag communication breakdown if confidence exceeds this calibration setpoint.
            </span>
          </div>

          {/* Storage status */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-foreground block uppercase tracking-wider">
              STORAGE CONTROLLER
            </span>
            <div className="p-3 bg-[#d1d9e6]/50 shadow-recessed border border-[#babecc]/40 text-xs font-mono rounded-lg flex items-center justify-between">
              <span className="text-foreground font-medium">{healthStatus?.database || 'Local In-Memory & Browser Cache'}</span>
              <span className="text-emerald-700 font-bold uppercase">ACTIVE</span>
            </div>
            <span className="text-[11px] font-mono text-muted block leading-relaxed">
              With a live provider, transcript content is sent to its API for analysis. Review the configured provider's data policy before submitting sensitive conversations.
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSaveConfigs}
            className="btn-tactile-primary w-full sm:w-auto"
          >
            SAVE CALIBRATION
          </button>
        </div>
      </div>

      {/* Data Management & Persistence */}
      <div className="p-3.5 sm:p-5 md:p-6 bg-[#e0e5ec] shadow-card rounded-xl sm:rounded-2xl border border-white/60 space-y-4 corner-screws-sm relative overflow-hidden">
        <div className="flex items-center gap-2 pb-3 border-b border-[#babecc]/40">
          <Database className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-foreground text-embossed uppercase tracking-wide">
            Chassis Storage Operations
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleExportAll}
            className="p-4 bg-[#e0e5ec] shadow-card hover:shadow-floating active:shadow-pressed border border-white/70 text-left rounded-xl transition-all duration-200 flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-foreground font-mono block">
                EXPORT ARCHIVE
              </span>
              <span className="text-[11px] text-muted font-mono mt-0.5 block">
                Download JSON backup
              </span>
            </div>
            <Download className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={handleResetPresets}
            className="p-4 bg-[#e0e5ec] shadow-card hover:shadow-floating active:shadow-pressed border border-white/70 text-left rounded-xl transition-all duration-200 flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-foreground font-mono block">
                RESET DEMO SETS
              </span>
              <span className="text-[11px] text-muted font-mono mt-0.5 block">
                Restore defaults
              </span>
            </div>
            <RotateCcw className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={handleClearHistory}
            className="p-4 bg-[#e0e5ec] shadow-card hover:shadow-floating active:shadow-pressed border border-white/70 text-left rounded-xl transition-all duration-200 flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-bold text-accent font-mono block">
                PURGE STORAGE
              </span>
              <span className="text-[11px] text-muted font-mono mt-0.5 block">
                Erase local records
              </span>
            </div>
            <Trash2 className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
