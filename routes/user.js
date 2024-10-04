const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// CRUD for Users
router.post('/', authenticateToken, async (req, res) => {
  const { name, email, password, role} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password: hashedPassword, role: role || 'user',});
    await user.save();
    res.send({ id: user._id, name, email, role: user.role });
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.findByIdAndUpdate(req.params.id, { name, email, password: hashedPassword, role });
    res.send('User updated');
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send('User deleted');
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

module.exports = router;
