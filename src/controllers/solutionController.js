const Solution = require('../models/Solution');

exports.createSolution = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Tên biện pháp là bắt buộc.' });
    }

    const trimmedName = name.trim();

    // Tìm biện pháp đã tồn tại (không phân biệt hoa thường)
    const existing = await Solution.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });

    if (existing) {
      // Cập nhật lại tên nếu cần (ví dụ khác cách viết)
      existing.name = trimmedName;
      const updated = await existing.save();
      return res.status(200).json({ message: 'Cập nhật biện pháp thành công.', solution: updated });
    }

    // Nếu chưa tồn tại thì tạo mới
    const solution = new Solution({ name: trimmedName });
    const saved = await solution.save();
    res.status(201).json({ message: 'Tạo biện pháp thành công.', solution: saved });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo/cập nhật biện pháp', error: error.message });
  }
};


exports.getAllSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách biện pháp', error });
  }
};

exports.updateSolution = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Solution.findOne({ name, _id: { $ne: req.params.id } });
    if (existing) return res.status(409).json({ message: 'Biện pháp đã tồn tại.' });

    const updated = await Solution.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy biện pháp' });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật biện pháp', error });
  }
};

exports.deleteSolution = async (req, res) => {
  try {
    const deleted = await Solution.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy biện pháp' });

    res.json({ message: 'Xóa biện pháp thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa biện pháp', error });
  }
};
