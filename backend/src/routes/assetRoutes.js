const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

router.use(authenticate);

// Program Assets
router.get('/program-assets', assetController.listProgramAssets);
router.post('/program-assets', authorize('admin', 'editor'), assetController.createProgramAsset);
router.delete('/program-assets/:id', authorize('admin', 'editor'), assetController.deleteProgramAsset);

// Lesson Assets
router.get('/lesson-assets', assetController.listLessonAssets);
router.post('/lesson-assets', authorize('admin', 'editor'), assetController.createLessonAsset);
router.delete('/lesson-assets/:id', authorize('admin', 'editor'), assetController.deleteLessonAsset);

module.exports = router;
