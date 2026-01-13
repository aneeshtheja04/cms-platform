/**
 * Format timestamp in ISO 8601 format
 * @returns {string} ISO formatted timestamp
 */
function formatTimestamp() {
  return new Date().toISOString();
}

/**
 * Log a message with structured JSON format
 * @param {string} level - Log level (info, error, warn, debug)
 * @param {string} message - Log message
 * @param {Object} context - Additional context data
 */
function log(level, message, context = {}) {
  const timestamp = formatTimestamp();
  const logEntry = {
    timestamp,
    level,
    service: 'worker',
    message,
    ...context
  };

  console.log(JSON.stringify(logEntry));
}

module.exports = {
  info: (message, context) => log('info', message, context),
  error: (message, context) => log('error', message, context),
  warn: (message, context) => log('warn', message, context),
  debug: (message, context) => log('debug', message, context),
};
