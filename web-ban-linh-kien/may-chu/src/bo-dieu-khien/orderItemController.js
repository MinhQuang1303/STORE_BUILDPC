const OrderItem = require("../mo-hinh/OrderItem");

// Lấy danh sách tất cả các item trong đơn hàng
exports.layDanhSachOrderItem = async (req, res) => {
  try {
    const danhSach = await OrderItem.find()
      .populate("idOrder")
      .populate("idSanPham")
      .populate("idBienThe");
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
