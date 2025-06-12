const Account = require('../models/Account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '7d';

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await Account.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const account = await Account.create({ fullName, email, password: hashedPassword });

    res.status(201).json({ message: 'Đăng ký thành công', account });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email });

    if (!account) return res.status(400).json({ message: 'Email không đúng' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không đúng' });

    const token = jwt.sign({ id: account._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({
      message: 'Đăng nhập thành công',
      token,
      account: {
        _id: account._id,
        fullName: account.fullName,
        email: account.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Gửi mã xác thực 6 số qua email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const account = await Account.findOne({ email });

    if (!account) return res.status(400).json({ message: 'Email không tồn tại' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    account.resetCode = code;
    account.resetCodeExpire = Date.now() + 15 * 60 * 1000; // 15 phút

    await account.save();

    const html = `<p>Mã xác thực đặt lại mật khẩu của bạn là: <b>${code}</b></p>`;
    await sendEmail(email, 'Mã xác thực đặt lại mật khẩu', html);

    res.json({ message: 'Đã gửi mã xác thực đến email của bạn' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đặt lại mật khẩu bằng mã 6 số
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body; // 🔁 đổi từ `password` => `newPassword`

    const account = await Account.findOne({
      email,
      resetCode: code,
      resetCodeExpire: { $gt: Date.now() }
    });

    if (!account) {
      return res.status(400).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' });
    }

    account.password = await bcrypt.hash(newPassword, 10); // 🔁 dùng `newPassword`
    account.resetCode = undefined;
    account.resetCodeExpire = undefined;
    await account.save();

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};


// Lấy thông tin tài khoản hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await Account.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách tất cả tài khoản
exports.getAllAccounts = async (req, res) => {
  try {
    const users = await Account.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
