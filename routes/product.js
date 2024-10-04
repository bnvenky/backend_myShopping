const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');

const path = require('path')

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))

  }
})

const upload = multer({
  storage: storage
})


// CRUD for Products with file upload
router.post('/', upload.single('thumbnail'), async (req, res) => {
  const { title, description, price, category } = req.body;
  const thumbnail = req.file ? `/uploads/${req.file.filename}` : null; // Updated path

  try {
    const product = new Product({ title, description, price, category, thumbnail });
    await product.save();
    res.send(product);
    
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.send(product);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.put('/:id', async (req, res) => {
  const { title, description, price, category, thumbnail } = req.body;

  try {
    await Product.findByIdAndUpdate(req.params.id, { title, description, price, category, thumbnail });
    res.send('Product updated');
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send('Product deleted');
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

module.exports = router;
