const orderService = require("../services/orderService");
const Notification = require("../models/Notification");

// User tạo đơn thanh toán
exports.taoDonThanhToan = async (req, res) => {
  try {
    const idUser = req.user?.id;
    const data = await orderService.taoDonThanhToan({
      ...req.body,
      idUser,
    });

    // 1. Tạo thông báo cho Admin
    const notifAdmin = await Notification.create({
      type: 'order',
      title: `Khách ${data.idUser?.username || "mới"} chốt đơn!`,
      content: `Đơn hàng mới trị giá ${data.tongTien?.toLocaleString('vi-VN')} đ`,
      linkData: data._id,
      isAdminAuth: true
    });

    // 2. Tạo thông báo cho chính Khách hàng (Lưu vào chuông)
    const notifCustomer = await Notification.create({
      type: 'system',
      title: 'Đặt hàng thành công!',
      content: `Bạn đã đặt một đơn hàng mới trị giá ${data.tongTien?.toLocaleString('vi-VN')} đ`,
      linkData: data._id,
      userId: idUser,
      isAdminAuth: false
    });

    const io = req.app.get("io");
    if (io) {
      // Gửi cho Admin
      io.to("admin_room").emit("SOCKET_EVENT_ORDER", {
        message: "Đơn hàng mới nổ!",
        order: data,
        notification: notifAdmin
      });
      // Gửi cho Khách hàng
      io.to(idUser.toString()).emit("order_status_update", {
        message: "Bạn đã đặt hàng thành công!",
        order: data,
        notification: notifCustomer
      });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy danh sách tất cả đơn hàng
exports.layDanhSachOrder = async (req, res) => {
  try {
    const danhSach = await orderService.layDanhSachOrder();
    res.status(200).json(danhSach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin xem đơn theo user
exports.layOrderTheoNguoiDung = async (req, res) => {
  try {
    const { userId } = req.params;
    const danhSach = await orderService.layOrderTheoNguoiDung(userId);
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User xem danh sách đơn của chính mình
exports.layOrderCuaToi = async (req, res) => {
  try {
    const idUser = req.user?.id;
    const danhSach = await orderService.layOrderCuaToi(idUser);
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

    const orderCapNhat = await orderService.capNhatTrangThaiOrder(
      id,
      trangThai,
    );

    if (!orderCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Tạo thông báo cho Khách hàng khi trạng thái đổi
    const statusMap = {
      Pending: "Đang chờ xử lý",
      Confirmed: "Đã xác nhận",
      Shipping: "Đang giao hàng",
      Delivered: "Đã giao hàng thành công",
      Cancelled: "Đã hủy đơn"
    };

    const notifUser = await Notification.create({
      type: 'system',
      title: 'Cập nhật trạng thái đơn hàng!',
      content: `Đơn hàng #${id.substring(id.length - 8).toUpperCase()} đã chuyển sang trạng thái: ${statusMap[trangThai] || trangThai}`,
      linkData: id,
      userId: orderCapNhat.idUser?._id || orderCapNhat.idUser,
      isAdminAuth: false
    });

    const io = req.app.get("io");
    if (io) {
      io.to(orderCapNhat.idUser?._id.toString()).emit("order_status_update", {
        message: `Đơn hàng của bạn đã chuyển sang trạng thái: ${statusMap[trangThai] || trangThai}`,
        order: orderCapNhat,
        notification: notifUser
      });
    }

    res.json(orderCapNhat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
