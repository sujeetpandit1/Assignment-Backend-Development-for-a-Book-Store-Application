const sendErrorResponse = require('../errorHandler/apiError');
const ApiResponse = require('../errorHandler/apiResponse');
const tryCatch = require('../errorHandler/tryCatch');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const bookService = require('../services/bookService');
const { startSession } = require('mongoose');
const {generateSlug, generateSlugWithPrefix} = require('../utils/generateSlug');
const { startEmailSendingController } = require('../queueServices/queues');



const addBook = async (req, res) => {
  const { bookId, title, description, price, quantity } = req.body;
  const authorName = req.user.fullName;
  const userId = req.user.userId;

  const slug = generateSlug(title);
  const slug2 = generateSlugWithPrefix(bookId, 'book');

  // Start a transaction
  const session = await startSession();
  session.startTransaction();

  try {
    const newBook = new Book({
      bookId: slug2,
      title: slug,
      userId: userId,
      authors: authorName,
      description,
      price,
      quantity,
    });

    await newBook.save({ session });
    await session.commitTransaction();

    startEmailSendingController(req, res)

    res.status(201).json(new ApiResponse(undefined, 'Book added Successfully', newBook));
    
  } catch (error) {
    if(error.code === 11000){
      const field = Object.keys(error.keyValue)[0];
          return res.status(400).json({
          status: 'failed',
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} '${error.keyValue[field]}' already exists.`,
      }); }
    await session.abortTransaction();
    console.error(error);
    return sendErrorResponse(res, 400, 'Transaction Aborted: Unable to add the book');
  } finally {
    session.endSession();
  }
};


const updateBook = tryCatch (async (req, res) => {
    const updatedBook = await bookService.updateBook(req.params.bookId, req.body);

    if(!updatedBook){
      return sendErrorResponse(res, 404, "Book Not Found")
    }

    return res.status(200).json(new ApiResponse(undefined, 'Book Updated Successfully', updatedBook));
});

const deleteBook = tryCatch (async (req, res) => {
    const deletedBook = await bookService.deleteBook(req.params.bookId);
    if(!deletedBook){
      return sendErrorResponse(res, 404, "Book Not Found")
    }
    return res.status(204).send(); 
});

const getBooks =  tryCatch (async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

    const books = await bookService.getBooks(page, limit);

    if(!books || books.length === 0){
      return sendErrorResponse(res, 400, "Books Not Available")
    }

    const modifiedBooks = books.map(book => {
      const { sellCount, __v,_id, createdAt, updatedAt, ...bookWithoutSellCount } = book._doc;
      return bookWithoutSellCount;
    });

    return res.status(200).json(new ApiResponse(undefined, 'Book Retrived Successfully', modifiedBooks));
});


const searchBook = tryCatch (async (req, res) =>{
  const { title, author, minPrice, maxPrice } = req.query;

    const filter = {};
    if (title) filter.title = new RegExp(title, 'i');
    if (author) filter.authors = new RegExp(author, 'i');;
    if (minPrice !== undefined) filter.price = { $gte: parseInt(minPrice) };
    if (maxPrice !== undefined) filter.price = { ...filter.price, $lte: parseInt(maxPrice) };

    const filteredBooks = await Book.find(filter);

    const modifiedBooks = filteredBooks.map(book => {
      const { sellCount, __v,_id, createdAt, updatedAt, revenue, version, ...bookWithoutSellCount } = book._doc;
      return bookWithoutSellCount;
    });

    return res.status(200).json(new ApiResponse(undefined, "Data Retrived Successfully", modifiedBooks))
})

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  getBooks,
  searchBook
};
