const Unit = require('../models/Unit');

exports.createUnit = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Tên đơn vị là bắt buộc.' });
    }

    const trimmedName = name.trim();

    // Kiểm tra tên đơn vị đã tồn tại (không phân biệt hoa thường)
    const existing = await Unit.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });

    if (existing) {
      // Cập nhật lại tên nếu cần
      existing.name = trimmedName;
      const updated = await existing.save();
      return res.status(200).json({ message: 'Cập nhật đơn vị thành công.', unit: updated });
    }

    // Nếu chưa tồn tại thì tạo mới
    const newUnit = new Unit({ name: trimmedName });
    const savedUnit = await newUnit.save();

    res.status(201).json({ message: 'Tạo đơn vị thành công.', unit: savedUnit });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo/cập nhật đơn vị', error: error.message });
  }
};


exports.getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find().sort({ createdAt: -1 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn vị', error });
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Unit.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });

    if (!updated) return res.status(404).json({ message: 'Không tìm thấy đơn vị' });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật đơn vị', error });
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const deleted = await Unit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy đơn vị' });

    res.json({ message: 'Xóa đơn vị thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa đơn vị', error });
  }
};
