import { GapType } from '../types/conversation';

export function getGapMeta(type: GapType) {
  switch (type) {
    case 'unanswered_question':
      return {
        label: 'Unanswered Question',
        shortLabel: 'Unanswered',
        color: '#ff4757', // Safety Orange / Braun Red
        bgClass: 'bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),2px_2px_4px_rgba(186,190,204,0.5)]',
        glowClass: 'shadow-[0_0_8px_rgba(255,71,87,0.5)]',
        iconName: 'AlertCircle',
      };
    case 'repeated_clarification':
      return {
        label: 'Repeated Clarification',
        shortLabel: 'Repeated',
        color: '#d97706', // Machine Amber
        bgClass: 'bg-[#d97706]/10 text-[#b45309] border-[#d97706]/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),2px_2px_4px_rgba(186,190,204,0.5)]',
        glowClass: 'shadow-[0_0_8px_rgba(217,119,6,0.5)]',
        iconName: 'RefreshCw',
      };
    case 'unresolved_topic':
      return {
        label: 'Unresolved Topic',
        shortLabel: 'Unresolved',
        color: '#7c3aed', // Technical Violet
        bgClass: 'bg-[#7c3aed]/10 text-[#6d28d9] border-[#7c3aed]/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),2px_2px_4px_rgba(186,190,204,0.5)]',
        glowClass: 'shadow-[0_0_8px_rgba(124,58,237,0.5)]',
        iconName: 'GitBranch',
      };
    case 'partial_answer':
      return {
        label: 'Partial Answer',
        shortLabel: 'Partial',
        color: '#0284c7', // Blueprint Cyan
        bgClass: 'bg-[#0284c7]/10 text-[#0369a1] border-[#0284c7]/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),2px_2px_4px_rgba(186,190,204,0.5)]',
        glowClass: 'shadow-[0_0_8px_rgba(2,132,199,0.5)]',
        iconName: 'PieChart',
      };
    case 'pending_follow_up':
      return {
        label: 'Pending Follow-up',
        shortLabel: 'Follow-up',
        color: '#16a34a', // Status Green
        bgClass: 'bg-[#16a34a]/10 text-[#15803d] border-[#16a34a]/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),2px_2px_4px_rgba(186,190,204,0.5)]',
        glowClass: 'shadow-[0_0_8px_rgba(22,163,74,0.5)]',
        iconName: 'Clock',
      };
    case 'missed_response':
    default:
      return {
        label: 'Missed Response',
        shortLabel: 'Missed',
        color: '#c026d3', // Magenta
        bgClass: 'bg-[#c026d3]/10 text-[#a21caf] border-[#c026d3]/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),2px_2px_4px_rgba(186,190,204,0.5)]',
        glowClass: 'shadow-[0_0_8px_rgba(192,38,211,0.5)]',
        iconName: 'MessageSquareX',
      };
  }
}

// Deterministic speaker color for physical indicator tags
const SPEAKER_COLORS = [
  '#ff4757', // Safety Orange
  '#0284c7', // Cyan
  '#16a34a', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#2563eb', // Blue
  '#0d9488', // Teal
  '#e11d48', // Rose
];

export function getSpeakerColor(speaker: string): string {
  let hash = 0;
  for (let i = 0; i < speaker.length; i++) {
    hash = speaker.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SPEAKER_COLORS.length;
  return SPEAKER_COLORS[index];
}
