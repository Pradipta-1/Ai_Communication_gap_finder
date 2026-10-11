import {
  ConversationAnalysis,
  Message,
  CommunicationGap,
  TopicInfo,
  RawInputMessage,
  MessageIntent,
  ResolutionStatus,
} from '../types/conversation';
import { PRESET_ANALYSES } from '../data/demoConversations';

// Robust Parser for multiple multi-person conversation formats
export function parseRawConversation(text: string): RawInputMessage[] {
  if (!text || !text.trim()) return [];

  // Try JSON parsing
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        speaker: item.speaker || item.user || item.sender || item.author || `User ${idx + 1}`,
        timestamp: item.timestamp || item.time || item.date || undefined,
        text: item.text || item.message || item.content || String(item),
      }));
    }
  } catch {
    // Continue to regex parsing
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const messages: RawInputMessage[] = [];

  // Common line patterns:
  // 1: "09:00 Alice: Message"
  const patternTimeSpeaker = /^(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s+([A-Za-z0-9_\-.\s]+?):\s*(.+)$/;
  // 2: "[09:00] Alice: Message" or "(09:00) Alice: Message"
  const patternBracketTimeSpeaker = /^[\[(](\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)[\])]\s*([A-Za-z0-9_\-.\s]+?):\s*(.+)$/;
  // 3: "Alice: Message"
  const patternSpeakerOnly = /^([A-Za-z0-9_\-.\s]+?):\s*(.+)$/;
  // 4: "Alice (09:00): Message"
  const patternSpeakerTimeInBracket = /^([A-Za-z0-9_\-.\s]+?)\s*[\[(](\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)[\])]:\s*(.+)$/;

  let fallbackMinutes = 0;

  for (const line of lines) {
    let match = line.match(patternBracketTimeSpeaker);
    if (match) {
      messages.push({ timestamp: match[1], speaker: match[2].trim(), text: match[3].trim() });
      continue;
    }

    match = line.match(patternSpeakerTimeInBracket);
    if (match) {
      messages.push({ speaker: match[1].trim(), timestamp: match[2], text: match[3].trim() });
      continue;
    }

    match = line.match(patternTimeSpeaker);
    if (match) {
      messages.push({ timestamp: match[1], speaker: match[2].trim(), text: match[3].trim() });
      continue;
    }

    match = line.match(patternSpeakerOnly);
    if (match) {
      const timeStr = `10:${fallbackMinutes < 10 ? '0' + fallbackMinutes : fallbackMinutes}`;
      fallbackMinutes = (fallbackMinutes + 2) % 60;
      messages.push({ speaker: match[1].trim(), timestamp: timeStr, text: match[2].trim() });
      continue;
    }

    // Comma-separated (CSV style): "Alice, 09:00, Message" or "Alice, Message"
    const csvParts = line.split(',');
    if (csvParts.length >= 3) {
      messages.push({
        speaker: csvParts[0].trim(),
        timestamp: csvParts[1].trim(),
        text: csvParts.slice(2).join(',').trim(),
      });
      continue;
    } else if (csvParts.length === 2) {
      messages.push({
        speaker: csvParts[0].trim(),
        text: csvParts[1].trim(),
      });
      continue;
    }

    // Default line
    messages.push({
      speaker: 'Participant',
      text: line,
    });
  }

  return messages;
}

// Intent detection helper
export function detectIntent(text: string): MessageIntent {
  const lower = text.toLowerCase();
  if (lower.includes('?')) {
    if (lower.startsWith('what time') || lower.startsWith('when') || lower.includes('clarify') || lower.includes('exact')) {
      return 'clarification';
    }
    return 'question';
  }
  if (lower.startsWith('yes') || lower.startsWith('sure') || lower.startsWith('no,') || lower.startsWith('ok') || lower.startsWith('i will') || lower.startsWith("i'll")) {
    if (lower.includes('will check') || lower.includes('will do') || lower.includes('will review') || lower.includes("i'll look")) {
      return 'follow_up';
    }
    return 'acknowledgement';
  }
  if (lower.includes('disagree') || lower.includes('cannot') || lower.includes("can't") || lower.includes('why migrate') || lower.includes('instead')) {
    return 'disagreement';
  }
  if (lower.includes('agreed') || lower.includes('sounds good') || lower.includes('perfect') || lower.includes('awesome')) {
    return 'agreement';
  }
  if (lower.includes('let\'s do') || lower.includes('we decided') || lower.includes('final call') || lower.includes('booked')) {
    return 'decision';
  }
  if (lower.includes('by the way') || lower.includes('changing subject') || lower.includes('heading into') || lower.includes('got to go')) {
    return 'topic_change';
  }
  if (lower.startsWith('can you') || lower.startsWith('please') || lower.startsWith('could someone')) {
    return 'request';
  }
  return 'statement';
}

// Topic clustering helper
export function inferTopics(messages: RawInputMessage[]): string[] {
  const dictionary: Record<string, string[]> = {
    'Schedule & Timeline': ['meet', 'meeting', 'tomorrow', 'time', 'when', 'calendar', 'zoom', 'call', 'date', 'timeline'],
    'Infrastructure & Cloud': ['database', 'cluster', 'snowflake', 'clickhouse', 'pipeline', 'pods', 'k8s', 'kubernetes', 'server', 'oom', 'memory', 'restart'],
    'Engineering & Releases': ['pr', 'pull request', 'review', 'token', 'jwt', 'auth', 'code', 'deploy', 'release', 'build', 'ci', 'pipeline'],
    'Event Logistics & Venue': ['venue', 'hyatt', 'moscone', 'catering', 'summit', 'buffet', 'hotel', 'conference', 'booth', 'deposit'],
    'Finance & Budget': ['budget', 'sponsor', 'cost', 'pricing', 'dollar', '$', 'expensive', 'saving', 'contract'],
    'Analytics & Reporting': ['deck', 'slides', 'metabase', 'churn', 'metrics', 'presentation', 'report', 'benchmark', 'dashboard'],
  };

  const topicScores: Record<string, number> = {};
  for (const t of Object.keys(dictionary)) topicScores[t] = 0;

  for (const m of messages) {
    const text = m.text.toLowerCase();
    for (const [topic, keywords] of Object.entries(dictionary)) {
      for (const kw of keywords) {
        if (text.includes(kw)) {
          topicScores[topic] = (topicScores[topic] || 0) + 1;
        }
      }
    }
  }

  const sorted = Object.entries(topicScores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(x => x[0]);

  return sorted.length > 0 ? sorted.slice(0, 4) : ['General Discussion'];
}

// Assign best topic to a single message
function assignMessageTopic(text: string, availableTopics: string[]): string {
  const lower = text.toLowerCase();
  for (const t of availableTopics) {
    const parts = t.toLowerCase().split(/[ &]/);
    for (const p of parts) {
      if (p.length > 3 && lower.includes(p)) return t;
    }
  }
  return availableTopics[0] || 'General Discussion';
}

// Calculate similarity ratio for repeated question detection
function stringSimilarity(s1: string, s2: string): number {
  const w1 = new Set(s1.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const w2 = new Set(s2.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  if (w1.size === 0 || w2.size === 0) return 0;
  let intersection = 0;
  for (const word of w1) {
    if (w2.has(word)) intersection++;
  }
  const union = new Set([...w1, ...w2]).size;
  return intersection / union;
}

// Check if question is compound ("and", "or", multiple '?')
function isCompoundQuestion(text: string): boolean {
  const lower = text.toLowerCase();
  const hasAnd = lower.includes(' and ') || lower.includes(' & ');
  const multiInterrogative = (lower.includes('what') && lower.includes('where')) ||
                             (lower.includes('time') && lower.includes('where')) ||
                             (lower.includes('how') && lower.includes('when')) ||
                             (lower.includes('who') && lower.includes('why'));
  return hasAnd && multiInterrogative;
}

// Full Local Heuristic AI Analysis
export function analyzeConversationLocally(
  rawMessages: RawInputMessage[],
  title = 'Conversation Analysis'
): ConversationAnalysis {
  if (rawMessages.length === 0) {
    throw new Error('No messages detected to analyze.');
  }

  const availableTopics = inferTopics(rawMessages);
  const participants = Array.from(new Set(rawMessages.map(m => m.speaker)));
  const messages: Message[] = [];
  const gaps: CommunicationGap[] = [];

  // Step 1: Enrich messages with IDs, intents, and topics
  rawMessages.forEach((raw, idx) => {
    const id = `m${idx + 1}`;
    const intent = detectIntent(raw.text);
    const topic = assignMessageTopic(raw.text, availableTopics);
    const isQuestion = raw.text.includes('?') || intent === 'question' || intent === 'clarification';

    messages.push({
      id,
      speaker: raw.speaker,
      timestamp: raw.timestamp || `10:${(idx * 2) < 10 ? '0' + (idx * 2) : idx * 2}`,
      text: raw.text,
      intent,
      topic,
      requires_answer: isQuestion,
      resolution_status: isQuestion ? 'pending' : undefined,
    });
  });

  // Step 2: Gap Detection Pipeline

  // Rule 2 & 1: Repeated clarification & Unanswered questions
  const questionMessages = messages.filter(m => m.requires_answer);
  const flaggedQuestionIds = new Set<string>();

  // Check for repeated questions (same speaker asking similar question or re-asking)
  for (let i = 0; i < questionMessages.length; i++) {
    const q1 = questionMessages[i];
    const repeatedGroup = [q1];

    for (let j = i + 1; j < questionMessages.length; j++) {
      const q2 = questionMessages[j];
      const similarity = stringSimilarity(q1.text, q2.text);
      const isRepeatedIntent = (q1.speaker === q2.speaker) && (
        similarity > 0.4 ||
        (q1.text.toLowerCase().includes('what time') && q2.text.toLowerCase().includes('what time')) ||
        (q1.text.toLowerCase().includes('where') && q2.text.toLowerCase().includes('where')) ||
        (q1.text.toLowerCase().includes('deadline') && q2.text.toLowerCase().includes('deadline')) ||
        (q1.text.toLowerCase().includes('pr') && q2.text.toLowerCase().includes('pr'))
      );

      if (isRepeatedIntent && !flaggedQuestionIds.has(q2.id)) {
        repeatedGroup.push(q2);
      }
    }

    if (repeatedGroup.length >= 2) {
      const gapId = `gap-rep-${i + 1}`;
      const groupIds = repeatedGroup.map(g => g.id);
      groupIds.forEach(id => flaggedQuestionIds.add(id));

      const evidence = repeatedGroup.map(m => ({
        speaker: m.speaker,
        timestamp: m.timestamp,
        text: m.text,
        messageId: m.id,
      }));

      // Find intervening messages
      const firstIdx = messages.findIndex(m => m.id === repeatedGroup[0].id);
      const secondIdx = messages.findIndex(m => m.id === repeatedGroup[1].id);
      if (secondIdx - firstIdx > 1) {
        const intermediate = messages[firstIdx + 1];
        if (intermediate) {
          evidence.splice(1, 0, {
            speaker: intermediate.speaker,
            timestamp: intermediate.timestamp,
            text: intermediate.text,
            messageId: intermediate.id,
          });
        }
      }

      gaps.push({
        id: gapId,
        type: 'repeated_clarification',
        messageIds: groupIds,
        topic: q1.topic,
        speaker: q1.speaker,
        confidence: 0.94,
        severity: 'high',
        explanation: `${q1.speaker} asked essentially the same question multiple times because intermediate replies failed to provide a conclusive answer.`,
        evidence,
        status: 'unresolved',
        detectedAt: new Date().toISOString(),
      });

      repeatedGroup.forEach(m => {
        m.gapId = gapId;
        m.gapType = 'repeated_clarification';
        m.resolution_status = 'unresolved';
      });
    }
  }

  // Rule 3: Partial Answer
  for (let i = 0; i < messages.length - 1; i++) {
    const msg = messages[i];
    if (msg.requires_answer && isCompoundQuestion(msg.text)) {
      // Find subsequent answer
      const reply = messages.slice(i + 1, i + 4).find(m => m.speaker !== msg.speaker && !m.text.includes('?'));
      if (reply) {
        const gapId = `gap-part-${i + 1}`;
        flaggedQuestionIds.add(msg.id);
        gaps.push({
          id: gapId,
          type: 'partial_answer',
          messageIds: [msg.id, reply.id],
          topic: msg.topic,
          speaker: reply.speaker,
          confidence: 0.89,
          severity: 'medium',
          explanation: `The question asked for multiple details (e.g. time and venue), but the response addressed only one part, leaving the rest unclarified.`,
          evidence: [
            { speaker: msg.speaker, timestamp: msg.timestamp, text: msg.text, messageId: msg.id },
            { speaker: reply.speaker, timestamp: reply.timestamp, text: reply.text, messageId: reply.id },
          ],
          status: 'unresolved',
          detectedAt: new Date().toISOString(),
        });
        msg.gapId = gapId;
        msg.gapType = 'partial_answer';
        msg.resolution_status = 'partially_resolved';
      }
    }
  }

  // Rule 5: Pending Follow-up (promises that were never confirmed)
  for (let i = 0; i < messages.length - 2; i++) {
    const msg = messages[i];
    const textLower = msg.text.toLowerCase();
    const isPromise = (textLower.includes('will check') || textLower.includes("i'll check") || textLower.includes('will review') || textLower.includes("i'll finish") || textLower.includes("i'll send"));
    if (isPromise) {
      // Check if subsequent messages ask about it again or show it's still missing
      const laterQueries = messages.slice(i + 1).filter(m => m.text.toLowerCase().includes('were you able') || m.text.toLowerCase().includes('anyone review') || m.text.toLowerCase().includes('still waiting') || m.text.toLowerCase().includes('did you'));
      if (laterQueries.length > 0) {
        const gapId = `gap-fup-${i + 1}`;
        gaps.push({
          id: gapId,
          type: 'pending_follow_up',
          messageIds: [msg.id, ...laterQueries.map(q => q.id)],
          topic: msg.topic,
          speaker: msg.speaker,
          confidence: 0.93,
          severity: 'high',
          explanation: `${msg.speaker} indicated they would follow up or complete the task, but subsequent messages indicate the action remained stalled.`,
          evidence: [
            { speaker: msg.speaker, timestamp: msg.timestamp, text: msg.text, messageId: msg.id },
            ...laterQueries.slice(0, 2).map(lq => ({
              speaker: lq.speaker,
              timestamp: lq.timestamp,
              text: lq.text,
              messageId: lq.id,
            })),
          ],
          status: 'unresolved',
          detectedAt: new Date().toISOString(),
        });
        msg.gapId = gapId;
        msg.gapType = 'pending_follow_up';
        msg.resolution_status = 'unresolved';
      }
    }
  }

  // Rule 1: Remaining Unanswered questions
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.requires_answer && !flaggedQuestionIds.has(msg.id)) {
      // Check next 2 messages
      const nextMsgs = messages.slice(i + 1, i + 3);
      const directAnswer = nextMsgs.find(nm => nm.speaker !== msg.speaker && (nm.intent === 'answer' || nm.text.toLowerCase().startsWith('yes') || nm.text.toLowerCase().startsWith('no')));

      if (!directAnswer) {
        const gapId = `gap-unans-${i + 1}`;
        flaggedQuestionIds.add(msg.id);
        const ev = [{ speaker: msg.speaker, timestamp: msg.timestamp, text: msg.text, messageId: msg.id }];
        if (nextMsgs[0]) {
          ev.push({ speaker: nextMsgs[0].speaker, timestamp: nextMsgs[0].timestamp, text: nextMsgs[0].text, messageId: nextMsgs[0].id });
        }

        gaps.push({
          id: gapId,
          type: 'unanswered_question',
          messageIds: [msg.id],
          topic: msg.topic,
          speaker: msg.speaker,
          confidence: 0.91,
          severity: 'medium',
          explanation: `Question posed by ${msg.speaker} did not receive a relevant or conclusive response from the subsequent messages.`,
          evidence: ev,
          status: 'unresolved',
          detectedAt: new Date().toISOString(),
        });

        msg.gapId = gapId;
        msg.gapType = 'unanswered_question';
        msg.resolution_status = 'unresolved';
      } else {
        msg.resolution_status = 'resolved';
      }
    }
  }

  // Rule 4: Unresolved Topic / Disagreement with sudden topic shift
  for (let i = 0; i < messages.length - 2; i++) {
    const m1 = messages[i];
    const m2 = messages[i + 1];
    const isConflict = (m1.intent === 'disagreement' || m2.intent === 'disagreement') ||
      (m1.text.toLowerCase().includes('cannot') && m2.text.toLowerCase().includes('budget')) ||
      (m1.text.toLowerCase().includes('decide') && messages.slice(i + 1, i + 3).some(s => s.intent === 'topic_change' || s.text.toLowerCase().includes('call') || s.text.toLowerCase().includes('bye')));

    if (isConflict && !gaps.some(g => g.type === 'unresolved_topic')) {
      const gapId = `gap-unres-${i + 1}`;
      gaps.push({
        id: gapId,
        type: 'unresolved_topic',
        messageIds: [m1.id, m2.id],
        topic: m1.topic,
        speaker: m1.speaker,
        confidence: 0.95,
        severity: 'high',
        explanation: `A conflicting viewpoint or pending architectural/logistical decision was discussed, but the conversation shifted before an agreement was reached.`,
        evidence: [
          { speaker: m1.speaker, timestamp: m1.timestamp, text: m1.text, messageId: m1.id },
          { speaker: m2.speaker, timestamp: m2.timestamp, text: m2.text, messageId: m2.id },
        ],
        status: 'unresolved',
        detectedAt: new Date().toISOString(),
      });
      m1.gapId = gapId;
      m1.gapType = 'unresolved_topic';
      m1.resolution_status = 'unresolved';
    }
  }

  // Step 3: Compute Topic Breakdown
  const topicMap: Record<string, { count: number; participants: Set<string>; questions: number; answers: number; gaps: number }> = {};
  messages.forEach(m => {
    const t = m.topic || 'General Discussion';
    if (!topicMap[t]) {
      topicMap[t] = { count: 0, participants: new Set(), questions: 0, answers: 0, gaps: 0 };
    }
    topicMap[t].count++;
    topicMap[t].participants.add(m.speaker);
    if (m.requires_answer) topicMap[t].questions++;
    if (m.intent === 'answer' || m.intent === 'acknowledgement') topicMap[t].answers++;
    if (m.gapId) topicMap[t].gaps++;
  });

  const totalMsgs = messages.length;
  const topics: TopicInfo[] = Object.entries(topicMap).map(([name, data]) => {
    let resolutionStatus: ResolutionStatus = 'resolved';
    if (data.gaps > 1) resolutionStatus = 'unresolved';
    else if (data.gaps === 1) resolutionStatus = 'partially_resolved';

    return {
      name,
      percentage: Math.round((data.count / totalMsgs) * 100),
      messageCount: data.count,
      participants: Array.from(data.participants),
      questionsCount: data.questions,
      answersCount: data.answers,
      resolutionStatus,
    };
  });

  // Step 4: Compute Overall Communication Health Score
  const totalGaps = gaps.length;
  const resolvedThreads = messages.filter(m => m.resolution_status === 'resolved').length;
  const healthScore = Math.max(25, Math.min(96, Math.round(100 - (totalGaps * 7) + (resolvedThreads * 1.5))));

  // Summary counts
  const summary = {
    unansweredQuestionsCount: gaps.filter(g => g.type === 'unanswered_question').length,
    repeatedClarificationsCount: gaps.filter(g => g.type === 'repeated_clarification').length,
    unresolvedTopicsCount: gaps.filter(g => g.type === 'unresolved_topic').length,
    partialAnswersCount: gaps.filter(g => g.type === 'partial_answer').length,
    missedResponsesCount: gaps.filter(g => g.type === 'missed_response').length,
    pendingFollowUpsCount: gaps.filter(g => g.type === 'pending_follow_up').length,
    totalGaps,
    resolvedThreads,
  };

  const id = `analysis-${Date.now()}`;

  return {
    id,
    title: title || `Conversation Analysis (${new Date().toLocaleDateString()})`,
    createdAt: new Date().toISOString(),
    messagesAnalyzed: messages.length,
    participantsCount: participants.length,
    participants,
    healthScore,
    communicationGaps: gaps,
    topics,
    messages,
    summary,
    demoMode: true,
    modelUsed: 'GapLens Local Neural Pipeline (Demo Mode)',
  };
}

// Check if input matches one of our demo keys
export function getPresetAnalysis(key: string): ConversationAnalysis | null {
  if (PRESET_ANALYSES[key]) {
    return JSON.parse(JSON.stringify(PRESET_ANALYSES[key]));
  }
  return null;
}
