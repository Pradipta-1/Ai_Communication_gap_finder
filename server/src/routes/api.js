const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const ruleEngine = require('../services/ruleEngine');
const { db } = require('../services/database');

// Health check endpoint
router.get('/health', (req, res) => {
  const aiStatus = aiService.getStatus();
  res.json({
    status: 'ok',
    mode: aiStatus.mode,
    aiConnected: aiStatus.connected,
    provider: aiStatus.provider,
    model: aiStatus.model,
    database: db.isMongoActive() ? 'MongoDB' : 'In-Memory Store',
    timestamp: new Date().toISOString(),
  });
});

// Analyze conversation
router.post('/analyze', async (req, res) => {
  try {
    const { conversation, title, confidenceThreshold, temperature, mode } = req.body;
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({ error: 'Conversation array is required and cannot be empty.' });
    }

    let analysis;
    if (mode === 'local') {
      analysis = ruleEngine.analyzeConversation(conversation, title || 'Conversation Analysis');
    } else {
      if (!aiService.getStatus().connected) {
        return res.status(503).json({ error: 'Set OPENROUTER_API_KEY in server/.env and restart the server to analyze conversations with OpenRouter, or choose Local AI mode.' });
      }

      analysis = await aiService.analyze(conversation, {
        title: title || 'Conversation Analysis',
        confidenceThreshold: confidenceThreshold || 0.7,
        temperature,
      });
    }

    // Save to database
    await db.saveConversation(analysis);

    return res.json(analysis);
  } catch (err) {
    console.error('[API /analyze] Error:', err);
    return res.status(502).json({ error: err.message || 'Analysis failed. Check the API key, model, and provider status.' });
  }
});

// Get all conversations list
router.get('/conversations', async (req, res) => {
  try {
    const list = await db.getConversations();
    const formatted = list.map(item => ({
      id: item.id,
      title: item.title,
      participantsCount: item.participantsCount || (item.participants || []).length,
      messagesCount: item.messagesAnalyzed || (item.messages || []).length,
      gapsCount: (item.communicationGaps || []).length,
      healthScore: item.healthScore || 75,
      createdAt: item.createdAt,
      summaryText: `${(item.communicationGaps || []).length} gaps detected across ${(item.topics || []).length} topics`,
    }));
    return res.json(formatted);
  } catch (err) {
    console.error('[API /conversations] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve conversations.' });
  }
});

// Get single conversation by ID
router.get('/conversations/:id', async (req, res) => {
  try {
    const item = await db.getConversationById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    return res.json(item);
  } catch (err) {
    console.error('[API /conversations/:id] Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve conversation details.' });
  }
});

// Save or update conversation
router.post('/conversations', async (req, res) => {
  try {
    const analysis = req.body;
    if (!analysis || !analysis.id) {
      return res.status(400).json({ error: 'Invalid conversation payload.' });
    }
    await db.saveConversation(analysis);
    return res.json({ success: true, conversation: analysis });
  } catch (err) {
    console.error('[API POST /conversations] Error:', err);
    return res.status(500).json({ error: 'Failed to save conversation.' });
  }
});

// Delete conversation
router.delete('/conversations/:id', async (req, res) => {
  try {
    await db.deleteConversation(req.params.id);
    return res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('[API DELETE /conversations/:id] Error:', err);
    return res.status(500).json({ error: 'Failed to delete conversation.' });
  }
});

// Update conversation (e.g. rename title)
router.patch('/conversations/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const item = await db.getConversationById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    if (title && typeof title === 'string') {
      item.title = title.trim();
    }
    await db.saveConversation(item);
    return res.json({ success: true, conversation: item });
  } catch (err) {
    console.error('[API PATCH /conversations/:id] Error:', err);
    return res.status(500).json({ error: 'Failed to update conversation.' });
  }
});

// Mark gap as resolved
router.post('/conversations/:id/resolve-gap', async (req, res) => {
  try {
    const { gapId } = req.body;
    const updated = await db.updateGapStatus(req.params.id, gapId, 'resolved');
    if (!updated) {
      return res.status(404).json({ error: 'Gap or conversation not found.' });
    }
    return res.json({ success: true, conversation: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to resolve gap.' });
  }
});

// Reopen gap
router.post('/conversations/:id/reopen-gap', async (req, res) => {
  try {
    const { gapId } = req.body;
    const updated = await db.updateGapStatus(req.params.id, gapId, 'unresolved');
    if (!updated) {
      return res.status(404).json({ error: 'Gap or conversation not found.' });
    }
    return res.json({ success: true, conversation: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reopen gap.' });
  }
});

// Dismiss gap
router.post('/conversations/:id/dismiss-gap', async (req, res) => {
  try {
    const { gapId } = req.body;
    const updated = await db.updateGapStatus(req.params.id, gapId, 'dismissed');
    if (!updated) {
      return res.status(404).json({ error: 'Gap or conversation not found.' });
    }
    return res.json({ success: true, conversation: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to dismiss gap.' });
  }
});

module.exports = router;
