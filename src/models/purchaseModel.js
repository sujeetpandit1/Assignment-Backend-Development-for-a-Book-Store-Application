const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const Book = require('./bookModel');
const User = require('./userModel')

const purchaseSchema = new Schema({
  purchaseId: { type: String, unique: true, required: true },
  bookId: { type: String, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purchaseDate: {
    type: Date,
    default: Date.now,
    get: (purchaseDate) => moment(purchaseDate).format('YYYY-MM-DD HH:mm:ss'),
  },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  paymentId: { type: String, default: null },
  paymentStatus: { type: String, default: 'pending' }
}, {
  timestamps: true,
});

purchaseSchema.set('toObject', { getters: true });
purchaseSchema.set('toJSON', { getters: true });


module.exports = mongoose.model('Purchase', purchaseSchema);
