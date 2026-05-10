const express = require('express');
const router = express.Router();
const disciplineController = require('../controllers/disciplineController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  validateCreateDiscipline,
  validateUpdateDiscipline
} = require('../middlewares/validationMiddleware');

router.use(authMiddleware);

const ADMIN_ONLY = roleMiddleware(['ADMIN']);
const ADMIN_OR_TEACHER = roleMiddleware(['ADMIN', 'TEACHER']);

router.get('/listDisciplines', ADMIN_ONLY, disciplineController.getAllDisciplines);
router.get('/listDisciplineById/:id', ADMIN_OR_TEACHER, disciplineController.getDisciplineById);
router.post('/createDiscipline', ADMIN_ONLY, validateCreateDiscipline, disciplineController.createDiscipline);
router.put('/updateDisciplineById/:id', ADMIN_ONLY, validateUpdateDiscipline, disciplineController.updateDiscipline);
router.delete('/deleteDisciplineById/:id', ADMIN_ONLY, disciplineController.deleteDiscipline);
router.post('/restoreDisciplineById/:id', ADMIN_ONLY, disciplineController.restoreDiscipline);
router.get('/listClassesByDisciplineId/:id', ADMIN_ONLY, disciplineController.getClassesByDiscipline);

module.exports = router;