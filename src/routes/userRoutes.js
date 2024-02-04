const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const {validateUser, validateLogin}  = require('../services/userServices');
const {sendBulkEmail, allMails} = require('../controllers/bulkEmailApi');
const { startEmailSendingController } = require('../queueServices/queues');
const router = express.Router();


router.post('/register', validateUser, registerUser);
router.post('/login', validateLogin, loginUser);

//send bulk mail
router.post('/sendBulkMail', sendBulkEmail)
router.post('/mails', startEmailSendingController)



module.exports = router;
