const express = require('express');
const router = express.Router();
const { layDanhSachSanPham, taoDuLieuMau } = require('../bo-dieu-khien/sanPhamController.js');

router.get('/', layDanhSachSanPham); // Gọi: GET /api/san-pham
router.post('/tao-mau', taoDuLieuMau); // Gọi: POST /api/san-pham/tao-mau

module.exports = router;