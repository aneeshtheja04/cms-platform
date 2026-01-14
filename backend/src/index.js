require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');
const programRoutes = require('./routes/programRoutes');
const termRoutes = require('./routes/termRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const assetRoutes = require('./routes/assetRoutes');
const catalogRoutes = require('./routes/catalogRoutes');

const app = express();
const port = process.env.PORT || 3000;

// ============ MIDDLEWARE ============

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:5174', // Local development (alternate port)
    'https://frontend-production-c995.up.railway.app' // Production frontend
  ],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============ ROUTES ============

// Health check
app.get('/health', async (req, res) => {
  try {
    // Test database connectivity
    await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: error.message,
    });
  }
});

// API routes (admin - requires authentication)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/terms', termRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api', assetRoutes); // /api/program-assets and /api/lesson-assets

// Public catalog routes (no authentication)
app.use('/catalog', catalogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Endpoint not found',
    path: req.path,
  });
});

// ============ ERROR HANDLER ============
// This must be last
app.use(errorHandler);

// ============ START SERVER ============
app.listen(port, () => {
  console.log(`
    Listening on http://localhost:${port}
  `);
});
