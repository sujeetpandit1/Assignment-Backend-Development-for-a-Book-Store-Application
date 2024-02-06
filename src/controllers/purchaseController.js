const tryCatch = require('../errorHandler/tryCatch');
const purchaseService = require('../services/purchasesService');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const sendErrorResponse = require('../errorHandler/apiError');
const ApiResponse = require('../errorHandler/apiResponse');
const Purchase = require('../models/purchaseModel');
const generateUniquePurchaseId = require('../utils/purchaseUtils');
const mongoose = require('mongoose');
const { startSession } = require('mongoose');
const { sendEmail } = require('../config/mailer');
const { processPayment } = require('./paymentController');
const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);



const getPurchaseHistory = tryCatch (async (req, res) => {

    const userId  = req.user.userId;
    const history = await purchaseService.getPurchaseHistory(userId);

    return res.status(200).json(new ApiResponse(undefined, "Purchase history retrived successfully", history));
});

// const purchaseBook = tryCatch(async (req, res) => {
//   const { bookId, quantity } = req.body;
//   const userId = req.user.userId;
//   const userName = req.user.fullName;

//    // Calculate revenue for the author
//    const book = await Book.findOne({ bookId });
//    if (!book || book === null) {
//       return sendErrorResponse(res, 404, "Book Not Available");
//     }

//     if (quantity > book.quantity) {
//       return sendErrorResponse(res, 400, "INSUFFICIENT_STOCK : Insufficient stock for the requested quantity");
//     }

//    const authorRevenue = book.price * quantity * 0.9; // Moved here

//    // Use a transaction for atomicity
//    const session = await startSession();
//    session.startTransaction(); 

//    try {
//     const [updatedBook, updatedUser] = await Promise.all([
//       Book.findOneAndUpdate(
//         { _id: book._id, version: book.version },
//         {
//           $set: {
//             sellCount: book.sellCount + quantity,
//             quantity: book.quantity - quantity,
//             revenue: book.revenue + authorRevenue
//           },
//           $inc: { version: 1 },
//         },
//         { new: true, session }
//       ),
//       User.findByIdAndUpdate(book.userId, { $inc: { revenue: authorRevenue } }, { new: true, session })
//     ]);

//     if (!updatedBook) {
//       return sendErrorResponse(res, 409, "Concurrency Conflict: The book has been updated by another user");
//     }

//     if (!updatedUser) {
//       return sendErrorResponse(res, 500, "Failed to update author's revenue");
//     }

//     const totalPrice = book.price * quantity;
//     const uniquePurchaseId = await generateUniquePurchaseId();

//     // Create a new purchase instance
//     const newPurchase = new Purchase({
//       purchaseId: uniquePurchaseId,
//       bookId,
//       userId,
//       price: totalPrice,
//       quantity,
//     })

//     // Save the new purchase to the database
//     await newPurchase.save({ session });

//     const currentDateTime = new Date().toLocaleString();
//     // Send notification to the user
//     const user = await User.findById(userId);
//     const emailContent = `Thank you for your purchase!\nYou have successfully bought ${quantity}, copies of :- \nBook Title = ${book.title}\nTotal amount paid: ${totalPrice}/- \nPurchase Date and Time: ${currentDateTime}`;

//     await sendEmail(user.email, 'Purchase Successful', emailContent);

//     // Send notification to the author
//     const author = await User.findById(book.userId);
//     const authorEmailContent = `Your book ${book.title} has been purchased by ${userName}, \nQuantity = ${quantity}, \nRevenue earned: ${authorRevenue}/- \nPurchase Date and Time: ${currentDateTime}`;

//     await sendEmail(author.email, 'Book Sale Notification', authorEmailContent);

//     // Commit the transaction
//     await session.commitTransaction();

//     return res.status(201).json(new ApiResponse(undefined, "Purchased Successfully", newPurchase));
//   } catch (error) {
//     await session.abortTransaction();
//     console.log(error.stack);
//     return sendErrorResponse(res, 400, "Transaction Aborted")
//   } finally {
//     session.endSession();
//   }
 
// });

