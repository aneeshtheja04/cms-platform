const pool = require('../config/db');

/**
 * Get all programs with optional filters
 * @param {Object} filters - Filter options (status, language, topic_id, limit, offset)
 * @returns {Promise<Array>} - Array of programs
 */
async function getAllPrograms(filters = {}) {
  const { status, language, topic_id, limit = 50, offset = 0 } = filters;

  let query = `
    SELECT DISTINCT p.id, p.title, p.description, p.language_primary,
           p.languages_available, p.status, p.published_at,
           p.created_at, p.updated_at
    FROM programs p
  `;

  const conditions = [];
  const params = [];
  let paramCount = 1;

  // Filter by topic
  if (topic_id) {
    query += ` INNER JOIN program_topics pt ON pt.program_id = p.id`;
    conditions.push(`pt.topic_id = $${paramCount++}`);
    params.push(topic_id);
  }

  // Filter by status
  if (status) {
    conditions.push(`p.status = $${paramCount++}`);
    params.push(status);
  }

  // Filter by language
  if (language) {
    conditions.push(`p.language_primary = $${paramCount++}`);
    params.push(language);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC`;
  query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  const programs = result.rows;

  // Fetch topics and assets for each program
  for (const program of programs) {
    // Get topics
    const topicsResult = await pool.query(
      `SELECT t.id, t.name
       FROM topics t
       INNER JOIN program_topics pt ON pt.topic_id = t.id
       WHERE pt.program_id = $1
       ORDER BY t.name`,
      [program.id]
    );
    program.topics = topicsResult.rows;

    // Get assets
    const assetsResult = await pool.query(
      `SELECT id, language, variant, asset_type, url, created_at
       FROM program_assets
       WHERE program_id = $1
       ORDER BY language, variant`,
      [program.id]
    );
    program.assets = assetsResult.rows;
  }

  return programs;
}

/**
 * Get program by ID with all related data
 * @param {string} id - Program ID
 * @returns {Promise<Object>} - Program with topics, terms, and assets
 */
async function getProgramById(id) {
  // Get program
  const programResult = await pool.query(
    `SELECT id, title, description, language_primary, languages_available,
            status, published_at, created_at, updated_at
     FROM programs
     WHERE id = $1`,
    [id]
  );

  if (programResult.rows.length === 0) {
    const error = new Error('Program not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const program = programResult.rows[0];

  // Get topics
  const topicsResult = await pool.query(
    `SELECT t.id, t.name
     FROM topics t
     INNER JOIN program_topics pt ON pt.topic_id = t.id
     WHERE pt.program_id = $1
     ORDER BY t.name`,
    [id]
  );
  program.topics = topicsResult.rows;

  // Get terms with lesson counts
  const termsResult = await pool.query(
    `SELECT t.id, t.term_number, t.title, t.created_at,
            COUNT(l.id) as lesson_count,
            COUNT(CASE WHEN l.status = 'published' THEN 1 END) as published_lesson_count
     FROM terms t
     LEFT JOIN lessons l ON l.term_id = t.id
     WHERE t.program_id = $1
     GROUP BY t.id, t.term_number, t.title, t.created_at
     ORDER BY t.term_number`,
    [id]
  );
  program.terms = termsResult.rows;

  // Get assets
  const assetsResult = await pool.query(
    `SELECT id, language, variant, asset_type, url, created_at
     FROM program_assets
     WHERE program_id = $1
     ORDER BY language, variant`,
    [id]
  );
  program.assets = assetsResult.rows;

  return program;
}

/**
 * Create new program
 * @param {Object} data - Program data
 * @returns {Promise<Object>} - Created program
 */
async function createProgram(data) {
  const { title, description, language_primary, languages_available, status = 'draft', topics = [] } = data;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert program
    const programResult = await client.query(
      `INSERT INTO programs (title, description, language_primary, languages_available, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, language_primary, languages_available,
                 status, published_at, created_at, updated_at`,
      [title, description, language_primary, languages_available, status]
    );

    const program = programResult.rows[0];

    // Insert program-topic associations
    if (topics.length > 0) {
      for (const topicId of topics) {
        await client.query(
          `INSERT INTO program_topics (program_id, topic_id)
           VALUES ($1, $2)`,
          [program.id, topicId]
        );
      }

      // Fetch associated topics
      const topicsResult = await client.query(
        `SELECT t.id, t.name
         FROM topics t
         INNER JOIN program_topics pt ON pt.topic_id = t.id
         WHERE pt.program_id = $1`,
        [program.id]
      );
      program.topics = topicsResult.rows;
    } else {
      program.topics = [];
    }

    await client.query('COMMIT');
    return program;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Update program
 * @param {string} id - Program ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} - Updated program
 */
async function updateProgram(id, data) {
  const { title, description, language_primary, languages_available, status, topics } = data;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update program
    const programResult = await client.query(
      `UPDATE programs
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           language_primary = COALESCE($3, language_primary),
           languages_available = COALESCE($4, languages_available),
           status = COALESCE($5, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, title, description, language_primary, languages_available,
                 status, published_at, created_at, updated_at`,
      [title, description, language_primary, languages_available, status, id]
    );

    if (programResult.rows.length === 0) {
      await client.query('ROLLBACK');
      const error = new Error('Program not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const program = programResult.rows[0];

    // Update topics if provided
    if (topics !== undefined) {
      // Delete existing associations
      await client.query(
        `DELETE FROM program_topics WHERE program_id = $1`,
        [id]
      );

      // Insert new associations
      if (topics.length > 0) {
        for (const topicId of topics) {
          await client.query(
            `INSERT INTO program_topics (program_id, topic_id)
             VALUES ($1, $2)`,
            [id, topicId]
          );
        }
      }
    }

    // Fetch topics
    const topicsResult = await client.query(
      `SELECT t.id, t.name
       FROM topics t
       INNER JOIN program_topics pt ON pt.topic_id = t.id
       WHERE pt.program_id = $1`,
      [id]
    );
    program.topics = topicsResult.rows;

    await client.query('COMMIT');
    return program;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Delete program
 * @param {string} id - Program ID
 * @returns {Promise<Object>} - Deleted program
 */
async function deleteProgram(id) {
  const result = await pool.query(
    `DELETE FROM programs
     WHERE id = $1
     RETURNING id, title`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Program not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};
