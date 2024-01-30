// Import the book service
const bookService = require('../services/bookService');

// Example function for fetching all books
const getAllBooks = async (req, res) => {
  try {
    // Call the book service to retrieve all books
    const books = await bookService.getAllBooks();

    // Send the list of books in the response
    res.json(books);
  } catch (error) {
    // Handle errors, e.g., database connection error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Example function for fetching a single book by ID
const getBookById = async (req, res) => {
  try {
    // Extract book ID from the request parameters
    const { bookId } = req.params;

    // Call the book service to retrieve the book by ID
    const book = await bookService.getBookById(bookId);

    // If the book is found, send it in the response; otherwise, return a 404 status
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    // Handle errors, e.g., invalid book ID format
    res.status(400).json({ error: 'Invalid book ID format' });
  }
};

// Example function for adding a new book
const addBook = async (req, res) => {
  try {
    // Extract book details from the request body
    const { title, authors, description, price } = req.body;

    // Call the book service to add the new book
    const newBook = await bookService.addBook({ title, authors, description, price });

    // Send the newly added book in the response
    res.status(201).json(newBook);
  } catch (error) {
    // Handle errors, e.g., validation error or duplicate book title
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
    } else if (error.code === 'DUPLICATE_TITLE') {
      res.status(409).json({ error: 'Book with the same title already exists' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

// Other book controller functions can be added as needed

// Export the controller functions
module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  // Add other functions here
};
