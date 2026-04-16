const classService = require('../services/classService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

// --- CRUD Turmas ---
const createClass = async (req, res, next) => {
  try {
    const newClass = await classService.createClass(req.body);
    return res.status(HTTP_STATUS.CREATED).json(newClass);
  } catch (error) {
    next(error);
  }
};

const getAllClasses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, class_name, class_school_year, class_status } = req.query;
    const filters = {};
    if (class_name) filters.class_name = class_name;
    if (class_school_year) filters.class_school_year = class_school_year;
    if (class_status !== undefined) filters.class_status = parseInt(class_status);
    const result = await classService.getAllClasses(filters, parseInt(page), parseInt(limit));
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classData = await classService.getClassById(parseInt(id));
    return res.status(HTTP_STATUS.OK).json(classData);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await classService.updateClass(parseInt(id), req.body);
    return res.status(HTTP_STATUS.OK).json(updated);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    await classService.deleteClass(parseInt(id));
    return res.status(HTTP_STATUS.OK).json({ message: 'Turma desativada com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

// --- Matrículas ---
const enrollStudent = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const { student_id } = req.body;
    const enrollment = await classService.enrollStudent(classId, student_id);
    return res.status(HTTP_STATUS.CREATED).json(enrollment);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND || error.message === 'Aluno não está matriculado nesta turma') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.STUDENT_ALREADY_ENROLLED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const unenrollStudent = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const studentId = parseInt(req.params.studentId);
    await classService.unenrollStudent(classId, studentId);
    return res.status(HTTP_STATUS.OK).json({ message: 'Aluno removido da turma com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND || error.message === 'Aluno não está matriculado nesta turma') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const getStudentsByClass = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const students = await classService.getStudentsByClass(classId);
    return res.status(HTTP_STATUS.OK).json(students);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

// --- Alocação de Professores ---
const assignTeacher = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const { teacher_id } = req.body;
    const assignment = await classService.assignTeacher(classId, teacher_id);
    return res.status(HTTP_STATUS.CREATED).json(assignment);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND || error.message === 'Professor não está alocado nesta turma') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.TEACHER_ALREADY_ASSIGNED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const unassignTeacher = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const teacherId = parseInt(req.params.teacherId);
    await classService.unassignTeacher(classId, teacherId);
    return res.status(HTTP_STATUS.OK).json({ message: 'Professor removido da turma com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND || error.message === 'Professor não está alocado nesta turma') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const getTeachersByClass = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const teachers = await classService.getTeachersByClass(classId);
    return res.status(HTTP_STATUS.OK).json(teachers);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

// --- Disciplinas por Turma ---
const addDisciplineToClass = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const { discipline_id } = req.body;
    const association = await classService.addDisciplineToClass(classId, discipline_id);
    return res.status(HTTP_STATUS.CREATED).json(association);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND || error.message === 'Disciplina não está associada a esta turma') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.DISCIPLINE_ALREADY_IN_CLASS) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const removeDisciplineFromClass = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const disciplineId = parseInt(req.params.disciplineId);
    await classService.removeDisciplineFromClass(classId, disciplineId);
    return res.status(HTTP_STATUS.OK).json({ message: 'Disciplina removida da turma com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND || error.message === 'Disciplina não está associada a esta turma') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const getDisciplinesByClass = async (req, res, next) => {
  try {
    const classId = parseInt(req.params.id);
    const disciplines = await classService.getDisciplinesByClass(classId);
    return res.status(HTTP_STATUS.OK).json(disciplines);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
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