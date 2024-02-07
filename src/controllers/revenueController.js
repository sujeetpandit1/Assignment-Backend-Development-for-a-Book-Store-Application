const { sendRevenueDetailsEmail } = require("../config/mailer");
const sendErrorResponse = require("../errorHandler/apiError");
const ApiResponse = require("../errorHandler/apiResponse");
const tryCatch = require("../errorHandler/tryCatch");
const Book = require('../models/bookModel')


const revenueDetails = tryCatch (async (req, res) =>{
    const userId = req.user.userId;
    const authorEmail = req.user.email;
    const authorname = req.user.fullName;

    if (!userId || !authorEmail || !authorname) {
      return sendErrorResponse(res, 400, `Invalid Token`);
    }

    const books = await Book.find({ userId: userId });

    const totalRevenue = books.reduce((total, book) => total + book.revenue, 0);

    const currentMonth = new Date().getMonth() + 1;
    const monthlyRevenue = books
      .filter((book) => new Date(book.createdAt).getMonth() + 1 === currentMonth)
      .reduce((total, book) => total + book.revenue, 0);

    const currentYear = new Date().getFullYear();
    const yearlyRevenue = books
      .filter((book) => new Date(book.createdAt).getFullYear() === currentYear)
      .reduce((total, book) => total + book.revenue, 0);

    // Send revenue details email
    sendRevenueDetailsEmail(authorEmail, authorname, totalRevenue, monthlyRevenue, yearlyRevenue);

    return res.status(200).json(new ApiResponse(undefined, "Revenue Details Retrived Successfully", {monthlyRevenue, yearlyRevenue, totalRevenue}))
})

module.exports = revenueDetails;