function applyConfidenceThreshold(analysis, threshold) {
  const originalGaps = analysis.communicationGaps;
  const retainedGaps = originalGaps.filter(gap => gap.confidence >= threshold);
  const retainedGapIds = new Set(retainedGaps.map(gap => gap.id));
  const removedGapIds = new Set(
    originalGaps
      .filter(gap => !retainedGapIds.has(gap.id))
      .map(gap => gap.id)
  );

  analysis.communicationGaps = retainedGaps;
  analysis.messages = analysis.messages.map(message => {
    if (!message.gapId || !removedGapIds.has(message.gapId)) return message;
    return {
      ...message,
      gapId: undefined,
      gapType: undefined,
      resolution_status: message.requires_answer ? 'pending' : undefined,
    };
  });

  const countByType = type => retainedGaps.filter(gap => gap.type === type).length;
  analysis.summary = {
    ...analysis.summary,
    unansweredQuestionsCount: countByType('unanswered_question'),
    repeatedClarificationsCount: countByType('repeated_clarification'),
    unresolvedTopicsCount: countByType('unresolved_topic'),
    partialAnswersCount: countByType('partial_answer'),
    missedResponsesCount: countByType('missed_response'),
    pendingFollowUpsCount: countByType('pending_follow_up'),
    totalGaps: retainedGaps.length,
  };
  analysis.topics = analysis.topics.map(topic => {
    const topicHadGaps = originalGaps.some(gap => gap.topic === topic.name);
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
  });
  analysis.healthScore = Math.max(
    25,
    Math.min(
      97,
      Math.round(100 - (retainedGaps.length * 7) + (analysis.summary.resolvedThreads * 1.5))
    )
  );

  return analysis;
}

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || null;
    this.model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    this.apiEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
  }

  isConfigured(apiKey = this.apiKey) {
    return Boolean(apiKey && apiKey.trim().length > 5 && !/^your_|^replace_/i.test(apiKey.trim()));
  }

  getStatus() {
    const connected = this.isConfigured();
    return {
      connected,
      mode: connected ? 'live_ai' : 'configuration_required',
      provider: 'openrouter',
      model: connected ? this.model : 'OPENROUTER_API_KEY required',
    };
  }

  async analyze(conversation, options = {}) {
    const title = options.title || 'Conversation Analysis';
    const confidenceThreshold = options.confidenceThreshold || 0.7;
    const apiKey = this.apiKey;
    const model = this.model;
    const apiEndpoint = this.apiEndpoint;
    const temperature = typeof options.temperature === 'number'
      ? Math.min(1, Math.max(0, options.temperature))
      : 0.2;

    if (!this.isConfigured(apiKey)) {
      throw new Error('OPENROUTER_API_KEY is not configured in server/.env.');
    }

    try {
      const prompt = `You are GapLens, an AI Communication Gap Detector.
Analyze the following multi-person conversation and identify communication gaps:
1. Unanswered questions
2. Repeated requests for clarification
3. Partial answers
4. Unresolved topics / conflicting responses with no final decision
5. Missed follow-ups or stalled promises

Conversation:
${JSON.stringify(conversation, null, 2)}

Return a strict JSON object with this exact schema:
{
  "healthScore": 75,
  "summary": {
    "unansweredQuestionsCount": 2,
    "repeatedClarificationsCount": 1,
    "unresolvedTopicsCount": 1,
    "partialAnswersCount": 1,
    "missedResponsesCount": 0,
    "pendingFollowUpsCount": 1,
    "totalGaps": 5,
    "resolvedThreads": 8
  },
  "topics": [
    {
      "name": "Topic Name",
      "percentage": 40,
      "messageCount": 4,
      "participants": ["Alice", "Bob"],
      "questionsCount": 2,
      "answersCount": 1,
      "resolutionStatus": "partially_resolved"
    }
  ],
  "messages": [
    {
      "id": "m1",
      "speaker": "Alice",
      "timestamp": "09:00",
      "text": "...",
      "intent": "question",
      "topic": "Topic Name",
      "requires_answer": true,
      "resolution_status": "unresolved",
      "gapId": "gap-1",
      "gapType": "unanswered_question"
    }
  ],
  "communicationGaps": [
    {
      "id": "gap-1",
      "type": "unanswered_question",
      "messageIds": ["m1"],
      "topic": "Topic Name",
      "speaker": "Alice",
      "confidence": 0.95,
      "severity": "high",
      "explanation": "Alice asked about X, but nobody replied.",
      "evidence": [
        { "speaker": "Alice", "timestamp": "09:00", "text": "..." }
      ],
      "status": "unresolved"
    }
  ]
}`;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are an expert NLP conversation auditor. Output ONLY valid JSON.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`OpenRouter returned status ${response.status}${responseText ? `: ${responseText}` : ''}`);
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || '';
      
      // Strip potential markdown code fences from model response
      content = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (parseErr) {
        throw new Error(`Invalid JSON returned by OpenRouter model: ${parseErr.message}`);
      }

      parsed.id = parsed.id || `conv-${Date.now()}`;
      parsed.title = title;
      parsed.createdAt = new Date().toISOString();
      parsed.messagesAnalyzed = conversation.length;
      parsed.participantsCount = new Set(conversation.map(m => m.speaker)).size;
      parsed.participants = Array.from(new Set(conversation.map(m => m.speaker)));
      parsed.demoMode = false;
      parsed.modelUsed = model;
      parsed.communicationGaps = parsed.communicationGaps || [];
      parsed.messages = parsed.messages || [];
      parsed.topics = parsed.topics || [];
      parsed.summary = parsed.summary || {};

      return applyConfidenceThreshold(parsed, confidenceThreshold);
    } catch (err) {
      const safeError = apiKey ? err.message.replaceAll(apiKey, '[redacted]') : err.message;
      console.error(`[AI Service] OpenRouter analysis failed: ${safeError}`);
      throw new Error(safeError);
    }
  }
}

module.exports = new AIService();
