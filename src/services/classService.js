const classRepo = require('../repositories/classRepository');
const classStudentRepo = require('../repositories/classStudentRepository');
const classTeacherRepo = require('../repositories/classTeacherRepository');
const classDisciplineRepo = require('../repositories/classDisciplineRepository');
const { CLASS_STATUS, MESSAGES } = require('../utils/constants');

// --- CRUD de Turmas ---
const createClass = async (data) => {
  const newClass = await classRepo.create(data);
  return newClass;
};

const getAllClasses = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.class_name) where.class_name = { contains: filters.class_name };
  if (filters.class_school_year) where.class_school_year = { contains: filters.class_school_year };
  if (filters.class_status !== undefined) where.class_status = filters.class_status;

  const classes = await classRepo.findAll(skip, limit, where);
  const total = await classRepo.count(where);
  return { classes, total, page, limit };
};

const getClassById = async (id) => {
  const classData = await classRepo.findById(id);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  return classData;
};

const updateClass = async (id, updateData) => {
  const existing = await classRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  const updated = await classRepo.update(id, updateData);
  return updated;
};

const deleteClass = async (id) => {
  const existing = await classRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  await classRepo.softDelete(id);
  return true;
};

// --- Matrícula de Alunos ---
const enrollStudent = async (classId, studentId) => {
  // Verificar se a turma existe
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);

  // Verificar se o aluno já está matriculado
  const existing = await classStudentRepo.findOne(classId, studentId);
  if (existing) throw new Error(MESSAGES.STUDENT_ALREADY_ENROLLED);

  // FUTURO: validar se studentId existe no StudentService (via HTTP ou RabbitMQ)
  // Por enquanto, apenas insere

  const enrollment = await classStudentRepo.enroll(classId, studentId);
  return enrollment;
};

const unenrollStudent = async (classId, studentId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);

  const existing = await classStudentRepo.findOne(classId, studentId);
  if (!existing) throw new Error('Aluno não está matriculado nesta turma');

  await classStudentRepo.remove(classId, studentId);
  return true;
};

const getStudentsByClass = async (classId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  const students = await classStudentRepo.findByClass(classId);
  return students;
};

// --- Alocação de Professores ---
const assignTeacher = async (classId, teacherId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);

  const existing = await classTeacherRepo.findOne(classId, teacherId);
  if (existing) throw new Error(MESSAGES.TEACHER_ALREADY_ASSIGNED);

  const assignment = await classTeacherRepo.assign(classId, teacherId);
  return assignment;
};

const unassignTeacher = async (classId, teacherId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);

  const existing = await classTeacherRepo.findOne(classId, teacherId);
  if (!existing) throw new Error('Professor não está alocado nesta turma');

  await classTeacherRepo.remove(classId, teacherId);
  return true;
};

const getTeachersByClass = async (classId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  const teachers = await classTeacherRepo.findByClass(classId);
  return teachers;
};

// --- Disciplinas por Turma ---
const addDisciplineToClass = async (classId, disciplineId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);

  const existing = await classDisciplineRepo.findOne(classId, disciplineId);
  if (existing) throw new Error(MESSAGES.DISCIPLINE_ALREADY_IN_CLASS);

  const association = await classDisciplineRepo.add(classId, disciplineId);
  return association;
};

const removeDisciplineFromClass = async (classId, disciplineId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);

  const existing = await classDisciplineRepo.findOne(classId, disciplineId);
  if (!existing) throw new Error('Disciplina não está associada a esta turma');

  await classDisciplineRepo.remove(classId, disciplineId);
  return true;
};

const getDisciplinesByClass = async (classId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  const disciplines = await classDisciplineRepo.findByClass(classId);
  return disciplines;
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  enrollStudent,
  unenrollStudent,
  getStudentsByClass,
  assignTeacher,
  unassignTeacher,
  getTeachersByClass,
  addDisciplineToClass,
  removeDisciplineFromClass,
  getDisciplinesByClass
};