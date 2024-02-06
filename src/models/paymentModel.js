const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  return_url: { type: String },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);