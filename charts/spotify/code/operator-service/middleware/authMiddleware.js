const jwt = require('jsonwebtoken');
const env = require('../app');

const jwtSecret = env.JWT_SECRET_KEY;

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.user_id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
}

module.exports = authenticate;