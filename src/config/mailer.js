const nodemailer = require('nodemailer');
const dotenv = require('dotenv');


dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true
});

const sendEmail = async (to, subject, text) => {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    throw new Error(`Failed to send email: ${error}`);
  }
};

const sendBulkEmail = async (recipients, subject, text) => {
  try {
      // Convert the array of recipients to a comma-separated string
      const to = recipients.join(', ');

      await transport.sendMail({
          from: process.env.EMAIL_USER,
          to,
          subject,
          text,
      });
  } catch (error) {
      throw new Error(`Failed to send email: ${error}`);
  }
};



module.exports = { sendEmail, sendBulkEmail };
