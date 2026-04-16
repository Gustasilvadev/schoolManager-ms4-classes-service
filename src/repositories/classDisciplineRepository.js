const prisma = require('../config/prisma');

const add = async (classId, disciplineId) => {
  return await prisma.class_disciplines.create({
    data: { class_id: classId, discipline_id: disciplineId }
  });
};

const remove = async (classId, disciplineId) => {
  return await prisma.class_disciplines.deleteMany({
    where: { class_id: classId, discipline_id: disciplineId }
  });
};

const findByClass = async (classId) => {
  return await prisma.class_disciplines.findMany({
    where: { class_id: classId },
    include: { disciplines: true }
  });
};

const findByDiscipline = async (disciplineId) => {
  return await prisma.class_disciplines.findMany({
    where: { discipline_id: disciplineId },
    include: { classes: true }
  });
};

const findOne = async (classId, disciplineId) => {
  return await prisma.class_disciplines.findFirst({
    where: { class_id: classId, discipline_id: disciplineId }
  });
};

module.exports = { 
    add, 
    remove, 
    findByClass, 
    findByDiscipline, 
    findOne 
};