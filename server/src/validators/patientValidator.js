const { body } = require('express-validator');

const VALID_GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];
const VALID_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'];

const createPatientValidation = [
  body('first_name')
    .trim().notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 100 }).withMessage('First name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s-']+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

  body('last_name')
    .trim().notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Last name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s-']+$/).withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

  body('date_of_birth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      if (dob > today) throw new Error('Date of birth cannot be in the future');
      if (dob < new Date('1900-01-01')) throw new Error('Invalid date of birth');
      return true;
    }),

  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(VALID_GENDERS).withMessage(`Gender must be one of: ${VALID_GENDERS.join(', ')}`),

  body('phone')
    .trim().notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format')
    .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),

  body('email')
    .optional({ nullable: true, checkFalsy: true }).trim()
    .isEmail().withMessage('Please provide a valid email address').normalizeEmail(),

  body('blood_type')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(VALID_BLOOD_TYPES).withMessage(`Blood type must be one of: ${VALID_BLOOD_TYPES.join(', ')}`),

  body('address')
    .optional({ nullable: true, checkFalsy: true }).trim()
    .isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),

  body('emergency_contact_name')
    .optional({ nullable: true, checkFalsy: true }).trim()
    .isLength({ min: 2, max: 255 }).withMessage('Emergency contact name must be between 2 and 255 characters'),

  body('emergency_contact_phone')
    .optional({ nullable: true, checkFalsy: true }).trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid emergency contact phone format')
    .isLength({ min: 10, max: 20 }).withMessage('Emergency contact phone must be between 10 and 20 characters'),
];

const updatePatientValidation = [
  body('first_name')
    .optional().trim()
    .isLength({ min: 2, max: 100 }).withMessage('First name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s-']+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

  body('last_name')
    .optional().trim()
    .isLength({ min: 2, max: 100 }).withMessage('Last name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s-']+$/).withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

  body('date_of_birth')
    .optional().isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom((value) => {
      if (value) {
        const dob = new Date(value);
        const today = new Date();
        if (dob > today) throw new Error('Date of birth cannot be in the future');
        if (dob < new Date('1900-01-01')) throw new Error('Invalid date of birth');
      }
      return true;
    }),

  body('gender').optional().isIn(VALID_GENDERS).withMessage(`Gender must be one of: ${VALID_GENDERS.join(', ')}`),

  body('phone')
    .optional().trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format')
    .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),

  body('email')
    .optional({ nullable: true, checkFalsy: true }).trim()
    .isEmail().withMessage('Please provide a valid email address').normalizeEmail(),

  body('blood_type')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(VALID_BLOOD_TYPES).withMessage(`Blood type must be one of: ${VALID_BLOOD_TYPES.join(', ')}`),

  body('address')
    .optional({ nullable: true, checkFalsy: true }).trim()
    .isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),

  body('emergency_contact_name')
    .optional({ nullable: true, checkFalsy: true }).trim()
    .isLength({ min: 2, max: 255 }).withMessage('Emergency contact name must be between 2 and 255 characters'),

  body('emergency_contact_phone')
    .optional({ nullable: true, checkFalsy: true }).trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid emergency contact phone format')
    .isLength({ min: 10, max: 20 }).withMessage('Emergency contact phone must be between 10 and 20 characters'),
];

module.exports = { createPatientValidation, updatePatientValidation };
