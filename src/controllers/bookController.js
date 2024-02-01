const ApiResponse = require('../errorHandler/apiResponse');
const tryCatch = require('../errorHandler/tryCatch');
const Book = require('../models/bookModel');
const bookService = require('../services/bookService');

const addBook = tryCatch (async (req, res) => {
  const { bookId, title, description, price } = req.body;
  const authorName = req.user.fullName;

  const newBook = new Book({ bookId, title, authors: authorName , description, price });
  await newBook.save();

  return res.status(201).json(new ApiResponse(undefined, 'Book added Successfully', newBook));
});

const updateBook = async (req, res, next) => {
  try {
    const updatedBook = await bookService.updateBook(req.params.bookId, req.body);
    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const deletedBook = await bookService.deleteBook(req.params.bookId);
    res.json(deletedBook);
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const books = await bookService.getBooks(page, limit);
    res.json(books);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  getBooks
};
