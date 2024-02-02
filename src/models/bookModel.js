const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, unique: true, required: true },
  authors: [{ type: String, required: true }],
  sellCount: { type: Number, default: 0 },
  description: { type: String, required: true },
  price: { type: Number, min: 100, max: 1000, required: true },
  quantity: {type: Number, default: 0},
  version: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
