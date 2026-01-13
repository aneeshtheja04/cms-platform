const express = require('express');
const router = express.Router();
const termController = require('../controllers/termController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

router.use(authenticate);

router.get('/', termController.list);
router.get('/:id', termController.getById);
router.post('/', authorize('admin', 'editor'), termController.create);
router.put('/:id', authorize('admin', 'editor'), termController.update);
router.delete('/:id', authorize('admin'), termController.remove);

module.exports = router;
