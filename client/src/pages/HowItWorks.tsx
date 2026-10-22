import React, { useState } from 'react';
import { GapBadge } from '../components/GapBadge';
import { GapType } from '../types/conversation';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<GapType>('unanswered_question');

  const rulesData: Record<
    GapType,
    {
      title: string;
      detectionLogic: string[];
      exampleDialogue: { speaker: string; text: string; note?: string }[];
      confidenceFactor: string;
      whyImportant: string;
    }
  > = {
    unanswered_question: {
      title: 'Unanswered Question',
      detectionLogic: [
        'Identifies explicit questions ending in "?" or phrased with interrogative intent.',
        'Scans subsequent turns within the dialogue window (next 1-5 messages).',
        'Evaluates if any respondent answers with relevant factual information or clarity.',
        'Distinguishes between conversational filler ("cool", "ok") and genuine substantive replies.',
      ],
      exampleDialogue: [
        { speaker: 'Alice', text: 'Does anyone have the credentials for the staging cluster?' },
        { speaker: 'Bob', text: 'I am pushing the frontend build right now.' },
        { speaker: 'Charlie', text: 'Meeting is moved to 4 PM.', note: 'Gap flagged: Staging credentials question completely ignored' },
      ],
      confidenceFactor: '95% when 3+ subsequent messages pass without topic relevance.',
      whyImportant: 'Directly uncovers blocked teammates whose blockers went unnoticed in fast chat.',
    },
    repeated_clarification: {
      title: 'Repeated Clarification',
      detectionLogic: [
        'Calculates token similarity and semantic intent across multiple inquiries from the same person.',
        'Detects re-asking patterns ("What time?" -> "What time are we meeting?" -> "Seriously, what time?").',
        'Flags cases where respondents gave ambiguous or evasive answers.',
      ],
      exampleDialogue: [
        { speaker: 'Alice', text: 'When is the hard deadline for the client deck?' },
        { speaker: 'David', text: 'Soon, we need it before leadership leaves.' },
        { speaker: 'Alice', text: 'Can you tell me the exact date?', note: 'Gap flagged: Repeated request due to vague reply' },
      ],
      confidenceFactor: '94% based on semantic similarity and repeated intent.',
      whyImportant: 'Signals stakeholder confusion and lack of clarity in requirements.',
    },
    partial_answer: {
      title: 'Partial Answer',
      detectionLogic: [
        'Parses compound sentences containing multiple questions or clauses.',
        'Checks if the respondent addressed part A (e.g. time) but omitted part B (e.g. location).',
        'Flags the unanswered clause as a communication gap.',
      ],
      exampleDialogue: [
        { speaker: 'Alice', text: 'What time and where are we meeting?' },
        { speaker: 'Bob', text: 'Let\'s do 10 AM.', note: 'Gap flagged: Time answered (10 AM), but location was omitted' },
      ],
      confidenceFactor: '89% when compound clauses lack mutual resolution.',
      whyImportant: 'Prevents logistical confusion where teams assume a question was fully settled.',
    },
    unresolved_topic: {
      title: 'Unresolved Topic & Abandonment',
      detectionLogic: [
        'Detects active debate or differing viewpoints between participants.',
        'Tracks whether a consensus decision ("Let\'s do X", "Agreed") was reached.',
        'Flags if the conversation abruptly shifts to an unrelated topic without a decision.',
      ],
      exampleDialogue: [
        { speaker: 'David', text: 'We should migrate analytics from ClickHouse to Snowflake.' },
        { speaker: 'Bob', text: 'ClickHouse saves us $12k/mo, why migrate now?' },
        { speaker: 'Bob', text: 'Heading into another call now, bye!', note: 'Gap flagged: Critical architecture debate abandoned' },
      ],
      confidenceFactor: '95% when open disagreement is followed by departure or abrupt subject change.',
      whyImportant: 'Stops unresolved technical disagreements from lingering without a recorded owner.',
    },
    pending_follow_up: {
      title: 'Pending Follow-up / Stalled Promise',
      detectionLogic: [
        'Recognizes commitment statements ("I will review", "I\'ll check", "will send tonight").',
        'Scans subsequent transcript context to determine whether the promised action occurred.',
        'Flags stalled commitments when follow-up queries reveal the task remained pending.',
      ],
      exampleDialogue: [
        { speaker: 'Marcus', text: 'I can review PR #412 right after lunch at 2:30 PM.' },
        { speaker: 'Elena (2h later)', text: 'Can someone please approve the PR? CI has been waiting for 2 hours.', note: 'Gap flagged: Promised code review was stalled' },
      ],
      confidenceFactor: '92% when temporal commitments are followed by stalled status.',
      whyImportant: 'Guarantees that stated commitments and promises are systematically fulfilled.',
    },
    missed_response: {
      title: 'Missed Response & Stranded Thread',
      detectionLogic: [
        'Identifies conversations where multiple threads cross each other simultaneously.',
        'Flags when an answer directed to Person B causes Person A\'s prior query to be lost.',
      ],
      exampleDialogue: [
        { speaker: 'Alice', text: 'Are the staging pods ready for testing?' },
        { speaker: 'Bob', text: 'Charlie, did you send the invoice?' },
        { speaker: 'Charlie', text: 'Invoice sent!', note: 'Gap flagged: Alice’s staging question stranded' },
      ],
      confidenceFactor: '88% when interleaved threads displace prior queries.',
      whyImportant: 'Restores lost conversational threads in fast-moving chat channels.',
    },
  };

  const current = rulesData[selectedRule];

  return (
    <div className="p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-10 font-sans">
      {/* Header */}
      <div className="pb-4 sm:pb-6 border-b border-[#babecc]/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-accent tracking-widest uppercase">
            SPECIFICATION // REASONING_HEURISTICS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight text-embossed">
          Mechanical Specifications
        </h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">
          Every detection rule is verifiable, deterministic, and bound directly to conversational quotes and timestamps.
        </p>
      </div>

      {/* Interactive Rule Explorer Tabs */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-wrap gap-2 pb-1">
          {(Object.keys(rulesData) as GapType[]).map(key => (
            <button
              key={key}
              onClick={() => setSelectedRule(key)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono font-bold rounded-lg transition-all duration-150 ${
                selectedRule === key
                  ? 'bg-[#e0e5ec] text-accent shadow-pressed border-2 border-accent'
                  : 'bg-[#e0e5ec] text-muted hover:text-foreground shadow-card border border-white/60 active:shadow-pressed'
              }`}
            >
              {rulesData[key].title.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Selected Rule Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start bg-[#e0e5ec] shadow-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/60 corner-screws relative overflow-hidden">
          {/* Left Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <GapBadge type={selectedRule} size="md" />
              <h2 className="text-xl font-bold text-foreground text-embossed">
                {current.title}
              </h2>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs font-bold uppercase text-accent tracking-wider block">
                DETECTION LOGIC PROTOCOL:
              </span>
              <ul className="space-y-2.5 text-xs text-foreground font-mono leading-relaxed">
                {current.detectionLogic.map((logic, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 bg-[#d1d9e6]/40 shadow-recessed rounded-lg border border-[#babecc]/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{logic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-[#babecc]/40 text-xs font-mono">
              <div className="p-3 bg-[#d1d9e6]/50 shadow-recessed rounded-xl border border-[#babecc]/40">
                <span className="text-muted block font-bold uppercase">
                  TARGET CONFIDENCE
                </span>
                <span className="text-accent font-extrabold text-sm mt-0.5 block">
                  {current.confidenceFactor}
                </span>
              </div>
              <div className="p-3 bg-[#d1d9e6]/50 shadow-recessed rounded-xl border border-[#babecc]/40">
                <span className="text-muted block font-bold uppercase">
                  OPERATIONAL IMPACT
                </span>
                <span className="text-foreground font-medium mt-0.5 block">
                  {current.whyImportant}
                </span>
              </div>
            </div>
          </div>

          {/* Right Example Dialogue (5 Cols) */}
          <div className="lg:col-span-5 bg-[#d1d9e6]/50 shadow-recessed p-5 rounded-xl border border-[#babecc]/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#babecc]/40 text-xs font-mono">
              <span className="font-bold text-foreground uppercase tracking-wider">
                SAMPLE TRANSCRIPT SCENARIO
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {current.exampleDialogue.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border transition-all ${
                    item.note
                      ? 'bg-accent/10 border-accent/30 shadow-card text-foreground'
                      : 'bg-[#e0e5ec] border-white/60 shadow-card text-foreground'
                  }`}
                >
                  <div className="text-xs text-accent font-bold mb-1">
                    {item.speaker}:
                  </div>
                  <p className="italic text-foreground">"{item.text}"</p>
                  {item.note && (
                    <div className="mt-2 pt-2 border-t border-accent/20 text-[11px] text-accent font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span>{item.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The Evidence-First Philosophy */}
      <div className="p-4 sm:p-6 bg-[#e0e5ec] shadow-card rounded-xl sm:rounded-2xl border border-white/60 space-y-3 corner-screws-sm relative overflow-hidden">
        <div className="flex items-center gap-2 text-accent font-bold text-sm font-mono uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <span>ZERO-HALLUCINATION GUARANTEE</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed max-w-3xl">
          GapLens will never claim a communication gap exists without citing the exact message, participant, and timestamp from the original conversation. Every flagged item can be traced and inspected in full context.
        </p>
        <div className="pt-2">
          <Link
            to="/analyze"
            className="btn-tactile-primary inline-flex items-center gap-2 text-xs"
          >
            <span>INGEST TRANSCRIPT NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
