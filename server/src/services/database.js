const mongoose = require('mongoose');

// In-memory fallback repository for zero-config startup
const memoryStore = new Map();

let isConnected = false;

// Initialize Database connection
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gaplens';
  try {
    mongoose.set('strictQuery', false);
    // 2-second timeout so app never hangs if MongoDB isn't installed
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isConnected = true;
    console.log(`[Database] Connected successfully to MongoDB at ${uri}`);
  } catch (err) {
    isConnected = false;
    console.warn(`[Database] MongoDB not reachable (${err.message}). Using high-performance in-memory store.`);
  }
}

// Mongoose Schema
const ConversationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, default: 'Untitled Conversation' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    messagesAnalyzed: { type: Number, default: 0 },
    participantsCount: { type: Number, default: 0 },
    participants: [String],
    healthScore: { type: Number, default: 75 },
    communicationGaps: [mongoose.Schema.Types.Mixed],
    topics: [mongoose.Schema.Types.Mixed],
    messages: [mongoose.Schema.Types.Mixed],
    summary: mongoose.Schema.Types.Mixed,
    demoMode: { type: Boolean, default: false },
    modelUsed: String,
  },
  { timestamps: true }
);

const ConversationModel = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

// Universal DB operations layer
const db = {
  isMongoActive() {
    return isConnected;
  },

  async saveConversation(data) {
    memoryStore.set(data.id, data);
    if (isConnected) {
      try {
        await ConversationModel.findOneAndUpdate({ id: data.id }, data, { upsert: true, new: true });
      } catch (e) {
        console.error('[Database] MongoDB save error, retained in memory:', e.message);
      }
    }
    return data;
  },

  async getConversations() {
    if (isConnected) {
      try {
        const docs = await ConversationModel.find().sort({ createdAt: -1 }).lean();
        if (docs && docs.length > 0) return docs;
      } catch (e) {
        console.error('[Database] MongoDB fetch error, falling back to memory:', e.message);
      }
    }
    return Array.from(memoryStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getConversationById(id) {
    if (isConnected) {
      try {
        const doc = await ConversationModel.findOne({ id }).lean();
        if (doc) return doc;
      } catch (e) {
        console.error('[Database] MongoDB fetch single error:', e.message);
      }
    }
    return memoryStore.get(id) || null;
  },

  async deleteConversation(id) {
    memoryStore.delete(id);
    if (isConnected) {
      try {
        await ConversationModel.deleteOne({ id });
      } catch (e) {
        console.error('[Database] MongoDB delete error:', e.message);
      }
    }
    return true;
  },

  async updateGapStatus(conversationId, gapId, status) {
    const conv = await this.getConversationById(conversationId);
    if (!conv) return null;

    const gap = (conv.communicationGaps || []).find(g => g.id === gapId);
    if (gap) {
      gap.status = status;
      if (status === 'resolved') {
        gap.resolvedAt = new Date().toISOString();
      }
      // Recompute health score
      const activeGaps = conv.communicationGaps.filter(g => g.status === 'unresolved').length;
      conv.healthScore = Math.min(99, Math.round(100 - (activeGaps * 7)));
      await this.saveConversation(conv);
      return conv;
    }
    return null;
  },
};

module.exports = { connectDB, db, ConversationModel };
