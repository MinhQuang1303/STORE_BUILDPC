const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route đăng ký người dùng mới
router.post("/dang-ky", userController.dangKy);

// Route lấy danh sách tất cả người dùng
router.get("/", userController.layTatCa);

module.exports = router;
