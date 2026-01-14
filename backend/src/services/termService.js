const pool = require('../config/db');

/**
 * Get all terms with optional program filter
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} - Array of terms
 */
async function getAllTerms(filters = {}) {
  const { program_id } = filters;

  let query = `
    SELECT t.id, t.program_id, t.term_number, t.title, t.created_at,
           p.title as program_title,
           COUNT(l.id)::integer as lesson_count,
           COUNT(CASE WHEN l.status = 'published' THEN 1 END)::integer as published_lesson_count
    FROM terms t
    INNER JOIN programs p ON p.id = t.program_id
    LEFT JOIN lessons l ON l.term_id = t.id
  `;

  const params = [];
  const conditions = [];

  if (program_id) {
    conditions.push(`t.program_id = $1`);
    params.push(program_id);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` GROUP BY t.id, t.program_id, t.term_number, t.title, t.created_at, p.title`;
  query += ` ORDER BY t.program_id, t.term_number`;

  const result = await pool.query(query, params);
  return result.rows;
}

/**
 * Get term by ID with lessons
 * @param {string} id - Term ID
 * @returns {Promise<Object>} - Term with lessons
 */
async function getTermById(id) {
  // Get term
  const termResult = await pool.query(
    `SELECT t.id, t.program_id, t.term_number, t.title, t.created_at,
            p.title as program_title
     FROM terms t
     INNER JOIN programs p ON p.id = t.program_id
     WHERE t.id = $1`,
    [id]
  );

  if (termResult.rows.length === 0) {
    const error = new Error('Term not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const term = termResult.rows[0];

  // Get lessons
  const lessonsResult = await pool.query(
    `SELECT id, lesson_number, title, content_type, duration_ms,
            is_paid, status, publish_at, published_at, created_at
     FROM lessons
     WHERE term_id = $1
     ORDER BY lesson_number`,
    [id]
  );
  term.lessons = lessonsResult.rows;

  return term;
}

/**
 * Create new term
 * @param {Object} data - Term data
 * @returns {Promise<Object>} - Created term
 */
async function createTerm(data) {
  const { program_id, term_number, title } = data;

  const result = await pool.query(
    `INSERT INTO terms (program_id, term_number, title)
     VALUES ($1, $2, $3)
     RETURNING id, program_id, term_number, title, created_at`,
    [program_id, term_number, title]
  );

  return result.rows[0];
}

/**
 * Update term
 * @param {string} id - Term ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} - Updated term
 */
async function updateTerm(id, data) {
  const { title } = data;

  const result = await pool.query(
    `UPDATE terms
     SET title = COALESCE($1, title)
     WHERE id = $2
     RETURNING id, program_id, term_number, title, created_at`,
    [title, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Term not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

/**
 * Delete term
 * @param {string} id - Term ID
 * @returns {Promise<Object>} - Deleted term
 */
async function deleteTerm(id) {
  const result = await pool.query(
    `DELETE FROM terms
     WHERE id = $1
     RETURNING id, program_id, term_number, title`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Term not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

module.exports = {
  getAllTerms,
  getTermById,
  createTerm,
  updateTerm,
  deleteTerm,
};
