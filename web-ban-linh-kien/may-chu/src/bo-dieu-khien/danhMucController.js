const DanhMuc = require("../mo-hinh/DanhMuc");

// Lấy tất cả danh mục
exports.layTatCa = async (req, res) => {
  try {
    const danhSachs = await DanhMuc.find();
    res.json(danhSachs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo danh mục mới
exports.taoMoi = async (req, res) => {
  try {
    const { ten, moTa } = req.body;
    const danhMucMoi = new DanhMuc({ ten, moTa });
    await danhMucMoi.save();
    res.status(201).json(danhMucMoi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật danh mục
exports.capNhat = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, moTa } = req.body;
    const danhMucCapNhat = await DanhMuc.findByIdAndUpdate(
      id,
      { ten, moTa },
      { new: true },
    );
    if (!danhMucCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json(danhMucCapNhat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xoá danh mục
exports.xoa = async (req, res) => {
  try {
    const { id } = req.params;
    const danhMucDaXoa = await DanhMuc.findByIdAndDelete(id);
    if (!danhMucDaXoa) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json({ message: "Đã xoá danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
