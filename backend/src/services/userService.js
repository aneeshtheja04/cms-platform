const pool = require('../config/db');
const { hashPassword } = require('../utils/hash');

/**
 * Get all users
 * @returns {Promise<Array>} - Array of users (without password_hash)
 */
async function getAllUsers() {
  const result = await pool.query(
    `SELECT id, email, name, role, is_active, created_at, updated_at
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows;
}

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} - User object
 */
async function getUserById(id) {
  const result = await pool.query(
    `SELECT id, email, name, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('User not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

/**
 * Create new user
 * @param {Object} data - User data
 * @returns {Promise<Object>} - Created user
 */
async function createUser(data) {
  const { email, password, name, role = 'viewer' } = data;

  // Hash password
  const passwordHash = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role, is_active, created_at, updated_at`,
    [email, passwordHash, name, role]
  );

  return result.rows[0];
}

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} - Updated user
 */
async function updateUser(id, data) {
  const { name, role, is_active } = data;

  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         role = COALESCE($2, role),
         is_active = COALESCE($3, is_active),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, email, name, role, is_active, created_at, updated_at`,
    [name, role, is_active, id]
  );

  if (result.rows.length === 0) {
    const error = new Error('User not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

/**
 * Deactivate user (soft delete)
 * @param {string} id - User ID
 * @returns {Promise<Object>} - Deactivated user
 */
async function deactivateUser(id) {
  const result = await pool.query(
    `UPDATE users
     SET is_active = false,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, email, name, role, is_active, created_at, updated_at`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('User not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return result.rows[0];
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
};
