const purchaseService = require('../services/purchasesService');

// Example function for fetching purchase history for a user
const getPurchaseHistory = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const { userId } = req.params;

    // Call the purchase service to retrieve the purchase history for the user
    const history = await purchaseService.getPurchaseHistory(userId);

    // Send the purchase history in the response
    res.json(history);
  } catch (error) {
    // Handle errors, e.g., database connection error or invalid user ID format
    res.status(400).json({ error: 'Invalid user ID format' });
  }
};

// Example function for making a book purchase
const purchaseBook = async (req, res) => {
  try {
    // Extract book ID, user ID, and quantity from the request body
    const { bookId, userId, quantity } = req.body;

    // Call the purchase service to make the book purchase
    const purchase = await purchaseService.purchaseBook(bookId, userId, quantity);

    // Send the purchase details in the response
    res.status(201).json(purchase);
  } catch (error) {
    // Handle errors, e.g., insufficient stock or invalid book/user ID
    if (error.code === 'INSUFFICIENT_STOCK') {
      res.status(400).json({ error: 'Insufficient stock for the requested quantity' });
    } else if (error.code === 'INVALID_BOOK_ID' || error.code === 'INVALID_USER_ID') {
      res.status(400).json({ error: 'Invalid book or user ID format' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

// Other purchase controller functions can be added as needed

// Export the controller functions
module.exports = {
  getPurchaseHistory,
  purchaseBook,
  // Add other functions here
};
