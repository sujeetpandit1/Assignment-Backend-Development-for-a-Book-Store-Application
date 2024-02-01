// routes/bookRoutes.js
const express = require('express');
const { addBook } = require('../controllers/bookController');
const  {auth, authorizeAuthor}  = require('../auth/authMiddleware');
const { validateBook } = require('../services/bookService');

const router = express.Router();

router.post('/addBook', auth, authorizeAuthor, validateBook, addBook);
// router.put('/books/:bookId', bookController.updateBook);
// router.delete('/books/:bookId', bookController.deleteBook);
// router.get('/books', bookController.getBooks);

module.exports = router;
 