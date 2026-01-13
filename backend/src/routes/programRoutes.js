const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// All routes require authentication
router.use(authenticate);

// GET /api/programs - List all programs with filters (all roles)
router.get('/', programController.list);

// GET /api/programs/:id - Get program by ID (all roles)
router.get('/:id', programController.getById);

// POST /api/programs - Create program (admin, editor)
router.post('/', authorize('admin', 'editor'), programController.create);

// PUT /api/programs/:id - Update program (admin, editor)
router.put('/:id', authorize('admin', 'editor'), programController.update);

// DELETE /api/programs/:id - Delete program (admin only)
router.delete('/:id', authorize('admin'), programController.remove);

module.exports = router;
