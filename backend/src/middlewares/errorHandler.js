/**
 * Centralized error handling middleware
 * Catches all errors and returns consistent error responses
 *
 * PostgreSQL error codes:
 * - 23505: unique_violation (duplicate key)
 * - 23503: foreign_key_violation
 * - 23502: not_null_violation
 * - 23514: check_violation
 * - 22P02: invalid_text_representation (invalid UUID)
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // PostgreSQL unique violation (duplicate key)
  if (err.code === '23505') {
    return res.status(409).json({
      code: 'DUPLICATE',
      message: 'Resource already exists',
      details: {
        constraint: err.constraint,
        table: err.table,
      },
    });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      code: 'INVALID_REFERENCE',
      message: 'Referenced resource does not exist',
      details: {
        constraint: err.constraint,
        table: err.table,
      },
    });
  }

  // PostgreSQL not null violation
  if (err.code === '23502') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Required field is missing',
      details: {
        column: err.column,
        table: err.table,
      },
    });
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Data validation failed',
      details: {
        constraint: err.constraint,
        table: err.table,
      },
    });
  }

  // PostgreSQL invalid UUID
  if (err.code === '22P02') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Invalid ID format',
    });
  }

  // Custom error with status code
  if (err.status) {
    return res.status(err.status).json({
      code: err.code || 'ERROR',
      message: err.message,
      details: err.details || {},
    });
  }

  // Default internal server error
  return res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    details: {
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
  });
}

module.exports = errorHandler;
