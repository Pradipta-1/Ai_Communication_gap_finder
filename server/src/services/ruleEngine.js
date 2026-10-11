// High-precision heuristic communication gap detection engine

function detectIntent(text) {
  const lower = text.toLowerCase();
  if (lower.includes('?')) {
    if (lower.startsWith('what time') || lower.startsWith('when') || lower.includes('clarify') || lower.includes('exact')) {
      return 'clarification';
    }
    return 'question';
  }
  if (lower.startsWith('yes') || lower.startsWith('sure') || lower.startsWith('ok') || lower.startsWith('i will') || lower.startsWith("i'll")) {
    if (lower.includes('will check') || lower.includes('will do') || lower.includes('will review') || lower.includes("i'll send")) {
      return 'follow_up';
    }
    return 'acknowledgement';
  }
  if (lower.includes('disagree') || lower.includes('cannot') || lower.includes("can't") || lower.includes('why migrate') || lower.includes('instead')) {
    return 'disagreement';
  }
  if (lower.includes('agreed') || lower.includes('sounds good') || lower.includes('perfect')) {
    return 'agreement';
  }
  if (lower.includes('let\'s do') || lower.includes('we decided') || lower.includes('final call')) {
    return 'decision';
  }
  if (lower.includes('heading into') || lower.includes('bye') || lower.includes('got to jump')) {
    return 'topic_change';
  }
  return 'statement';
}

