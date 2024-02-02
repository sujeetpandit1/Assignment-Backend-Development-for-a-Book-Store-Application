const sendErrorResponse = require('../errorHandler/apiError');
const ApiResponse = require('../errorHandler/apiResponse');
const tryCatch = require('../errorHandler/tryCatch');
const Book = require('../models/bookModel');
const bookService = require('../services/bookService');
const {generateSlug, generateSlugWithPrefix} = require('../utils/generateSlug');
// const slugify = require('slugify');


const addBook = tryCatch (async (req, res) => {
  const { bookId, title, description, price, quantity} = req.body;
  const authorName = req.user.fullName;
  const userId = req.user.userId;

  // const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });
  const slug = generateSlug(title);
  const slug2 = generateSlugWithPrefix(bookId, 'book');

    const newBook = new Book({
      bookId: slug2,
      title: slug,
      userId: userId,
      authors: authorName,
      description,
      price,
      quantity
    });

    await newBook.save();

  return res.status(201).json(new ApiResponse(undefined, 'Book added Successfully', newBook));
});

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