const purchaseBook = tryCatch(async (req, res) => {
  const { bookId, quantity, paymentMethodId} = req.body;
  const userId = req.user.userId;
  const userName = req.user.fullName;

  // Check book availability
  const book = await Book.findOne({ bookId });
  if (!book) {
    return sendErrorResponse(res, 404, "Book Not Available");
  }

  // Check stock availability
  if (quantity > book.quantity) {
    return sendErrorResponse(res, 400, "INSUFFICIENT_STOCK: Insufficient stock for the requested quantity");
  }

  const authorRevenue = purchaseService.calculateAuthorRevenue(book.price, quantity);

  const session = await startSession();
  session.startTransaction();

  try {
// Backend: Process payment with Stripe
const paymentIntent = await stripe.paymentIntents.create({
  amount: book.price * quantity * 100, // Convert price to cents
  currency: 'INR', // Replace with your currency
  automatic_payment_methods: {
    enabled: true,
  }, 
});

console.log(paymentIntent.id);
let data =paymentIntent.id.toString();

const paymentConfirm = await stripe.paymentIntents.confirm(
  data,
{
  payment_method: 'pm_card_visa',
  return_url: 'http://localhost:6000',
});
console.log(paymentConfirm);

if (paymentConfirm.status !== 'succeeded') {
  return sendErrorResponse(res, 400, "Payment Failed" );
}


    const [updatedBook, updatedUser] = await purchaseService.updateBookAndUser(book, authorRevenue, quantity, session);

    if (!updatedBook) {
      return sendErrorResponse(res, 409, "Concurrency Conflict: The book has been updated by another user");
    }

    if (!updatedUser) {
      return sendErrorResponse(res, 500, "Failed to update author's revenue");
    }

    const totalPrice = book.price * quantity;
    const uniquePurchaseId = await generateUniquePurchaseId();
    
    const newPurchase = new Purchase({
          purchaseId: uniquePurchaseId,
          bookId,
          userId,
          price: totalPrice,
          quantity,
        });
      
        await newPurchase.save({ session });

    purchaseService.sendPurchaseNotificationEmails(newPurchase, book, userName);

    await session.commitTransaction();

    return res.status(201).json(new ApiResponse(undefined, "Purchased Successfully", newPurchase));
  } catch (error) {
    await session.abortTransaction();
    console.error(error.stack);
    return sendErrorResponse(res, 400, "Transaction Aborted");
  } finally {
    session.endSession();
  }
});
 
// function calculateAuthorRevenue(price, quantity) {
//   return price * quantity * 0.9;
// }

// async function updateBookAndUser(book, authorRevenue, quantity, session) {
//   const [updatedBook, updatedUser] = await Promise.all([
//     Book.findOneAndUpdate(
//       { _id: book._id, version: book.version },
//       {
//         $set: {
//           sellCount: book.sellCount + quantity,
//           quantity: book.quantity - quantity,
//           revenue: book.revenue + authorRevenue
//         },
//         $inc: { version: 1 },
//       },
//       { new: true, session }
//     ),
//     User.findByIdAndUpdate(book.userId, { $inc: { revenue: authorRevenue } }, { new: true, session })
//   ]);

//   return [updatedBook, updatedUser];
// }


// async function sendPurchaseNotificationEmails(newPurchase, book, userName) {
//   const currentDateTime = new Date().toLocaleString();

//   const user = await User.findById(newPurchase.userId);
//   const emailContent = `Thank you for your purchase!\nYou have successfully bought ${newPurchase.quantity} copies of:\nBook Title = ${book.title}\nTotal amount paid: ${newPurchase.price}/-\nPurchase Date and Time: ${currentDateTime}`;

//   await sendEmail(user.email, 'Purchase Successful', emailContent);

//   const author = await User.findById(book.userId);
//   const authorEmailContent = `Your book ${book.title} has been purchased by ${userName},\nQuantity = ${newPurchase.quantity},\nRevenue earned: ${book.price * newPurchase.quantity * 0.9}/-\nPurchase Date and Time: ${currentDateTime}`;

//   await sendEmail(author.email, 'Book Sale Notification', authorEmailContent);
// }






module.exports = {purchaseBook, getPurchaseHistory}
