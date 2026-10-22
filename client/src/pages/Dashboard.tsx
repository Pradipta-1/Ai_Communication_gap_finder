import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../components/StatsCard';
import { api } from '../services/api';
import { ConversationListItem } from '../types/conversation';
import {
  MessageSquare,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getConversations().then(data => {
      if (mounted) {
        setConversations(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const totalGaps = conversations.reduce((acc, c) => acc + c.gapsCount, 0);
  const totalMessages = conversations.reduce((acc, c) => acc + c.messagesCount, 0);
  const avgHealth = conversations.length > 0
    ? Math.round(conversations.reduce((acc, c) => acc + c.healthScore, 0) / conversations.length)
    : 85;

  return (
    <div className="p-3.5 sm:p-6 md:p-8 space-y-5 sm:space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-mono font-extrabold uppercase text-[#2d3436] text-embossed tracking-tight">
            TELEMETRY DASHBOARD
          </h1>
          <p className="text-xs font-mono text-[#4a5568] mt-1">
            Real-time conversational clarity, unresolved threads, and dialogue health.
          </p>
        </div>

        <Link
          to="/analyze"
          className="btn-tactile-primary inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl active:translate-y-[2px] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>NEW SCAN</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <StatsCard
          label="CONVERSATIONS ANALYZED"
          value={conversations.length}
          icon={MessageSquare}
          color="#0284c7"
          trend={conversations.length > 0 ? `${conversations.length} RECORDED` : 'READY TO SCAN'}
          description="Indexed multi-party discussions and transcripts"
        />
        <StatsCard
          label="COMMUNICATION GAPS"
          value={totalGaps}
          icon={AlertTriangle}
          color="#ff4757"
          trend={totalGaps > 0 ? `${totalGaps} DETECTED` : 'CLEAN THREADS'}
          description="Unanswered questions & repeated queries"
        />
        <StatsCard
          label="MESSAGES AUDITED"
          value={totalMessages}
          icon={GitBranch}
          color="#7c3aed"
          trend="CHRONOLOGICAL NODES"
          description="Individually tagged and parsed speaker turns"
        />
        <StatsCard
          label="AVG CLARITY RATING"
          value={avgHealth}
          suffix="%"
          icon={ShieldCheck}
          color="#16a34a"
          trend={avgHealth >= 75 ? 'OPTIMAL' : 'ATTENTION'}
          description="Ratio of resolved threads vs. dropped topics"
        />
      </div>

      {/* Quick Launch & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Recent Analyzed Conversations (8 Cols) */}
        <div className="lg:col-span-8 bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl corner-screws border border-[#ffffff]/40 space-y-4 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff4757]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
                RECENT TRANSCRIPT ARCHIVES
              </h2>
            </div>
            <Link
              to="/history"
              className="text-xs text-[#ff4757] hover:underline font-bold uppercase"
            >
              VIEW ALL ({conversations.length})
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#4a5568]">
              POLLING LOCAL ARCHIVE...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-[#4a5568]">NO CONVERSATIONS ARCHIVED YET.</p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 text-xs text-[#ff4757] font-bold uppercase"
              >
                EXECUTE FIRST ANALYSIS →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  className="p-3 sm:p-4 rounded-xl bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] border border-[#ffffff]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold uppercase text-[#2d3436] group-hover:text-[#ff4757] transition-colors text-embossed">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#4a5568]">
                        [{new Date(item.createdAt).toLocaleDateString()}]
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#4a5568]">
                      <span>{item.participantsCount} USERS</span>
                      <span>•</span>
                      <span>{item.messagesCount} MSGS</span>
                      <span>•</span>
                      <span className="text-[#ff4757] font-bold">{item.gapsCount} GAPS</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[9px] uppercase text-[#4a5568] block font-bold">
                        HEALTH SCORE
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          item.healthScore >= 75
                            ? 'text-[#16a34a]'
                            : item.healthScore >= 60
                            ? 'text-[#0284c7]'
                            : 'text-[#d97706]'
                        }`}
                      >
                        {item.healthScore}%
                      </span>
                    </div>

                    <Link
                      to={`/results/${item.id}`}
                      className="btn-tactile-chassis p-2 rounded-lg text-[#2d3436] hover:text-[#ff4757]"
                      title="Inspect analysis"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Launch Demos & Health Advisor (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl corner-screws border border-[#ffffff]/40 space-y-4 font-mono">
            <div className="flex items-center gap-2 pb-3 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
              <Zap className="w-4 h-4 text-[#ff4757]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
                PRE-CALIBRATED BENCH TESTS
              </h3>
            </div>

            <p className="text-[11px] text-[#4a5568] leading-relaxed">
              Examine pre-audited multi-person scenarios highlighting specific communication failure modes.
            </p>

            <div className="space-y-2.5">
              <Link
                to="/results/demo-project-meeting"
                className="w-full p-3.5 bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] hover:shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] rounded-xl flex items-center justify-between transition-all group border border-[#ffffff]/50"
              >
                <div>
                  <span className="text-xs font-bold uppercase text-[#2d3436] block group-hover:text-[#ff4757]">
                    01. Project Planning Sync
                  </span>
                  <span className="text-[10px] text-[#4a5568]">
                    Repeated Clarifications & Debate
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#ff4757] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/results/demo-software-team"
                className="w-full p-3.5 bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] hover:shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] rounded-xl flex items-center justify-between transition-all group border border-[#ffffff]/50"
              >
                <div>
                  <span className="text-xs font-bold uppercase text-[#2d3436] block group-hover:text-[#0284c7]">
                    02. Software Incident Sync
                  </span>
                  <span className="text-[10px] text-[#4a5568]">
                    Stalled Commitments & Memory Alert
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#0284c7] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/results/demo-event-planning"
                className="w-full p-3.5 bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] hover:shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] rounded-xl flex items-center justify-between transition-all group border border-[#ffffff]/50"
              >
                <div>
                  <span className="text-xs font-bold uppercase text-[#2d3436] block group-hover:text-[#7c3aed]">
                    03. DevCon Summit Planning
                  </span>
                  <span className="text-[10px] text-[#4a5568]">
                    Schedule Conflict & Topic Abandonment
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7c3aed] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Real-time Advisor Tip */}
          <div className="p-4 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl space-y-1.5 font-mono text-xs border border-[#ffffff]/40">
            <div className="flex items-center gap-1.5 text-[#ff4757] font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMUNICATION TELEMETRY TIP</span>
            </div>
            <p className="text-[11px] text-[#4a5568] leading-relaxed">
              When assigning next steps in chat, mention the owner explicitly by name with an estimated completion time to prevent dropped threads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
