const catalogService = require('../services/catalogService');

/**
 * GET /catalog/programs
 * List all published programs with cursor pagination
 */
async function listPrograms(req, res, next) {
  try {
    const { language, topic, cursor, limit } = req.query;

    const result = await catalogService.getPublishedPrograms({
      language,
      topic_id: topic,
      cursor,
      limit: limit ? Math.min(parseInt(limit), 100) : 20
    });

    // Add cache headers (5 minutes)
    res.set('Cache-Control', 'public, max-age=300');
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /catalog/programs/:id
 * Get single published program with terms and published lessons
 */
async function getProgramById(req, res, next) {
  try {
    const { id } = req.params;
    const program = await catalogService.getPublishedProgramById(id);

    // Add cache headers (10 minutes)
    res.set('Cache-Control', 'public, max-age=600');
    res.json(program);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /catalog/lessons/:id
 * Get single published lesson
 */
async function getLessonById(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await catalogService.getPublishedLessonById(id);

    // Add cache headers (10 minutes)
    res.set('Cache-Control', 'public, max-age=600');
    res.json(lesson);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPrograms,
  getProgramById,
  getLessonById
};
