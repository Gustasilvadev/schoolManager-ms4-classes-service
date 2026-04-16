const prisma = require('../config/prisma');

const assign = async (classId, teacherId) => {
  return await prisma.class_teachers.create({
    data: { class_id: classId, teacher_id: teacherId }
  });
};

const remove = async (classId, teacherId) => {
  return await prisma.class_teachers.deleteMany({
    where: { class_id: classId, teacher_id: teacherId }
  });
};

const findByClass = async (classId) => {
  return await prisma.class_teachers.findMany({ where: { class_id: classId } });
};

const findByTeacher = async (teacherId) => {
  return await prisma.class_teachers.findMany({ where: { teacher_id: teacherId } });
};

const findOne = async (classId, teacherId) => {
  return await prisma.class_teachers.findFirst({
    where: { class_id: classId, teacher_id: teacherId }
  });
};

module.exports = { 
    assign, 
    remove, 
    findByClass, 
    findByTeacher, 
    findOne 
};