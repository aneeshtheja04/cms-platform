const pool = require('../config/db');
const { comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<{user: Object, token: string}>} - User object and JWT token
 */
async function login(email, password) {
  // Query user by email (only active users)
  const result = await pool.query(
    `SELECT id, email, password_hash, name, role, is_active
     FROM users
     WHERE email = $1 AND is_active = true`,
    [email]
  );

  // Check if user exists
  if (result.rows.length === 0) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const user = result.rows[0];

  // Compare password
  const passwordMatch = await comparePassword(password, user.password_hash);

  if (!passwordMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user (without password_hash) and token
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

/**
 * Get user by ID (for /me endpoint)
 * @param {string} id - User ID
 * @returns {Promise<Object>} - User object without password
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

module.exports = {
  login,
  getUserById,
};
