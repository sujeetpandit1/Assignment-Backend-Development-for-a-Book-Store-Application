const Purchase = require('../models/purchaseModel');
const Book = require('../models/bookModel');

// Function to retrieve purchase history for a user
const getPurchaseHistory = async (userId) => {
  try {
    // Find all purchases for the given user in the database
    const history = await Purchase.find({ userId });

    return history;
  } catch (error) {
    throw error;
  }
};

// Function to make a book purchase
const purchaseBook = async (bookId, userId, quantity) => {
  try {
    // Find the book by ID in the database
    const book = await Book.findById(bookId);

    // If the book is not found, throw an error
    if (!book) {
      throw { code: 'INVALID_BOOK_ID', message: 'Invalid book ID' };
    }

    // If the requested quantity exceeds the available stock, throw an error
    if (quantity > book.stock) {
      throw { code: 'INSUFFICIENT_STOCK', message: 'Insufficient stock for the requested quantity' };
    }

    // Calculate the total price based on the book price and quantity
    const totalPrice = book.price * quantity;

    // Create a new purchase instance
    const newPurchase = new Purchase({
      bookId,
      userId,
      price: totalPrice,
      quantity,
    });

    // Save the new purchase to the database
    await newPurchase.save();

    // Update the book's sell count and stock
    book.sellCount += quantity;
    book.stock -= quantity;

    // Save the updated book to the database
    await book.save();

    return newPurchase;
  } catch (error) {
    // Handle invalid book/user ID errors separately
    if (error.code === 'INVALID_BOOK_ID' || error.code === 'INVALID_USER_ID') {
      throw error;
    }

    // Handle other errors
    throw error;
  }
};

// Other purchase service functions can be added as needed

// Export the service functions
module.exports = {
  getPurchaseHistory,
  purchaseBook,
  // Add other functions here
};
