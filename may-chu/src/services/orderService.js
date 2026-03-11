const Order = require("../models/Order");

const layDanhSachOrder = async () => {
  return await Order.find()
    .populate("idUser")
    .populate({
      path: "orderItems",
      populate: { path: "idSanPham" },
    });
};

const capNhatTrangThaiOrder = async (id, trangThai) => {
  return await Order.findByIdAndUpdate(id, { trangThai }, { new: true })
    .populate("idUser")
    .populate({
      path: "orderItems",
      populate: { path: "idSanPham" },
    });
};

module.exports = {
  layDanhSachOrder,
  capNhatTrangThaiOrder,
};
