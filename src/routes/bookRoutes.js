const express = require('express');
const { addBook, updateBook, deleteBook, getBooks, searchBook } = require('../controllers/bookController');
const  {auth, authorizeAuthor}  = require('../auth/authMiddleware');
const { validateBook, validateToUpdateBook } = require('../services/bookService');

const router = express.Router();

router.post('/addBook', auth, authorizeAuthor, validateBook, addBook);
router.patch('/book/:bookId', auth, authorizeAuthor, updateBook);
router.delete('/book/:bookId', auth, authorizeAuthor, validateToUpdateBook, deleteBook);
router.get('/books', getBooks);
router.get('/searchBook', searchBook)

module.exports = router;
 