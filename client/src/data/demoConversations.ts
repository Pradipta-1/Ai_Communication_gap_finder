import { ConversationAnalysis } from '../types/conversation';

export const DEMO_PROJECT_MEETING_RAW = `09:00 Alice: Are we meeting tomorrow for the Q4 roadmap?
09:01 Bob: Yes, the executive deck needs our timeline.
09:02 Alice: What time?
09:03 Charlie: I still haven't finished compiling the benchmark numbers from staging.
09:04 David: We should also figure out if we're migrating the analytics pipeline to Snowflake or keeping ClickHouse.
09:05 Alice: What time are we meeting tomorrow?
09:06 Bob: David, ClickHouse is saving us $12k a month, why migrate now?
09:07 David: Because Snowflake has better DBT integration for the data science analysts.
09:08 Bob: I'll send the updated deck tonight.
09:09 Charlie: Does anyone know if the Q3 churn rate is 4.2% or 4.8%?
09:10 Bob: Look in the Metabase dashboard.
09:11 Charlie: Metabase is throwing a 504 Gateway Timeout.
09:12 Alice: Seriously guys, what time and where are we meeting tomorrow?
09:13 David: Staging cluster needs a restart to fix Metabase.
09:14 Bob: Let's do 10 AM.
09:15 David: So what do we decide on Snowflake vs ClickHouse before the leadership review?
09:16 Charlie: I restarted the pods, Metabase is back.
09:17 Bob: Great, I'm heading into another client call now.`;

export const DEMO_SOFTWARE_TEAM_RAW = `14:00 Elena: Hey team, has anyone reviewed PR #412 for the JWT token rotation?
14:02 Marcus: I can review it right after my lunch break at 2:30 PM.
14:05 Kenji: What are the latency requirements and how does it handle expired refresh tokens?
14:07 Elena: P99 latency is under 8ms, but Redis cluster handles the revocation list.
14:09 Kenji: But what happens when the refresh token itself is expired or revoked during transit?
14:11 Sarah: Production alert just fired! Memory leak in worker pod 3.
14:12 Marcus: I'm seeing a spike in heap allocations on the ingestion worker.
14:14 Sarah: Scaling the replica count to 5 to absorb the traffic spike.
14:16 Kenji: Did we configure OOMKilled alerts on Prometheus?
14:18 Sarah: Yes, PagerDuty should trigger if it restarts twice.
14:20 Elena: Hey Marcus, were you able to check PR #412? We have to cut the release candidate today.
14:22 Marcus: Oh sorry, got pulled into debugging the memory spike with Sarah. I will check it in 10 minutes.
14:40 Elena: Can someone please approve the PR? The CI pipeline has been waiting for 40 minutes.`;

export const DEMO_EVENT_PLANNING_RAW = `11:00 Maya: Team, we need to finalize the venue for the DevCon Summit. Options are Moscone West or Hyatt Regency.
11:02 Liam: Hyatt is $45,000 and includes AV gear, but their date is strictly November 14th.
11:04 Chloe: Our keynote speaker Dr. Vance is in Tokyo on November 14th, she can only do November 21st.
11:06 Noah: Moscone has November 21st available, but the deposit is non-refundable and costs $68,000.
11:08 Liam: November 14th at Hyatt is within our allocated budget of $50,000. We should lock it in.
11:09 Chloe: We cannot lose Dr. Vance! Her keynote is the main ticket driver. November 21st is essential.
11:11 Maya: What is the catering cost for 800 attendees at each venue?
11:13 Liam: Hyatt catering is $65 per person for hot buffet.
11:15 Noah: Has anyone checked the sponsor booths layout for the expo hall?
11:17 Chloe: Let's focus on the date first—are we booking Nov 14th or Nov 21st?
11:19 Noah: Google Cloud agreed to be Diamond Tier sponsor!
11:21 Liam: That gives us an extra $25,000 in sponsor budget!
11:23 Maya: Awesome news! I'll draft the sponsor announcement tweet.
11:25 Chloe: Wait, what did we actually decide about the venue and date? The hold expires at 5 PM!`;

