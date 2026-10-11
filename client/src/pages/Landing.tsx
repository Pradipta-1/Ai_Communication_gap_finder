import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { GapBadge } from '../components/GapBadge';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  GitBranch,
  PieChart,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Sliders,
  Cpu,
  CornerDownRight,
  Moon,
  Sun,
} from 'lucide-react';

interface LandingProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Landing: React.FC<LandingProps> = ({ theme, onToggleTheme }) => {
  // Interactive Live Demo State
  const [demoScanning, setDemoScanning] = useState(false);
  const [demoAnalyzed, setDemoAnalyzed] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);

  const handleRunDemo = () => {
    setDemoScanning(true);
    setDemoAnalyzed(false);
    setDemoProgress(0);

    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDemoScanning(false);
          setDemoAnalyzed(true);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-[#2d3436] font-sans selection:bg-[#ff4757] selection:text-white landing-page">
      {/* Top Banner Navigation */}
      <header className="border-b border-[#babecc] shadow-[0_1px_0_#ffffff] bg-[#e0e5ec] sticky top-0 z-30 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto select-none">
        <Logo size="md" showTagline={true} />
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-[#2d3436] rounded-lg bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <Link
            to="/how-it-works"
            className="text-xs font-mono font-bold uppercase text-[#4a5568] hover:text-[#ff4757] hidden sm:inline-block transition-colors text-embossed"
          >
            SCHEMATICS
          </Link>
          <Link
            to="/dashboard"
            className="text-xs font-mono font-bold uppercase text-[#4a5568] hover:text-[#ff4757] hidden md:inline-block transition-colors text-embossed"
          >
            DASHBOARD
          </Link>
          <Link
            to="/analyze"
            className="btn-tactile-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg active:translate-y-[2px]"
          >
            <span>LAUNCH CONSOLE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* LED Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] border border-[#ffffff]/60 text-[#4a5568] text-xs font-mono font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] animate-pulse" />
              <span>SERIES 01 // PRECISION CONVERSATION INSPECTION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2d3436] text-embossed leading-[1.1]">
              See what the <br />
              <span className="text-[#ff4757] underline decoration-[#ff4757]/30 decoration-wavy">
                conversation missed.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#4a5568] leading-relaxed max-w-xl font-medium">
              GapLens brings industrial diagnostic precision to human dialogue. Detect unanswered questions, stalled commitments, and conversational bottlenecks with verifiable quoted evidence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/analyze"
                className="btn-tactile-primary inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl active:translate-y-[2px]"
              >
                <span>ANALYZE A CONVERSATION</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <button
                onClick={() => {
                  const demoEl = document.getElementById('live-demo-section');
                  if (demoEl) demoEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-tactile-chassis inline-flex items-center gap-2 px-5 py-3.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-[#ffffff]/60"
              >
                <Play className="w-4 h-4 text-[#ff4757]" />
                <span>SEE HARDWARE DEMO</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-[#4a5568]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] shadow-[0_0_6px_#16a34a]" />
                <span className="font-bold uppercase text-embossed">Server-Side API Keys</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0284c7] shadow-[0_0_6px_#0284c7]" />
                <span className="font-bold uppercase text-embossed">Slack / Teams / Meet Compatible</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Signature 3D "Device" Visualization in Pure CSS */}
          <div className="lg:col-span-5 relative">
            {/* Outer Machine Bezel */}
            <div className="relative bg-[#e0e5ec] shadow-[16px_16px_32px_#babecc,-16px_-16px_32px_#ffffff] rounded-2xl p-5 border border-[#ffffff]/80 corner-screws">
              {/* Top hardware bar with Vent slots & Power LED */}
              <div className="flex items-center justify-between pb-3 border-b border-[#babecc] shadow-[0_1px_0_#ffffff] text-xs font-mono">
                <div className="flex items-center gap-2">
                  {/* Power LED Indicator */}
                  <span className="w-3 h-3 rounded-full bg-[#ff4757] shadow-[0_0_8px_rgba(255,71,87,0.9)] animate-pulse" />
                  <span className="font-bold text-[#2d3436] uppercase text-embossed">MOD-01 DIAGNOSTIC DISP</span>
                </div>
                {/* Vent slots */}
                <div className="flex gap-1">
                  <div className="h-4 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
                  <div className="h-4 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
                  <div className="h-4 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
                </div>
              </div>

              {/* Inner CRT Screen with Scanlines */}
              <div className="mt-4 p-4 rounded-xl crt-screen space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-[#22c55e] pb-1 border-b border-[#22c55e]/30">
                  <span>TELEMETRY STREAM: RUNNING</span>
                  <span>FPS: 60.0 // BUFFER: 4KB</span>
                </div>

                {/* Alice message 1 */}
                <div className="p-2.5 rounded bg-black/40 border border-white/10">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 mb-1">
                    <span>ALICE</span>
                    <span>09:00</span>
                  </div>
                  <p className="text-slate-200">Where should we meet tomorrow?</p>
                </div>

                {/* Bob message */}
                <div className="p-2.5 rounded bg-black/40 border border-white/10">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 mb-1">
                    <span>BOB</span>
                    <span>09:01</span>
                  </div>
                  <p className="text-slate-200">I'll finish the presentation tonight.</p>
                </div>

                {/* Alice repeated question - HIGHLIGHTED GAP */}
                <div className="p-3 rounded bg-[#ff4757]/20 border border-[#ff4757]/80 relative shadow-[0_0_12px_rgba(255,71,87,0.3)]">
                  <div className="flex items-center justify-between text-[10px] text-[#ff4757] font-bold mb-1">
                    <span>ALICE [UNRESOLVED INQUIRY]</span>
                    <span>09:05</span>
                  </div>
                  <p className="text-white font-bold">Where should we meet?</p>

                  <div className="mt-2 pt-1.5 border-t border-[#ff4757]/40 flex items-center justify-between text-[10px] text-[#ff4757] font-bold">
                    <span>⚠ GAP: REPEATED CLARIFICATION</span>
                    <span className="bg-[#ff4757] text-white px-1.5 py-0.2 rounded">94% CONF</span>
                  </div>
                </div>
              </div>

              {/* Physical Bottom Switch Strip */}
              <div className="mt-4 pt-3 border-t border-[#babecc] shadow-[0_1px_0_#ffffff] flex items-center justify-between text-[10px] font-mono text-[#4a5568]">
                <span>CALIBRATION: HIGH PRECISION</span>
                <span className="font-bold text-[#2d3436]">HEURISTIC ENGINE v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: The Failure Modes */}
      <section className="px-6 py-20 border-y border-[#babecc] shadow-[inset_0_1px_0_#ffffff,inset_0_-1px_0_#babecc] bg-[#e0e5ec]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff4757] text-embossed">
              // FAILURE MODE TAXONOMY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d3436] text-embossed">
              Four Critical Communication Breakdowns
            </h2>
            <p className="text-sm font-mono text-[#4a5568] leading-relaxed">
              Engineered to pinpoint structural conversational degradation rather than subjective tone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Unanswered Questions',
                desc: 'Blockers buried under status updates that no team member ever responded to.',
                icon: AlertCircle,
                color: '#ff4757',
              },
              {
                title: 'Stalled Commitments',
                desc: 'Promises like "I\'ll check the logs in an hour" that quietly stall out without follow-up.',
                icon: Clock,
                color: '#0284c7',
              },
              {
                title: 'Repeated Clarifications',
                desc: 'Confusion signals where participants repeatedly re-ask questions due to vague replies.',
                icon: RefreshCw,
                color: '#d97706',
              },
              {
                title: 'Unresolved Decisions',
                desc: 'Technical debates that conclude abruptly without clear consensus or a designated owner.',
                icon: GitBranch,
                color: '#7c3aed',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#babecc,-12px_-12px_24px_#ffffff] rounded-2xl transition-all space-y-4 corner-screws border border-[#ffffff]/40 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] border border-[#ffffff]/60 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ color: card.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-mono font-bold uppercase text-[#2d3436] text-embossed">
                    {card.title}
                  </h3>
                  <p className="text-xs font-mono text-[#4a5568] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Physical Step Pipeline with Cylindrical Connector Pipe */}
      <section className="px-6 py-24 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff4757] text-embossed">
            // SCHEMATIC WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d3436] text-embossed">
            Three Physical Stages of Detection
          </h2>
          <p className="text-sm font-mono text-[#4a5568] leading-relaxed">
            From raw input text to verifiable evidence quote nodes.
          </p>
        </div>

        {/* Pipeline Container with Physical Pipe Connector */}
        <div className="relative">
          {/* Physical Pipe behind the cards */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 connector-pipe hidden md:block z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                step: '01',
                title: 'Data Ingestion',
                desc: 'Paste conversation transcript or upload TXT, CSV, or JSON logs from Slack, Teams, or Meet.',
                icon: FileText,
              },
              {
                step: '02',
                title: 'Neural Dependency Graph',
                desc: 'Engine traces speaker turns, question-answer bindings, and semantic commitments across time.',
                icon: Cpu,
              },
              {
                step: '03',
                title: 'Verifiable Evidence Quotes',
                desc: 'Every communication gap is paired with exact quoted timestamps and one-click resolution controls.',
                icon: ShieldCheck,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] rounded-2xl border border-[#ffffff]/60 space-y-4 corner-screws"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-2xl font-extrabold text-[#ff4757] text-embossed">
                      {item.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] text-[#ff4757]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-mono font-bold uppercase text-[#2d3436] text-embossed">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-[#4a5568] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Interactive Live Demo */}
      <section id="live-demo-section" className="px-6 py-20 border-t border-[#babecc] shadow-[inset_0_1px_0_#ffffff] bg-[#e0e5ec]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff4757] text-embossed">
              // INTERACTIVE BENCH TEST
            </span>
            <h2 className="text-3xl font-extrabold text-[#2d3436] text-embossed">
              Hardware Console Demo
            </h2>
            <p className="text-sm font-mono text-[#4a5568]">
              Trigger an automated AI scan across this unmoderated morning sync scenario.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[#e0e5ec] shadow-[12px_12px_24px_#babecc,-12px_-12px_24px_#ffffff] rounded-2xl corner-screws border border-[#ffffff]/60 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-[#2d3436] text-embossed">
                  SAMPLE LOG: MORNING STANDUP SYNC
                </h3>
                <span className="text-[10px] font-mono text-[#4a5568]">
                  6 MESSAGES • PARTICIPANTS: ALICE, BOB, CHARLIE
                </span>
              </div>

              <button
                onClick={handleRunDemo}
                disabled={demoScanning}
                className="btn-tactile-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl active:translate-y-[2px] disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{demoScanning ? `RUNNING (${demoProgress}%)...` : 'RUN GAP DETECTION'}</span>
              </button>
            </div>

            {/* Transcript Viewer with Scanlines */}
            <div className="space-y-2.5 font-mono text-xs">
              {[
                { time: '09:00', speaker: 'Alice', text: 'Are we meeting tomorrow?' },
                { time: '09:01', speaker: 'Bob', text: 'Yes, I think so.' },
                { time: '09:02', speaker: 'Alice', text: 'What time?', gapCandidate: true },
                { time: '09:03', speaker: 'Charlie', text: "I still haven't finished the presentation." },
                { time: '09:05', speaker: 'Alice', text: 'What time are we meeting?', gapCandidate: true },
                { time: '09:08', speaker: 'Bob', text: "I'll send the presentation tonight." },
              ].map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all duration-200 ${
                    demoAnalyzed && msg.gapCandidate
                      ? 'border-[#ff4757]/80 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff]'
                      : 'border-[#ffffff]/50 bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#4a5568] mb-1 font-bold">
                    <span className="uppercase text-[#2d3436]">{msg.speaker}</span>
                    <span>[{msg.time}]</span>
                  </div>
                  <p className="text-[#2d3436] font-medium">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Result Card Revealed After Analysis */}
            {demoAnalyzed && (
              <div className="p-5 rounded-2xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] border border-[#ff4757]/40 space-y-4 animate-in fade-in duration-300 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GapBadge type="repeated_clarification" size="md" />
                    <span className="text-xs font-bold uppercase text-[#ff4757]">
                      HIGH SEVERITY
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#ff4757] bg-[#ff4757]/15 px-2 py-0.5 rounded shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7)]">
                    CONFIDENCE: 94%
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#2d3436] pl-3 border-l-2 border-[#ff4757]">
                  <p>Alice (09:02): <span className="italic">“What time?”</span></p>
                  <p>Charlie (09:03): <span className="italic">“I still haven't finished the presentation.”</span></p>
                  <p>Alice (09:05): <span className="italic">“What time are we meeting?”</span></p>
                </div>

                <div className="text-xs text-[#4a5568] leading-relaxed pt-3 border-t border-[#babecc]/50 shadow-[0_1px_0_#ffffff]">
                  <strong className="text-[#2d3436] uppercase block mb-0.5">DIAGNOSTIC EXPLANATION:</strong>
                  Alice inquired regarding meeting scheduling, but participants diverged to slide preparation. The query was dropped, forcing a second inquiry 3 minutes later.
                </div>

                <div className="pt-2">
                  <Link
                    to="/analyze"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#ff4757] hover:underline"
                  >
                    <span>ANALYZE FULL CONVERSATIONS NOW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d3436] text-embossed">
          Calibrate Your Team's Communication.
        </h2>
        <p className="text-sm font-mono text-[#4a5568] max-w-xl mx-auto leading-relaxed">
          Zero sign up required. Execute your first diagnostic scan in seconds with 100% in-browser security.
        </p>
        <div>
          <Link
            to="/analyze"
            className="btn-tactile-primary inline-flex items-center gap-2 px-7 py-3.5 text-xs font-mono font-bold uppercase rounded-xl active:translate-y-[2px]"
          >
            <span>LAUNCH DIAGNOSTIC SCAN</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#babecc] shadow-[0_1px_0_#ffffff] bg-[#e0e5ec] py-10 px-6 text-xs font-mono text-[#4a5568]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" showTagline={true} />

          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-[#ff4757]">SCHEMATICS</Link>
            <Link to="/history" className="hover:text-[#ff4757]">ARCHIVE</Link>
            <Link to="/settings" className="hover:text-[#ff4757]">CALIBRATE</Link>
            <Link to="/privacy" className="hover:text-[#ff4757]">SECURITY</Link>
          </div>

          <div className="text-center md:text-right text-[11px]">
            <span>GAPLENS MOD-01 // PROVIDER-BASED AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
