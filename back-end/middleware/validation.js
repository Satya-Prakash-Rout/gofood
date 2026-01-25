// middleware/validation.js
const { body, validationResult } = require('express-validator');

// Validation middleware handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User Login Validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// User Signup Validation
const validateUserSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),
  handleValidationErrors
];

// Food Item Validation
const validateFoodItem = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Food name must be between 2 and 100 characters'),
  body('CategoryName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('halfPrice')
    .isFloat({ min: 0 })
    .withMessage('Half price must be a valid positive number'),
  body('fullPrice')
    .isFloat({ min: 0 })
    .withMessage('Full price must be a valid positive number'),
  body('imgUrl')
    .trim()
    .isURL()
    .withMessage('Please provide a valid image URL'),
  handleValidationErrors
];

// Admin Login Validation
const validateAdminLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Admin Signup Validation
const validateAdminSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Admin name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long for admin'),
  body('restaurantName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),
  handleValidationErrors
];

module.exports = {
  validateUserLogin,
  validateUserSignup,
  validateFoodItem,
  validateAdminLogin,
  validateAdminSignup,
  handleValidationErrors
};
