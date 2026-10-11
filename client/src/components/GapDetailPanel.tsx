import React, { useState } from 'react';
import { CommunicationGap } from '../types/conversation';
import { GapBadge } from './GapBadge';
import { getGapMeta } from '../utils/colors';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Eye,
  Trash2,
  Copy,
  Check,
  Quote,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface GapDetailPanelProps {
  gap: CommunicationGap | null;
  onClose: () => void;
  onResolve: (gapId: string) => void;
  onReopen?: (gapId: string) => void;
  onDismiss: (gapId: string) => void;
  onViewContext: (messageId?: string) => void;
}

export const GapDetailPanel: React.FC<GapDetailPanelProps> = ({
  gap,
  onClose,
  onResolve,
  onReopen,
  onDismiss,
  onViewContext,
}) => {
  const [copied, setCopied] = useState(false);

  if (!gap) return null;

  const meta = getGapMeta(gap.type);

  const handleCopyEvidence = () => {
    const text = `Communication Gap: ${meta.label}\nTopic: ${gap.topic || 'General'}\nConfidence: ${Math.round(gap.confidence * 100)}%\n\nEvidence:\n${gap.evidence.map(e => `[${e.timestamp || ''}] ${e.speaker}: "${e.text}"`).join('\n')}\n\nAI Explanation:\n${gap.explanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResolveClick = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff4757', '#d97706', '#22c55e'],
    });
    onResolve(gap.id);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[#e0e5ec] border-l border-[#babecc] shadow-[-12px_0_24px_rgba(0,0,0,0.15)] z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250 font-sans">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-[#babecc] shadow-[0_1px_0_#ffffff] flex items-center justify-between bg-[#e0e5ec]">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] border border-[#ffffff]/60"
              style={{ color: meta.color }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
                GAP DIAGNOSTIC INSPECTOR
              </h2>
              <span className="text-[10px] font-mono text-[#4a5568]">
                ID: {gap.id}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#2d3436] rounded-lg bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]"
            aria-label="Close gap detail panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Badge & Confidence */}
          <div className="p-5 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <GapBadge type={gap.type} size="md" />
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-[#4a5568] block">
                  PROBABILITY
                </span>
                <span
                  className="text-lg font-mono font-extrabold text-embossed"
                  style={{ color: meta.color }}
                >
                  {Math.round(gap.confidence * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#babecc]/50 shadow-[0_1px_0_#ffffff] text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#4a5568] block">
                  PRIMARY SPEAKER
                </span>
                <span className="font-bold text-[#2d3436]">
                  {gap.speaker || 'MULTI-PARTY'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#4a5568] block">
                  TOPIC THREAD
                </span>
                <span className="font-bold text-[#ff4757]">
                  {gap.topic || 'General Discussion'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
              <Sparkles className="w-3.5 h-3.5 text-[#ff4757]" />
              <span>DIAGNOSTIC REASONING</span>
            </div>
            <div className="p-4 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] text-xs font-mono leading-relaxed text-[#2d3436] rounded-xl border border-[#ffffff]/40">
              {gap.explanation}
            </div>
          </div>

          {/* Direct Conversation Evidence */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
                <Quote className="w-3.5 h-3.5 text-[#7c3aed]" />
                <span>TRANSCRIPT EVIDENCE</span>
              </div>
              <button
                onClick={handleCopyEvidence}
                className="btn-tactile-chassis flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded"
              >
                {copied ? <Check className="w-3 h-3 text-[#16a34a]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {gap.evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] rounded-xl border border-[#ffffff]/50"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#4a5568] mb-1">
                    <span className="font-bold text-[#2d3436] uppercase">
                      {item.speaker}
                    </span>
                    {item.timestamp && <span>[{item.timestamp}]</span>}
                  </div>
                  <p className="text-xs font-mono text-[#2d3436] italic">
                    "{item.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="flex items-center justify-between p-3.5 bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl font-mono text-xs">
            <span className="font-bold uppercase text-[#4a5568]">
              RESOLUTION STATUS
            </span>
            <span
              className={`font-bold uppercase px-2.5 py-0.5 rounded shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),2px_2px_4px_rgba(186,190,204,0.5)] ${
                gap.status === 'resolved'
                  ? 'bg-[#16a34a]/15 text-[#15803d]'
                  : gap.status === 'dismissed'
                  ? 'bg-[#d1d9e6] text-[#4a5568]'
                  : 'bg-[#ff4757]/15 text-[#ff4757]'
              }`}
            >
              {gap.status === 'resolved' ? 'RESOLVED' : gap.status === 'dismissed' ? 'DISMISSED' : 'UNRESOLVED'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-5 border-t border-[#babecc] shadow-[0_-1px_0_#ffffff] bg-[#e0e5ec] space-y-2">
        <div className="flex items-center gap-3">
          {gap.status !== 'resolved' ? (
            <button
              onClick={handleResolveClick}
              className="btn-tactile-primary flex-1 flex items-center justify-center gap-1.5 py-3 px-4 text-xs font-mono font-bold uppercase rounded-xl"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>MARK RESOLVED</span>
            </button>
          ) : (
            <button
              onClick={() => (onReopen ? onReopen(gap.id) : onResolve(gap.id))}
              className="btn-tactile-chassis flex-1 flex items-center justify-center gap-1.5 py-3 px-4 text-xs font-mono font-bold uppercase rounded-xl"
            >
              <RotateCcw className="w-4 h-4 text-[#d97706]" />
              <span>REOPEN THREAD</span>
            </button>
          )}

          <button
            onClick={() => onViewContext(gap.evidence[0]?.messageId)}
            className="btn-tactile-chassis flex-1 flex items-center justify-center gap-1.5 py-3 px-4 text-xs font-mono font-bold uppercase rounded-xl"
          >
            <Eye className="w-4 h-4 text-[#ff4757]" />
            <span>JUMP TO CHAT</span>
          </button>

          <button
            onClick={() => onDismiss(gap.id)}
            className="btn-tactile-chassis p-3 text-xs rounded-xl text-[#4a5568] hover:text-[#ff4757]"
            title="Dismiss gap"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
