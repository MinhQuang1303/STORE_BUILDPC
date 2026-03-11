const maGiamGiaService = require("../services/maGiamGiaService");

// Lấy tất cả mã giảm giá
exports.layTatCa = async (req, res) => {
  try {
    const danhSachs = await maGiamGiaService.layTatCaMaGiamGia();
    res.json(danhSachs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết một mã giảm giá
exports.layChiTiet = async (req, res) => {
  try {
    const { id } = req.params;
    const maGiamGia = await maGiamGiaService.layChiTietMaGiamGia(id);
    if (!maGiamGia) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
    res.json(maGiamGia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kiểm tra mã giảm giá hợp lệ
exports.kiemTraMa = async (req, res) => {
  try {
    const { ma } = req.params;
    const maGiamGia = await maGiamGiaService.kiemTraMaGiamGia(ma);
    res.json(maGiamGia);
  } catch (error) {
    const status = error.message.includes("không tồn tại") ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
};

// Tạo mã giảm giá mới
exports.taoMoi = async (req, res) => {
  try {
    const maMoi = await maGiamGiaService.taoMoiMaGiamGia(req.body);
    res.status(201).json(maMoi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật mã giảm giá
exports.capNhat = async (req, res) => {
  try {
    const { id } = req.params;
    const capNhat = await maGiamGiaService.capNhatMaGiamGia(id, req.body);
    if (!capNhat) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
    res.json(capNhat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa mã giảm giá
exports.xoa = async (req, res) => {
  try {
    const { id } = req.params;
    const daXoa = await maGiamGiaService.xoaMaGiamGia(id);
    if (!daXoa) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
    res.json({ message: "Đã xóa mã giảm giá thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
