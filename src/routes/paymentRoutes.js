const express = require('express');
const path = require('path')
const { createCustomer, addNewCard, createCharges } = require('../controllers/paymentController');

const payment_route = express();
const router = express.Router();

payment_route.set('view engine', 'ejs');
payment_route.set('views', path.join(__dirname, '../'))

router.post('/createCustomer', createCustomer);
router.post('/addCard', addNewCard);
router.post('/createCharges', createCharges);

module.exports = router;
