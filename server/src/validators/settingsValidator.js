const { body } = require('express-validator');

const VALID_ROLES = ['admin', 'doctor', 'receptionist'];

const createUserValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(VALID_ROLES).withMessage(`Role must be one of: ${VALID_ROLES.join(', ')}`),
];

const updateUserRoleValidation = [
  body('role').isIn(VALID_ROLES).withMessage(`Role must be one of: ${VALID_ROLES.join(', ')}`),
];

const updateHospitalValidation = [
  body('hospital_name').trim().notEmpty().withMessage('Hospital name is required'),
  body('total_beds').isInt({ min: 0 }).withMessage('Total beds must be a positive number'),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('logo_url').optional().trim(),
];

const updateProfileValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const changePasswordValidation = [
  body('current_password').notEmpty().withMessage('Current password is required'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.new_password) throw new Error('Passwords do not match');
    return true;
  }),
];

module.exports = { createUserValidation, updateUserRoleValidation, updateHospitalValidation, updateProfileValidation, changePasswordValidation };
