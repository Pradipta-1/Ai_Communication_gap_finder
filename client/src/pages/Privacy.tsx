import React from 'react';
import { Lock, EyeOff, Cpu, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Privacy: React.FC = () => {
  return (
    <div className="p-3.5 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 font-sans">
      <div className="pb-4 sm:pb-6 border-b border-[#babecc]/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-accent tracking-widest uppercase">
            SECURITY // DATA_HANDLING
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight text-embossed">
          Security & Privacy Spec
        </h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">
          Data handling depends on the selected AI mode and storage configuration. Review these details before submitting sensitive conversations.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6 text-sm text-foreground leading-relaxed">
        {/* Section 1 */}
        <div className="p-4 sm:p-6 bg-[#e0e5ec] shadow-card rounded-xl sm:rounded-2xl border border-white/60 space-y-3 corner-screws-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base font-mono uppercase">
            <Lock className="w-5 h-5 text-accent" />
            <span>1. What Data Is Processed</span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            When you paste or upload a conversation transcript, GapLens processes speaker names, message timestamps, and message contents solely for identifying communication gaps such as unanswered questions, repeated requests for clarification, and unresolved discussions.
          </p>
        </div>

        {/* Section 2 */}
        <div className="p-4 sm:p-6 bg-[#e0e5ec] shadow-card rounded-xl sm:rounded-2xl border border-white/60 space-y-3 corner-screws-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base font-mono uppercase">
            <EyeOff className="w-5 h-5 text-accent" />
            <span>2. Zero Persistent Retention By Default</span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            The browser keeps a local conversation archive. When the backend is running, analyses are also saved to its configured database (MongoDB when configured, otherwise an in-memory store). The Settings purge action clears the browser archive; delete server-saved conversations individually from the archive.
          </p>
        </div>

        {/* Section 3 */}
        <div className="p-4 sm:p-6 bg-[#e0e5ec] shadow-card rounded-xl sm:rounded-2xl border border-white/60 space-y-3 corner-screws-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base font-mono uppercase">
            <Cpu className="w-5 h-5 text-accent" />
            <span>3. How AI Processing Operates</span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            Choose Local AI to run the built-in heuristic analysis in this browser, or choose OpenRouter API to send the transcript to the app backend and OpenRouter over HTTPS. GapLens does not configure OpenRouter retention or training policies; review its terms and account settings. OpenRouter analysis is unavailable when the server key or provider connection is unavailable.
          </p>
        </div>

        {/* Section 4 */}
        <div className="p-4 sm:p-6 bg-[#e0e5ec] shadow-card rounded-xl sm:rounded-2xl border border-white/60 space-y-3 corner-screws-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-base font-mono uppercase">
            <Trash2 className="w-5 h-5 text-accent" />
            <span>4. Complete User Deletion Rights</span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            You retain absolute authority over your conversation data. At any time, you can individually delete conversation audits, rename titles, or trigger a full local purge using the Settings data management panel.
          </p>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#babecc]/50">
        <Link
          to="/analyze"
          className="btn-tactile-chassis inline-flex items-center gap-2 text-xs font-mono font-bold w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>RETURN TO ANALYZER</span>
        </Link>
        <span className="text-xs font-mono text-muted">
          GAPLENS // SECURITY SPECIFICATION V2.0
        </span>
      </div>
    </div>
  );
};
