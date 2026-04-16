const express = require('express');
const classRoutes = require('./classRoutes');
const disciplineRoutes = require('./disciplineRoutes');

const router = express.Router();

router.use('/classes', classRoutes);
router.use('/disciplines', disciplineRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'classes-service' });
});

module.exports = router;