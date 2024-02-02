const mongoose = require('mongoose')
const moment = require('moment');



const reviewSchema = new mongoose.Schema({
    bookId : {type : String, ref: 'Book', required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reviewedBy : {type :String, default: "Guest", trim : true},
    reviewedAt : {type: Date,
        default: Date.now,
        get: (purchaseDate) => moment(purchaseDate).format('YYYY-MM-DD HH:mm:ss')},
    rating: {type : Number},
    review : {type : String, trim : true},
}, {timestamps: true})

module.exports = mongoose.model('Review', reviewSchema)