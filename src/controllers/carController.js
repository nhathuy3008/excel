// const Car = require('../models/Car');

// // Thêm xe mới
// exports.createCar = async (req, res) => {
//   try {
//     const { plateNumber, carType, repairContents, statuses, solutions } = req.body;

//     if (!plateNumber || !carType) {
//       return res.status(400).json({ message: 'Biển số và loại xe là bắt buộc.' });
//     }

//     const existing = await Car.findOne({ plateNumber });
//     if (existing) {
//       return res.status(409).json({ message: 'Biển số xe đã tồn tại.' });
//     }

//     const newCar = new Car({ plateNumber, carType, repairContents, statuses, solutions });
//     const saved = await newCar.save();

//     // Populate sau khi lưu
//     const populated = await Car.findById(saved._id)
//       .populate('carType', 'name')
//       .populate('statuses', 'name')
//       .populate('solutions', 'name')
//       .populate({
//         path: 'repairContents.repairContent',
//         select: 'name',
//       })
//       .populate({
//         path: 'repairContents.products.product',
//         select: 'code brand price tax unit',
//         populate: { path: 'unit', select: 'name' }
//       });

//     res.status(201).json(populateWithCalculations(populated));
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi thêm xe mới', error: error.message });
//   }
// };

// // Lấy danh sách xe
// exports.getAllCars = async (req, res) => {
//   try {
//     const cars = await Car.find()
//       .populate('carType', 'name')
//       .populate('statuses', 'name')
//       .populate('solutions', 'name')
//       .populate({
//         path: 'repairContents.repairContent',
//         select: 'name',
//       })
//       .populate({
//         path: 'repairContents.products.product',
//         select: 'code brand price tax unit',
//         populate: { path: 'unit', select: 'name' }
//       })
//       .sort({ createdAt: -1 });

//     const carsWithTotal = cars.map(populateWithCalculations);

//     res.json(carsWithTotal);
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi lấy danh sách xe', error });
//   }
// };

// // Lấy chi tiết xe theo id
// exports.getCarById = async (req, res) => {
//   try {
//     const car = await Car.findById(req.params.id)
//       .populate('carType', 'name')
//       .populate('statuses', 'name')
//       .populate('solutions', 'name')
//       .populate({
//         path: 'repairContents.repairContent',
//         select: 'name',
//       })
//       .populate({
//         path: 'repairContents.products.product',
//         select: 'code brand price tax unit',
//         populate: { path: 'unit', select: 'name' }
//       });

//     if (!car) return res.status(404).json({ message: 'Không tìm thấy xe' });

//     res.json(populateWithCalculations(car));
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi lấy chi tiết xe', error });
//   }
// };

// // Cập nhật xe
// exports.updateCar = async (req, res) => {
//   try {
//     const { plateNumber, carType, repairContents, statuses, solutions } = req.body;

//     const existing = await Car.findOne({ plateNumber, _id: { $ne: req.params.id } });
//     if (existing) {
//       return res.status(409).json({ message: 'Biển số xe đã tồn tại ở xe khác.' });
//     }

//     const updated = await Car.findByIdAndUpdate(
//       req.params.id,
//       { plateNumber, carType, repairContents, statuses, solutions },
//       { new: true, runValidators: true }
//     );

//     if (!updated) return res.status(404).json({ message: 'Không tìm thấy xe' });

//     // Populate sau khi cập nhật
//     const populated = await Car.findById(updated._id)
//       .populate('carType', 'name')
//       .populate('statuses', 'name')
//       .populate('solutions', 'name')
//       .populate({
//         path: 'repairContents.repairContent',
//         select: 'name',
//       })
//       .populate({
//         path: 'repairContents.products.product',
//         select: 'code brand price tax unit',
//         populate: { path: 'unit', select: 'name' }
//       });

//     res.json(populateWithCalculations(populated));
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi cập nhật xe', error });
//   }
// };

// // Xóa xe
// exports.deleteCar = async (req, res) => {
//   try {
//     const deleted = await Car.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Không tìm thấy xe' });

//     res.json({ message: 'Xóa xe thành công' });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi xóa xe', error });
//   }
// };

// // Hàm helper tính toán giá trị phụ và format dữ liệu trả về
// function populateWithCalculations(car) {
//   let totalAmount = 0;

//   const repairContents = car.repairContents.map(content => {
//     const products = content.products.map(item => {
//       if (!item.product) return item;

//       const price = item.product.price || 0;
//       const tax = item.product.tax || 0;
//       const quantity = item.quantity || 0;

