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
router.use(roleMiddleware(['ADMIN']));

router.get('/listDisciplines', disciplineController.getAllDisciplines);
router.get('/listDisciplineById/:id', disciplineController.getDisciplineById);
router.post('/createDiscipline', validateCreateDiscipline, disciplineController.createDiscipline);
router.put('/updateDisciplineById/:id', validateUpdateDiscipline, disciplineController.updateDiscipline);
router.delete('/deleteDisciplineById/:id', disciplineController.deleteDiscipline);
router.get('/discipline/:id/classes', disciplineController.getClassesByDiscipline);

module.exports = router;