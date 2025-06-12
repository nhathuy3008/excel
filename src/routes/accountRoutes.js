const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const verifyToken = require('../middleware/authMiddleware'); // middleware xác thực JWT

// Đăng ký
router.post('/register', accountController.register);

// Đăng nhập
router.post('/login', accountController.login);

// Gửi mã xác thực qua email để reset mật khẩu
router.post('/forgot-password', accountController.forgotPassword);

// Reset mật khẩu bằng mã xác thực
router.post('/reset-password', accountController.resetPassword);

// Lấy thông tin tài khoản hiện tại (đã đăng nhập)
router.get('/me', verifyToken, accountController.getMe);

// Lấy toàn bộ tài khoản
router.get('/', accountController.getAllAccounts);

module.exports = router;
