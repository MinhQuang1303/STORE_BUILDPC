const express = require("express");
const router = express.Router();
const thongKeController = require("../bo-dieu-khien/thongKeController");

// Route lấy tổng quan
router.get("/overview", thongKeController.getOverview);

// Route lấy doanh thu 12 tháng gần nhất
router.get("/doanh-thu", thongKeController.getDoanhThuChart);

// Route lấy thống kê trạng thái đơn hàng
router.get("/trang-thai-don-hang", thongKeController.getTrangThaiDonHangChart);

// Route lấy 5 đơn hàng gần đây
router.get("/recent", thongKeController.getRecentOrders);

module.exports = router;
