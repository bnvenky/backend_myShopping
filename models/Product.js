const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  thumbnail: String,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
