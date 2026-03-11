const Order = require("../mo-hinh/Order");

// Lấy danh sách tất cả đơn hàng
exports.layDanhSachOrder = async (req, res) => {
  try {
    const danhSach = await Order.find()
      .populate("idUser")
      .populate({
        path: "orderItems",
        populate: { path: "idSanPham" },
      });
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.capNhatTrangThai = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;

    const orderCapNhat = await Order.findByIdAndUpdate(
      id,
      { trangThai },
      { new: true },
    )
      .populate("idUser")
      .populate({
        path: "orderItems",
        populate: { path: "idSanPham" },
      });

    if (!orderCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json(orderCapNhat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
