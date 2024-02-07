# Bookstore Application

This Node.js application manages book purchases, tracks user history, and sends email notifications for newly added books.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Express
- Nodemailer
- Stripe
- Agenda
- npm (Node Package Manager)

### Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/sujeetpandit1/Assignment-Backend-Development-for-a-Book-Store-Application.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Assignment-Backend-Development-for-a-Book-Store-Application
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file in the project root and configure the following variables:

    PORT=your-desired-port
    MONGODB_URI=your-mongodb-connection-string

    Replace `your-desired-port` with the preferred port number for the application, and `your-mongodb-connection-string` with the connection string to your MongoDB instance.

    Replace MailTrap Credential for sending emails.
    Replace Stripe credentials for processing payments.

    MONGODB_URI = 'mongodb+srv:'
    JWT_SECRET_KEY = 'ashggvfa'
    PORT = 6000

    EMAIL_HOST = 'sandbox.smtp.mailtrap.io'
    EMAIL_PORT = 2525
    EMAIL_FROM = 'contact@geekyshows.com'
    EMAIL_USER = '********************'
    EMAIL_PASS = '********************'
    EMAIL_FROM = 'abc@gmail.com'

    STRIP_SECRET_KEY = '*******************************************'
    STRIPE_PUBLIC_KEY = '******************************************'



### Database Setup

1. Start your MongoDB server.

2. Create a new database for the application.

### Running the Application

1. Start the Node.js application:

    npm start

2. The application should be running on `http://localhost:your-port` (replace `your-port` with the port configured in the `.env` file).

3. ****End Points:-****
>>>> User's Routes:-
-- POST API -- http//:localhost:6000/user/register
-- POST API -- http//:localhost:6000/user/login -- token generated

>>>> Book Routes:-
-- POST API -- http//:localhost:6000/book/addBook
-- PATCH API -- http//:localhost:6000/book/book/:bookId
-- DELETE API -- http//:localhost:6000/book/book/:bookId
-- GET API -- http//:localhost:6000/book/books
-- GET API -- http//:localhost:6000/book/searchBook

>>>> Purchase Routes:-
-- POST API -- http//:localhost:6000/purchase/purchase
-- GET API -- http//:localhost:6000/purchase/history

>>>> Review Routes:-
-- POST API -- http//:localhost:6000/review/createReview
-- PATCH API -- http//:localhost:6000/review/updateReview/:id
-- DELETE API -- http//:localhost:6000/review/deleteReview/:id
-- GET API -- http//:localhost:6000/review/getReviews

>>>> Revenue Routes:-
-- GET API -- http//:localhost:6000/revenue/revenueDetails

### License

This project is licensed under the [MIT License](LICENSE).

## Project Structure

- **/config**: Configuration files
  - `db.js`: Database configuration
  - `mailer.js`: Mailer configuration

- **/controllers**: Request handlers
  - `authController.js`: Authentication logic
  - `bookController.js`: Book-related logic
  - `purchaseController.js`: Purchase-related logic
  - `reviewController.js`: Review-related logic
  - `revueController.js`: Revenue-related logic

- **/models**: Mongoose models
  - `userModel.js`: User model
  - `bookModel.js`: Book model
  - `purchaseModel.js`: Purchase model
  - `reviewmodel.js`: Review model

- **/routes**: Express routes
  - `authRoutes.js`: Authentication routes
  - `bookRoutes.js`: Book-related routes
  - `purchaseRoutes.js`: Purchase-related routes
  - `reviewRoutes.js`: Review-related routes

- **/services**: Business logic
  - `authService.js`: Authentication service
  - `bookService.js`: Book-related service
  - `purchaseService.js`: Purchase-related service
  - `paymentService.js`: Payment-related service
  - `reviewService.js`: Review-related service

- **/utils**: Utility functions
  - `purchaseUtils.js`: Purchase utility functions
  - `generateSlug.js`: Slug Generation functions

- `index.js`: Main application file

- `.env`: Environment variables

- `README.md`: Project documentation

- `package.json`: NPM package configuration

### Purchase Logic

The `purchaseBook` function in the main application (`app.js`) handles the process of purchasing a book. Here's a breakdown of the logic:

1. **Request Parsing**: The function first extracts relevant information from the incoming request, such as `bookId`, `quantity`, `userId`, and `userName`.

2. **User Token Validation**: It checks if the user's token is valid by ensuring the existence of `userId` and `userName`. If not, it returns a 400 Bad Request response with an "Invalid Token" message.

3. **Book Availability Check**: It queries the database to check if the requested book (`bookId`) is available. If not, it returns a 404 Not Found response with a "Book Not Available" message.

4. **Stock Check**: It verifies if there is sufficient stock for the requested quantity. If not, it returns a 400 Bad Request response with an "INSUFFICIENT_STOCK" message.

