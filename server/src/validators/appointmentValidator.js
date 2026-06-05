const { body } = require('express-validator');

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled'];

const createAppointmentValidation = [
  body('patient_id').isUUID().withMessage('Valid patient ID is required'),
  body('doctor_id').isUUID().withMessage('Valid doctor ID is required'),
  body('appointment_date').isISO8601().withMessage('Valid date (YYYY-MM-DD) is required'),
  body('appointment_time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid time (HH:MM) is required'),
  body('reason').trim().notEmpty().withMessage('Reason for visit is required'),
  body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
  body('notes').optional().trim(),
];

const updateStatusValidation = [
  body('status').isIn(VALID_STATUSES).withMessage('Status must be pending, confirmed, or cancelled'),
];

module.exports = { createAppointmentValidation, updateStatusValidation };
