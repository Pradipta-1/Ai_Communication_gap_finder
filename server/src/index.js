require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./services/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Root health
app.get('/', (req, res) => {
  res.json({
    name: 'GapLens API Server',
    tagline: 'See what the conversation missed.',
    version: '1.0.0',
    status: 'online',
  });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[GapLens Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
