const express = require('express');
const { createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const {validateReview, validateReviewUpdate} = require('../services/reviewService');
const { auth, authorizeRetail } = require('../auth/authMiddleware');


const router = express.Router();

router.post('/createReview', auth, authorizeRetail, validateReview, createReview);
router.patch('/updateReview/:id', auth, authorizeRetail, validateReviewUpdate, updateReview);
router.delete('/deleteReview/:id', auth, authorizeRetail, deleteReview);

module.exports = router;