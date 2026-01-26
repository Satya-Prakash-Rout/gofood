const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? null : 'dev_jwt_secret_change_me');
const jwtExpiresIn = process.env.JWT_EXPIRE || '7d';

// Admin Signup
router.post('/admin/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET missing' });
    }
    

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if admin already exists
    const existingAdmin = await mongoose.connection.db
      .collection('admins')
      .findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create admin in database
    const adminData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date()
    };

    const result = await mongoose.connection.db
      .collection('admins')
      .insertOne(adminData);

    console.log('Admin created successfully:', result.insertedId);

    // Create JWT token
    const token = jwt.sign(
      { id: result.insertedId, email: adminData.email },
      JWT_SECRET,
      { expiresIn: jwtExpiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      admin: {
        id: result.insertedId,
        name: adminData.name,
        email: adminData.email,
        role: adminData.role
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET missing' });
    }

    console.log('Admin login attempt:', { email });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin
    const adminCollection = mongoose.connection.db.collection('admins');
    const admin = await adminCollection.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ error: 'Admin account is inactive' });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await adminCollection.updateOne(
      { _id: admin._id },
      { $set: { lastLogin: new Date() } }
    );

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: jwtExpiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Verify Admin Token
router.post('/admin/verify', async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET missing' });
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await mongoose.connection.db
      .collection('admins')
      .findOne({ _id: decoded.id });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive admin' });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
