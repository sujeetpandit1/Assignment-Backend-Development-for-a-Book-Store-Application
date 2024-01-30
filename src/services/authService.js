const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to authenticate user credentials and generate JWT token
const authenticateUser = async (username, password) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found or password is incorrect, throw an error
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid username or password');
    }

    // Return the authenticated user
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to generate JWT token for a user
const generateAuthToken = (user) => {
  // Use your own secret key for signing the token
  const secretKey = process.env.JWT_SECRET || 'your_secret_key';

  // Create and sign the token with the user information
  const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });

  return token;
};

// Other authentication service functions can be added as needed

// Export the service functions
module.exports = {
  authenticateUser,
  generateAuthToken,
  // Add other functions here
};
