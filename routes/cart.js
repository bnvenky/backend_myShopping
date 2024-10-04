const express = require('express');
const Cart = require('../models/Cart');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// CRUD for Cart
router.post('/', authenticateToken, async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = new Cart({ userId, productId });
    await cart.save();
    res.send(cart);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const carts = await Cart.find().populate('userId').populate('productId');
    res.send(carts);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.send('Cart item deleted');
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

module.exports = router;
