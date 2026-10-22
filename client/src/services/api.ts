import {
  ConversationAnalysis,
  ConversationListItem,
} from '../types/conversation';
import { analyzeConversationLocally, parseRawConversation } from './analysisEngine';
import { PRESET_ANALYSES } from '../data/demoConversations';

const API_BASE = '/api';
const LOCAL_STORAGE_KEY = 'gaplens_conversations_v1';
const ANALYSIS_PREFERENCES_STORAGE_KEY = 'gaplens_analysis_preferences_v1';

export interface AnalysisPreferences {
  temperature: number;
  confidenceThreshold: number;
  aiMode: AnalysisMode | null;
}

export type AnalysisMode = 'openrouter' | 'local';

export function getAnalysisPreferences(): AnalysisPreferences {
  try {
    const saved = localStorage.getItem(ANALYSIS_PREFERENCES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<AnalysisPreferences>;
      return {
        temperature: typeof parsed.temperature === 'number' ? parsed.temperature : 0.2,
        confidenceThreshold: typeof parsed.confidenceThreshold === 'number'
          ? parsed.confidenceThreshold
          : 0.7,
        aiMode: parsed.aiMode === 'openrouter' || parsed.aiMode === 'local'
          ? parsed.aiMode
          : 'local',
      };
    }
  } catch {
    // Use the defaults if stored preferences are unavailable or invalid.
  }

  return { temperature: 0.2, confidenceThreshold: 0.7, aiMode: 'local' };
}

export function saveAnalysisPreferences(preferences: AnalysisPreferences): void {
  localStorage.setItem(ANALYSIS_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

function applyConfidenceThreshold(
  analysis: ConversationAnalysis,
  threshold: number,
): ConversationAnalysis {
  const retainedGaps = analysis.communicationGaps.filter(gap => gap.confidence >= threshold);
  const retainedGapIds = new Set(retainedGaps.map(gap => gap.id));
  const removedGapIds = new Set(
    analysis.communicationGaps
      .filter(gap => !retainedGapIds.has(gap.id))
      .map(gap => gap.id),
  );

  return {
    ...analysis,
    communicationGaps: retainedGaps,
    messages: analysis.messages.map(message => {
      if (!message.gapId || !removedGapIds.has(message.gapId)) return message;
      return {
        ...message,
        gapId: undefined,
        gapType: undefined,
        resolution_status: message.requires_answer ? 'pending' : undefined,
      };
    }),
    summary: {
      ...analysis.summary,
      unansweredQuestionsCount: retainedGaps.filter(gap => gap.type === 'unanswered_question').length,
      repeatedClarificationsCount: retainedGaps.filter(gap => gap.type === 'repeated_clarification').length,
      unresolvedTopicsCount: retainedGaps.filter(gap => gap.type === 'unresolved_topic').length,
      partialAnswersCount: retainedGaps.filter(gap => gap.type === 'partial_answer').length,
      missedResponsesCount: retainedGaps.filter(gap => gap.type === 'missed_response').length,
      pendingFollowUpsCount: retainedGaps.filter(gap => gap.type === 'pending_follow_up').length,
      totalGaps: retainedGaps.length,
    },
    topics: analysis.topics.map(topic => {
      const topicHadGaps = analysis.communicationGaps.some(gap => gap.topic === topic.name);
      if (!topicHadGaps) return topic;
      const topicGapCount = retainedGaps.filter(gap => gap.topic === topic.name).length;
      return {
        ...topic,
        resolutionStatus: topicGapCount > 1
          ? 'unresolved'
          : topicGapCount === 1
            ? 'partially_resolved'
            : 'resolved',
      };
    }),
    healthScore: Math.max(
      25,
      Math.min(
        97,
        Math.round(100 - (retainedGaps.length * 7) + (analysis.summary.resolvedThreads * 1.5)),
      ),
    ),
  };
}

// Seed demo conversations in local store on initial load
function initializeLocalStore(): Record<string, ConversationAnalysis> {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      // ignore
    }
  }
  const initial = { ...PRESET_ANALYSES };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function getLocalConversations(): Record<string, ConversationAnalysis> {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existing) {
    return initializeLocalStore();
  }
  try {
    return JSON.parse(existing);
  } catch {
    return initializeLocalStore();
  }
}

export function saveLocalConversation(analysis: ConversationAnalysis): void {
  const current = getLocalConversations();
  current[analysis.id] = analysis;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
}

export function deleteLocalConversation(id: string): void {
  const current = getLocalConversations();
  delete current[id];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
}

