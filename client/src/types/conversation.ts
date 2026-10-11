export type GapType =
  | 'unanswered_question'
  | 'repeated_clarification'
  | 'partial_answer'
  | 'unresolved_topic'
  | 'missed_response'
  | 'pending_follow_up';

export type GapStatus = 'unresolved' | 'resolved' | 'dismissed';

export type ResolutionStatus = 'resolved' | 'partially_resolved' | 'unresolved' | 'pending';

export type MessageIntent =
  | 'question'
  | 'answer'
  | 'clarification'
  | 'statement'
  | 'request'
  | 'acknowledgement'
  | 'agreement'
  | 'disagreement'
  | 'decision'
  | 'follow_up'
  | 'topic_change';

export interface EvidenceItem {
  speaker: string;
  timestamp?: string;
  text: string;
  messageId?: string;
}

export interface Message {
  id: string;
  speaker: string;
  timestamp?: string;
  text: string;
  intent?: MessageIntent | string;
  topic?: string;
  requires_answer?: boolean;
  question_target?: string;
  resolution_status?: ResolutionStatus;
  gapId?: string;
  gapType?: GapType;
}

export interface CommunicationGap {
  id: string;
  type: GapType;
  messageIds: string[];
  topic?: string;
  speaker?: string;
  confidence: number;
  severity?: 'low' | 'medium' | 'high';
  explanation: string;
  evidence: EvidenceItem[];
  status: GapStatus;
  detectedAt?: string;
  resolvedAt?: string;
}

export interface TopicInfo {
  name: string;
  percentage: number;
  messageCount: number;
  participants: string[];
  questionsCount: number;
  answersCount: number;
  resolutionStatus: ResolutionStatus;
}

export interface AnalysisSummary {
  unansweredQuestionsCount: number;
  repeatedClarificationsCount: number;
  unresolvedTopicsCount: number;
  partialAnswersCount: number;
  missedResponsesCount: number;
  pendingFollowUpsCount: number;
  totalGaps: number;
  resolvedThreads: number;
}

export interface ConversationAnalysis {
  id: string;
  title: string;
  createdAt: string;
  messagesAnalyzed: number;
  participantsCount: number;
  participants: string[];
  healthScore: number; // 0 - 100
  communicationGaps: CommunicationGap[];
  topics: TopicInfo[];
  messages: Message[];
  summary: AnalysisSummary;
  demoMode?: boolean;
  modelUsed?: string;
}

export interface ConversationListItem {
  id: string;
  title: string;
  participantsCount: number;
  messagesCount: number;
  gapsCount: number;
  healthScore: number;
  createdAt: string;
  summaryText?: string;
}

export interface RawInputMessage {
  speaker: string;
  timestamp?: string;
  text: string;
}
