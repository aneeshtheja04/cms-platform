const topicService = require('../services/topicService');

/**
 * GET /api/topics
 * List all topics
 */
async function list(req, res, next) {
  try {
    const topics = await topicService.getAllTopics();
    res.json(topics);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/topics/:id
 * Get topic by ID
 */
async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const topic = await topicService.getTopicById(id);
    res.json(topic);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/topics
 * Create new topic
 */
async function create(req, res, next) {
  try {
    const { name } = req.body;

    // Manual validation
    if (!name) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Topic name is required',
      });
    }

    const topic = await topicService.createTopic({ name });
    res.status(201).json(topic);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/topics/:id
 * Update topic
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Manual validation
    if (!name) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Topic name is required',
      });
    }

    const topic = await topicService.updateTopic(id, { name });
    res.json(topic);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/topics/:id
 * Delete topic
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const topic = await topicService.deleteTopic(id);
    res.json({
      message: 'Topic deleted successfully',
      topic,
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