// API Service
export const api = {
  // Check backend and required OpenRouter configuration.
  async checkHealth(): Promise<{
    status: string;
    mode: string;
    aiConnected: boolean;
    model?: string;
    provider?: string;
    database?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend not running or unreachable
    }
    return {
      status: 'standalone',
      mode: 'standalone',
      aiConnected: true,
      model: 'GapLens Local AI (Browser Engine)',
      provider: 'local',
      database: 'Browser Local Storage',
    };
  },

  // Analyze using the explicitly selected OpenRouter or local mode.
  async analyzeConversation(
    rawText: string,
    options?: {
      title?: string;
      aiMode: AnalysisMode | null;
      confidenceThreshold?: number;
    }
  ): Promise<ConversationAnalysis> {
    const parsed = parseRawConversation(rawText);

    if (!options?.aiMode) {
      throw new Error('Choose OpenRouter API or Local AI before starting an analysis.');
    }

    if (options.aiMode === 'local') {
      const result = analyzeConversationLocally(parsed, options.title || 'Analyzed Conversation');
      result.demoMode = false;
      result.modelUsed = 'GapLens Local AI (On-device heuristic engine)';
      const filteredResult = applyConfidenceThreshold(
        result,
        options.confidenceThreshold ?? getAnalysisPreferences().confidenceThreshold,
      );
      saveLocalConversation(filteredResult);

      // Opportunistically sync to backend in background if backend is online
      fetch(`${API_BASE}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filteredResult),
      }).catch(() => {});

      return filteredResult;
    }

    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation: parsed,
        rawText,
        title: options?.title,
        confidenceThreshold: options?.confidenceThreshold ?? 0.7,
        temperature: getAnalysisPreferences().temperature,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `Analysis request failed with status ${response.status}.`);
    }

    const result = applyConfidenceThreshold(
      await response.json(),
      options?.confidenceThreshold ?? getAnalysisPreferences().confidenceThreshold,
    );
    saveLocalConversation(result);
    return result;
  },

  // Get list of all conversations (merging backend database and local memory seamlessly)
  async getConversations(): Promise<ConversationListItem[]> {
    const itemsMap = new Map<string, ConversationListItem>();

    // 1. Load local store items first
    const localStore = getLocalConversations();
    Object.values(localStore).forEach(item => {
      itemsMap.set(item.id, {
        id: item.id,
        title: item.title,
        participantsCount: item.participantsCount,
        messagesCount: item.messagesAnalyzed,
        gapsCount: item.communicationGaps.length,
        healthScore: item.healthScore,
        createdAt: item.createdAt,
        summaryText: `${item.communicationGaps.length} gaps detected across ${item.topics.length} topics`,
      });
    });

    // 2. Fetch backend conversations if accessible and merge
    try {
      const res = await fetch(`${API_BASE}/conversations`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const backendList: ConversationListItem[] = await res.json();
        if (Array.isArray(backendList)) {
          backendList.forEach(item => {
            itemsMap.set(item.id, item);
          });
        }
      }
    } catch {
      // Backend not running, use local items
    }

    return Array.from(itemsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Get single conversation by ID
  async getConversationById(id: string): Promise<ConversationAnalysis | null> {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          saveLocalConversation(data);
          return data;
        }
      }
    } catch {
      // Fallback
    }

    const localStore = getLocalConversations();
    return localStore[id] || null;
  },

  // Update gap status (Mark Resolved, Dismiss, or Reopen)
  async updateGapStatus(
    conversationId: string,
    gapId: string,
    status: 'resolved' | 'dismissed' | 'unresolved'
  ): Promise<boolean> {
    try {
      const endpoint = status === 'resolved'
        ? 'resolve-gap'
        : status === 'dismissed'
        ? 'dismiss-gap'
        : 'reopen-gap';

      await fetch(`${API_BASE}/conversations/${conversationId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gapId }),
      });
    } catch {
      // Ignore network errors in demo/local mode
    }

    const localStore = getLocalConversations();
    const conv = localStore[conversationId];
    if (conv) {
      const targetGap = conv.communicationGaps.find(g => g.id === gapId);
      if (targetGap) {
        targetGap.status = status;
        if (status === 'resolved') {
          targetGap.resolvedAt = new Date().toISOString();
        } else {
          delete targetGap.resolvedAt;
        }
        // Recalculate health score
        const activeGaps = conv.communicationGaps.filter(g => g.status === 'unresolved').length;
        conv.healthScore = Math.min(99, Math.max(25, Math.round(100 - (activeGaps * 7))));
        saveLocalConversation(conv);
        return true;
      }
    }
    return true;
  },

  // Delete conversation
  async deleteConversation(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/conversations/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    deleteLocalConversation(id);
    return true;
  },

  // Rename conversation
  async renameConversation(id: string, newTitle: string): Promise<boolean> {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return false;

    try {
      await fetch(`${API_BASE}/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      });
    } catch {
      // ignore network errors
    }

    const localStore = getLocalConversations();
    if (localStore[id]) {
      localStore[id].title = trimmedTitle;
      saveLocalConversation(localStore[id]);
      return true;
    }
    return true;
  },
};
