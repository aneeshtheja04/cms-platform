const termService = require('../services/termService');

async function list(req, res, next) {
  try {
    const { program_id } = req.query;
    const terms = await termService.getAllTerms({ program_id });
    res.json(terms);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const term = await termService.getTermById(id);
    res.json(term);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { program_id, term_number, title } = req.body;

    if (!program_id || !term_number) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'program_id and term_number are required',
      });
    }

    const term = await termService.createTerm({ program_id, term_number, title });
    res.status(201).json(term);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const term = await termService.updateTerm(id, { title });
    res.json(term);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const term = await termService.deleteTerm(id);
    res.json({
      message: 'Term deleted successfully',
      term,
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
