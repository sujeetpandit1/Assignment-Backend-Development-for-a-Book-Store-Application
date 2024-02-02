const joi = require('joi');
const sendErrorResponse = require('../errorHandler/apiError');

// user validation
const userSchema = joi.object({
    username: joi.string().length(6).regex(/^[a-z]+$/).required(),
    password: joi.string().min(8).max(16).required(),
    role: joi.string().valid('admin', 'author', 'retail').required(),
    fullName: joi.string().max(60).required(),
    email: joi.string().email().required()
})

const validateUser = (req, res, next) =>{
    const {error} = userSchema.validate(req.body);

    if(error){
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next()
}

const loginSchema = joi.object({
    username: joi.string().length(6).regex(/^[a-z]+$/).required(),
    password: joi.string().min(8).max(16).required(),
})

const validateLogin = (req, res, next) =>{
    const {error} = loginSchema.validate(req.body);

    if(error){
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next()
}


module.exports = {
    validateUser, 
    validateLogin
}