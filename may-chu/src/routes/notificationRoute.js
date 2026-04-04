const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Lấy danh sách 
router.get('/admin', notificationController.layThongBaoAdmin);
// Lấy danh sách thông báo cho User
router.get('/customer/:userId', notificationController.layThongBaoCustomer);
// Đánh dấu đã đọc
router.put('/:id/read', notificationController.danhDauDaDoc);

module.exports = router;
