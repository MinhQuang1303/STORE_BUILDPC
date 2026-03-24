const Order = require("../models/Order");
const SanPham = require("../models/SanPham");
const BienThe = require("../models/BienThe");
const OrderItem = require("../models/OrderItem");

const populateOrder = [
  { path: "idUser", select: "username email role" },
  {
    path: "orderItems",
    populate: [{ path: "idSanPham" }, { path: "idBienThe" }],
  },
];

const taoDonThanhToan = async (payload) => {
  const {
    idUser,
    diaChi,
    soDienThoai,
    ghiChu,
    phuongThucThanhToan = "COD",
    items = [],
  } = payload;

  if (!idUser) {
    throw new Error("Không tìm thấy người dùng đăng nhập.");
  }
  if (!diaChi || !soDienThoai) {
    throw new Error("Vui lòng nhập đầy đủ địa chỉ và số điện thoại.");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Đơn hàng phải có ít nhất một sản phẩm.");
  }

  const orderItemsPayload = [];
  let tongTien = 0;

  for (const item of items) {
    const idSanPham = item.idSanPham || item._id;
    const idBienThe = item.idBienThe || item.bienTheId;
    const soLuong = Number(item.soLuong || item.qty || 0);

    if (!idSanPham || soLuong <= 0) {
      throw new Error("Dữ liệu sản phẩm không hợp lệ.");
    }

    const sanPham = await SanPham.findById(idSanPham);
    if (!sanPham) {
      throw new Error("Có sản phẩm không còn tồn tại.");
    }

    let giaThucTe = sanPham.gia;
    if (idBienThe) {
      const bienThe = await BienThe.findById(idBienThe);
      if (!bienThe) {
        throw new Error("Biến thể sản phẩm không hợp lệ.");
      }
      giaThucTe = bienThe.gia;
    }

    tongTien += giaThucTe * soLuong;
    orderItemsPayload.push({
      idSanPham,
      idBienThe: idBienThe || null,
      soLuong,
      gia: giaThucTe,
    });
  }

  const order = await Order.create({
    idUser,
    tongTien,
    diaChi,
    soDienThoai,
    ghiChu,
    phuongThucThanhToan,
    trangThaiThanhToan: phuongThucThanhToan === "BANKING" ? "Pending" : "Pending",
  });

  await Promise.all(
    orderItemsPayload.map((item) =>
      OrderItem.create({
        idOrder: order._id,
        idSanPham: item.idSanPham,
        idBienThe: item.idBienThe,
        soLuong: item.soLuong,
        gia: item.gia,
      }),
    ),
  );

  return await Order.findById(order._id).populate(populateOrder);
};

const layDanhSachOrder = async () => {
  return await Order.find().sort({ createdAt: -1 }).populate(populateOrder);
};

const layOrderTheoNguoiDung = async (idUser) => {
  return await Order.find({ idUser })
    .sort({ createdAt: -1 })
    .populate(populateOrder);
};

const layOrderCuaToi = async (idUser) => {
  return await Order.find({ idUser })
    .sort({ createdAt: -1 })
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

  return await Order.findById(id).populate(populateOrder);
};

module.exports = {
  taoDonThanhToan,
  layDanhSachOrder,
  layOrderTheoNguoiDung,
  layOrderCuaToi,
  capNhatTrangThaiOrder,
};
