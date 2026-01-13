/**
 * Role-Based Access Control middleware
 * Checks if authenticated user has one of the required roles
 *
 * @param {...string} allowedRoles - Roles that are allowed (e.g., 'admin', 'editor')
 * @returns {Function} Express middleware function
 *
 * @example
 * router.get('/users', authenticate, authorize('admin'), userController.list);
 * router.post('/topics', authenticate, authorize('admin', 'editor'), topicController.create);
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
        details: { userRole: req.user.role, requiredRoles: allowedRoles },
      });
    }

    next();
  };
}

module.exports = authorize;
