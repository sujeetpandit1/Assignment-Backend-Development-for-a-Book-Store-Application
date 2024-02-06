const {sendEmail } = require("../config/mailer");
const tryCatch = require("../errorHandler/tryCatch");
const userModel = require("../models/userModel");

class EmailQueue {
  constructor(emailArray) {
    this.items = emailArray.slice();
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

class EmailSender {
  constructor(emailArray) {
    this.emailQueue = new EmailQueue(emailArray);
  }

  sendEmailBatch(batchSize) {
    const batch = [];
    while (batch.length < batchSize && !this.emailQueue.isEmpty()) {
      batch.push(this.emailQueue.dequeue());
    }
    return batch;
  }

  async processBatch(batch) {
    for (const email of batch) {
      const { to, user, title } = email;

      if (!to) {
        console.error(`Recipient (to) not defined for email: ${JSON.stringify(email)}`);
        continue; // Skip to the next email in the batch
      }
      const subject = "New Book Added notification";
      const text = `Dear ${user.fullName},\nNew Book: ${title} Added! Checkout now!`;

      try {
        await sendEmail(to, subject, text);
        console.log(`Email sent successfully to: ${to}`);
      } catch (error) {
        console.error(`Failed to send email to ${to}: ${error.message}`);
        // Handle the error as needed, e.g., requeue the email or log it for further analysis
      }
    }
  }

  async startSending(interval, batchSize) {
    try {
      while (!this.emailQueue.isEmpty()) {
        const batch = this.sendEmailBatch(batchSize);
        if (batch.length > 0) {
          await this.processBatch(batch);
        }
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      console.log('All emails sent successfully.');
    } catch (error) {
      console.error(`Error in startSending: ${error.message}`);
      // Handle the error as needed
    }
  }
}

const startEmailSending = async (req, res) => {
  const { title } = req.body;
  try {
    const emails = await userModel.find({ role: 'retail' }, 'email fullName');

    if (!emails || emails.length === 0) {
      throw new Error("User's Email not found");
    }

    const emailAddresses = emails.map((user) => ({ to: user.email, user, title }));
    const emailSender = new EmailSender(emailAddresses);
    await emailSender.startSending(60000, 100);
  } catch (error) {
    console.error(error);
    throw error; // Rethrow to allow for further error handling
  }
};

const startEmailSendingController = tryCatch(async (req, res) => {
  startEmailSending(req, res);
  console.log('Email sending process started successfully.' );
});

module.exports = { startEmailSendingController };
