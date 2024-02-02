const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: [true, 'Password is required'] },
  role: { type: String, enum: ['admin', 'author', 'retail'], required: true },
  fullName: {type: String, required: true},
  email:{type: String, unique: true, required: true},
  revenue: { type: Number, default: 0 },
},{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
