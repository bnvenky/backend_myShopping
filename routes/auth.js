const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};



// Registration Endpoint
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Name, Email, and Password are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'user' });
    await user.save();

    const token = generateToken(user);
    res.status(201).send({ id: user._id, name, email, role: user.role, token });
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.code === 11000) {
      return res.status(400).send('Email already in use');
    }
    res.status(500).send('Server error: ' + error.message);
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and Password are required');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid Email or Password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid Email or Password');

    const token = generateToken(user);
    res.send({ id: user._id, name: user.name, email: user.email, role: user.role, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});


  
module.exports = router;
