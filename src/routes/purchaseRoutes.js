const express = require('express');
const { purchaseBook, getPurchaseHistory } = require('../controllers/purchaseController');
const { auth, authorizeRetail } = require('../auth/authMiddleware');
const { validatePurchase } = require('../services/purchasesService');

const router = express.Router();

router.get('/history', auth, authorizeRetail, getPurchaseHistory);
router.post('/purchase', auth, authorizeRetail, validatePurchase, purchaseBook);


module.exports = router;
