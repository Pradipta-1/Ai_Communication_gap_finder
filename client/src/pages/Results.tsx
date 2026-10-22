import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  ConversationAnalysis,
  CommunicationGap,
  GapType,
} from '../types/conversation';
import { MessageCard } from '../components/MessageCard';
import { GapDetailPanel } from '../components/GapDetailPanel';
import { TopicPanel } from '../components/TopicPanel';
import { Timeline } from '../components/Timeline';
import { HealthScoreGauge } from '../components/HealthScoreGauge';
import { ExportModal } from '../components/ExportModal';
import {
  Download,
  Search,
  ArrowLeft,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGapType, setSelectedGapType] = useState<GapType | 'all'>('all');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Active Gap Inspector & Export Modal
  const [activeGap, setActiveGap] = useState<CommunicationGap | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getConversationById(id).then(data => {
      if (data) {
        setAnalysis(data);
      } else {
        setErrorMsg('Conversation analysis not found.');
      }
      setLoading(false);
    });
  }, [id]);

  // Handle Mark Resolved
  const handleResolveGap = async (gapId: string) => {
    if (!analysis) return;
    const success = await api.updateGapStatus(analysis.id, gapId, 'resolved');
    if (success) {
      setAnalysis(prev => {
        if (!prev) return null;
        const updatedGaps = prev.communicationGaps.map(g =>
          g.id === gapId ? { ...g, status: 'resolved' as const } : g
        );
        const activeCount = updatedGaps.filter(g => g.status === 'unresolved').length;
        return {
          ...prev,
          communicationGaps: updatedGaps,
          healthScore: Math.min(99, Math.round(100 - activeCount * 7)),
        };
      });
      if (activeGap?.id === gapId) {
        setActiveGap(prev => (prev ? { ...prev, status: 'resolved' } : null));
      }
    }
  };

  // Handle Reopen Gap
  const handleReopenGap = async (gapId: string) => {
    if (!analysis) return;
    const success = await api.updateGapStatus(analysis.id, gapId, 'unresolved');
    if (success) {
      setAnalysis(prev => {
        if (!prev) return null;
        const updatedGaps = prev.communicationGaps.map(g =>
          g.id === gapId ? { ...g, status: 'unresolved' as const } : g
        );
        const activeCount = updatedGaps.filter(g => g.status === 'unresolved').length;
        return {
          ...prev,
          communicationGaps: updatedGaps,
          healthScore: Math.min(99, Math.max(25, Math.round(100 - activeCount * 7))),
        };
      });
      if (activeGap?.id === gapId) {
        setActiveGap(prev => (prev ? { ...prev, status: 'unresolved' } : null));
      }
    }
  };

  // Handle Dismiss Gap
  const handleDismissGap = async (gapId: string) => {
    if (!analysis) return;
    const success = await api.updateGapStatus(analysis.id, gapId, 'dismissed');
    if (success) {
      setAnalysis(prev => {
        if (!prev) return null;
        return {
          ...prev,
          communicationGaps: prev.communicationGaps.map(g =>
            g.id === gapId ? { ...g, status: 'dismissed' as const } : g
          ),
        };
      });
      setActiveGap(null);
    }
  };

  // Scroll to context message
  const handleViewContext = (targetId?: string) => {
    const el = document.getElementById(`msg-${targetId || selectedMessageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSelectedMessageId(targetId || null);
    }
  };

  // Build filtered message list
  const filteredMessages = useMemo(() => {
    if (!analysis) return [];

    return analysis.messages.filter(msg => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = msg.text.toLowerCase().includes(q);
        const matchesSpeaker = msg.speaker.toLowerCase().includes(q);
        if (!matchesText && !matchesSpeaker) return false;
      }

      if (selectedSpeaker !== 'all' && msg.speaker !== selectedSpeaker) {
        return false;
      }

      if (selectedTopic && msg.topic !== selectedTopic) {
        return false;
      }

      if (selectedGapType !== 'all') {
        const gap = analysis.communicationGaps.find(g => g.id === msg.gapId || g.messageIds.includes(msg.id));
        if (!gap || gap.type !== selectedGapType) {
          return false;
        }
      }

      return true;
    });
  }, [analysis, searchQuery, selectedSpeaker, selectedTopic, selectedGapType]);

  if (loading) {
    return (
      <div className="p-16 text-center font-mono space-y-4">
        <div className="w-8 h-8 rounded-full bg-[#ff4757] animate-ping mx-auto" />
        <p className="text-xs uppercase font-bold text-[#4a5568]">
          POLLING CONVERSATION TELEMETRY...
        </p>
      </div>
    );
  }

  if (errorMsg || !analysis) {
    return (
      <div className="p-16 text-center font-mono space-y-4 max-w-md mx-auto">
        <AlertTriangle className="w-8 h-8 text-[#ff4757] mx-auto" />
        <h2 className="text-sm font-bold uppercase text-[#2d3436] text-embossed">
          {errorMsg || 'RECORD NOT FOUND'}
        </h2>
        <p className="text-xs text-[#4a5568]">
          The requested conversation record could not be located in local memory.
        </p>
        <Link
          to="/analyze"
          className="btn-tactile-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>INGEST NEW TRANSCRIPT</span>
        </Link>
      </div>
    );
  }

  const openGapsCount = analysis.communicationGaps.filter(g => g.status === 'unresolved').length;

  return (
    <div className="p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-8 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
        <div className="space-y-1.5 font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/history"
              className="text-[#4a5568] hover:text-[#ff4757] text-xs flex items-center gap-1 font-bold uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO ARCHIVE</span>
            </Link>
            <span className="text-[#babecc]">•</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#d1d9e6] text-[#4a5568] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff]">
              {analysis.demoMode ? 'CALIBRATION MODE' : 'VERIFIED AUDIT'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#2d3436] text-embossed tracking-tight">
            {analysis.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[#4a5568] pt-1">
            <span className="flex items-center gap-1.5 font-bold">
              <Calendar className="w-3.5 h-3.5 text-[#ff4757]" />
              [{new Date(analysis.createdAt).toLocaleDateString()}]
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-bold">
              <Users className="w-3.5 h-3.5 text-[#0284c7]" />
              {analysis.participantsCount} PARTICIPANTS: {analysis.participants.join(', ')}
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-tactile-chassis inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl border border-[#ffffff]/60 w-full sm:w-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#ff4757]" />
            <span>EXPORT SCHEMATICS</span>
          </button>
        </div>
      </div>

      {/* Top Summary & Health Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Health Score Gauge (4 Cols) */}
        <div className="lg:col-span-4 flex">
          <div className="w-full">
            <HealthScoreGauge score={analysis.healthScore} size={160} />
          </div>
        </div>

        {/* Communication Metrics Cards (8 Cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 font-mono">
          <div className="p-2.5 sm:p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] rounded-xl border border-[#ffffff]/50 space-y-0.5 sm:space-y-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#4a5568] block">
              MESSAGES ANALYZED
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#2d3436] text-embossed">
              {analysis.messagesAnalyzed}
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#4a5568] block">
              COMPLETE TRANSCRIPT
            </span>
          </div>

          <div className="p-2.5 sm:p-4 bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] sm:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl border border-[#ff4757]/30 space-y-0.5 sm:space-y-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#ff4757] block">
              OPEN GAPS
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#ff4757]">
              {openGapsCount}
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#4a5568] block">
              REQUIRE RESOLUTION
            </span>
          </div>

          <div className="p-2.5 sm:p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] rounded-xl border border-[#ffffff]/50 space-y-0.5 sm:space-y-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#16a34a] block">
              RESOLVED EXCHANGES
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#16a34a] text-embossed">
              {analysis.summary.resolvedThreads || 8}
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#4a5568] block">
              CONFIRMED CONSENSUS
            </span>
          </div>

          <div className="p-2.5 sm:p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] rounded-xl border border-[#ffffff]/50 space-y-0.5 sm:space-y-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#ff4757] block">
              UNANSWERED QS
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#ff4757]">
              {analysis.summary.unansweredQuestionsCount}
            </span>
          </div>

          <div className="p-2.5 sm:p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] rounded-xl border border-[#ffffff]/50 space-y-0.5 sm:space-y-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#d97706] block">
              REPEATED QUERIES
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#d97706]">
              {analysis.summary.repeatedClarificationsCount}
            </span>
          </div>

          <div className="p-2.5 sm:p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] rounded-xl border border-[#ffffff]/50 space-y-0.5 sm:space-y-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#7c3aed] block">
              UNRESOLVED TOPICS
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#7c3aed]">
              {analysis.summary.unresolvedTopicsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="p-3.5 sm:p-5 bg-[#e0e5ec] shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] sm:shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] rounded-xl sm:rounded-2xl border border-[#ffffff]/50 space-y-2.5 sm:space-y-3.5 font-mono">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Recessed Search box */}
          <div className="relative flex-1 max-w-full md:max-w-md">
            <Search className="w-4 h-4 text-[#4a5568] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH TRANSCRIPT BY MESSAGE OR SPEAKER..."
              className="w-full bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] border-none pl-10 pr-3 py-2 text-xs font-mono text-[#2d3436] placeholder:text-[#4a5568]/60 rounded-xl focus:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff,0_0_0_2px_#ff4757] focus:outline-none"
            />
          </div>

          {/* Speaker select */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-bold text-[#4a5568] text-embossed">
              SPEAKER:
            </span>
            <select
              value={selectedSpeaker}
              onChange={e => setSelectedSpeaker(e.target.value)}
              className="bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] border-none text-xs px-3 py-2 text-[#2d3436] font-bold rounded-lg focus:outline-none flex-1 sm:flex-none"
            >
              <option value="all">ALL PARTICIPANTS</option>
              {analysis.participants.map(p => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gap Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[#babecc]/50 shadow-[0_1px_0_#ffffff] text-xs">
          <span className="text-[10px] uppercase font-bold text-[#4a5568] mr-1 text-embossed">
            FILTER:
          </span>
          {[
            { id: 'all', label: 'ALL MESSAGES' },
            { id: 'unanswered_question', label: 'UNANSWERED' },
            { id: 'repeated_clarification', label: 'REPEATED' },
            { id: 'unresolved_topic', label: 'UNRESOLVED' },
            { id: 'partial_answer', label: 'PARTIAL ANSWER' },
            { id: 'pending_follow_up', label: 'FOLLOW-UP' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setSelectedGapType(btn.id as any)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${
                selectedGapType === btn.id
                  ? 'bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] text-[#ff4757]'
                  : 'bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] text-[#4a5568] hover:text-[#2d3436]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Viewer with Sidebars (12 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
        {/* Left: Chronological Conversation Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
            <span className="text-xs font-bold uppercase text-[#2d3436] text-embossed">
              TRANSCRIPT STREAM ({filteredMessages.length} NODES)
            </span>
            <span className="text-[10px] text-[#4a5568] uppercase font-bold">
              CLICK FLAGGED NODE TO INSPECT EVIDENCE
            </span>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-2xl text-xs text-[#4a5568]">
              NO MESSAGES MATCH CURRENT FILTER CRITERIA.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map(msg => {
                const associatedGap = analysis.communicationGaps.find(
                  g => g.id === msg.gapId || g.messageIds.includes(msg.id)
                );

                return (
                  <MessageCard
                    key={msg.id}
                    message={msg}
                    gap={associatedGap}
                    isSelected={selectedMessageId === msg.id}
                    onSelectGap={gap => {
                      setActiveGap(gap);
                      setSelectedMessageId(msg.id);
                    }}
                    onSelectMessage={m => {
                      setSelectedMessageId(m.id);
                      if (associatedGap) setActiveGap(associatedGap);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Topic Intelligence & Structural Timeline (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Topic Intelligence Panel */}
          <TopicPanel
            topics={analysis.topics}
            selectedTopic={selectedTopic}
            onSelectTopic={t => setSelectedTopic(t)}
          />

          {/* Conversation Structural Timeline */}
          <Timeline
            messages={analysis.messages}
            gaps={analysis.communicationGaps}
            onSelectMessage={msgId => {
              handleViewContext(msgId);
              const gap = analysis.communicationGaps.find(g => g.messageIds.includes(msgId));
              if (gap) setActiveGap(gap);
            }}
          />
        </div>
      </div>

      {/* Right Drawer: Gap Detail Panel */}
      <GapDetailPanel
        gap={activeGap}
        onClose={() => setActiveGap(null)}
        onResolve={handleResolveGap}
        onReopen={handleReopenGap}
        onDismiss={handleDismissGap}
        onViewContext={handleViewContext}
      />

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          analysis={analysis}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
