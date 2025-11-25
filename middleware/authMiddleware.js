// D:\semester 5\pws\praktikum7\middleware\authMiddleware.js

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY_FOR_PICO';

exports.verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(403)
      .json({ message: 'Token required or format invalid (Bearer <token>)' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.admin = admin;
    next();
  });
};
