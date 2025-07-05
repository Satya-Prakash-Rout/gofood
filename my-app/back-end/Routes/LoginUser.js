const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Mongoose User model
const { body, validationResult } = require('express-validator');

// POST /api/loginuser
router.post(
  '/loginuser',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    console.log("Login request body:", req.body); // Debug log

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      console.log("User found:", user);
      
      if (!user) {
        return res.status(400).json({ success: false, error: 'User not found' });
      }

      if (user.password !== password) {
        return res.status(401).json({ success: false, error: 'Invalid password' });
      }

      return res.json({ success: true });

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

module.exports = router;
