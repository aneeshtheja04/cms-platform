const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// NO AUTHENTICATION - public endpoints

// GET /catalog/programs - List all published programs
router.get('/programs', catalogController.listPrograms);

// GET /catalog/programs/:id - Get single published program
router.get('/programs/:id', catalogController.getProgramById);

// GET /catalog/lessons/:id - Get single published lesson
router.get('/lessons/:id', catalogController.getLessonById);

module.exports = router;
