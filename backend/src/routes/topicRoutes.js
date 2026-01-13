const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// All routes require authentication
router.use(authenticate);

// GET /api/topics - List all topics (all roles)
router.get('/', topicController.list);

// GET /api/topics/:id - Get topic by ID (all roles)
router.get('/:id', topicController.getById);

// POST /api/topics - Create topic (admin, editor)
router.post('/', authorize('admin', 'editor'), topicController.create);

// PUT /api/topics/:id - Update topic (admin, editor)
router.put('/:id', authorize('admin', 'editor'), topicController.update);

// DELETE /api/topics/:id - Delete topic (admin only)
router.delete('/:id', authorize('admin'), topicController.remove);

module.exports = router;
