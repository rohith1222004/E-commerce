const jwt = require('jsonwebtoken');
require('dotenv').config()

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
      req.isAuthenticated = false;
      // return res.status(401).json({ error: 'Access denied' });
      return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        req.isAuthenticated = false;
        // return res.status(403).json({ message: 'Invalid token' });
        return next();
      }
      req.isAuthenticated = true;
      req.user = user;     
      next();
    });
}

const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports={
    authenticateToken,
    authorizeRole
}