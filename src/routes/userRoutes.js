const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const {validateUser, validateLogin}  = require('../services/userServices');
const router = express.Router();


router.post('/register', validateUser, registerUser);
router.post('/login', validateLogin, loginUser);


module.exports = router;
