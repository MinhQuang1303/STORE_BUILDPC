const Order = require("../models/Order");
const SanPham = require("../models/SanPham");
const User = require("../models/User");

// @desc    Láº¥y tá»•ng quan sá»‘ liá»‡u thá»‘ng kÃª
// @route   GET /api/thong-ke/overview
exports.getOverview = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await SanPham.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });

    // TÃ­nh tá»•ng doanh thu tá»« cÃ¡c Ä‘Æ¡n hÃ ng Ä‘Ã£ giao (Delivered)
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

// @desc    Láº¥y dá»¯ liá»‡u doanh thu theo thÃ¡ng (12 thÃ¡ng gáº§n nháº¥t)
// @route   GET /api/thong-ke/doanh-thu
exports.getDoanhThuChart = async (req, res) => {
  try {
    const endDay = new Date();
    const startDay = new Date();
    startDay.setMonth(startDay.getMonth() - 11); // 12 thÃ¡ng bao gá»“m thÃ¡ng hiá»‡n táº¡i
    startDay.setDate(1);
    startDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      trangThai: "Delivered",
      createdAt: { $gte: startDay, $lte: endDay },
    });

    // Khá»Ÿi táº¡o máº£ng 12 thÃ¡ng
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDay);
      date.setMonth(startDay.getMonth() + i);
      const monthLabel = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyData.push({ month: monthLabel, revenue: 0 });
    }

    // Äiá»n dá»¯ liá»‡u vÃ o máº£ng
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

// @desc    Thá»‘ng kÃª Ä‘Æ¡n hÃ ng theo tráº¡ng thÃ¡i
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

// @desc    Láº¥y 5 Ä‘Æ¡n hÃ ng má»›i nháº¥t
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
