const express = require('express');
const revenueDetails = require('../controllers/revenueController');
const { auth, authorizeAuthor } = require('../auth/authMiddleware');


const router = express.Router();

router.get('/revenueDetails', auth, authorizeAuthor, revenueDetails);

module.exports = router;
 