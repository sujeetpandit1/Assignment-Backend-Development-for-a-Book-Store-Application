const express = require('express');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
const {db} = require ("./config/db");


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

//DB Connect
db();

// Global JSON handler
app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError) {
      res.status(400).json({ status: "failed", message: 'Invalid Data : Content in body is in invalid format' });
    } else {
      next();
    }
  });
// Global Error Handlet
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "failed", message:'Something went wrong!'});
  });

// Load routes
app.use('/user', require('./routes/userRoutes'));
app.use('/books', require('./routes/bookRoutes'));  
app.use('/purchase', require('./routes/purchaseRoutes'));
app.use('/revenue', require('./routes/revenueRoutes'));
app.use('/review', require('./routes/reviewRoutes'));

app.all("/**", (_req, res) => {
    res
      .status(404)
      .send({ status: "failed", message: "Requested URL not Available" });
  });

  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
