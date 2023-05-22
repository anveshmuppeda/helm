const jwt = require('jsonwebtoken');
const app = require('../app');

const jwtSecret = app.env.JWT_SECRET_KEY;

const authenticate = (isOperator = false) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized, You must be login.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (isOperator && decoded.role !== 'Operator') {
      return res.status(401).json({ success: false, message: 'Unauthorized, You must be an Operator to access this resource.' });
    }
    req.userId = decoded.user_id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
}

module.exports = authenticate;