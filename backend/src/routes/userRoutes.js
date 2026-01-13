const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// All routes require authentication
router.use(authenticate);

// GET /api/users - List all users (admin only)
router.get('/', authorize('admin'), userController.list);

// GET /api/users/:id - Get user by ID (admin, editor)
router.get('/:id', authorize('admin', 'editor'), userController.getById);

// POST /api/users - Create user (admin only)
router.post('/', authorize('admin'), userController.create);

// PUT /api/users/:id - Update user (admin, editor)
router.put('/:id', authorize('admin', 'editor'), userController.update);

// DELETE /api/users/:id - Deactivate user (admin only)
router.delete('/:id', authorize('admin'), userController.deactivate);

module.exports = router;
