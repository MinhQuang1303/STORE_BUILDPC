const SanPham = require('../models/SanPham'); // Đã đổi tên từ mo-hinh sang models

class SanPhamController {
    async getAll(req, res) {
        try {
            const danhSach = await SanPham.find();
            res.json(danhSach);
        } catch (err) {
            res.status(500).json({ message: "Lỗi Server: " + err.message });
        }
    }
}

module.exports = new SanPhamController();