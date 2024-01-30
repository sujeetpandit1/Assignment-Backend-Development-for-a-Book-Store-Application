const nodemailer = require('nodemailer');
const { sendPurchaseNotificationEmail } = require('../utils/emailUtil');

// Create a nodemailer transporter using your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Replace with your email
    pass: 'your_email_password', // Replace with your email password
  },
});

// Function to send a purchase notification email to authors
const sendPurchaseNotification = async (authorEmail, purchaseDetails) => {
  try {
    // Create the email message
    const mailOptions = {
      from: 'your_email@gmail.com', // Replace with your email
      to: authorEmail,
      subject: 'Purchase Notification',
      html: `
        <p>Hello,</p>
        <p>Your book has been purchased!</p>
        <p>Purchase Details:</p>
        <ul>
          <li>Book Title: ${purchaseDetails.bookTitle}</li>
          <li>Quantity: ${purchaseDetails.quantity}</li>
          <li>Total Price: $${purchaseDetails.totalPrice}</li>
        </ul>
        <p>Thank you for being a part of our book store!</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Handle email sending errors
    console.error('Error sending email:', error.message);
  }
};

// Export the mailer and utility functions
module.exports = {
  transporter,
  sendPurchaseNotification,
};
