require('dotenv').config();
const pool = require('./src/config/db');
const { processScheduledLessons } = require('./src/services/publisherService');

// Configuration
const INTERVAL_MS = 60000;  // 60 seconds
let isShuttingDown = false;
let intervalId = null;

/**
 * Main worker function - runs the scheduled publish check
 */
async function runWorker() {
  if (isShuttingDown) {
    console.log('[Worker] Shutdown in progress, skipping run');
    return;
  }

  try {
    console.log(`[Worker] Running scheduled publish check at ${new Date().toISOString()}`);
    await processScheduledLessons();
  } catch (error) {
    console.error('[Worker] Fatal error during run:', error);
  }
}

/**
 * Graceful shutdown handler
 */
async function shutdown() {
  if (isShuttingDown) return;

  isShuttingDown = true;
  console.log('[Worker] Received shutdown signal, cleaning up...');

  // Stop interval
  if (intervalId) {
    clearInterval(intervalId);
    console.log('[Worker] Stopped interval timer');
  }

  // Close database connections
  try {
    await pool.end();
    console.log('[Worker] Database connections closed');
  } catch (error) {
    console.error('[Worker] Error closing database:', error);
  }

  console.log('[Worker] Shutdown complete');
  process.exit(0);
}

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('[Worker] Database connection successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('[Worker] Database connection failed:', error);
    return false;
  }
}

/**
 * Start the worker
 */
async function start() {
  console.log('🚀 Worker starting...');
  console.log(`[Worker] Environment: DB_HOST=${process.env.DB_HOST}, DB_NAME=${process.env.DB_NAME}`);
  console.log(`[Worker] Interval: ${INTERVAL_MS / 1000} seconds`);

  // Test database connection
  const connected = await testConnection();
  if (!connected) {
    console.error('[Worker] Failed to connect to database, exiting');
    process.exit(1);
  }

  // Run immediately on start
  console.log('[Worker] Running initial publish check...');
  await runWorker();

  // Setup interval (every 60 seconds)
  intervalId = setInterval(runWorker, INTERVAL_MS);
  console.log(`[Worker] Scheduled to run every ${INTERVAL_MS / 1000} seconds`);
  console.log('[Worker] Press Ctrl+C to stop');
}

// Setup signal handlers for graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[Worker] Uncaught exception:', error);
  shutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Worker] Unhandled rejection at:', promise, 'reason:', reason);
});

// Start the worker
start().catch((error) => {
  console.error('[Worker] Failed to start:', error);
  process.exit(1);
});
