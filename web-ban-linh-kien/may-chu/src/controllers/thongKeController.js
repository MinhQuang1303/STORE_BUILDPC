const Order = require("../models/Order");
const SanPham = require("../models/SanPham");
const User = require("../models/User");

// @desc    Lấy tổng quan số liệu thống kê
// @route   GET /api/thong-ke/overview
exports.getOverview = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await SanPham.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });

    // Tính tổng doanh thu từ các đơn hàng đã giao (Delivered)
    const orders = await Order.find({ trangThai: "Delivered" });
    const totalRevenue = orders.reduce((sum, order) => sum + order.tongTien, 0);

    res.status(200).json({
      success: true,
      data: {
        revenue: totalRevenue,
        orders: totalOrders,
        products: totalProducts,
        users: totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lấy dữ liệu doanh thu theo tháng (12 tháng gần nhất)
// @route   GET /api/thong-ke/doanh-thu
exports.getDoanhThuChart = async (req, res) => {
  try {
    const endDay = new Date();
    const startDay = new Date();
    startDay.setMonth(startDay.getMonth() - 11); // 12 tháng bao gồm tháng hiện tại
    startDay.setDate(1);
    startDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      trangThai: "Delivered",
      createdAt: { $gte: startDay, $lte: endDay },
    });

    // Khởi tạo mảng 12 tháng
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDay);
      date.setMonth(startDay.getMonth() + i);
      const monthLabel = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyData.push({ month: monthLabel, revenue: 0 });
    }

    // Điền dữ liệu vào mảng
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthLabel = `${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
      const dataIndex = monthlyData.findIndex(
        (item) => item.month === monthLabel,
      );
      if (dataIndex !== -1) {
        monthlyData[dataIndex].revenue += order.tongTien;
      }
    });

    res.status(200).json({ success: true, data: monthlyData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Thống kê đơn hàng theo trạng thái
// @route   GET /api/thong-ke/trang-thai-don-hang
exports.getTrangThaiDonHangChart = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$trangThai",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lấy 5 đơn hàng mới nhất
// @route   GET /api/thong-ke/recent
exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("idUser", "username email");

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
