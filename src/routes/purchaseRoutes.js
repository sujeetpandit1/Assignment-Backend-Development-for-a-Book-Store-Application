const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Route to get purchase history for a user
router.get('/purchase/history/:userId', purchaseController.getPurchaseHistory);

// Route to purchase a book
router.post('/purchase', purchaseController.purchaseBook);

// Other purchase routes can be added as needed

// Export the router
module.exports = router;
