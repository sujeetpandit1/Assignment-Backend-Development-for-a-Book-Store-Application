const jwt = require('jsonwebtoken');
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');


const auth = async (req, res, next) => {
  try {

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ status: "failed", message: "Authentication token missing" });
  }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ status: "failed", message: `Session Expired : ${error.message}` });
    }

    if (error instanceof JsonWebTokenError || error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ status: "failed", message: `Invalid Token : ${error.message}` });
    }

    return res.status(500).json({ status: "failed", message: `Internal Server Error: ${error.message}` });
  }
};

const authorizeAuthor = (req, res, next) => {
  if (req.user && req.user.role === 'author') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
};

const authorizeRetail = (req, res, next) => {
  if (req.user && req.user.role === 'retail') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
};

module.exports = { auth, authorizeAuthor, authorizeRetail };
