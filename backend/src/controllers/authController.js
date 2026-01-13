const authService = require('../services/authService');

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Manual validation
    if (!email || !password) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required',
        details: {
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
        },
      });
    }

    // Call service
    const result = await authService.login(email, password);

    // Return success response
    res.json({
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
async function me(req, res, next) {
  try {
    // req.user is set by authenticate middleware
    const user = await authService.getUserById(req.user.id);

    res.json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  me,
};
