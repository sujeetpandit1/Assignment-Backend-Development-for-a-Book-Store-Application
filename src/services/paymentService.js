const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);


const processPayment = async (book, quantity) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: book.price * quantity * 100,
        currency: 'INR',
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      let data = paymentIntent.id.toString();
  
      const paymentConfirm = await stripe.paymentIntents.confirm(
        data,
        {
          payment_method: 'pm_card_visa',
          return_url: 'http://localhost:6000', 
        }
      );

      // if(paymentConfirm.status != "succeeded"){
      //   return { success: false, paymentId: null }
      // } 

  
      return paymentConfirm;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
 module.exports = {processPayment}; 