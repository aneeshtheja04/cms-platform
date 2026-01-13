const lessonService = require('../services/lessonService');

async function list(req, res, next) {
  try {
    const { term_id, status, content_type, limit, offset } = req.query;
    const lessons = await lessonService.getAllLessons({
      term_id,
      status,
      content_type,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
    res.json(lessons);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await lessonService.getLessonById(id);
    res.json(lesson);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const {
      term_id, lesson_number, title, content_type, duration_ms, is_paid,
      content_language_primary, content_languages_available, content_urls_by_language,
      subtitle_languages, subtitle_urls_by_language, status, publish_at
    } = req.body;

    // Validation
    if (!term_id || !lesson_number || !title || !content_type ||
        !content_language_primary || !content_languages_available || !content_urls_by_language) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Required fields missing',
      });
    }

    if (content_type === 'video' && !duration_ms) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'duration_ms is required for video lessons',
      });
    }

    if (status === 'scheduled' && !publish_at) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'publish_at is required for scheduled lessons',
      });
    }

    const lesson = await lessonService.createLesson({
      term_id, lesson_number, title, content_type, duration_ms, is_paid,
      content_language_primary, content_languages_available, content_urls_by_language,
      subtitle_languages, subtitle_urls_by_language, status, publish_at
    });

    res.status(201).json(lesson);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await lessonService.updateLesson(id, req.body);
    res.json(lesson);
  } catch (error) {
    next(error);
  }
}

async function publish(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await lessonService.publishLesson(id);
    res.json({
      message: 'Lesson published successfully',
      lesson,
    });
  } catch (error) {
    next(error);
  }
}

async function schedule(req, res, next) {
  try {
    const { id } = req.params;
    const { publish_at } = req.body;

    if (!publish_at) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'publish_at is required',
      });
    }

    const lesson = await lessonService.scheduleLesson(id, publish_at);
    res.json({
      message: 'Lesson scheduled successfully',
      lesson,
    });
  } catch (error) {
    next(error);
  }
}

async function archive(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await lessonService.archiveLesson(id);
    res.json({
      message: 'Lesson archived successfully',
      lesson,
    });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await lessonService.deleteLesson(id);
    res.json({
      message: 'Lesson deleted successfully',
      lesson,
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
  publish,
  schedule,
  archive,
  remove,
};
