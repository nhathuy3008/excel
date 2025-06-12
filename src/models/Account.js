const mongoose = require('mongoose');
const validator = require('validator');

const accountSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Họ và tên bắt buộc điền'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email bắt buộc điền'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Vui lòng nhập một địa chỉ email hợp lệ',
    },
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu bắt buộc điền'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
  },

  // 👇 Thêm 2 dòng này để hỗ trợ reset password
  resetCode: {
    type: String,
    default: null,
  },
  resetCodeExpire: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Account', accountSchema);
