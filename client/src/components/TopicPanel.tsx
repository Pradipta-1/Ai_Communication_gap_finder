import React from 'react';
import { TopicInfo } from '../types/conversation';
import { Layers, MessageSquare, HelpCircle, Users } from 'lucide-react';

interface TopicPanelProps {
  topics: TopicInfo[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
}

export const TopicPanel: React.FC<TopicPanelProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
}) => {
  return (
    <div className="relative p-6 bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] rounded-2xl corner-screws border border-[#ffffff]/40 space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#ff4757]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
            TOPIC CLUSTERS
          </h3>
        </div>
        {selectedTopic && (
          <button
            onClick={() => onSelectTopic(null)}
            className="text-[10px] font-mono font-bold uppercase text-[#ff4757] hover:underline"
          >
            [CLEAR FILTER]
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {topics.map(topic => {
          const isSelected = selectedTopic === topic.name;

          return (
            <div
              key={topic.name}
              onClick={() => onSelectTopic(isSelected ? null : topic.name)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-150 group border ${
                isSelected
                  ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] border-[#ff4757]/60'
                  : 'bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] border-[#ffffff]/50 hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff]'
              }`}
            >
              {/* Header: Name + Percentage */}
              <div className="flex items-center justify-between text-xs mb-2 font-mono">
                <span className="font-bold text-[#2d3436] truncate max-w-[200px] uppercase text-embossed">
                  {topic.name}
                </span>
                <span className="text-[#ff4757] font-extrabold">
                  {topic.percentage}%
                </span>
              </div>

              {/* Recessed track with raised physical bar */}
              <div className="w-full h-2 bg-[#d1d9e6] rounded-full shadow-[inset_1px_1px_3px_#babecc,inset_-1px_-1px_3px_#ffffff] overflow-hidden mb-3 p-0.5">
                <div
                  className="h-full bg-[#ff4757] rounded-full shadow-[1px_1px_2px_rgba(166,50,60,0.5)] transition-all duration-300"
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-[#4a5568] pt-2 border-t border-[#babecc]/50 shadow-[0_1px_0_#ffffff]">
                <span className="flex items-center gap-1 font-bold">
                  <MessageSquare className="w-3 h-3 text-[#0284c7]" />
                  {topic.messageCount} MSGS
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <HelpCircle className="w-3 h-3 text-[#d97706]" />
                  {topic.questionsCount} QS
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <Users className="w-3 h-3 text-[#7c3aed]" />
                  {topic.participants.length} USERS
                </span>
              </div>

              {/* Status pill */}
              <div className="mt-2.5 flex items-center justify-between font-mono">
                <span className="text-[9px] uppercase font-bold text-[#4a5568]">
                  STATE
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),1px_1px_2px_rgba(186,190,204,0.5)] ${
                    topic.resolutionStatus === 'resolved'
                      ? 'bg-[#16a34a]/15 text-[#15803d]'
                      : topic.resolutionStatus === 'unresolved'
                      ? 'bg-[#ff4757]/15 text-[#ff4757]'
                      : 'bg-[#d97706]/15 text-[#b45309]'
                  }`}
                >
                  {topic.resolutionStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
