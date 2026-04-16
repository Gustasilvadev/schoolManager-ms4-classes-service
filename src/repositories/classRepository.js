const prisma = require('../config/prisma');
const { CLASS_STATUS } = require('../utils/constants');

const findAll = async (skip, take, where = {}) => {
  return await prisma.classes.findMany({ where, skip, take, orderBy: { class_id: 'asc' } });
};

const findById = async (id) => {
  return await prisma.classes.findUnique({
    where: { class_id: id },
    include: { class_disciplines: true, class_students: true, class_teachers: true }
  });
};

const create = async (data) => {
  return await prisma.classes.create({ data });
};

const update = async (id, data) => {
  return await prisma.classes.update({ where: { class_id: id }, data });
};

const softDelete = async (id) => {
  return await prisma.classes.update({
    where: { class_id: id },
    data: { class_status: CLASS_STATUS.DELETED }
  });
};

const count = async (where = {}) => {
  return await prisma.classes.count({ where });
};

module.exports = { 
    findAll, 
    findById, 
    create, 
    update, 
    softDelete, 
    count 
};