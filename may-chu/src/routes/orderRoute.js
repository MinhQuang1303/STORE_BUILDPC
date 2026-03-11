const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Route láº¥y danh sÃ¡ch táº¥t cáº£ Ä‘Æ¡n hÃ ng
router.get("/", orderController.layDanhSachOrder);

// Route cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
router.put("/:id/trang-thai", orderController.capNhatTrangThai);

module.exports = router;
