const userService = require('../services/userService');

/**
 * GET /api/users
 * List all users
 */
async function list(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/users/:id
 * Get user by ID
 */
async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/users
 * Create new user
 */
async function create(req, res, next) {
  try {
    const { email, password, name, role } = req.body;

    // Manual validation
    if (!email || !password || !name) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Email, password, and name are required',
        details: {
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
          name: !name ? 'Name is required' : undefined,
        },
      });
    }

    // Validate role if provided
    const validRoles = ['admin', 'editor', 'viewer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
      });
    }

    const user = await userService.createUser({ email, password, name, role });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/users/:id
 * Update user
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { name, role, is_active } = req.body;

    // Validate role if provided
    const validRoles = ['admin', 'editor', 'viewer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
      });
    }

    const user = await userService.updateUser(id, { name, role, is_active });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/users/:id
 * Deactivate user
 */
async function deactivate(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.deactivateUser(id);
    res.json({
      message: 'User deactivated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  deactivate,
};
