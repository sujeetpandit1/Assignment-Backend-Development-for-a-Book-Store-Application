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

// const { generateUniquePurchaseId } = require('../utils/generateSlug');


const getPurchaseHistory = tryCatch (async (req, res) => {

    const userId  = req.user.userId;
    const history = await purchaseService.getPurchaseHistory(userId);

    return res.status(200).json(new ApiResponse(undefined, "Purchase history retrived successfully", history));
});

// const purchaseBook = tryCatch(async (req, res) => {
//   const { bookId, quantity } = req.body;
//   const userId = req.user.userId;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const book = await Book.findOne({ bookId: bookId }).session(session);

//     if (!book || book === null) {
//       return sendErrorResponse(res, 404, "Book Not Available");
//     }

//     if (quantity > book.quantity) {
//       return sendErrorResponse(res, 400, "INSUFFICIENT_STOCK : Insufficient stock for the requested quantity");
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
//     });

//     // Save the new purchase and update book quantities within the same transaction
//     await newPurchase.save({ session });
//     book.sellCount += quantity;
//     book.quantity -= quantity;
//     await book.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(201).json(new ApiResponse(undefined, "Purchased Successfully", newPurchase));
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
    
//     console.error(error);
//     return sendErrorResponse(res, 500, "Internal Server Error");
//   }
// });

// const purchaseBook = tryCatch(async (req, res) => {
//   const { bookId, quantity } = req.body;
//   const userId = req.user.userId;

//   try {
//     const book = await Book.findOne({ bookId: bookId });

//     if (!book || book === null) {
//       return sendErrorResponse(res, 404, "Book Not Available");
//     }

//     if (quantity > book.quantity) {
//       return sendErrorResponse(res, 400, "INSUFFICIENT_STOCK : Insufficient stock for the requested quantity");
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
//     });

//     // Attempt to save the new purchase, but check for changes in the book document
//     const updatedBook = await Book.findOneAndUpdate(
//       { _id: book._id, version: book.version }, // Include version in the query
//       {
//         $set: {
//           sellCount: book.sellCount + quantity,
//           quantity: book.quantity - quantity,
//         },
//         $inc: { version: 1 }, // Atomic increment of the version field
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedBook) {
//       // Someone else modified the document in the meantime
//       return sendErrorResponse(res, 409, "Concurrency Conflict: The book has been updated by another user");
//     }

//     // Save the new purchase to the database
//     await newPurchase.save();

//     return res.status(201).json(new ApiResponse(undefined, "Purchased Successfully", newPurchase));
//   } catch (error) {
//     console.error(error);
//     return sendErrorResponse(res, 500, "Internal Server Error");
//   }
// });


const purchaseBook = tryCatch(async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user.userId;

   // Calculate revenue for the author
   const book = await Book.findOne({ bookId });
   if (!book || book === null) {
      return sendErrorResponse(res, 404, "Book Not Available");
    }

    if (quantity > book.quantity) {
      return sendErrorResponse(res, 400, "INSUFFICIENT_STOCK : Insufficient stock for the requested quantity");
    }

   const authorRevenue = book.price * quantity * 0.9; // Moved here

   // Use a transaction for atomicity
   const session = await startSession();
   session.startTransaction(); 

   try {
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

    if (!updatedBook) {
      return sendErrorResponse(res, 409, "Concurrency Conflict: The book has been updated by another user");
    }

    if (!updatedUser) {
      return sendErrorResponse(res, 500, "Failed to update author's revenue");
    }

    const totalPrice = book.price * quantity;
    const uniquePurchaseId = await generateUniquePurchaseId();

    // Create a new purchase instance
    const newPurchase = new Purchase({
      purchaseId: uniquePurchaseId,
      bookId,
      userId,
      price: totalPrice,
      quantity,
    });

    // Save the new purchase to the database
    await newPurchase.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    return res.status(201).json(new ApiResponse(undefined, "Purchased Successfully", newPurchase));
  } catch (error) {
    await session.abortTransaction();
    console.log(error.stack);
    return sendErrorResponse(res, 400, "Transaction Aborted")
  } finally {
    session.endSession();
  }
 
});





module.exports = {purchaseBook, getPurchaseHistory}
