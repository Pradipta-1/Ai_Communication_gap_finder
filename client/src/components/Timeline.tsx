import React from 'react';
import { Message, CommunicationGap } from '../types/conversation';
import { getGapMeta } from '../utils/colors';
import { Clock, AlertCircle } from 'lucide-react';

interface TimelineProps {
  messages: Message[];
  gaps: CommunicationGap[];
  onSelectMessage: (messageId: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  messages,
  gaps,
  onSelectMessage,
}) => {
  // Map of gap types by messageId
  const gapMap = new Map<string, CommunicationGap>();
  gaps.forEach(g => {
    g.messageIds.forEach(id => gapMap.set(id, g));
  });

  return (
    <div className="relative p-3.5 sm:p-5 md:p-6 bg-[#e0e5ec] shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] sm:shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] rounded-xl sm:rounded-2xl corner-screws border border-[#ffffff]/40 space-y-3 sm:space-y-4 font-sans">
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#ff4757]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
            EVENT SEQUENCE LOG
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#4a5568] uppercase">
          {messages.length} NODES
        </span>
      </div>

      {/* Vertical Cylindrical Connector Pipe */}
      <div className="relative pl-5 sm:pl-6 space-y-3 sm:space-y-3.5 before:absolute before:left-2 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-1.5 before:rounded-full before:bg-[#d1d9e6] before:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),0_1px_0_#ffffff]">
        {messages.map((msg, idx) => {
          const associatedGap = gapMap.get(msg.id);
          const meta = associatedGap ? getGapMeta(associatedGap.type) : null;
          const isQuestion = msg.text.includes('?') || msg.intent === 'question' || msg.intent === 'clarification';

          return (
            <div
              key={msg.id}
              onClick={() => onSelectMessage(msg.id)}
              className="relative group cursor-pointer"
            >
              {/* Tactile hardware node switch */}
              <div
                className={`absolute -left-[19px] sm:-left-[21px] top-2 w-4 h-4 rounded-full transition-transform duration-150 group-hover:scale-125 z-10 flex items-center justify-center ${
                  meta
                    ? 'bg-[#ff4757] shadow-[0_0_8px_#ff4757]'
                    : isQuestion
                    ? 'bg-[#d97706] shadow-[0_0_6px_#d97706]'
                    : 'bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff]'
                }`}
              >
                {meta ? (
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                ) : null}
              </div>

              {/* Event card strip */}
              <div
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border text-xs transition-all duration-150 ${
                  meta
                    ? 'border-[#ff4757]/40 bg-[#e0e5ec] shadow-[inset_2px_2px_5px_#babecc,inset_-2px_-2px_5px_#ffffff]'
                    : 'border-[#ffffff]/50 bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] hover:shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1 text-[#4a5568] mb-1 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#2d3436] uppercase">{msg.speaker}</span>
                    <span>•</span>
                    <span>{msg.timestamp || `T+${idx}`}</span>
                  </div>
                  {msg.intent && (
                    <span className="uppercase font-bold px-1.5 py-0.5 rounded bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc]">
                      {msg.intent}
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono text-[#2d3436] line-clamp-2 sm:line-clamp-1 italic break-words-safe">
                  "{msg.text}"
                </p>

                {/* Gap alert marker */}
                {meta && (
                  <div className="mt-2 pt-2 border-t border-[#ff4757]/20 flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono font-bold text-[#ff4757]">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      GAP: {meta.label}
                    </span>
                    <span className="text-[10px] text-[#4a5568] group-hover:text-[#ff4757] uppercase">
                      INSPECT →
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
