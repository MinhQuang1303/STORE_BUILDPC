const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// đăng ký người dùng mới
router.post("/dang-ky", userController.dangKy);

// Lấy danh sách tất cả người dùng
router.get("/", userController.layTatCa);

module.exports = router;
