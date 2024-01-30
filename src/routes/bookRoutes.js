const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Route to get all books
router.get('/books', bookController.getAllBooks);

// Route to get a book by ID
router.get('/books/:bookId', bookController.getBookById);

// Route to add a new book
router.post('/books', bookController.addBook);

// Other book routes can be added as needed

// Export the router
module.exports = router;
