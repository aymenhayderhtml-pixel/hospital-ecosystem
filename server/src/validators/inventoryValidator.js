const { body } = require('express-validator');

const VALID_CATEGORIES = ['medicine', 'equipment', 'supply'];
const VALID_UNITS = ['tablets', 'ml', 'pieces', 'boxes'];

const createInventoryValidation = [
  body('name').trim().notEmpty().withMessage('Item name is required'),
  body('category').isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('unit').isIn(VALID_UNITS).withMessage(`Unit must be one of: ${VALID_UNITS.join(', ')}`),
  body('min_quantity').isInt({ min: 0 }).withMessage('Minimum quantity must be a non-negative integer'),
  body('unit_price').isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('supplier_name').optional({ nullable: true, checkFalsy: true }).trim(),
  body('expiry_date').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid expiry date format'),
];

const updateInventoryValidation = [
  body('name').optional().trim().notEmpty().withMessage('Item name cannot be empty'),
  body('category').optional().isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('unit').optional().isIn(VALID_UNITS).withMessage(`Unit must be one of: ${VALID_UNITS.join(', ')}`),
  body('min_quantity').optional().isInt({ min: 0 }).withMessage('Minimum quantity must be a non-negative integer'),
  body('unit_price').optional().isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('supplier_name').optional({ nullable: true, checkFalsy: true }).trim(),
  body('expiry_date').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid expiry date format'),
];

module.exports = { createInventoryValidation, updateInventoryValidation };