//       const priceAfterTax = price * (1 + tax / 100);
//       const totalPrice = priceAfterTax * quantity;
//       totalAmount += totalPrice;

//       return {
//         _id: item._id,
//         quantity,
//         product: {
//           _id: item.product._id,
//           code: item.product.code,
//           brand: item.product.brand,
//           price,
//           tax,
//           priceAfterTax,
//           unit: item.product.unit ? item.product.unit.name : null,
//         },
//         totalPrice,
//       };
//     });

//     return {
//       _id: content._id,
//       name: content.repairContent?.name || null,
//       repairContent: content.repairContent?._id || null,
//       products,
//     };
//   });

//   return {
//     _id: car._id,
//     plateNumber: car.plateNumber,
//     carType: car.carType,
//     repairContents,
//     statuses: car.statuses,   // Trạng thái hiện trạng (mảng)
//     solutions: car.solutions, // Biện pháp (mảng)
//     totalAmount,
//     createdAt: car.createdAt,
//     updatedAt: car.updatedAt,
//   };
// }
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Car = require('../models/Car'); // Thay bằng đường dẫn đúng đến model Car của bạn

function formatVND(number) {
  return (number ?? 0).toLocaleString('vi-VN');
}

function drawProductsTable(doc, products, startX, startY, rowHeight = 24, content) {
  if (!products || products.length === 0) return startY;

  const columns = [
    { header: 'STT', width: 30 },
    { header: 'Mã SP - Thương hiệu', width: 120 },
    { header: 'SL', width: 30 },
    { header: 'ĐVT', width: 35 },
    { header: 'Giá', width: 60 },
    { header: 'Thuế', width: 40 },
    { header: 'Sau thuế', width: 60 },
    { header: 'Tình trạng', width: 90 },
    { header: 'Biện pháp', width: 90 },
    { header: 'Thành tiền', width: 70 },
  ];

  const tableWidth = columns.reduce((sum, c) => sum + c.width, 0);

  // Vẽ header nền xám
  doc.rect(startX, startY, tableWidth, rowHeight).fill('#f0f0f0');
  doc.fillColor('black').font('DejaVu').fontSize(10);
  let x = startX;
  columns.forEach(col => {
    doc.text(col.header, x + 3, startY + 6, { width: col.width - 6, align: 'center' });
    x += col.width;
  });

  // Đường kẻ dọc header
  x = startX;
  for (let i = 0; i <= columns.length; i++) {
    doc.moveTo(x, startY).lineTo(x, startY + rowHeight + products.length * rowHeight).stroke();
    if (i < columns.length) x += columns[i].width;
  }

  // Đường kẻ ngang header
  doc.moveTo(startX, startY + rowHeight).lineTo(startX + tableWidth, startY + rowHeight).stroke();

  let y = startY + rowHeight;

  // Vẽ từng dòng sản phẩm
  products.forEach((prod, idx) => {
    const p = prod.product || {};
    const code = p.code || '---';
    const brand = p.brand || '---';
    const quantity = prod.quantity ?? 0;
    const unit = typeof p.unit === 'string' ? p.unit : (p.unit?.name || '---');
    const price = p.price ?? 0;
    const tax = p.tax ?? 0;
    const priceAfterTax = p.priceAfterTax ?? (price + (price * tax) / 100);
    const totalPrice = prod.totalPrice ?? priceAfterTax * quantity;

    // Tình trạng, biện pháp riêng cho sản phẩm này
    const statuses = (prod.statuses || []).map(s => s.name).join(', ') || '---';
    const solutions = (prod.solutions || []).map(s => s.name).join(', ') || '---';

    x = startX;
    const values = [
      idx + 1,
      `${code} - ${brand}`,
      quantity,
      unit,
      formatVND(price),
      `${tax}%`,
      formatVND(priceAfterTax),
      statuses,
      solutions,
      formatVND(totalPrice),
    ];

    for (let i = 0; i < columns.length; i++) {
      doc.text(values[i], x + 3, y + 6, {
        width: columns[i].width - 6,
        align: i === 1 ? 'left' : (i === 4 || i === 6 || i === 9 ? 'right' : 'center'),
      });
      x += columns[i].width;
    }

    // Đường kẻ ngang dưới mỗi dòng
    doc.moveTo(startX, y + rowHeight).lineTo(startX + tableWidth, y + rowHeight).stroke();

    y += rowHeight;
  });

  // Đường kẻ dọc bên phải cuối bảng
  doc.moveTo(startX + tableWidth, startY).lineTo(startX + tableWidth, y).stroke();

  return y;
}

