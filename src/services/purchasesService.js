const Purchase = require('../models/purchaseModel');
const sendErrorResponse = require('../errorHandler/apiError');
const joi = require('joi');


// Purchase validation
const purchaseSchema = joi.object({
    bookId: joi.string().required(),
    quantity: joi.number().min(1).max(30000).required()
})

const validatePurchase = (req, res, next) =>{
    const {error} = purchaseSchema.validate(req.body);

    if(error){
        return sendErrorResponse(res, 400, error.details[0].message);
    }

    next()
} 


const getPurchaseHistory = async (userId) => {
    const history = await Purchase.find({ userId });
    return history;
};

  
module.exports = {
  validatePurchase,
  getPurchaseHistory

};
