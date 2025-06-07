const Product = require('../models/Product');

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    let { code, brand, origin, specs, unit, price, tax } = req.body;

    if (!code || !unit || price == null) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mã hàng, đơn vị tính và giá.' });
    }

    // Nếu specs là chuỗi thì tách thành mảng
    const specsArray = typeof specs === 'string'
      ? specs.split(',').map(s => s.trim())
      : Array.isArray(specs)
        ? specs
        : [];

    // Kiểm tra mã hàng đã tồn tại chưa
    const existing = await Product.findOne({ code });
    
    if (existing) {
      // Cập nhật sản phẩm nếu đã tồn tại
      existing.brand = brand;
      existing.origin = origin;
      existing.specs = specsArray;
      existing.unit = unit;
      existing.price = price;
      existing.tax = tax;

      const updated = await existing.save();
      return res.status(200).json({ message: 'Cập nhật sản phẩm thành công.', product: updated });
    }

    // Nếu chưa tồn tại thì tạo mới
    const newProduct = new Product({
      code,
      brand,
      origin,
      specs: specsArray,
      unit,
      price,
      tax,
    });

    const saved = await newProduct.save();
    res.status(201).json({ message: 'Tạo sản phẩm mới thành công.', product: saved });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo/cập nhật sản phẩm', error: error.message });
  }
};


// Lấy danh sách tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('unit', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
  }
};

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('unit', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    let { code, brand, origin, specs, unit, price, tax } = req.body;

    const existing = await Product.findOne({ code, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(409).json({ message: 'Mã hàng đã tồn tại cho sản phẩm khác.' });
    }

    const specsArray = typeof specs === 'string' ? specs.split(',').map(s => s.trim()) : Array.isArray(specs) ? specs : [];

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { code, brand, origin, specs: specsArray, unit, price, tax },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
  }
};
