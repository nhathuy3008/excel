const Solution = require('../models/Solution');

exports.createSolution = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Tên biện pháp là bắt buộc.' });

    const existing = await Solution.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Biện pháp đã tồn tại.' });

    const solution = new Solution({ name });
    const saved = await solution.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo biện pháp', error: error.message });
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
