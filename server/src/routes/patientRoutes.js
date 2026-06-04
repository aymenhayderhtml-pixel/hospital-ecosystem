const express = require('express');
const router = express.Router();

const { createPatient, getAllPatients, getPatientById, updatePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { createPatientValidation, updatePatientValidation } = require('../validators/patientValidator');

router.use(protect);

router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/', createPatientValidation, createPatient);
router.put('/:id', updatePatientValidation, updatePatient);

module.exports = router;
