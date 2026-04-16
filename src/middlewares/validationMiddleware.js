const { body, validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../utils/constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const validateCreateClass = [
  body('class_name').notEmpty().withMessage('Nome da turma é obrigatório').isLength({ max: 45 }),
  body('class_school_year').notEmpty().withMessage('Ano letivo é obrigatório').isLength({ max: 45 }),
  body('class_status').optional().isInt({ min: 0, max: 2 }),
  validate
];

const validateUpdateClass = [
  body('class_name').optional().notEmpty().isLength({ max: 45 }),
  body('class_school_year').optional().notEmpty().isLength({ max: 45 }),
  body('class_status').optional().isInt({ min: 0, max: 2 }),
  validate
];

const validateCreateDiscipline = [
  body('discipline_name').notEmpty().withMessage('Nome da disciplina é obrigatório').isLength({ max: 45 }),
  body('discipline_hour').isInt({ min: 1 }).withMessage('Carga horária deve ser positiva'),
  body('discipline_status').optional().isInt({ min: 0, max: 2 }),
  validate
];

const validateUpdateDiscipline = [
  body('discipline_name').optional().notEmpty().isLength({ max: 45 }),
  body('discipline_hour').optional().isInt({ min: 1 }),
  body('discipline_status').optional().isInt({ min: 0, max: 2 }),
  validate
];

const validateEnrollStudent = [
  body('student_id').isInt({ min: 1 }).withMessage('ID do aluno é obrigatório'),
  validate
];

const validateAssignTeacher = [
  body('teacher_id').isInt({ min: 1 }).withMessage('ID do professor é obrigatório'),
  validate
];

const validateAddDisciplineToClass = [
  body('discipline_id').isInt({ min: 1 }).withMessage('ID da disciplina é obrigatório'),
  validate
];

module.exports = {
  validateCreateClass,
  validateUpdateClass,
  validateCreateDiscipline,
  validateUpdateDiscipline,
  validateEnrollStudent,
  validateAssignTeacher,
  validateAddDisciplineToClass
};