const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Mã hàng là bắt buộc'],
      unique: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    specs: {
      type: [String], // Mảng chuỗi thay vì chuỗi đơn
      default: [],
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'Đơn vị tính là bắt buộc'],
    },
    price: {
      type: Number,
      required: [true, 'Giá là bắt buộc'],
      min: [0, 'Giá không được âm'],
    },
    tax: {
      type: Number,
      min: [0, 'Thuế không được âm'],
      max: [100, 'Thuế tối đa là 100%'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
