const pool = require('../config/db');

/**
 * Get all topics
 * @returns {Promise<Array>} - Array of topics
 */
async function getAllTopics() {
  const result = await pool.query(
    `SELECT id, name, created_at
     FROM topics
     ORDER BY name`
  );

  return result.rows;
}

/**
 * Get topic by ID
 * @param {string} id - Topic ID
 * @returns {Promise<Object>} - Topic object
 */
async function getTopicById(id) {
  const result = await pool.query(
    `SELECT id, name, created_at
     FROM topics
     WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Topic not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

/**
 * Create new topic
 * @param {Object} data - Topic data
 * @returns {Promise<Object>} - Created topic
 */
async function createTopic(data) {
  const { name } = data;

  const result = await pool.query(
    `INSERT INTO topics (name)
     VALUES ($1)
     RETURNING id, name, created_at`,
    [name]
  );

  return result.rows[0];
}

/**
 * Update topic
 * @param {string} id - Topic ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} - Updated topic
 */
async function updateTopic(id, data) {
  const { name } = data;

  const result = await pool.query(
    `UPDATE topics
     SET name = $1
     WHERE id = $2
     RETURNING id, name, created_at`,
    [name, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Topic not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

/**
 * Delete topic
 * @param {string} id - Topic ID
 * @returns {Promise<Object>} - Deleted topic
 */
async function deleteTopic(id) {
  const result = await pool.query(
    `DELETE FROM topics
     WHERE id = $1
     RETURNING id, name, created_at`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Topic not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

module.exports = {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
};
