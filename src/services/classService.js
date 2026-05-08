const classRepo = require('../repositories/classRepository');
const classStudentRepo = require('../repositories/classStudentRepository');
const classTeacherRepo = require('../repositories/classTeacherRepository');
const classDisciplineRepo = require('../repositories/classDisciplineRepository');
const { getTeacherDisciplineIds } = require('../utils/teachersClient');
const { CLASS_STATUS, MESSAGES } = require('../utils/constants');

const isTeacher = (user) => user?.role === 'TEACHER';

const assertTeacherCanAccessClass = async (classId, user) => {
  if (!isTeacher(user)) return;
  if (!user.teacher_id) throw new Error(MESSAGES.FORBIDDEN);
  const link = await classTeacherRepo.findOne(classId, user.teacher_id);
  if (!link) throw new Error(MESSAGES.FORBIDDEN);
};

const createClass = async (data) => {
  const newClass = await classRepo.create(data);
  return newClass;
};

const getAllClasses = async (filters = {}, page = 1, limit = 10, currentUser = null) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.class_name) where.class_name = { contains: filters.class_name };
  if (filters.class_school_year) where.class_school_year = { contains: filters.class_school_year };
  if (filters.class_status !== undefined) where.class_status = filters.class_status;

  if (isTeacher(currentUser)) {
    if (!currentUser.teacher_id) {
      return { classes: [], total: 0, page, limit };
    }
    const links = await classTeacherRepo.findByTeacher(currentUser.teacher_id);
    const allowedClassIds = links.map((l) => l.class_id);
    if (allowedClassIds.length === 0) {
      return { classes: [], total: 0, page, limit };
    }
    where.class_id = { in: allowedClassIds };
  }

  const classes = await classRepo.findAll(skip, limit, where);
  const total = await classRepo.count(where);
  return { classes, total, page, limit };
};

const getClassById = async (id, currentUser = null) => {
  const classData = await classRepo.findById(id);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  await assertTeacherCanAccessClass(id, currentUser);
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

const enrollStudent = async (classId, studentId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);

  const existing = await classStudentRepo.findOne(classId, studentId);
  if (existing) throw new Error(MESSAGES.STUDENT_ALREADY_ENROLLED);

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

const getStudentsByClass = async (classId, currentUser = null) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  await assertTeacherCanAccessClass(classId, currentUser);
  const students = await classStudentRepo.findByClass(classId);
  return students;
};

const assignTeacher = async (classId, teacherId) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);

  const existing = await classTeacherRepo.findOne(classId, teacherId);
  if (existing) throw new Error(MESSAGES.TEACHER_ALREADY_ASSIGNED);

  // Sem retorno do MS3 (timeout/null) bloqueia alocação por segurança — evita professor sem habilitação confirmada.
  const teacherDisciplineIds = await getTeacherDisciplineIds(teacherId);
  if (teacherDisciplineIds === null) {
    throw new Error(MESSAGES.TEACHER_NOT_QUALIFIED);
  }
  const classDisciplines = await classDisciplineRepo.findByClass(classId);
  const classDisciplineIds = classDisciplines.map((cd) => cd.discipline_id);
  const intersect = classDisciplineIds.filter((id) => teacherDisciplineIds.includes(id));
  if (intersect.length === 0) {
    throw new Error(MESSAGES.TEACHER_NOT_QUALIFIED);
  }

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

const getTeachersByClass = async (classId, currentUser = null) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  await assertTeacherCanAccessClass(classId, currentUser);
  const teachers = await classTeacherRepo.findByClass(classId);
  return teachers;
};

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

const getDisciplinesByClass = async (classId, currentUser = null) => {
  const classData = await classRepo.findById(classId);
  if (!classData) throw new Error(MESSAGES.CLASS_NOT_FOUND);
  await assertTeacherCanAccessClass(classId, currentUser);
  const disciplines = await classDisciplineRepo.findByClass(classId);
  return disciplines;
};

const isTeacherOfClassDiscipline = async (teacherId, classDisciplineId) => {
  const classDiscipline = await classDisciplineRepo.findById(classDisciplineId);
  if (!classDiscipline) return false;
  const link = await classTeacherRepo.findOne(classDiscipline.class_id, teacherId);
  return Boolean(link);
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
  getDisciplinesByClass,
  isTeacherOfClassDiscipline
};
