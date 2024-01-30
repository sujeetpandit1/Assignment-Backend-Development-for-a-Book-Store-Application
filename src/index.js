const express = require('express');
const dotenv = require('dotenv');
const {db} = require ("./config/db");


dotenv.config();

const app = express();
app.use(express.json());

//DB Connect
db();

// Load routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/books', require('./routes/bookRoutes'));  
app.use('/purchases', require('./routes/purchaseRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
