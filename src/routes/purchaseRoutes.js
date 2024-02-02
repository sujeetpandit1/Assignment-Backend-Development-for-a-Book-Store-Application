const express = require('express');
const { purchaseBook, getPurchaseHistory } = require('../controllers/purchaseController');
const { auth, authorizeRetail } = require('../auth/authMiddleware');
const { validatePurchase } = require('../services/purchasesService');

const router = express.Router();

// Route to get purchase history for a user
router.get('/history', auth, authorizeRetail, getPurchaseHistory);

// Route to purchase a book
router.post('/purchase', auth, authorizeRetail, validatePurchase, purchaseBook);

// Other purchase routes can be added as needed

// Export the router
module.exports = router;
