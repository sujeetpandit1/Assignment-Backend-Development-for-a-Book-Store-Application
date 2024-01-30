const Book = require('../models/bookModel');

// Function to retrieve all books
const getAllBooks = async () => {
  try {
    // Find all books in the database
    const books = await Book.find();
    return books;
  } catch (error) {
    throw error;
  }
};

// Function to retrieve a book by ID
const getBookById = async (bookId) => {
  try {
    // Find the book by ID in the database
    const book = await Book.findById(bookId);
    return book;
  } catch (error) {
    throw error;
  }
};

// Function to add a new book
const addBook = async (bookDetails) => {
  try {
    // Create a new book instance with the provided details
    const newBook = new Book(bookDetails);

    // Save the new book to the database
    await newBook.save();

    return newBook;
  } catch (error) {
    // Handle duplicate title error separately
    if (error.code === 11000) {
      throw { code: 'DUPLICATE_TITLE', message: 'Book with the same title already exists' };
    }

    // Handle other errors
    throw error;
  }
};

// Other book service functions can be added as needed

// Export the service functions
module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  // Add other functions here
};
