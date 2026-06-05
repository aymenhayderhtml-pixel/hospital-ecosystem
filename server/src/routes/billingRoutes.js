const express = require('express');
const router = express.Router();

const {
  createInvoice, getAllInvoices, getInvoiceById, updateInvoiceStatus, getInvoicesByPatient,
} = require('../controllers/billingController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { createInvoiceValidation, updateStatusValidation } = require('../validators/billingValidator');

router.use(protect);

// Specific routes MUST come before parameterized routes
router.get('/patient/:patientId', getInvoicesByPatient);

router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

router.post('/', authorize('admin', 'receptionist'), createInvoiceValidation, createInvoice);
router.patch('/:id/status', authorize('admin', 'receptionist'), updateStatusValidation, updateInvoiceStatus);

module.exports = router;
