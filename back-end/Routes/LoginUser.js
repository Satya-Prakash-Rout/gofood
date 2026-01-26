// Import required modules
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Mongoose User model

const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key used to sign JWT tokens (use environment variable in production)
const jwtSecret =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? null : 'dev_jwt_secret_change_me');
const jwtExpiresIn = process.env.JWT_EXPIRE || '1h';

// POST /api/loginuser
router.post(
  '/loginuser',
  [
    // Validate that the email is a proper format
    body('email').isEmail().withMessage('Please enter a valid email'),

    // Make sure password is not empty
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    // Collect validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        error: 'Server misconfigured: JWT_SECRET missing'
      });
    }

    // Extract email and password from request
    const { email, password } = req.body;

    try {
      // Check if a user exists with the given email
      const user = await User.findOne({ email });

      

      // If no user is found, return error
      if (!user) {
        return res.status(400).json({ success: false, error: 'User not found' });
      }

      // Compare entered password with the hashed password in DB
      const pwdCompare = await bcrypt.compare(password, user.password);

      // If passwords do not match
      if (!pwdCompare) {
        return res.status(401).json({ success: false, error: 'Invalid password' });
      }

      // Prepare payload to encode in JWT
      const data = {
        users: {
          id: user.id // or user._id
        }
      };

      // Sign the JWT with the payload and secret key
      const authToken = jwt.sign(data, jwtSecret, { expiresIn: jwtExpiresIn });

      // Return success and the token
      return res.json({ success: true, authToken });

    } catch (err) {
      // Catch any unexpected server/database errors
      console.error('Login error:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Export the router so it can be used in index.js
module.exports = router;
