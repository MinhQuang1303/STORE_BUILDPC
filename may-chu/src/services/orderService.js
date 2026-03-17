const Order = require("../models/Order");
const SanPham = require("../models/SanPham");
const BienThe = require("../models/BienThe");
const OrderItem = require("../models/OrderItem");

const layDanhSachOrder = async () => {
  return await Order.find()
    .populate("idUser")
    .populate({
      path: "orderItems",
      populate: [{ path: "idSanPham" }, { path: "idBienThe" }],
    });
};

const capNhatTrangThaiOrder = async (id, trangThai) => {
  const order = await Order.findById(id).populate("orderItems");
  if (!order) return null;

  // Logic xử lý kho
  if (trangThai === "Confirmed" && !order.isStockUpdated) {
    // Trừ kho khi xác nhận đơn hàng
    for (const item of order.orderItems) {
      // Cập nhật Biến thể
      await BienThe.findByIdAndUpdate(item.idBienThe, {
        $inc: { soLuong: -item.soLuong, daBan: item.soLuong },
      });
      // Cập nhật Sản phẩm tổng
      await SanPham.findByIdAndUpdate(item.idSanPham, {
        $inc: { soLuong: -item.soLuong, daBan: item.soLuong },
      });
    }
    order.isStockUpdated = true;
  } else if (trangThai === "Cancelled" && order.isStockUpdated) {
    // Hoàn kho khi hủy đơn hàng đã từng được xác nhận
    for (const item of order.orderItems) {
      // Hoàn lại Biến thể
      await BienThe.findByIdAndUpdate(item.idBienThe, {
        $inc: { soLuong: item.soLuong, daBan: -item.soLuong },
      });
      // Hoàn lại Sản phẩm tổng
      await SanPham.findByIdAndUpdate(item.idSanPham, {
        $inc: { soLuong: item.soLuong, daBan: -item.soLuong },
      });
    }
    order.isStockUpdated = false;
  }

  order.trangThai = trangThai;
  await order.save();

  return await Order.findById(id)
    .populate("idUser")
    .populate({
      path: "orderItems",
      populate: [{ path: "idSanPham" }, { path: "idBienThe" }],
    });
};

module.exports = {
  layDanhSachOrder,
  capNhatTrangThaiOrder,
};
