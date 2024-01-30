# Book Store Backend

## Project Structure

- **/config**: Configuration files
  - `db.js`: Database configuration
  - `mailer.js`: Mailer configuration

- **/controllers**: Request handlers
  - `authController.js`: Authentication logic
  - `bookController.js`: Book-related logic
  - `purchaseController.js`: Purchase-related logic

- **/models**: Mongoose models
  - `User.js`: User model
  - `Book.js`: Book model
  - `Purchase.js`: Purchase model

- **/routes**: Express routes
  - `authRoutes.js`: Authentication routes
  - `bookRoutes.js`: Book-related routes
  - `purchaseRoutes.js`: Purchase-related routes

- **/services**: Business logic
  - `authService.js`: Authentication service
  - `bookService.js`: Book-related service
  - `purchaseService.js`: Purchase-related service

- **/utils**: Utility functions
  - `emailUtil.js`: Email utility functions

- `index.js`: Main application file

- `.env`: Environment variables

- `README.md`: Project documentation

- `package.json`: NPM package configuration
