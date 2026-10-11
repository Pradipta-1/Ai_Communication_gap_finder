import React from 'react';
import { GapType } from '../types/conversation';
import { getGapMeta } from '../utils/colors';
import { AlertCircle, RefreshCw, GitBranch, PieChart, Clock, MessageSquareX } from 'lucide-react';

interface GapBadgeProps {
  type: GapType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  confidence?: number;
  className?: string;
  onClick?: () => void;
}

export const GapBadge: React.FC<GapBadgeProps> = ({
  type,
  showIcon = true,
  size = 'md',
  confidence,
  className = '',
  onClick,
}) => {
  const meta = getGapMeta(type);

  const getIcon = () => {
    const props = { className: size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5' };
    switch (type) {
      case 'unanswered_question':
        return <AlertCircle {...props} />;
      case 'repeated_clarification':
        return <RefreshCw {...props} />;
      case 'unresolved_topic':
        return <GitBranch {...props} />;
      case 'partial_answer':
        return <PieChart {...props} />;
      case 'pending_follow_up':
        return <Clock {...props} />;
      default:
        return <MessageSquareX {...props} />;
    }
  };

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3.5 py-1.5 gap-2',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-md border transition-all duration-150 ${meta.bgClass} ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:brightness-95 active:translate-y-[1px]' : ''} ${className}`}
    >
      {showIcon && getIcon()}
      <span>{size === 'sm' ? meta.shortLabel : meta.label}</span>
      {confidence !== undefined && (
        <span className="opacity-80 font-mono text-[9px] ml-0.5 border-l border-current/30 pl-1">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
};
