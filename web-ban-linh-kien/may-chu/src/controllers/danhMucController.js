const danhMucService = require("../services/danhMucService");

// Lấy tất cả danh mục
exports.layTatCa = async (req, res) => {
  try {
    const danhSachs = await danhMucService.layTatCaDanhMuc();
    res.json(danhSachs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo danh mục mới
exports.taoMoi = async (req, res) => {
  try {
    const danhMucMoi = await danhMucService.taoMoiDanhMuc(req.body);
    res.status(201).json(danhMucMoi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật danh mục
exports.capNhat = async (req, res) => {
  try {
    const { id } = req.params;
    const danhMucCapNhat = await danhMucService.capNhatDanhMuc(id, req.body);
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
    const danhMucDaXoa = await danhMucService.xoaDanhMuc(id);
    if (!danhMucDaXoa) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json({ message: "Đã xoá danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
