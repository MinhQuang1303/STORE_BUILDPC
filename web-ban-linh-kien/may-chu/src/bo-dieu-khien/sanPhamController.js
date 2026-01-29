const SanPham = require('../mo-hinh/SanPham');

// Lấy danh sách sản phẩm (có lọc theo loại)
exports.layDanhSachSanPham = async (req, res) => {
    try {
        const { loai } = req.query; // Lấy tham số ?loai=CPU từ URL
        const filter = loai ? { loai: loai } : {}; 
        
        const danhSach = await SanPham.find(filter);
        res.json(danhSach);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo nhanh dữ liệu mẫu (để test)
exports.taoDuLieuMau = async (req, res) => {
    try {
        await SanPham.create([
            { tenSanPham: "Intel Core i9-14900K", loai: "CPU", gia: 15000000, thongSo: "LGA1700" },
            { tenSanPham: "AMD Ryzen 9 7950X", loai: "CPU", gia: 14000000, thongSo: "AM5" },
            { tenSanPham: "RTX 4090 Gaming OC", loai: "GPU", gia: 50000000, thongSo: "24GB VRAM" },
            { tenSanPham: "RAM Corsair 32GB", loai: "RAM", gia: 2500000, thongSo: "DDR5 6000MHz" }
        ]);
        res.json({ message: "Đã tạo dữ liệu mẫu thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};