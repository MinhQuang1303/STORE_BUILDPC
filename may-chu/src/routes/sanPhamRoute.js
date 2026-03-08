const express = require('express');
const router = express.Router();
const sanPhamController = require('../controllers/sanPhamController');

// Lấy danh sách sản phẩm
router.get('/', (req, res) => sanPhamController.getAll(req, res));

module.exports = router;