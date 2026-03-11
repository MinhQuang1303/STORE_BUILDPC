// may-chu/src/routes/authRoute.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Dòng 6: Đảm bảo authController.dangKy không bị undefined
router.post('/dang-ky', authController.dangKy); 

router.post('/dang-nhap', authController.dangNhap);

module.exports = router;