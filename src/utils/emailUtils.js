const nodemailer = require('nodemailer');

// Function to send a purchase notification email to authors
const sendPurchaseNotificationEmail = async (authorEmail, purchaseDetails) => {
  try {
    // Create a nodemailer transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com', // Replace with your email
        pass: 'your_email_password', // Replace with your email password
      },
    });

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

// Other email utility functions can be added as needed

// Export the utility functions
module.exports = {
  sendPurchaseNotificationEmail,
  // Add other functions here
};
