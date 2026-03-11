const express = require("express");
const router = express.Router();
const thongKeController = require("../controllers/thongKeController");

// Route láº¥y tá»•ng quan
router.get("/overview", thongKeController.getOverview);

// Route láº¥y doanh thu 12 thÃ¡ng gáº§n nháº¥t
router.get("/doanh-thu", thongKeController.getDoanhThuChart);

// Route láº¥y thá»‘ng kÃª tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
router.get("/trang-thai-don-hang", thongKeController.getTrangThaiDonHangChart);

// Route láº¥y 5 Ä‘Æ¡n hÃ ng gáº§n Ä‘Ã¢y
router.get("/recent", thongKeController.getRecentOrders);

module.exports = router;
