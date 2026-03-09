// may-chu/src/routes/sanPhamRoute.js
const express = require('express');
const router = express.Router();
const sanPhamController = require('../controllers/sanPhamController');
const { kiemTraAdmin } = require('../middlewares/authMiddleware');

// Ai cũng có thể xem danh sách sản phẩm (Không cần middleware)
router.get('/', sanPhamController.layDanhSachSanPham);
router.get('/:id', sanPhamController.layChiTietSanPham);

// CHỈ ADMIN mới có quyền Thêm, Sửa, Xóa sản phẩm
router.post('/', kiemTraAdmin, sanPhamController.themSanPham);
router.put('/:id', kiemTraAdmin, sanPhamController.capNhatSanPham);
router.delete('/:id', kiemTraAdmin, sanPhamController.xoaSanPham);

module.exports = router;