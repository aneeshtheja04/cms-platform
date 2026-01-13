const assetService = require('../services/assetService');

// ============ PROGRAM ASSETS ============

async function listProgramAssets(req, res, next) {
  try {
    const { program_id } = req.query;

    if (!program_id) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'program_id query parameter is required',
      });
    }

    const assets = await assetService.getProgramAssets(program_id);
    res.json(assets);
  } catch (error) {
    next(error);
  }
}

async function createProgramAsset(req, res, next) {
  try {
    const { program_id, language, variant, url } = req.body;

    if (!program_id || !language || !variant || !url) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'program_id, language, variant, and url are required',
      });
    }

    const validVariants = ['portrait', 'landscape', 'square', 'banner'];
    if (!validVariants.includes(variant)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: `Invalid variant. Must be one of: ${validVariants.join(', ')}`,
      });
    }

    const asset = await assetService.createProgramAsset({ program_id, language, variant, url });
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
}

async function deleteProgramAsset(req, res, next) {
  try {
    const { id } = req.params;
    const asset = await assetService.deleteProgramAsset(id);
    res.json({
      message: 'Program asset deleted successfully',
      asset,
    });
  } catch (error) {
    next(error);
  }
}

// ============ LESSON ASSETS ============

async function listLessonAssets(req, res, next) {
  try {
    const { lesson_id } = req.query;

    if (!lesson_id) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'lesson_id query parameter is required',
      });
    }

    const assets = await assetService.getLessonAssets(lesson_id);
    res.json(assets);
  } catch (error) {
    next(error);
  }
}

async function createLessonAsset(req, res, next) {
  try {
    const { lesson_id, language, variant, url } = req.body;

    if (!lesson_id || !language || !variant || !url) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'lesson_id, language, variant, and url are required',
      });
    }

    const validVariants = ['portrait', 'landscape', 'square', 'banner'];
    if (!validVariants.includes(variant)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: `Invalid variant. Must be one of: ${validVariants.join(', ')}`,
      });
    }

    const asset = await assetService.createLessonAsset({ lesson_id, language, variant, url });
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
}

async function deleteLessonAsset(req, res, next) {
  try {
    const { id } = req.params;
    const asset = await assetService.deleteLessonAsset(id);
    res.json({
      message: 'Lesson asset deleted successfully',
      asset,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProgramAssets,
  createProgramAsset,
  deleteProgramAsset,
  listLessonAssets,
  createLessonAsset,
  deleteLessonAsset,
};