exports.exportCarsToPDF = async (req, res) => {
  try {
    const cars = await Car.find()
      .populate('carType', 'name')
      .populate({
        path: 'repairContents.repairContent',
        select: 'name'
      })
      .populate({
        path: 'repairContents.products.product',
        select: 'code brand price tax priceAfterTax unit',
        populate: {
          path: 'unit',
          select: 'name'
        }
      })
      .populate({
        path: 'repairContents.products.statuses',
        select: 'name'
      })
      .populate({
        path: 'repairContents.products.solutions',
        select: 'name'
      })
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    const exportDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const fontPath = path.join(__dirname, '../fonts/DejaVuSans.ttf');
    if (!fs.existsSync(fontPath)) {
      return res.status(500).json({
        message: 'Không tìm thấy font tiếng Việt. Vui lòng thêm DejaVuSans.ttf vào thư mục fonts.',
      });
    }
    doc.registerFont('DejaVu', fontPath);
    doc.font('DejaVu');

    const filePath = path.join(exportDir, 'cars.pdf');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(16).text('DANH SÁCH XE SỬA CHỮA', { align: 'center' });
    doc.moveDown(1);

    for (let index = 0; index < cars.length; index++) {
      const car = cars[index];

      if (doc.y > 600) doc.addPage();

      doc.fontSize(12).text(`${index + 1}. Biển số: ${car.plateNumber}`);
      doc.fontSize(10)
        .text(`Loại xe: ${car.carType?.name || '---'}`)
        .text(`Ngày tạo: ${car.createdAt ? new Date(car.createdAt).toLocaleString('vi-VN') : '---'}`);

      doc.moveDown(0.3);
      doc.fontSize(10).text('Chi tiết sửa chữa:');

      for (const content of (car.repairContents || [])) {
        if (doc.y > 600) doc.addPage();

        doc.moveDown(0.3);
        // Hiển thị tên repairContent (ví dụ: "Thay nhớt", "Thay thắng")
        doc.fontSize(10).text(`- ${content.repairContent?.name || content.name || '---'}`, { indent: 10 });
        doc.moveDown(0.1);

        if (!content.products || content.products.length === 0) {
          doc.fontSize(9).text('(Không có sản phẩm)', { indent: 20 });
          doc.moveDown(0.3);
          continue;
        }

        const yStart = doc.y + 3;
        const tableEndY = drawProductsTable(doc, content.products, 50, yStart, 18, content);
        doc.y = tableEndY + 8;
      }

      doc.fontSize(10).text(`Tổng tiền: ${formatVND(car.totalAmount)} VNĐ`, { align: 'right' });
      doc.moveDown(1);
    }

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, 'cars.pdf');
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi xuất file PDF.' });
  }
};




exports.createCar = async (req, res) => {
  try {
    const { plateNumber, carType, repairContents } = req.body;

    if (!plateNumber || !carType) {
      return res.status(400).json({ message: 'Biển số và loại xe là bắt buộc.' });
    }

    const existing = await Car.findOne({ plateNumber });
    if (existing) {
      return res.status(409).json({ message: 'Biển số xe đã tồn tại.' });
    }

    const newCar = new Car({ plateNumber, carType, repairContents });
    const saved = await newCar.save();

    const populated = await Car.findById(saved._id)
      .populate('carType', 'name')
      .populate({ path: 'repairContents.repairContent', select: 'name' })
      .populate({
        path: 'repairContents.products.product',
        select: 'code brand origin specs price tax unit',
        populate: { path: 'unit', select: 'name' }
      })
      .populate('repairContents.products.statuses', 'name')
      .populate('repairContents.products.solutions', 'name');

    res.status(201).json(populateWithCalculations(populated));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm xe mới', error: error.message });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
      .populate('carType', 'name')
      .populate({ path: 'repairContents.repairContent', select: 'name' })
      .populate({
        path: 'repairContents.products.product',
        select: 'code brand origin specs price tax unit',
        populate: { path: 'unit', select: 'name' }
      })
      .populate('repairContents.products.statuses', 'name')
      .populate('repairContents.products.solutions', 'name')
      .sort({ createdAt: -1 });

    const carsWithTotal = cars.map(populateWithCalculations);
    res.json(carsWithTotal);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách xe', error });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('carType', 'name')
      .populate({ path: 'repairContents.repairContent', select: 'name' })
      .populate({
        path: 'repairContents.products.product',
        select: 'code brand origin specs price tax unit',
        populate: { path: 'unit', select: 'name' }
      })
      .populate('repairContents.products.statuses', 'name')
      .populate('repairContents.products.solutions', 'name');

    if (!car) return res.status(404).json({ message: 'Không tìm thấy xe' });

    res.json(populateWithCalculations(car));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết xe', error });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { plateNumber, carType, repairContents } = req.body;

    const existing = await Car.findOne({ plateNumber, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(409).json({ message: 'Biển số xe đã tồn tại ở xe khác.' });
    }

    const updated = await Car.findByIdAndUpdate(
      req.params.id,
      { plateNumber, carType, repairContents },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Không tìm thấy xe' });

    const populated = await Car.findById(updated._id)
      .populate('carType', 'name')
      .populate({ path: 'repairContents.repairContent', select: 'name' })
      .populate({
        path: 'repairContents.products.product',
        select: 'code brand origin specs price tax unit',
        populate: { path: 'unit', select: 'name' }
      })
      .populate('repairContents.products.statuses', 'name')
      .populate('repairContents.products.solutions', 'name');

    res.json(populateWithCalculations(populated));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật xe', error });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const deleted = await Car.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy xe' });

    res.json({ message: 'Xóa xe thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa xe', error });
  }
};

