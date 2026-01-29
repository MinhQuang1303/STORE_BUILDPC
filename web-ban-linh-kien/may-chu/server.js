const express = require('express');
const mongoose = require('mongoose'); // Thêm dòng này để không bị lỗi "not defined"
const cors = require('cors');
const SanPham = require('./src/mo-hinh/SanPham'); // Import model để lấy dữ liệu

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối trực tiếp tới Database 'pc-builder'
mongoose.connect('mongodb://127.0.0.1:27017/pc-builder')
  .then(() => console.log("✅ Đã kết nối đúng Database: pc-builder"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// API lấy danh sách linh kiện từ collection 'sanphams'
app.get('/api/san-pham', async (req, res) => {
    try {
        const danhSach = await SanPham.find();
        res.json(danhSach);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu từ Server" });
    }
});

app.get('/', (req, res) => {
    res.send('Máy chủ Build PC đang hoạt động!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend nổ máy tại: http://localhost:${PORT}`);
});