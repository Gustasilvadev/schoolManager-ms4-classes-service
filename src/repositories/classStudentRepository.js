const prisma = require('../config/prisma');

const enroll = async (classId, studentId) => {
  return await prisma.class_students.create({
    data: { class_id: classId, student_id: studentId }
  });
};

const remove = async (classId, studentId) => {
  return await prisma.class_students.deleteMany({
    where: { class_id: classId, student_id: studentId }
  });
};

const findByClass = async (classId) => {
  return await prisma.class_students.findMany({
    where: { class_id: classId },
    include: { classes: true } // ou apenas retornar os IDs
  });
};

const findByStudent = async (studentId) => {
  return await prisma.class_students.findMany({
    where: { student_id: studentId },
    include: { classes: true }
  });
};

const findOne = async (classId, studentId) => {
  return await prisma.class_students.findFirst({
    where: { class_id: classId, student_id: studentId }
  });
};

module.exports = { 
    enroll, 
    remove, 
    findByClass, 
    findByStudent, 
    findOne 
};