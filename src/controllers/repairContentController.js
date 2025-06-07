const RepairContent = require('../models/RepairContent');

// Tạo mới nội dung sửa chữa
exports.createRepairContent = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Tên nội dung sửa chữa là bắt buộc.' });
    }

    const trimmedName = name.trim();

    // Kiểm tra nội dung sửa chữa đã tồn tại chưa (không phân biệt hoa thường)
    const existing = await RepairContent.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });

    if (existing) {
      // Cập nhật tên (chỉ để đồng bộ nếu viết khác)
      existing.name = trimmedName;
      const updated = await existing.save();
      return res.status(200).json({ message: 'Cập nhật nội dung sửa chữa thành công.', content: updated });
    }

    // Nếu chưa tồn tại thì tạo mới
    const newContent = new RepairContent({ name: trimmedName });
    const saved = await newContent.save();

    res.status(201).json({ message: 'Tạo nội dung sửa chữa thành công.', content: saved });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo/cập nhật nội dung sửa chữa', error: error.message });
  }
};


// Lấy danh sách nội dung sửa chữa
exports.getAllRepairContents = async (req, res) => {
  try {
    const contents = await RepairContent.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nội dung sửa chữa', error });
  }
};

// Cập nhật nội dung sửa chữa
exports.updateRepairContent = async (req, res) => {
  try {
    const { name } = req.body;

    const updated = await RepairContent.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Không tìm thấy nội dung sửa chữa' });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật nội dung sửa chữa', error });
  }
};

// Xóa nội dung sửa chữa
exports.deleteRepairContent = async (req, res) => {
  try {
    const deleted = await RepairContent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy nội dung sửa chữa' });

    res.json({ message: 'Xóa nội dung sửa chữa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa nội dung sửa chữa', error });
  }
};
