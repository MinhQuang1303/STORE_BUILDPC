const express = require("express");
const router = express.Router();
const orderItemController = require("../bo-dieu-khien/orderItemController");

// Route lấy danh sách tất cả order items
router.get("/", orderItemController.layDanhSachOrderItem);

module.exports = router;
