const disciplineService = require('../services/disciplineService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

const createDiscipline = async (req, res, next) => {
  try {
    const newDiscipline = await disciplineService.createDiscipline(req.body);
    return res.status(HTTP_STATUS.CREATED).json(newDiscipline);
  } catch (error) {
    next(error);
  }
};

const getAllDisciplines = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, discipline_name, discipline_status } = req.query;
    const filters = {};
    if (discipline_name) filters.discipline_name = discipline_name;
    if (discipline_status !== undefined) filters.discipline_status = parseInt(discipline_status);
    const result = await disciplineService.getAllDisciplines(filters, parseInt(page), parseInt(limit));
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getDisciplineById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const discipline = await disciplineService.getDisciplineById(parseInt(id));
    return res.status(HTTP_STATUS.OK).json(discipline);
  } catch (error) {
    if (error.message === MESSAGES.DISCIPLINE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const updateDiscipline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await disciplineService.updateDiscipline(parseInt(id), req.body);
    return res.status(HTTP_STATUS.OK).json(updated);
  } catch (error) {
    if (error.message === MESSAGES.DISCIPLINE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const deleteDiscipline = async (req, res, next) => {
  try {
    const { id } = req.params;
    await disciplineService.deleteDiscipline(parseInt(id));
    return res.status(HTTP_STATUS.OK).json({ message: 'Disciplina desativada com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.DISCIPLINE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const getClassesByDiscipline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classes = await disciplineService.getClassesByDiscipline(parseInt(id));
    return res.status(HTTP_STATUS.OK).json(classes);
  } catch (error) {
    if (error.message === MESSAGES.DISCIPLINE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  createDiscipline,
  getAllDisciplines,
  getDisciplineById,
  updateDiscipline,
  deleteDiscipline,
  getClassesByDiscipline
};