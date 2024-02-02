const joi = require('joi');
const sendErrorResponse = require('../errorHandler/apiError');
const Review = require('../models/reviewModel');

// review validation
const reviewSchema = joi.object({
    bookId: joi.string().required(),
    userId: joi.string(),
    reviewedBy: joi.string(),
    rating: joi.number().min(1).max(5).required(),
    review: joi.string().max(150),
})

const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);

    if(error){
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next()
}


// review validation
const updateReviewSchema = joi.object({
    reviewedBy: joi.string(),
    rating: joi.number().min(1).max(5),
    review: joi.string().max(150),
})

const validateReviewUpdate = (req, res, next) =>{
    const {error} = updateReviewSchema.validate(req.body);

    if(error){
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next()
}


const updateReview = async (id, updatedData) => {
    
    const updatedReview = await Review.findOneAndUpdate(
      { _id: id },
      updatedData,
      { new: true, runValidators: true }
    );
    return updatedReview;
  };
  

  const deleteReview = async (id) => {
    const deletedReview = await Review.findOneAndDelete({ _id: id});
    return deletedReview;
  };


module.exports = {validateReview, validateReviewUpdate, updateReview, deleteReview}