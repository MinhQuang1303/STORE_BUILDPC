const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { xacThucNguoiDung, kiemTraAdmin } = require("../middlewares/authMiddleware");

// Route user tạo đơn thanh toán
router.post("/thanh-toan", xacThucNguoiDung, orderController.taoDonThanhToan);
router.get("/cua-toi", xacThucNguoiDung, orderController.layOrderCuaToi);

// Route lấy danh sách tất cả đơn hàng
router.get("/", kiemTraAdmin, orderController.layDanhSachOrder);

// Route admin xem đơn theo user
router.get("/nguoi-dung/:userId", kiemTraAdmin, orderController.layOrderTheoNguoiDung);

// Route cập nhật trạng thái đơn hàng
router.put("/:id/trang-thai", kiemTraAdmin, orderController.capNhatTrangThai);

module.exports = router;
