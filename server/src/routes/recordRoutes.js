const express = require('express');
const router = express.Router();

const {
  createRecord, getRecordsByPatient, getRecordById, updateRecord,
} = require('../controllers/recordController');

const { protect } = require('../middleware/authMiddleware');
const { createRecordValidation, updateRecordValidation } = require('../validators/recordValidator');

router.use(protect);

// Specific routes MUST come before parameterized routes
router.get('/patient/:patientId', getRecordsByPatient);

router.get('/:id', getRecordById);
router.post('/', createRecordValidation, createRecord);
router.put('/:id', updateRecordValidation, updateRecord);

module.exports = router;
