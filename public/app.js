// public/app.js

document.addEventListener('DOMContentLoaded', () => {
    const stripe = stripe('process.env.STRIPE_PUBLIC_KEY'); // Replace with your actual Stripe public key
    const elements = stripe.elements();
    
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');
    
    const form = document.getElementById('payment-form');
    const errorElement = document.getElementById('card-errors');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
    
      const { token, error } = await stripe.createToken(cardElement);
    
      if (error) {
        // Inform the user if there was an error.
        errorElement.textContent = error.message;
      } else {
        // Send the token to your server.
        stripePayment(token);
      }
    });
  
    const stripePayment = async (token) => {
      const amount = 2000; // Amount in cents
      const currency = 'INR'; // Replace with your currency
  
      try {
        const response = await fetch('/purchase/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookId: 'YOUR_BOOK_ID', // Replace with the actual book ID
            quantity: 1, // Replace with the desired quantity
            paymentMethodId: token.id,
          }),
        });
  
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error(error);
        // Display error to the user
        alert('Payment failed');
      }
    };
  });
  