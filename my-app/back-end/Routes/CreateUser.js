const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { body, validationResult } = require('express-validator');


// POST /api/createuser
router.post('/createuser',
  [
    // Username: required, alphanumeric, 3–20 chars
    body('name')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters long'),

    // Gmail: required, must be a valid Gmail address
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .matches(/@gmail\.com$/).withMessage('Email must be a Gmail address'),

      // password: min -> 8 char , 1 lowercase , 1 upper case , 1 number , 1 special char
     body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
  ], async (req, res) => {
     
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // You should be using the request body
      const { name, password, email, location } = req.body;

      await User.create({
        name,
        password,
        email,
        location,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

module.exports = router;
