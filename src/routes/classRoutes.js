const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  validateCreateClass,
  validateUpdateClass,
  validateEnrollStudent,
  validateAssignTeacher,
  validateAddDisciplineToClass
} = require('../middlewares/validationMiddleware');

// Todas as rotas exigem autenticação e role ADMIN
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

// CRUD Turmas
router.get('/listClasses', classController.getAllClasses);
router.get('/listClasseById/:id', classController.getClassById);
router.post('/createClass', validateCreateClass, classController.createClass);
router.put('/updateClassById/:id', validateUpdateClass, classController.updateClass);
router.delete('/deleteClassById/:id', classController.deleteClass);

// Matrícula de Alunos
router.post('/enroll/:id', validateEnrollStudent, classController.enrollStudent);
router.delete('/enroll/:id/:studentId', classController.unenrollStudent);
router.get('/students/:id', classController.getStudentsByClass);

// Alocação de Professores
router.post('/assignTeacher/:id', validateAssignTeacher, classController.assignTeacher);
router.delete('/assignTeacher/:id/:teacherId', classController.unassignTeacher);
router.get('/teachers/:id', classController.getTeachersByClass);

// Disciplinas por Turma
router.post('/disciplines/:id', validateAddDisciplineToClass, classController.addDisciplineToClass);
router.delete('/disciplines/:id/:disciplineId', classController.removeDisciplineFromClass);
router.get('/disciplines/:id', classController.getDisciplinesByClass);

module.exports = router;