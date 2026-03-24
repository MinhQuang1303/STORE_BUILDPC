const orderService = require("../services/orderService");

// User tạo đơn thanh toán
exports.taoDonThanhToan = async (req, res) => {
  try {
    const idUser = req.user?.id;
    const data = await orderService.taoDonThanhToan({
      ...req.body,
      idUser,
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy danh sách tất cả đơn hàng
exports.layDanhSachOrder = async (req, res) => {
  try {
    const danhSach = await orderService.layDanhSachOrder();
    res.json(danhSach);
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

    res.json(orderCapNhat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
