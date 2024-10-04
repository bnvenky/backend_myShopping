const mongoose = require('mongoose');

const dbConfig = () => {
  mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));
};

module.exports = dbConfig;
