const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, patientController.getAll);
router.get('/:id', authMiddleware, patientController.getById);
router.post('/', authMiddleware, patientController.create);
router.put('/:id', authMiddleware, patientController.update);
router.delete('/:id', authMiddleware, patientController.delete);

module.exports = router;
