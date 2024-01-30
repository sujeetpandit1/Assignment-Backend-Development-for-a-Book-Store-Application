const mongoose = require('mongoose')
require('dotenv').config();

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log('MongoDB is Connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1)
  }
}; 

module.exports = { db };