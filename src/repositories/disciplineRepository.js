const prisma = require('../config/prisma');
const { DISCIPLINE_STATUS } = require('../utils/constants');

const findAll = async (skip, take, where = {}) => {
  return await prisma.disciplines.findMany({ where, skip, take, orderBy: { discipline_id: 'asc' } });
};

const findById = async (id) => {
  return await prisma.disciplines.findUnique({ where: { discipline_id: id } });
};

const create = async (data) => {
  return await prisma.disciplines.create({ data });
};

const update = async (id, data) => {
  return await prisma.disciplines.update({ where: { discipline_id: id }, data });
};

const softDelete = async (id) => {
  return await prisma.disciplines.update({
    where: { discipline_id: id },
    data: { discipline_status: DISCIPLINE_STATUS.DELETED }
  });
};

const restore = async (id) => {
  return await prisma.disciplines.update({
    where: { discipline_id: id },
    data: { discipline_status: DISCIPLINE_STATUS.ACTIVE }
  });
};

const count = async (where = {}) => {
  return await prisma.disciplines.count({ where });
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    softDelete,
    restore,
    count
};