export const PRESET_ANALYSES: Record<string, ConversationAnalysis> = {
  'demo-project-meeting': {
    id: 'demo-project-meeting',
    title: 'Q4 Roadmap & Infrastructure Planning',
    createdAt: new Date().toISOString(),
    messagesAnalyzed: 18,
    participantsCount: 4,
    participants: ['Alice', 'Bob', 'Charlie', 'David'],
    healthScore: 68,
    modelUsed: 'GapLens Heuristic Engine v2.4 (Demo Mode)',
    summary: {
      unansweredQuestionsCount: 2,
      repeatedClarificationsCount: 2,
      unresolvedTopicsCount: 1,
      partialAnswersCount: 1,
      missedResponsesCount: 1,
      pendingFollowUpsCount: 0,
      totalGaps: 6,
      resolvedThreads: 8,
    },
    topics: [
      {
        name: 'Meeting Schedule',
        percentage: 35,
        messageCount: 6,
        participants: ['Alice', 'Bob'],
        questionsCount: 4,
        answersCount: 1,
        resolutionStatus: 'partially_resolved',
      },
      {
        name: 'Infrastructure & Database',
        percentage: 30,
        messageCount: 5,
        participants: ['David', 'Bob'],
        questionsCount: 2,
        answersCount: 1,
        resolutionStatus: 'unresolved',
      },
      {
        name: 'Metabase & Benchmark Outage',
        percentage: 25,
        messageCount: 5,
        participants: ['Charlie', 'Bob', 'David'],
        questionsCount: 2,
        answersCount: 2,
        resolutionStatus: 'resolved',
      },
      {
        name: 'Executive Deck',
        percentage: 10,
        messageCount: 2,
        participants: ['Bob'],
        questionsCount: 0,
        answersCount: 1,
        resolutionStatus: 'resolved',
      },
    ],
    communicationGaps: [
      {
        id: 'gap-1',
        type: 'repeated_clarification',
        messageIds: ['m3', 'm6', 'm12'],
        topic: 'Meeting Schedule',
        speaker: 'Alice',
        confidence: 0.96,
        severity: 'high',
        explanation: 'Alice asked for the meeting time three separate times across 10 minutes because earlier queries were deflected by technical discussions.',
        evidence: [
          { speaker: 'Alice', timestamp: '09:02', text: 'What time?', messageId: 'm3' },
          { speaker: 'Charlie', timestamp: '09:03', text: 'I still haven\'t finished compiling the benchmark numbers from staging.', messageId: 'm4' },
          { speaker: 'Alice', timestamp: '09:05', text: 'What time are we meeting tomorrow?', messageId: 'm6' },
          { speaker: 'Alice', timestamp: '09:12', text: 'Seriously guys, what time and where are we meeting tomorrow?', messageId: 'm12' },
        ],
        status: 'unresolved',
      },
      {
        id: 'gap-2',
        type: 'partial_answer',
        messageIds: ['m12', 'm14'],
        topic: 'Meeting Schedule',
        speaker: 'Bob',
        confidence: 0.91,
        severity: 'medium',
        explanation: 'Alice asked both "what time" and "where". Bob responded "Let\'s do 10 AM", answering the time but omitting the meeting location (e.g. Zoom link or conference room).',
        evidence: [
          { speaker: 'Alice', timestamp: '09:12', text: 'Seriously guys, what time and where are we meeting tomorrow?', messageId: 'm12' },
          { speaker: 'Bob', timestamp: '09:14', text: 'Let\'s do 10 AM.', messageId: 'm14' },
        ],
        status: 'unresolved',
      },
      {
        id: 'gap-3',
        type: 'unresolved_topic',
        messageIds: ['m5', 'm7', 'm8', 'm15', 'm17'],
        topic: 'Infrastructure & Database',
        speaker: 'David',
        confidence: 0.94,
        severity: 'high',
        explanation: 'David raised a critical architecture decision (migrating to Snowflake vs ClickHouse) before leadership review. Bob left for a client call without reaching a resolution.',
        evidence: [
          { speaker: 'David', timestamp: '09:04', text: 'We should also figure out if we\'re migrating the analytics pipeline to Snowflake or keeping ClickHouse.', messageId: 'm5' },
          { speaker: 'David', timestamp: '09:15', text: 'So what do we decide on Snowflake vs ClickHouse before the leadership review?', messageId: 'm15' },
          { speaker: 'Bob', timestamp: '09:17', text: 'Great, I\'m heading into another client call now.', messageId: 'm17' },
        ],
        status: 'unresolved',
      },
      {
        id: 'gap-4',
        type: 'unanswered_question',
        messageIds: ['m9', 'm11'],
        topic: 'Metabase & Benchmark Outage',
        speaker: 'Charlie',
        confidence: 0.88,
        severity: 'medium',
        explanation: 'Charlie asked for the Q3 churn rate (4.2% vs 4.8%). Bob directed him to Metabase, which crashed with a 504 timeout; the factual figure was never confirmed.',
        evidence: [
          { speaker: 'Charlie', timestamp: '09:09', text: 'Does anyone know if the Q3 churn rate is 4.2% or 4.8%?', messageId: 'm9' },
          { speaker: 'Bob', timestamp: '09:10', text: 'Look in the Metabase dashboard.', messageId: 'm10' },
          { speaker: 'Charlie', timestamp: '09:11', text: 'Metabase is throwing a 504 Gateway Timeout.', messageId: 'm11' },
        ],
        status: 'unresolved',
      },
    ],
    messages: [
      { id: 'm1', speaker: 'Alice', timestamp: '09:00', text: 'Are we meeting tomorrow for the Q4 roadmap?', intent: 'question', topic: 'Meeting Schedule', requires_answer: true, resolution_status: 'resolved' },
      { id: 'm2', speaker: 'Bob', timestamp: '09:01', text: 'Yes, the executive deck needs our timeline.', intent: 'answer', topic: 'Meeting Schedule', resolution_status: 'resolved' },
      { id: 'm3', speaker: 'Alice', timestamp: '09:02', text: 'What time?', intent: 'question', topic: 'Meeting Schedule', requires_answer: true, gapId: 'gap-1', gapType: 'repeated_clarification', resolution_status: 'unresolved' },
      { id: 'm4', speaker: 'Charlie', timestamp: '09:03', text: 'I still haven\'t finished compiling the benchmark numbers from staging.', intent: 'statement', topic: 'Metabase & Benchmark Outage' },
      { id: 'm5', speaker: 'David', timestamp: '09:04', text: 'We should also figure out if we\'re migrating the analytics pipeline to Snowflake or keeping ClickHouse.', intent: 'question', topic: 'Infrastructure & Database', requires_answer: true, gapId: 'gap-3', gapType: 'unresolved_topic', resolution_status: 'unresolved' },
      { id: 'm6', speaker: 'Alice', timestamp: '09:05', text: 'What time are we meeting tomorrow?', intent: 'clarification', topic: 'Meeting Schedule', requires_answer: true, gapId: 'gap-1', gapType: 'repeated_clarification', resolution_status: 'unresolved' },
      { id: 'm7', speaker: 'Bob', timestamp: '09:06', text: 'David, ClickHouse is saving us $12k a month, why migrate now?', intent: 'disagreement', topic: 'Infrastructure & Database' },
      { id: 'm8', speaker: 'David', timestamp: '09:07', text: 'Because Snowflake has better DBT integration for the data science analysts.', intent: 'statement', topic: 'Infrastructure & Database' },
      { id: 'm9', speaker: 'Bob', timestamp: '09:08', text: 'I\'ll send the updated deck tonight.', intent: 'statement', topic: 'Executive Deck' },
      { id: 'm10', speaker: 'Charlie', timestamp: '09:09', text: 'Does anyone know if the Q3 churn rate is 4.2% or 4.8%?', intent: 'question', topic: 'Metabase & Benchmark Outage', requires_answer: true, gapId: 'gap-4', gapType: 'unanswered_question', resolution_status: 'unresolved' },
      { id: 'm11', speaker: 'Bob', timestamp: '09:10', text: 'Look in the Metabase dashboard.', intent: 'statement', topic: 'Metabase & Benchmark Outage' },
      { id: 'm12', speaker: 'Charlie', timestamp: '09:11', text: 'Metabase is throwing a 504 Gateway Timeout.', intent: 'statement', topic: 'Metabase & Benchmark Outage' },
      { id: 'm13', speaker: 'Alice', timestamp: '09:12', text: 'Seriously guys, what time and where are we meeting tomorrow?', intent: 'clarification', topic: 'Meeting Schedule', requires_answer: true, gapId: 'gap-1', gapType: 'repeated_clarification', resolution_status: 'partially_resolved' },
      { id: 'm14', speaker: 'David', timestamp: '09:13', text: 'Staging cluster needs a restart to fix Metabase.', intent: 'statement', topic: 'Metabase & Benchmark Outage' },
      { id: 'm15', speaker: 'Bob', timestamp: '09:14', text: 'Let\'s do 10 AM.', intent: 'answer', topic: 'Meeting Schedule', gapId: 'gap-2', gapType: 'partial_answer', resolution_status: 'partially_resolved' },
      { id: 'm16', speaker: 'David', timestamp: '09:15', text: 'So what do we decide on Snowflake vs ClickHouse before the leadership review?', intent: 'question', topic: 'Infrastructure & Database', requires_answer: true, gapId: 'gap-3', gapType: 'unresolved_topic', resolution_status: 'unresolved' },
      { id: 'm17', speaker: 'Charlie', timestamp: '09:16', text: 'I restarted the pods, Metabase is back.', intent: 'statement', topic: 'Metabase & Benchmark Outage', resolution_status: 'resolved' },
      { id: 'm18', speaker: 'Bob', timestamp: '09:17', text: 'Great, I\'m heading into another client call now.', intent: 'topic_change', topic: 'Executive Deck' },
    ],
  },
  'demo-software-team': {
    id: 'demo-software-team',
    title: 'Sprint Release & Emergency Memory Incident',
    createdAt: new Date().toISOString(),
    messagesAnalyzed: 13,
    participantsCount: 4,
    participants: ['Elena', 'Marcus', 'Kenji', 'Sarah'],
    healthScore: 71,
    modelUsed: 'GapLens Heuristic Engine v2.4 (Demo Mode)',
    summary: {
      unansweredQuestionsCount: 1,
      repeatedClarificationsCount: 1,
      unresolvedTopicsCount: 1,
      partialAnswersCount: 1,
      missedResponsesCount: 1,
      pendingFollowUpsCount: 1,
      totalGaps: 5,
      resolvedThreads: 6,
    },
    topics: [
      {
        name: 'PR #412 JWT Review',
        percentage: 45,
        messageCount: 6,
        participants: ['Elena', 'Marcus'],
        questionsCount: 3,
        answersCount: 2,
        resolutionStatus: 'unresolved',
      },
      {
        name: 'Worker Pod OOM Incident',
        percentage: 35,
        messageCount: 5,
        participants: ['Sarah', 'Marcus', 'Kenji'],
        questionsCount: 1,
        answersCount: 1,
        resolutionStatus: 'resolved',
      },
      {
        name: 'Token Revocation Architecture',
        percentage: 20,
        messageCount: 2,
        participants: ['Kenji', 'Elena'],
        questionsCount: 2,
        answersCount: 1,
        resolutionStatus: 'partially_resolved',
      },
    ],
    communicationGaps: [
      {
        id: 'gap-s1',
        type: 'pending_follow_up',
        messageIds: ['m1', 'm2', 'm9', 'm10'],
        topic: 'PR #412 JWT Review',
        speaker: 'Marcus',
        confidence: 0.95,
        severity: 'high',
        explanation: 'Marcus committed to reviewing PR #412 after lunch and again in 10 minutes, but after 40 minutes the CI pipeline was still stalled awaiting approval.',
        evidence: [
          { speaker: 'Elena', timestamp: '14:00', text: 'Hey team, has anyone reviewed PR #412 for the JWT token rotation?', messageId: 'm1' },
          { speaker: 'Marcus', timestamp: '14:02', text: 'I can review it right after my lunch break at 2:30 PM.', messageId: 'm2' },
          { speaker: 'Elena', timestamp: '14:20', text: 'Hey Marcus, were you able to check PR #412? We have to cut the release candidate today.', messageId: 'm9' },
          { speaker: 'Elena', timestamp: '14:40', text: 'Can someone please approve the PR? The CI pipeline has been waiting for 40 minutes.', messageId: 'm11' },
        ],
        status: 'unresolved',
      },
      {
        id: 'gap-s2',
        type: 'partial_answer',
        messageIds: ['m3', 'm4'],
        topic: 'Token Revocation Architecture',
        speaker: 'Elena',
        confidence: 0.89,
        severity: 'medium',
        explanation: 'Kenji asked for both latency requirements and refresh token expiration handling. Elena provided the P99 latency metric but deferred transit expiration details.',
        evidence: [
          { speaker: 'Kenji', timestamp: '14:05', text: 'What are the latency requirements and how does it handle expired refresh tokens?', messageId: 'm3' },
          { speaker: 'Elena', timestamp: '14:07', text: 'P99 latency is under 8ms, but Redis cluster handles the revocation list.', messageId: 'm4' },
        ],
        status: 'unresolved',
      },
      {
        id: 'gap-s3',
        type: 'unanswered_question',
        messageIds: ['m5'],
        topic: 'Token Revocation Architecture',
        speaker: 'Kenji',
        confidence: 0.92,
        severity: 'high',
        explanation: 'Kenji asked what happens when the refresh token itself is expired or revoked during transit. The conversation was interrupted by a production memory alert.',
        evidence: [
          { speaker: 'Kenji', timestamp: '14:09', text: 'But what happens when the refresh token itself is expired or revoked during transit?', messageId: 'm5' },
          { speaker: 'Sarah', timestamp: '14:11', text: 'Production alert just fired! Memory leak in worker pod 3.', messageId: 'm6' },
        ],
        status: 'unresolved',
      },
    ],
    messages: [
      { id: 'm1', speaker: 'Elena', timestamp: '14:00', text: 'Hey team, has anyone reviewed PR #412 for the JWT token rotation?', intent: 'question', topic: 'PR #412 JWT Review', requires_answer: true, gapId: 'gap-s1', gapType: 'pending_follow_up', resolution_status: 'unresolved' },
      { id: 'm2', speaker: 'Marcus', timestamp: '14:02', text: 'I can review it right after my lunch break at 2:30 PM.', intent: 'acknowledgement', topic: 'PR #412 JWT Review', resolution_status: 'pending' },
      { id: 'm3', speaker: 'Kenji', timestamp: '14:05', text: 'What are the latency requirements and how does it handle expired refresh tokens?', intent: 'question', topic: 'Token Revocation Architecture', requires_answer: true, gapId: 'gap-s2', gapType: 'partial_answer', resolution_status: 'partially_resolved' },
      { id: 'm4', speaker: 'Elena', timestamp: '14:07', text: 'P99 latency is under 8ms, but Redis cluster handles the revocation list.', intent: 'answer', topic: 'Token Revocation Architecture', gapId: 'gap-s2', gapType: 'partial_answer', resolution_status: 'partially_resolved' },
      { id: 'm5', speaker: 'Kenji', timestamp: '14:09', text: 'But what happens when the refresh token itself is expired or revoked during transit?', intent: 'question', topic: 'Token Revocation Architecture', requires_answer: true, gapId: 'gap-s3', gapType: 'unanswered_question', resolution_status: 'unresolved' },
      { id: 'm6', speaker: 'Sarah', timestamp: '14:11', text: 'Production alert just fired! Memory leak in worker pod 3.', intent: 'statement', topic: 'Worker Pod OOM Incident' },
      { id: 'm7', speaker: 'Marcus', timestamp: '14:12', text: 'I\'m seeing a spike in heap allocations on the ingestion worker.', intent: 'statement', topic: 'Worker Pod OOM Incident' },
      { id: 'm8', speaker: 'Sarah', timestamp: '14:14', text: 'Scaling the replica count to 5 to absorb the traffic spike.', intent: 'statement', topic: 'Worker Pod OOM Incident' },
      { id: 'm9', speaker: 'Kenji', timestamp: '14:16', text: 'Did we configure OOMKilled alerts on Prometheus?', intent: 'question', topic: 'Worker Pod OOM Incident', requires_answer: true, resolution_status: 'resolved' },
      { id: 'm10', speaker: 'Sarah', timestamp: '14:18', text: 'Yes, PagerDuty should trigger if it restarts twice.', intent: 'answer', topic: 'Worker Pod OOM Incident', resolution_status: 'resolved' },
      { id: 'm11', speaker: 'Elena', timestamp: '14:20', text: 'Hey Marcus, were you able to check PR #412? We have to cut the release candidate today.', intent: 'clarification', topic: 'PR #412 JWT Review', requires_answer: true, gapId: 'gap-s1', gapType: 'pending_follow_up', resolution_status: 'unresolved' },
      { id: 'm12', speaker: 'Marcus', timestamp: '14:22', text: 'Oh sorry, got pulled into debugging the memory spike with Sarah. I will check it in 10 minutes.', intent: 'acknowledgement', topic: 'PR #412 JWT Review' },
      { id: 'm13', speaker: 'Elena', timestamp: '14:40', text: 'Can someone please approve the PR? The CI pipeline has been waiting for 40 minutes.', intent: 'request', topic: 'PR #412 JWT Review', gapId: 'gap-s1', gapType: 'pending_follow_up', resolution_status: 'unresolved' },
    ],
  },
  'demo-event-planning': {
    id: 'demo-event-planning',
    title: 'DevCon Summit Venue & Sponsor Clash',
    createdAt: new Date().toISOString(),
    messagesAnalyzed: 14,
    participantsCount: 4,
    participants: ['Maya', 'Liam', 'Chloe', 'Noah'],
    healthScore: 61,
    modelUsed: 'GapLens Heuristic Engine v2.4 (Demo Mode)',
    summary: {
      unansweredQuestionsCount: 2,
      repeatedClarificationsCount: 2,
      unresolvedTopicsCount: 2,
      partialAnswersCount: 1,
      missedResponsesCount: 1,
      pendingFollowUpsCount: 0,
      totalGaps: 7,
      resolvedThreads: 5,
    },
    topics: [
      {
        name: 'Venue & Date Selection',
        percentage: 55,
        messageCount: 8,
        participants: ['Maya', 'Liam', 'Chloe', 'Noah'],
        questionsCount: 4,
        answersCount: 1,
        resolutionStatus: 'unresolved',
      },
      {
        name: 'Sponsor Budget & Diamond Tier',
        percentage: 25,
        messageCount: 4,
        participants: ['Noah', 'Liam', 'Maya'],
        questionsCount: 0,
        answersCount: 2,
        resolutionStatus: 'resolved',
      },
      {
        name: 'Catering & Logistics',
        percentage: 20,
        messageCount: 2,
        participants: ['Maya', 'Liam'],
        questionsCount: 1,
        answersCount: 1,
        resolutionStatus: 'partially_resolved',
      },
    ],
    communicationGaps: [
      {
        id: 'gap-e1',
        type: 'unresolved_topic',
        messageIds: ['m2', 'm3', 'm4', 'm5', 'm6', 'm10', 'm14'],
        topic: 'Venue & Date Selection',
        speaker: 'Chloe',
        confidence: 0.98,
        severity: 'high',
        explanation: 'Direct schedule conflict: Liam pushed for Nov 14 ($45k budget), while Chloe insisted on Nov 21 for the keynote speaker. The decision was abandoned when sponsor news arrived.',
        evidence: [
          { speaker: 'Liam', timestamp: '11:04', text: 'November 14th at Hyatt is within our allocated budget of $50,000. We should lock it in.', messageId: 'm5' },
          { speaker: 'Chloe', timestamp: '11:06', text: 'We cannot lose Dr. Vance! Her keynote is the main ticket driver. November 21st is essential.', messageId: 'm6' },
          { speaker: 'Chloe', timestamp: '11:17', text: 'Let\'s focus on the date first—are we booking Nov 14th or Nov 21st?', messageId: 'm10' },
          { speaker: 'Chloe', timestamp: '11:25', text: 'Wait, what did we actually decide about the venue and date? The hold expires at 5 PM!', messageId: 'm14' },
        ],
        status: 'unresolved',
      },
      {
        id: 'gap-e2',
        type: 'partial_answer',
        messageIds: ['m7', 'm8'],
        topic: 'Catering & Logistics',
        speaker: 'Liam',
        confidence: 0.87,
        severity: 'medium',
        explanation: 'Maya asked for catering costs at "each venue" (both Hyatt and Moscone). Liam only provided Hyatt catering numbers ($65/person), omitting Moscone.',
        evidence: [
          { speaker: 'Maya', timestamp: '11:11', text: 'What is the catering cost for 800 attendees at each venue?', messageId: 'm7' },
          { speaker: 'Liam', timestamp: '11:13', text: 'Hyatt catering is $65 per person for hot buffet.', messageId: 'm8' },
        ],
        status: 'unresolved',
      },
    ],
    messages: [
      { id: 'm1', speaker: 'Maya', timestamp: '11:00', text: 'Team, we need to finalize the venue for the DevCon Summit. Options are Moscone West or Hyatt Regency.', intent: 'statement', topic: 'Venue & Date Selection' },
      { id: 'm2', speaker: 'Liam', timestamp: '11:02', text: 'Hyatt is $45,000 and includes AV gear, but their date is strictly November 14th.', intent: 'statement', topic: 'Venue & Date Selection' },
      { id: 'm3', speaker: 'Chloe', timestamp: '11:04', text: 'Our keynote speaker Dr. Vance is in Tokyo on November 14th, she can only do November 21st.', intent: 'statement', topic: 'Venue & Date Selection' },
      { id: 'm4', speaker: 'Noah', timestamp: '11:06', text: 'Moscone has November 21st available, but the deposit is non-refundable and costs $68,000.', intent: 'statement', topic: 'Venue & Date Selection' },
      { id: 'm5', speaker: 'Liam', timestamp: '11:08', text: 'November 14th at Hyatt is within our allocated budget of $50,000. We should lock it in.', intent: 'disagreement', topic: 'Venue & Date Selection', gapId: 'gap-e1', gapType: 'unresolved_topic', resolution_status: 'unresolved' },
      { id: 'm6', speaker: 'Chloe', timestamp: '11:09', text: 'We cannot lose Dr. Vance! Her keynote is the main ticket driver. November 21st is essential.', intent: 'disagreement', topic: 'Venue & Date Selection', gapId: 'gap-e1', gapType: 'unresolved_topic', resolution_status: 'unresolved' },
      { id: 'm7', speaker: 'Maya', timestamp: '11:11', text: 'What is the catering cost for 800 attendees at each venue?', intent: 'question', topic: 'Catering & Logistics', requires_answer: true, gapId: 'gap-e2', gapType: 'partial_answer', resolution_status: 'partially_resolved' },
      { id: 'm8', speaker: 'Liam', timestamp: '11:13', text: 'Hyatt catering is $65 per person for hot buffet.', intent: 'answer', topic: 'Catering & Logistics', gapId: 'gap-e2', gapType: 'partial_answer', resolution_status: 'partially_resolved' },
      { id: 'm9', speaker: 'Noah', timestamp: '11:15', text: 'Has anyone checked the sponsor booths layout for the expo hall?', intent: 'question', topic: 'Sponsor Budget & Diamond Tier', requires_answer: true },
      { id: 'm10', speaker: 'Chloe', timestamp: '11:17', text: 'Let\'s focus on the date first—are we booking Nov 14th or Nov 21st?', intent: 'clarification', topic: 'Venue & Date Selection', requires_answer: true, gapId: 'gap-e1', gapType: 'unresolved_topic', resolution_status: 'unresolved' },
      { id: 'm11', speaker: 'Noah', timestamp: '11:19', text: 'Google Cloud agreed to be Diamond Tier sponsor!', intent: 'statement', topic: 'Sponsor Budget & Diamond Tier' },
      { id: 'm12', speaker: 'Liam', timestamp: '11:21', text: 'That gives us an extra $25,000 in sponsor budget!', intent: 'agreement', topic: 'Sponsor Budget & Diamond Tier' },
      { id: 'm13', speaker: 'Maya', timestamp: '11:23', text: 'Awesome news! I\'ll draft the sponsor announcement tweet.', intent: 'statement', topic: 'Sponsor Budget & Diamond Tier' },
      { id: 'm14', speaker: 'Chloe', timestamp: '11:25', text: 'Wait, what did we actually decide about the venue and date? The hold expires at 5 PM!', intent: 'clarification', topic: 'Venue & Date Selection', requires_answer: true, gapId: 'gap-e1', gapType: 'unresolved_topic', resolution_status: 'unresolved' },
    ],
  },
};
