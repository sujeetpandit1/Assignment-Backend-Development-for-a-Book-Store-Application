const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);
const Payment = require('../models/paymentModel')


async function processPayment(amount, currency, paymentMethod, returnUrl) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        payment_method: paymentMethod,
        confirm: true,
        setup_future_usage: 'on_session',
        return_url: returnUrl,
      });
  
      if (paymentIntent.status !== 'succeeded') {
        throw new Error("Payment Failed"); 
      }
  
      const newPayment = new Payment({
        paymentId: paymentIntent.id,
        amount: amount,
        currency: currency,
        paymentMethod: paymentMethod,
        return_url: returnUrl,
      });
  
      await newPayment.save();
  
      return newPayment;
    } catch (error) {
      throw new Error("Payment Failed: " + error.message);
    }
  }
  
  
  module.exports = {
    processPayment,
  };