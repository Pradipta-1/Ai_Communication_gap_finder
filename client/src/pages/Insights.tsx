import React from 'react';
import {
  GapDistributionChart,
  ParticipantActivityChart,
  ResolutionTrendChart,
} from '../components/Charts';
import {
  Flame,
  GitBranch,
  Info,
  Activity,
} from 'lucide-react';

export const Insights: React.FC = () => {
  // Aggregate insights data across audit history
  const distributionData = [
    { name: 'Unanswered Questions', value: 34, color: '#ff4757' },
    { name: 'Repeated Clarifications', value: 26, color: '#d97706' },
    { name: 'Unresolved Topics', value: 18, color: '#2d3436' },
    { name: 'Partial Answers', value: 14, color: '#0284c7' },
    { name: 'Pending Follow-ups', value: 8, color: '#059669' },
  ];

  const participantData = [
    { participant: 'Alice', messages: 28, questions: 12 },
    { participant: 'Bob', messages: 34, questions: 5 },
    { participant: 'Charlie', messages: 19, questions: 7 },
    { participant: 'David', messages: 24, questions: 9 },
    { participant: 'Elena', messages: 31, questions: 14 },
    { participant: 'Marcus', messages: 22, questions: 4 },
  ];

  const trendData = [
    { session: 'Sprint 1', resolved: 14, gaps: 6 },
    { session: 'Sprint 2', resolved: 18, gaps: 8 },
    { session: 'Sprint 3', resolved: 22, gaps: 5 },
    { session: 'Sprint 4', resolved: 25, gaps: 7 },
    { session: 'Sprint 5', resolved: 30, gaps: 4 },
  ];

  const hotspots = [
    { time: '09:02 - 09:12', topic: 'Meeting Schedule & Venue', queries: 3, speaker: 'Alice', severity: 'High' },
    { time: '14:20 - 14:40', topic: 'PR #412 JWT Review Stalling', queries: 2, speaker: 'Elena', severity: 'High' },
    { time: '11:17 - 11:25', topic: 'Summit Date Collision (Nov 14 vs 21)', queries: 2, speaker: 'Chloe', severity: 'Critical' },
    { time: '16:05 - 16:15', topic: 'Database Migration Architecture', queries: 2, speaker: 'David', severity: 'Medium' },
  ];

  const unresolvedTopics = [
    { topic: 'Snowflake vs ClickHouse DBT Migration', occurrences: 4, lastSpeaker: 'David', status: 'Blocked by Budget' },
    { topic: 'Summit Venue & Keynote Date Hold', occurrences: 3, lastSpeaker: 'Chloe', status: 'Hold Expires 5 PM' },
    { topic: 'Transit Token Revocation in Redis', occurrences: 2, lastSpeaker: 'Kenji', status: 'Architecture Pending' },
    { topic: 'Staging Cluster Pod Alert Policies', occurrences: 2, lastSpeaker: 'Sarah', status: 'Under Review' },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="pb-6 border-b border-[#babecc]/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-accent tracking-widest uppercase">
            TELEMETRY_ENGINE // PATTERN_ANALYSIS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight text-embossed">
          Telemetry & Insights
        </h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">
          Aggregate communication trends, frequent bottlenecks, and recurring conversational failure modes across team channels.
        </p>
      </div>

      {/* Grid: Charts (Donut + Trend) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gap Distribution Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-[#e0e5ec] shadow-card rounded-2xl p-6 border border-white/60 space-y-4 corner-screws-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#babecc]/40">
            <h3 className="text-sm font-bold text-foreground text-embossed uppercase tracking-wide">
              Gap Type Distribution
            </h3>
            <span className="font-mono text-[10px] font-bold text-muted bg-[#d1d9e6] px-2 py-0.5 rounded shadow-recessed">
              HISTORICAL
            </span>
          </div>

          <div className="p-3 bg-[#d1d9e6]/40 shadow-recessed rounded-xl border border-[#babecc]/30">
            <GapDistributionChart data={distributionData} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-[#babecc]/40 font-mono">
            {distributionData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-muted truncate text-[11px]">{d.name}</span>
                <span className="font-bold text-foreground ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Over Time (7 Cols) */}
        <div className="lg:col-span-7 bg-[#e0e5ec] shadow-card rounded-2xl p-6 border border-white/60 space-y-4 corner-screws-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#babecc]/40">
            <h3 className="text-sm font-bold text-foreground text-embossed uppercase tracking-wide">
              Resolution Trajectory
            </h3>
            <span className="font-mono text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded shadow-recessed">
              RESOLVED VS GAPS
            </span>
          </div>

          <div className="p-3 bg-[#d1d9e6]/40 shadow-recessed rounded-xl border border-[#babecc]/30">
            <ResolutionTrendChart data={trendData} />
          </div>

          <p className="text-xs text-muted pt-3 border-t border-[#babecc]/40 leading-relaxed font-mono">
            Tracks proportion of initiated questions and debate threads that successfully conclude with verified answers rather than conversational drift.
          </p>
        </div>
      </div>

      {/* Participant Activity & Clarification Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Participant Activity (6 Cols) */}
        <div className="lg:col-span-6 bg-[#e0e5ec] shadow-card rounded-2xl p-6 border border-white/60 space-y-4 corner-screws-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#babecc]/40">
            <h3 className="text-sm font-bold text-foreground text-embossed uppercase tracking-wide">
              Participant Activity Distribution
            </h3>
            <span className="font-mono text-[10px] font-bold text-muted bg-[#d1d9e6] px-2 py-0.5 rounded shadow-recessed">
              SAMPLE TEAMS
            </span>
          </div>

          <div className="p-3 bg-[#d1d9e6]/40 shadow-recessed rounded-xl border border-[#babecc]/30">
            <ParticipantActivityChart data={participantData} />
          </div>

          <div className="p-3.5 bg-[#d1d9e6]/50 shadow-recessed rounded-xl border border-[#babecc]/40 flex items-start gap-2.5 text-xs text-muted font-mono leading-relaxed">
            <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>
              NOTE: Message density does not indicate alignment. High message count frequently correlates with repeated clarification loops due to unanswered inquiries.
            </span>
          </div>
        </div>

        {/* Clarification Hotspots (6 Cols) */}
        <div className="lg:col-span-6 bg-[#e0e5ec] shadow-card rounded-2xl p-6 border border-white/60 space-y-4 corner-screws-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#babecc]/40">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold text-foreground text-embossed uppercase tracking-wide">
                Clarification Hotspots
              </h3>
            </div>
            <span className="font-mono text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded shadow-recessed">
              HIGH CHURN
            </span>
          </div>

          <p className="text-xs text-muted font-mono">
            Time windows where inquiry loops accumulated due to missing, ambiguous, or evasive responses.
          </p>

          <div className="space-y-2.5">
            {hotspots.map((spot, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#d1d9e6]/50 shadow-recessed rounded-xl border border-[#babecc]/40 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">
                    {spot.topic}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase text-accent bg-[#e0e5ec] shadow-card border border-white/70 px-2 py-0.5 rounded">
                    {spot.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>WINDOW: {spot.time}</span>
                  <span>{spot.queries} REPEATS // {spot.speaker}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequently Unresolved Topics */}
      <div className="bg-[#e0e5ec] shadow-card rounded-2xl p-6 border border-white/60 space-y-4 corner-screws-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#babecc]/40">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-foreground text-embossed uppercase tracking-wide">
              Recurring Unresolved Decisions
            </h3>
          </div>
          <span className="font-mono text-[10px] font-bold text-muted bg-[#d1d9e6] px-2 py-0.5 rounded shadow-recessed">
            BLOCKER DETECTOR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unresolvedTopics.map((topic, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#d1d9e6]/50 shadow-recessed rounded-xl border border-[#babecc]/40 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>{topic.topic}</span>
                <span className="text-accent text-[10px] font-mono bg-[#e0e5ec] shadow-card px-2 py-0.5 rounded border border-white/80">
                  {topic.occurrences}x DROPPED
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-2 border-t border-[#babecc]/40">
                <span>SPEAKER: {topic.lastSpeaker}</span>
                <span className="text-foreground font-bold">{topic.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
