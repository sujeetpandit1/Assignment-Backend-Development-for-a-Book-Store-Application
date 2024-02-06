const tryCatch = require('../errorHandler/tryCatch');
const purchaseService = require('../services/purchasesService');
const Book = require('../models/bookModel');
const sendErrorResponse = require('../errorHandler/apiError');
const ApiResponse = require('../errorHandler/apiResponse');
const Purchase = require('../models/purchaseModel');
const generateUniquePurchaseId = require('../utils/purchaseUtils');
const { startSession } = require('mongoose');
const { processPayment } = require('../services/paymentService');


const getPurchaseHistory = tryCatch (async (req, res) => {

    const userId  = req.user.userId;
    const history = await purchaseService.getPurchaseHistory(userId);

    return res.status(200).json(new ApiResponse(undefined, "Purchase history retrived successfully", history));
});

const purchaseBook = tryCatch(async (req, res) => {
  const { bookId, quantity} = req.body;
  const userId = req.user.userId;
  const userName = req.user.fullName;

  const book = await Book.findOne({ bookId });
  if (!book) {
    return sendErrorResponse(res, 404, "Book Not Available");
  }

  if (quantity > book.quantity) {
    return sendErrorResponse(res, 400, "INSUFFICIENT_STOCK: Insufficient stock for the requested quantity");
  }

  const authorRevenue = purchaseService.calculateAuthorRevenue(book.price, quantity);

  const session = await startSession();
  session.startTransaction();

  try {

    const payment = await processPayment(book, quantity);

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
          paymentId: payment.id,
          paymentStatus: 'success',
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
 

module.exports = {purchaseBook, getPurchaseHistory}