5. **Transaction Handling**: It starts a MongoDB transaction to ensure data consistency during the purchase process.

6. **Payment Processing**: It initiates the payment processing for the book.

7. **Data Updates**: It updates the book information (sell count, quantity, revenue) and the user's revenue in the database. It handles concurrency conflicts by checking the book's version.

8. **Purchase Record Creation**: It creates a new purchase record with details like `purchaseId`, `bookId`, `userId`, `price`, `quantity`, `paymentId`, and `paymentStatus`. This record is saved within the transaction session.

9. **Email Notifications**: It sends purchase notification emails to the user and the book's author.

10. **Transaction Commit**: If everything is successful, it commits the MongoDB transaction.

### Computing `sellCount`

The `sellCount` is computed during the book update process in the `updateBookAndUser` function. The `sellCount` represents the total number of copies sold for a particular book. It gets incremented by the purchased quantity, reflecting the updated sales count.

### Mechanism for Sending Email Notifications

The application uses a queue-based mechanism for sending email notifications asynchronously. The `EmailQueue` class represents a simple queue structure, and the `EmailSender` class manages the processing of email batches.

1. **Queue Initialization**: An instance of `EmailSender` is created with an array of emails to be sent.

2. **Batch Sending**: The `sendEmailBatch` method retrieves a batch of emails from the queue.

3. **Email Processing**: The `processBatch` method iterates through the batch, sends emails, and logs the results. If an email fails to send, it handles the error appropriately.

4. **Start Sending Loop**: The `startSending` method initiates a loop that continues until the email queue is empty. It sends batches at a specified interval, allowing for asynchronous processing.

5. **Controller**: The `startEmailSendingController` controller initiates the email sending process, gathering email addresses and starting the `EmailSender`. It is wrapped in a `tryCatch` block to handle errors.


### Acknowledgments

This application is built as a demonstration of best practices in handling purchases, transactions, and email notifications in a Node.js environment. Feel free to adapt and extend it for your specific use case.

#### Database Selection
Choosing MongoDB for this particular project involves considering various factors related to database design and implementation. Here are some reasons why MongoDB might be a suitable choice:

1. **Document-Oriented Model:**
   - **Flexibility:** MongoDB is a NoSQL, document-oriented database, meaning it stores data in a flexible, JSON-like format known as BSON (Binary JSON). This provides flexibility in schema design, allowing developers to adapt the data model easily as application requirements evolve.
   - **Nested Data Structures:** BSON supports nested data structures, making it well-suited for representing complex relationships between entities without the need for joins.

2. **Scalability:**
   - **Horizontal Scalability:** MongoDB excels in horizontal scalability. It can distribute data across multiple servers (sharding) to handle increased load and storage requirements. This makes it a good choice for applications expecting growth in data volume and user traffic.

3. **Query Language and Indexing:**
   - **Rich Query Language:** MongoDB supports a rich set of queries, including range queries, regular expressions, and geospatial queries. This allows for efficient and expressive querying of data.
   - **Indexing:** MongoDB supports indexing, which significantly improves query performance. Developers can create various indexes, including compound indexes, to optimize specific queries.

4. **Schema Design:**
   - **Dynamic Schema:** MongoDB's dynamic schema allows for seamless updates to the data model. This is particularly useful in agile development environments where requirements can change frequently.
   - **Schema-less Nature:** Unlike traditional relational databases, MongoDB doesn't enforce a fixed schema. This flexibility is beneficial when dealing with evolving data structures.

5. **JSON-Like Documents:**
   - **Native JSON Format:** Storing data in BSON, a binary representation of JSON, allows for easy integration with JSON-based web applications. This native support for JSON simplifies data interchange between the application and the database.

6. **Developer Productivity:**
   - **Document Format:** Developers often find MongoDB's document format more natural to work with, especially when dealing with object-oriented programming languages. The document structure aligns well with data structures in modern programming languages.
   - **Aggregation Framework:** MongoDB's powerful aggregation framework enables developers to perform complex data transformations and analysis directly within the database.

7. **Community and Ecosystem:**
   - **Active Community:** MongoDB has a large and active community, providing support, documentation, and a wealth of resources. This is valuable for troubleshooting issues and staying up-to-date with best practices.
   - **Ecosystem:** MongoDB offers a comprehensive ecosystem, including tools like MongoDB Atlas for cloud-based database hosting, MongoDB Compass for GUI-based exploration, and various drivers for different programming languages.

8. **Use Cases:**
   - **Content Management:** MongoDB is well-suited for content management systems where content structures may vary.
   - **Real-Time Applications:** It is commonly used in real-time applications, such as messaging platforms and IoT applications, due to its horizontal scalability and low-latency performance.
