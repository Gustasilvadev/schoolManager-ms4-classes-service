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

// Endpoint interno consumido pelo MS5 para validar se um professor leciona uma class_discipline.
router.get('/checkTeacherAccess/:teacherId/:classDisciplineId', classController.checkTeacherAccess);

router.use(authMiddleware);

const ADMIN_ONLY = roleMiddleware(['ADMIN']);
const ADMIN_OR_TEACHER = roleMiddleware(['ADMIN', 'TEACHER']);

// TEACHER só vê suas próprias turmas — filtragem feita no service.
router.get('/listClasses', ADMIN_OR_TEACHER, classController.getAllClasses);
router.get('/listClassById/:id', ADMIN_OR_TEACHER, classController.getClassById);
router.post('/createClass', ADMIN_ONLY, validateCreateClass, classController.createClass);
router.put('/updateClassById/:id', ADMIN_ONLY, validateUpdateClass, classController.updateClass);
router.delete('/deleteClassById/:id', ADMIN_ONLY, classController.deleteClass);

router.post('/enroll/:id', ADMIN_ONLY, validateEnrollStudent, classController.enrollStudent);
router.delete('/enroll/:id/:studentId', ADMIN_ONLY, classController.unenrollStudent);
router.get('/students/:id', ADMIN_OR_TEACHER, classController.getStudentsByClass);

router.post('/assignTeacher/:id', ADMIN_ONLY, validateAssignTeacher, classController.assignTeacher);
router.delete('/assignTeacher/:id/:teacherId', ADMIN_ONLY, classController.unassignTeacher);
router.get('/teachers/:id', ADMIN_OR_TEACHER, classController.getTeachersByClass);

router.post('/disciplines/:id', ADMIN_ONLY, validateAddDisciplineToClass, classController.addDisciplineToClass);
router.delete('/disciplines/:id/:disciplineId', ADMIN_ONLY, classController.removeDisciplineFromClass);
router.get('/disciplines/:id', ADMIN_OR_TEACHER, classController.getDisciplinesByClass);

module.exports = router;