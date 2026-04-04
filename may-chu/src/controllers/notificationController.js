const Notification = require('../models/Notification');

// Lấy danh sách cho Admin (kết hợp phân trang hoặc lấy mới nhất)
exports.layThongBaoAdmin = async (req, res) => {
    try {
        const notifications = await Notification.find({ isAdminAuth: true })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('linkData'); // Có thể lấy nội dung đơn hàng nếu là loại báo đơn
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách cho Khách hàng (User)
exports.layThongBaoCustomer = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId, isAdminAuth: false })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Hàm đánh dấu đã đọc
exports.danhDauDaDoc = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
