const sendErrorResponse = require("../errorHandler/apiError");
const ApiResponse = require("../errorHandler/apiResponse");
const tryCatch = require("../errorHandler/tryCatch");
const Book = require("../models/bookModel");
const Review = require("../models/reviewModel");
const reviewService = require('../services/reviewService');



const createReview = tryCatch (async (req, res) => {
    const { bookId, reviewedBy, rating, review } = req.body;
    const userId = req.user.userId;

    const checkBook = await Book.findOne({bookId});
    if(!checkBook){
        return sendErrorResponse(res, 404, "Book Not Available")
    }

    const newreview = new Review({ bookId, userId, reviewedBy, rating, review});
    await newreview.save();

    return res.status(201).json(new ApiResponse(undefined, 'Review submitted Successfully'));
  });


const updateReview = tryCatch (async (req, res) =>{

    const id = req.params.id;
    if(id.length != 24){
        return sendErrorResponse(res, 400, "Please Check Id")
    }

    const updatedreview = await reviewService.updateReview(id, req.body);

    if(!updatedreview){
      return sendErrorResponse(res, 404, "Review Not Found")
    }

    return res.status(200).json(new ApiResponse(undefined, 'Review Updated Successfully', updatedreview));
})

const getReview = tryCatch (async (req, res)=>{
        const bookId = req.query.bookId;
        if(!bookId){
            return sendErrorResponse(res, 400, "Please Check Book Id")
        }
        const getBookReview = await Review.find({bookId: { $regex: new RegExp(bookId, 'i') }});
        if(!getBookReview){
          return sendErrorResponse(res, 404, "Review Not Found For this Book")
        }
        return res.status(200).json(new ApiResponse(undefined, "Review fetched successfully", getBookReview));
})

const deleteReview = tryCatch (async (req, res) => {

    const id = req.params.id;
    if(id.length != 24){
        return sendErrorResponse(res, 400, "Please Check Id")
    }
    const deletedBook = await reviewService.deleteReview(id);
    if(!deletedBook){
      return sendErrorResponse(res, 404, "Book Not Found")
    }
    return res.status(204).send();
});


module.exports = {createReview, updateReview, deleteReview, getReview}
  