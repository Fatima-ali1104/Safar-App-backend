const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ err: 'No token provided' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ err: 'Invalid token format' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("AUTH USER:", req.user);
    next();
  } catch (err) {
    console.error('Token verification error:', err); 
    res.status(401).json({ err: 'Invalid Token' }); 
  }
};

module.exports = verifyToken;

