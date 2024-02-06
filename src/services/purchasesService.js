const Purchase = require('../models/purchaseModel');
const sendErrorResponse = require('../errorHandler/apiError');
const joi = require('joi');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const { sendEmail } = require('../config/mailer');




// Purchase validation
const purchaseSchema = joi.object({
    bookId: joi.string().required(),
    quantity: joi.number().min(1).max(30000).required()
})

const validatePurchase = (req, res, next) =>{
    const {error} = purchaseSchema.validate(req.body);

    if(error){
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next()
} 


const getPurchaseHistory = async (userId) => {
    const history = await Purchase.find({ userId });
    return history;
};

function calculateAuthorRevenue(price, quantity) {
    return price * quantity * 0.9;
};


async function updateBookAndUser(book, authorRevenue, quantity, session) {
    const [updatedBook, updatedUser] = await Promise.all([
      Book.findOneAndUpdate(
        { _id: book._id, version: book.version },
        {
          $set: {
            sellCount: book.sellCount + quantity,
            quantity: book.quantity - quantity,
            revenue: book.revenue + authorRevenue
          },
          $inc: { version: 1 },
        },
        { new: true, session }
      ),
      User.findByIdAndUpdate(book.userId, { $inc: { revenue: authorRevenue } }, { new: true, session })
    ]);
  
    return [updatedBook, updatedUser];
};

async function sendPurchaseNotificationEmails(newPurchase, book, userName) {
    const currentDateTime = new Date().toLocaleString();

    const [user, author] = await Promise.all([
        User.findById(newPurchase.userId),
        User.findById(book.userId)
    ]);

    const userPurchaseContent = `Thank you for your purchase!\nYou have successfully bought ${newPurchase.quantity} copies of:\nBook Title = ${book.title}\nTotal amount paid: ${newPurchase.price}/-\nPurchase Date and Time: ${currentDateTime}`;
    const authorSaleContent = `Your book ${book.title} has been purchased by ${userName},\nQuantity = ${newPurchase.quantity},\nRevenue earned: ${book.price * newPurchase.quantity * 0.9}/-\nPurchase Date and Time: ${currentDateTime}`;

    await Promise.all([
        sendEmail(user.email, 'Purchase Successful', userPurchaseContent),
        sendEmail(author.email, 'Book Sale Notification', authorSaleContent)
    ]);
}

  

  
module.exports = {
  validatePurchase,
  getPurchaseHistory,
  calculateAuthorRevenue,
  updateBookAndUser,
  sendPurchaseNotificationEmails
};
