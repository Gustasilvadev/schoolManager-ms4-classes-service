const disciplineRepo = require('../repositories/disciplineRepository');
const classDisciplineRepo = require('../repositories/classDisciplineRepository');
const { DISCIPLINE_STATUS, MESSAGES, ROLES } = require('../utils/constants');

const createDiscipline = async (data) => {
  const newDiscipline = await disciplineRepo.create(data);
  return newDiscipline;
};

const getAllDisciplines = async (filters = {}, page = 1, limit = 10, userRole = ROLES.ADMIN) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.discipline_name) where.discipline_name = { contains: filters.discipline_name };

  if (userRole === ROLES.TEACHER) {
    where.discipline_status = DISCIPLINE_STATUS.ACTIVE;
  } else if (filters.discipline_status !== undefined) {
    where.discipline_status = filters.discipline_status;
  } else if (filters.includeDeleted !== true) {
    where.discipline_status = { in: [DISCIPLINE_STATUS.ACTIVE, DISCIPLINE_STATUS.INACTIVE] };
  }

  const disciplines = await disciplineRepo.findAll(skip, limit, where);
  const total = await disciplineRepo.count(where);
  return { disciplines, total, page, limit };
};

const getDisciplineById = async (id) => {
  const discipline = await disciplineRepo.findById(id);
  if (!discipline) throw new Error(MESSAGES.DISCIPLINE_NOT_FOUND);
  return discipline;
};

const updateDiscipline = async (id, updateData) => {
  const existing = await disciplineRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.DISCIPLINE_NOT_FOUND);
  if (existing.discipline_status === DISCIPLINE_STATUS.DELETED) {
    throw new Error(MESSAGES.CANNOT_EDIT_DELETED_DISCIPLINE);
  }
  const updated = await disciplineRepo.update(id, updateData);
  return updated;
};

const deleteDiscipline = async (id) => {
  const existing = await disciplineRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.DISCIPLINE_NOT_FOUND);
  await disciplineRepo.softDelete(id);
  return true;
};

const restoreDiscipline = async (id) => {
  const existing = await disciplineRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.DISCIPLINE_NOT_FOUND);
  if (existing.discipline_status !== DISCIPLINE_STATUS.DELETED) {
    throw new Error(MESSAGES.NOT_DELETED_CANNOT_RESTORE);
  }
  return await disciplineRepo.restore(id);
};

const getClassesByDiscipline = async (disciplineId) => {
  const discipline = await disciplineRepo.findById(disciplineId);
  if (!discipline) throw new Error(MESSAGES.DISCIPLINE_NOT_FOUND);
  const classes = await classDisciplineRepo.findByDiscipline(disciplineId);
  return classes;
};

module.exports = {
  createDiscipline,
  getAllDisciplines,
  getDisciplineById,
  updateDiscipline,
  deleteDiscipline,
  restoreDiscipline,
  getClassesByDiscipline
};