const BienThe = require("../mo-hinh/BienThe");

// Lấy danh sách tất cả biến thể
exports.layDanhSachBienThe = async (req, res) => {
  try {
    const { idSanPham } = req.query;
    const filter = idSanPham ? { idSanPham: idSanPham } : {};
    const danhSach = await BienThe.find(filter).populate("idSanPham");
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết một biến thể
exports.layChiTietBienThe = async (req, res) => {
  try {
    const bienThe = await BienThe.findById(req.params.id).populate("idSanPham");
    if (!bienThe)
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    res.json(bienThe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo biến thể mới
exports.taoMoi = async (req, res) => {
  try {
    const { ten, gia, idSanPham } = req.body;
    const bienTheMoi = new BienThe({ ten, gia, idSanPham });
    await bienTheMoi.save();
    res.status(201).json(bienTheMoi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật biến thể
exports.capNhat = async (req, res) => {
  try {
    const bienThe = await BienThe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bienThe)
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    res.json(bienThe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa biến thể
exports.xoa = async (req, res) => {
  try {
    const bienThe = await BienThe.findByIdAndDelete(req.params.id);
    if (!bienThe)
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    res.json({ message: "Đã xóa biến thể thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
