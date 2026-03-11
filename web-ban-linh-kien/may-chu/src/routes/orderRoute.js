const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Route lấy danh sách tất cả đơn hàng
router.get("/", orderController.layDanhSachOrder);

// Route cập nhật trạng thái đơn hàng
router.put("/:id/trang-thai", orderController.capNhatTrangThai);

module.exports = router;
