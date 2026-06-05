const { body } = require('express-validator');

const createRecordValidation = [
  body('patient_id').isUUID().withMessage('Valid patient ID is required'),
  body('doctor_id').isUUID().withMessage('Valid doctor ID is required'),
  body('appointment_id').optional({ nullable: true }).isUUID().withMessage('Invalid appointment ID'),
  body('visit_date').optional().isISO8601().withMessage('Invalid visit date format'),
  body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
  body('symptoms').trim().notEmpty().withMessage('Symptoms are required'),
  body('prescription').optional().trim(),
  body('notes').optional().trim(),
  body('follow_up_date').optional({ nullable: true }).isISO8601().withMessage('Invalid follow-up date format'),
];

const updateRecordValidation = [
  body('appointment_id').optional({ nullable: true }).isUUID().withMessage('Invalid appointment ID'),
  body('visit_date').optional().isISO8601().withMessage('Invalid visit date format'),
  body('diagnosis').optional().trim().notEmpty().withMessage('Diagnosis cannot be empty'),
  body('symptoms').optional().trim().notEmpty().withMessage('Symptoms cannot be empty'),
  body('prescription').optional().trim(),
  body('notes').optional().trim(),
  body('follow_up_date').optional({ nullable: true }).isISO8601().withMessage('Invalid follow-up date format'),
];

module.exports = { createRecordValidation, updateRecordValidation };
