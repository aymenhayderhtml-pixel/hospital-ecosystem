const { body } = require('express-validator');

const createInvoiceValidation = [
  body('patient_id').isUUID().withMessage('Valid patient ID is required'),
  body('medical_record_id').optional({ nullable: true }).isUUID().withMessage('Invalid medical record ID'),
  body('notes').optional().trim(),
  body('items').isArray({ min: 1 }).withMessage('At least one line item is required'),
  body('items.*.item_type').isIn(['medicine', 'service']).withMessage('Item type must be medicine or service'),
  body('items.*.inventory_item_id').optional({ nullable: true }).isUUID(),
  body('items.*.item_name').trim().notEmpty().withMessage('Item name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unit_price').isFloat({ min: 0 }).withMessage('Unit price must be >= 0'),
  body('items.*.total_price').isFloat({ min: 0 }).withMessage('Total price must be >= 0'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Valid subtotal is required'),
  body('tax_amount').isFloat({ min: 0 }).withMessage('Valid tax amount is required'),
  body('total_amount').isFloat({ min: 0 }).withMessage('Valid total amount is required'),
];

const updateStatusValidation = [
  body('status').isIn(['paid', 'cancelled']).withMessage('Status must be paid or cancelled'),
];

module.exports = { createInvoiceValidation, updateStatusValidation };
