const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require("../controllers/authController");

// --- 1. CÁC ROUTE XÁC THỰC THÔNG THƯỜNG ---
router.post("/dang-ky", authController.dangKy);
router.post("/dang-nhap", authController.dangNhap);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// --- 2. CÁC ROUTE ĐĂNG NHẬP GOOGLE ---

// Kích hoạt chọn tài khoản Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Xử lý sau khi Google trả dữ liệu về (CHỈ ĐỂ MỘT HÀM DUY NHẤT)
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/dang-nhap', session: false }),
  (req, res) => {
    // Tạo Token JWT
    const token = jwt.sign(
        { id: req.user._id, role: req.user.role }, 
        process.env.JWT_SECRET || 'secret_key', 
        { expiresIn: '1d' }
    );

    // Xử lý thông tin gửi về React (Mặc định KhachHang nếu không có tên)
    const userString = JSON.stringify({
        id: req.user._id,
        username: req.user.username || req.user.ten || "KhachHang", 
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar
    });

    // Redirect về trang trung gian ở Frontend
    res.redirect(`http://localhost:3000/auth-success?token=${token}&user=${encodeURIComponent(userString)}`);
  }
);

module.exports = router; 