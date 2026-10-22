import React from 'react';
import { Message, CommunicationGap } from '../types/conversation';
import { GapBadge } from './GapBadge';
import { getSpeakerColor } from '../utils/colors';
import { Tag, CornerDownRight } from 'lucide-react';

interface MessageCardProps {
  message: Message;
  gap?: CommunicationGap;
  isSelected?: boolean;
  isEvidence?: boolean;
  onSelectGap?: (gap: CommunicationGap) => void;
  onSelectMessage?: (message: Message) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  gap,
  isSelected = false,
  isEvidence = false,
  onSelectGap,
  onSelectMessage,
}) => {
  const speakerColor = getSpeakerColor(message.speaker);
  const initials = message.speaker.slice(0, 2).toUpperCase();

  const hasGap = Boolean(gap || message.gapType);

  return (
    <div
      id={`msg-${message.id}`}
      onClick={() => {
        if (gap && onSelectGap) onSelectGap(gap);
        if (onSelectMessage) onSelectMessage(message);
      }}
      className={`relative p-3 sm:p-4 rounded-xl transition-all duration-150 cursor-pointer font-sans border ${
        isSelected
          ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] border-[#ff4757]/60'
          : isEvidence
          ? 'bg-[#d1d9e6] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] border-[#0284c7]/40'
          : hasGap
          ? 'bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] border-l-4 border-l-[#ff4757] border-[#ffffff]/60 hover:shadow-[7px_7px_14px_#babecc,-7px_-7px_14px_#ffffff]'
          : 'bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] border-[#ffffff]/50 hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff]'
      }`}
    >
      {/* Top row: Avatar + Speaker name + Timestamp + Intent tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Avatar initial stamped token */}
          <div
            className="w-7 h-7 rounded-lg bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
            style={{
              color: speakerColor,
              border: `1px solid ${speakerColor}30`,
            }}
          >
            {initials}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-mono font-bold text-[#2d3436] uppercase text-embossed">
              {message.speaker}
            </span>
            {message.timestamp && (
              <span className="text-[10px] sm:text-[11px] font-mono text-[#4a5568]">
                [{message.timestamp}]
              </span>
            )}
          </div>
        </div>

        {/* Intent / Resolution stamped pill */}
        <div className="flex items-center gap-1.5 font-mono">
          {message.intent && (
            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-[#d1d9e6] text-[#4a5568] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff]">
              {message.intent}
            </span>
          )}
          {message.resolution_status && (
            <span
              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                message.resolution_status === 'resolved'
                  ? 'bg-[#16a34a]/15 text-[#15803d] border border-[#16a34a]/30'
                  : message.resolution_status === 'unresolved'
                  ? 'bg-[#ff4757]/15 text-[#ff4757] border border-[#ff4757]/30'
                  : 'bg-[#d97706]/15 text-[#b45309] border border-[#d97706]/30'
              }`}
            >
              {message.resolution_status}
            </span>
          )}
        </div>
      </div>

      {/* Message Text */}
      <p className="text-xs sm:text-sm font-mono leading-relaxed text-[#2d3436] pl-0 sm:pl-9 break-words">
        {message.text}
      </p>

      {/* Bottom meta row: Topic tag + GapBadge indicator */}
      <div className="mt-2.5 sm:mt-3 pl-0 sm:pl-9 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#babecc]/60 shadow-[0_1px_0_#ffffff]">
        <div className="flex items-center gap-2">
          {message.topic && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase text-[#4a5568] bg-[#d1d9e6] px-2 py-0.5 rounded shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff]">
              <Tag className="w-2.5 h-2.5 text-[#ff4757]" />
              {message.topic}
            </span>
          )}
        </div>

        {/* Gap notification */}
        {(gap || message.gapType) && (
          <div className="flex items-center gap-2">
            <GapBadge
              type={(gap ? gap.type : message.gapType) as any}
              size="sm"
              confidence={gap?.confidence}
            />
            <span className="text-[11px] font-mono font-bold text-[#ff4757] hover:underline flex items-center gap-0.5">
              INSPECT <CornerDownRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