// 🔧 Hàm xử lý dữ liệu sau populate
// function populateWithCalculations(car) {
//   let totalAmount = 0;

//   const repairContents = car.repairContents.map(content => {
//     const products = content.products.map(item => {
//       if (!item.product) return item;

//       const p = item.product;
//       const price = p.price || 0;
//       const tax = p.tax || 0;
//       const quantity = item.quantity || 0;

//       const priceAfterTax = price * (1 + tax / 100);
//       const totalPrice = priceAfterTax * quantity;
//       totalAmount += totalPrice;

//       return {
//         _id: item._id,
//         quantity,
//         product: {
//           _id: p._id,
//           code: p.code,
//           brand: p.brand,
//           origin: p.origin,
//           specs: Array.isArray(p.specs) ? p.specs : [],
//           originFull: p.brand && p.origin ? `${p.brand}/${p.origin}` : p.brand || p.origin || null,
//           price,
//           tax,
//           priceAfterTax,
//           unit: p.unit?.name || null,
//         },
//         totalPrice,
//         statuses: item.statuses || [],
//         solutions: item.solutions || []
//       };
//     });

//     return {
//       _id: content._id,
//       name: content.repairContent?.name || null,
//       repairContent: content.repairContent?._id || null,
//       products
//     };
//   });

//   return {
//     _id: car._id,
//     plateNumber: car.plateNumber,
//     carType: car.carType,
//     repairContents,
//     totalAmount,
//     createdAt: car.createdAt,
//     updatedAt: car.updatedAt,
//   };
// }
function populateWithCalculations(car) {
  let totalAmount = 0;

  const repairContents = car.repairContents.map(content => {
    const name = content.repairContent?.name || null;

    // Trường hợp là "Công"
    if (name === "Công") {
      const servicePrice = content.servicePrice || 0;
      const tax = 8; // Thuế mặc định cho công
      const servicePriceAfterTax = servicePrice * (1 + tax / 100);
      totalAmount += servicePriceAfterTax;

      return {
        _id: content._id,
        name,
        repairContent: content.repairContent?._id || null,
        servicePrice,
        servicePriceAfterTax,
        tax,
        products: []
      };
    }

    // Trường hợp bình thường (có sản phẩm)
    const products = content.products.map(item => {
      if (!item.product) return item;

      const p = item.product;
      const price = p.price || 0;
      const tax = p.tax || 0;
      const quantity = item.quantity || 0;

      const priceAfterTax = price * (1 + tax / 100);
      const totalPrice = priceAfterTax * quantity;
      totalAmount += totalPrice;

      return {
        _id: item._id,
        quantity,
        product: {
          _id: p._id,
          code: p.code,
          brand: p.brand,
          origin: p.origin,
          specs: Array.isArray(p.specs) ? p.specs : [],
          originFull: p.brand && p.origin ? `${p.brand}/${p.origin}` : p.brand || p.origin || null,
          price,
          tax,
          priceAfterTax,
          unit: p.unit?.name || null,
        },
        totalPrice,
        statuses: item.statuses || [],
        solutions: item.solutions || []
      };
    });

    return {
      _id: content._id,
      name,
      repairContent: content.repairContent?._id || null,
      products
    };
  });

  return {
    _id: car._id,
    plateNumber: car.plateNumber,
    carType: car.carType,
    repairContents,
    totalAmount,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
  };
}

