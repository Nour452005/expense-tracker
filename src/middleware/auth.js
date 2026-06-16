const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  // 2. If no token, reject immediately
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach the decoded payload to req
    next();             // continue to the actual route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};