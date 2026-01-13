const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

router.use(authenticate);

router.get('/', lessonController.list);
router.get('/:id', lessonController.getById);
router.post('/', authorize('admin', 'editor'), lessonController.create);
router.put('/:id', authorize('admin', 'editor'), lessonController.update);
router.post('/:id/publish', authorize('admin', 'editor'), lessonController.publish);
router.post('/:id/schedule', authorize('admin', 'editor'), lessonController.schedule);
router.post('/:id/archive', authorize('admin', 'editor'), lessonController.archive);
router.delete('/:id', authorize('admin'), lessonController.remove);

module.exports = router;
