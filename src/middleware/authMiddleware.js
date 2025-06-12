// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Không có token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Account.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Không tìm thấy người dùng' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
};

module.exports = verifyToken;
