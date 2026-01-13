const programService = require('../services/programService');

/**
 * GET /api/programs
 * List all programs with optional filters
 */
async function list(req, res, next) {
  try {
    const { status, language, topic_id, limit, offset } = req.query;

    const programs = await programService.getAllPrograms({
      status,
      language,
      topic_id,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    res.json(programs);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/programs/:id
 * Get program by ID with all related data
 */
async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const program = await programService.getProgramById(id);
    res.json(program);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/programs
 * Create new program
 */
async function create(req, res, next) {
  try {
    const { title, description, language_primary, languages_available, status, topics } = req.body;

    // Manual validation
    if (!title || !language_primary || !languages_available) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Title, language_primary, and languages_available are required',
        details: {
          title: !title ? 'Title is required' : undefined,
          language_primary: !language_primary ? 'Primary language is required' : undefined,
          languages_available: !languages_available ? 'Available languages are required' : undefined,
        },
      });
    }

    // Validate languages_available is array
    if (!Array.isArray(languages_available)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'languages_available must be an array',
      });
    }

    // Validate primary language is in available languages
    if (!languages_available.includes(language_primary)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Primary language must be included in available languages',
      });
    }

    const program = await programService.createProgram({
      title,
      description,
      language_primary,
      languages_available,
      status,
      topics,
    });

    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/programs/:id
 * Update program
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, language_primary, languages_available, status, topics } = req.body;

    // Validate languages_available if provided
    if (languages_available && !Array.isArray(languages_available)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'languages_available must be an array',
      });
    }

    // Validate primary language is in available languages if both provided
    if (language_primary && languages_available && !languages_available.includes(language_primary)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Primary language must be included in available languages',
      });
    }

    const program = await programService.updateProgram(id, {
      title,
      description,
      language_primary,
      languages_available,
      status,
      topics,
    });

    res.json(program);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/programs/:id
 * Delete program
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const program = await programService.deleteProgram(id);
    res.json({
      message: 'Program deleted successfully',
      program,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
