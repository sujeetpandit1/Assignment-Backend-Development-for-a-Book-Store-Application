const sendErrorResponse = require('../errorHandler/apiError');
const Book = require('../models/bookModel');
const joi = require('joi');

// Book validation
const bookSchema = joi.object({
  bookId: joi.number().integer().min(1).max(99999999999999999).required(),
    title: joi.string().min(4).max(60).required(),
    description: joi.string().required(),
    price: joi.number().min(100).max(1000).required(),
    quantity: joi.number().min(1).max(30000)
})

const validateBook = (req, res, next) =>{
    const {error} = bookSchema.validate(req.body);

    if(error){
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next()
} 

const updateBookSchema = joi.object({
  title: joi.string().min(4).max(60),
  description: joi.string(),
  price: joi.number().min(100).max(1000),
  quantity: joi.number().min(1).max(30000)
});

const validateToUpdateBook = (req, res, next) => {
  const { error } = updateBookSchema.validate(req.body);

  if (error) {
    return sendErrorResponse(res, 400, error.details[0].message);
  }

  next();
};

const addBook = async (bookData) => {
  const newBook = new Book(bookData);
  await newBook.save();
  return newBook;
};

const updateBook = async (bookId, updatedData) => {
  const updatedBook = await Book.findOneAndUpdate(
    { bookId: { $regex: new RegExp(bookId, 'i') } },
    updatedData,
    { new: true, runValidators: true }
  );
  return updatedBook;
};

const deleteBook = async (bookId) => {
  const deletedBook = await Book.findOneAndDelete({ bookId: { $regex: new RegExp(bookId, 'i') } });
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
  validateToUpdateBook,
  addBook,
  updateBook,
  deleteBook,
  getBooks
};
