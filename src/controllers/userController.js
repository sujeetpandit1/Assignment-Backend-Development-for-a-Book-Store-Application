const ApiResponse = require('../errorHandler/apiResponse');
const tryCatch = require('../errorHandler/tryCatch');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const sendErrorResponse = require('../errorHandler/apiError');



const registerUser = tryCatch(async (req, res) => {
  const { username, password, role, fullName, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword, role, fullName , email});
  await newUser.save();

  return res.status(201).json(new ApiResponse(undefined, 'User Registered Successfully'));
});


const loginUser = tryCatch (async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if(!user || user === undefined || user === null){
      return sendErrorResponse(res, 404, "User Name not Found");
    }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return sendErrorResponse(res, 401, "Password Mismatch");
  }
  const secretKey = process.env.JWT_SECRET_KEY;

  const token = jwt.sign({ userId: user._id, username: user.username, role: user.role , fullName: user.fullName, email: user.email}, secretKey, { expiresIn: '48h' });
  return res.status(200).send({status: "success", message: "Login Sucessfull", token: token}); 
});



module.exports = {
  registerUser,
  loginUser
};
