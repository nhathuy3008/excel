const Status = require('../models/Status');

exports.createStatus = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Tên hiện trạng là bắt buộc.' });

    const existing = await Status.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Hiện trạng đã tồn tại.' });

    const status = new Status({ name });
    const saved = await status.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo hiện trạng', error: error.message });
  }
};

exports.getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find().sort({ createdAt: -1 });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách hiện trạng', error });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Status.findOne({ name, _id: { $ne: req.params.id } });
    if (existing) return res.status(409).json({ message: 'Hiện trạng đã tồn tại.' });

    const updated = await Status.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy hiện trạng' });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật hiện trạng', error });
  }
};

exports.deleteStatus = async (req, res) => {
  try {
    const deleted = await Status.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy hiện trạng' });

    res.json({ message: 'Xóa hiện trạng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa hiện trạng', error });
  }
};
