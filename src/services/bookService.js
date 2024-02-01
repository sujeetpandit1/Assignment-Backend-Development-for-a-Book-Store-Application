const sendErrorResponse = require('../errorHandler/apiError');
const Book = require('../models/bookModel');
const joi = require('joi');

// Book validation
const bookSchema = joi.object({
    bookId: joi.string().min(4).max(18).required(),
    title: joi.string().min(4).max(60).required(),
    description: joi.string().required(),
    price: joi.number().min(100).max(1000).required(),
})

const validateBook = (req, res, next) =>{
    const {error} = bookSchema.validate(req.body);

    if(error){
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next()
} 

const addBook = async (bookData) => {
  const newBook = new Book(bookData);
  await newBook.save();
  return newBook;
};

const updateBook = async (bookId, updatedData) => {
  const updatedBook = await Book.findOneAndUpdate(
    { bookId },
    updatedData,
    { new: true, runValidators: true }
  );
  return updatedBook;
};

const deleteBook = async (bookId) => {
  const deletedBook = await Book.findOneAndDelete({ bookId });
  return deletedBook;
};

const getBooks = async (page, limit) => {
  const books = await Book.find()
    .skip((page - 1) * limit)
    .limit(limit);
  return books;
};

module.exports = {
  validateBook,
  addBook,
  updateBook,
  deleteBook,
  getBooks
};