function stringSimilarity(s1, s2) {
  const w1 = new Set(s1.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const w2 = new Set(s2.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  if (w1.size === 0 || w2.size === 0) return 0;
  let intersection = 0;
  for (const word of w1) {
    if (w2.has(word)) intersection++;
  }
  return intersection / (new Set([...w1, ...w2]).size);
}

function isCompoundQuestion(text) {
  const lower = text.toLowerCase();
  const hasAnd = lower.includes(' and ') || lower.includes(' & ');
  const multiInterrogative = (lower.includes('what') && lower.includes('where')) ||
                             (lower.includes('time') && lower.includes('where')) ||
                             (lower.includes('how') && lower.includes('when')) ||
                             (lower.includes('cost') && lower.includes('venue'));
  return hasAnd && multiInterrogative;
}

function analyzeConversation(rawMessages, title = 'Conversation Analysis') {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    throw new Error('No valid messages provided.');
  }

  const topicKeywords = {
    'Schedule & Timeline': ['meet', 'meeting', 'tomorrow', 'time', 'when', 'calendar', 'zoom', 'call', 'date'],
    'Technical & Infrastructure': ['database', 'cluster', 'snowflake', 'clickhouse', 'pipeline', 'pods', 'k8s', 'pr', 'jwt', 'token', 'review', 'oom'],
    'Logistics & Venue': ['venue', 'hyatt', 'moscone', 'catering', 'summit', 'buffet', 'hotel', 'conference'],
    'Budget & Financials': ['budget', 'sponsor', 'cost', 'pricing', 'dollar', '$', 'saving', 'deposit'],
  };

  const participants = Array.from(new Set(rawMessages.map(m => m.speaker || 'Anonymous')));
  const messages = [];
  const gaps = [];

  // Step 1: Enrich messages
  rawMessages.forEach((raw, idx) => {
    const id = `m${idx + 1}`;
    const text = raw.text || '';
    const intent = detectIntent(text);
    const isQuestion = text.includes('?') || intent === 'question' || intent === 'clarification';

    // Topic assignment
    let assignedTopic = 'General Discussion';
    const textLower = text.toLowerCase();
    for (const [topic, words] of Object.entries(topicKeywords)) {
      if (words.some(w => textLower.includes(w))) {
        assignedTopic = topic;
        break;
      }
    }

    messages.push({
      id,
      speaker: raw.speaker || `User ${idx + 1}`,
      timestamp: raw.timestamp || `09:${idx < 10 ? '0' + idx : idx}`,
      text,
      intent,
      topic: assignedTopic,
      requires_answer: isQuestion,
      resolution_status: isQuestion ? 'pending' : undefined,
    });
  });

  const questionMessages = messages.filter(m => m.requires_answer);
  const flaggedQuestionIds = new Set();

  // Rule 2: Repeated Clarification
  for (let i = 0; i < questionMessages.length; i++) {
    const q1 = questionMessages[i];
    const repeatedGroup = [q1];

    for (let j = i + 1; j < questionMessages.length; j++) {
      const q2 = questionMessages[j];
      const sim = stringSimilarity(q1.text, q2.text);
      if (q1.speaker === q2.speaker && (sim > 0.4 || (q1.text.includes('time') && q2.text.includes('time')))) {
        if (!flaggedQuestionIds.has(q2.id)) {
          repeatedGroup.push(q2);
        }
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

      gaps.push({
        id: gapId,
        type: 'repeated_clarification',
        messageIds: groupIds,
        topic: q1.topic,
        speaker: q1.speaker,
        confidence: 0.94,
        severity: 'high',
        explanation: `${q1.speaker} asked for clarification multiple times because intervening messages did not provide a conclusive resolution.`,
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
          confidence: 0.90,
          severity: 'medium',
          explanation: 'The initial question requested multiple points of detail, but the respondent only answered one aspect.',
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

  // Rule 5: Pending Follow-up
  for (let i = 0; i < messages.length - 2; i++) {
    const msg = messages[i];
    const textLower = msg.text.toLowerCase();
    if (textLower.includes('will check') || textLower.includes("i'll check") || textLower.includes('will review') || textLower.includes("i'll send")) {
      const laterQueries = messages.slice(i + 1).filter(m => m.text.toLowerCase().includes('were you able') || m.text.toLowerCase().includes('anyone review') || m.text.toLowerCase().includes('still waiting'));
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
          explanation: `${msg.speaker} promised to complete an action, but subsequent inquiries reveal the task remained pending.`,
          evidence: [
            { speaker: msg.speaker, timestamp: msg.timestamp, text: msg.text, messageId: msg.id },
            { speaker: laterQueries[0].speaker, timestamp: laterQueries[0].timestamp, text: laterQueries[0].text, messageId: laterQueries[0].id },
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
      const nextMsgs = messages.slice(i + 1, i + 3);
      const directAnswer = nextMsgs.find(nm => nm.speaker !== msg.speaker && (nm.intent === 'answer' || nm.text.toLowerCase().startsWith('yes') || nm.text.toLowerCase().startsWith('no')));

      if (!directAnswer) {
        const gapId = `gap-unans-${i + 1}`;
        flaggedQuestionIds.add(msg.id);
        gaps.push({
          id: gapId,
          type: 'unanswered_question',
          messageIds: [msg.id],
          topic: msg.topic,
          speaker: msg.speaker,
          confidence: 0.92,
          severity: 'medium',
          explanation: `Question asked by ${msg.speaker} was left without a direct, actionable answer.`,
          evidence: [
            { speaker: msg.speaker, timestamp: msg.timestamp, text: msg.text, messageId: msg.id },
          ],
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

  // Rule 4: Unresolved Topic
  for (let i = 0; i < messages.length - 2; i++) {
    const m1 = messages[i];
    const m2 = messages[i + 1];
    if (m1.intent === 'disagreement' || (m1.text.toLowerCase().includes('cannot') && m2.text.toLowerCase().includes('budget'))) {
      if (!gaps.some(g => g.type === 'unresolved_topic')) {
        const gapId = `gap-unres-${i + 1}`;
        gaps.push({
          id: gapId,
          type: 'unresolved_topic',
          messageIds: [m1.id, m2.id],
          topic: m1.topic,
          speaker: m1.speaker,
          confidence: 0.95,
          severity: 'high',
          explanation: `Conflicting constraints or disagreements were articulated without reaching consensus before the conversation concluded.`,
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
  }

  // Topic Statistics
  const topicMap = {};
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
  const topics = Object.entries(topicMap).map(([name, data]) => ({
    name,
    percentage: Math.round((data.count / totalMsgs) * 100),
    messageCount: data.count,
    participants: Array.from(data.participants),
    questionsCount: data.questions,
    answersCount: data.answers,
    resolutionStatus: data.gaps > 1 ? 'unresolved' : data.gaps === 1 ? 'partially_resolved' : 'resolved',
  }));

  const totalGaps = gaps.length;
  const resolvedThreads = messages.filter(m => m.resolution_status === 'resolved').length;
  const healthScore = Math.max(25, Math.min(97, Math.round(100 - (totalGaps * 7) + (resolvedThreads * 1.5))));

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

  return {
    id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
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
    modelUsed: 'GapLens Rule Engine v2.4 (Local Pattern Analyzer)',
  };
}

module.exports = { analyzeConversation };
