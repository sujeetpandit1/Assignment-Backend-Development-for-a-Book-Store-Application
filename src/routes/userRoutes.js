const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const {validateUser, validateLogin}  = require('../services/userServices');
const { startEmailSendingController } = require('../queueServices/queues');
const router = express.Router();


router.post('/register', validateUser, registerUser);
router.post('/login', validateLogin, loginUser);

//send bulk mail
router.post('/mails', startEmailSendingController)



module.exports = router;
