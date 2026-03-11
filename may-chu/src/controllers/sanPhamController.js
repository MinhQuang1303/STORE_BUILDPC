// may-chu/src/controllers/sanPhamController.js
const SanPham = require('../models/SanPham');

// 1. Lấy danh sách sản phẩm (MỚI BỔ SUNG - ĐỂ SỬA LỖI DÒNG 8)
exports.layDanhSachSanPham = async (req, res) => {
    try {
        const sanPhams = await SanPham.find();
        res.status(200).json(sanPhams);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách", error: error.message });
    }
};

// 2. Thêm sản phẩm (Dùng cho router.post)
exports.themSanPham = async (req, res) => {
    try {
        const { ten, loai, gia, anh, thongSo } = req.body;
        const spMoi = new SanPham({ ten, loai, gia, anh, thongSo });
        await spMoi.save();
        res.status(201).json({ message: "Thêm thành công!", data: spMoi });
    } catch (error) {
        res.status(500).json({ message: "Lỗi thêm sản phẩm", error: error.message });
    }
};

// 3. Lấy chi tiết một sản phẩm
exports.layChiTietSanPham = async (req, res) => {
    try {
        const sanPham = await SanPham.findById(req.params.id);
        if (!sanPham) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.status(200).json(sanPham);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi tiết", error: error.message });
    }
};

// 4. Cập nhật sản phẩm (MỚI BỔ SUNG - DÙNG CHO router.put)
exports.capNhatSanPham = async (req, res) => {
    try {
        const spCapNhat = await SanPham.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Cập nhật thành công!", data: spCapNhat });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

// 5. Xóa sản phẩm (MỚI BỔ SUNG - DÙNG CHO router.delete)
exports.xoaSanPham = async (req, res) => {
    try {
        await SanPham.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
    }
};