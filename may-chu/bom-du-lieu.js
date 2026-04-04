const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./src/models/User");
const Order = require("./src/models/Order");
const OrderItem = require("./src/models/OrderItem");
const SanPham = require("./src/models/SanPham");
const DanhMuc = require("./src/models/DanhMuc");
const BienThe = require("./src/models/BienThe");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pc-builder";

const danhSachFlashSale = [
    // CPU
    { ten: "Intel Core i9-14900K", loai: "CPU", gia: 15500000, anh: "https://tse2.mm.bing.net/th/id/OIP.npXBd3C4CnFJL77HtxLwXwHaIl?pid=Api&P=0&h=180", thongSo: "24 Cores (8P+16E), 32 Threads, Turbo 6.0GHz, LGA1700" },
    { ten: "Intel Core i9-13900K", loai: "CPU", gia: 13500000, anh: "https://tse1.mm.bing.net/th/id/OIP.pMi7ToFzNO7AYSuAZ7084QHaEc?pid=Api&P=0&h=180", thongSo: "24 Cores (8P+16E), 32 Threads, Turbo 5.8GHz, LGA1700" },
    { ten: "Intel Core i7-14700K", loai: "CPU", gia: 10200000, anh: "https://tse2.mm.bing.net/th/id/OIP.Bu5PUPy2hosEtEXeED0-XAHaIe?pid=Api&P=0&h=180", thongSo: "20 Cores (8P+12E), 28 Threads, Turbo 5.6GHz, LGA1700" },
    { ten: "Intel Core i2-14600K", loai: "CPU", gia: 7200000, anh: "https://tse4.mm.bing.net/th/id/OIP.ZkEOQYlmCTXgYj0yfqyngwHaD4?pid=Api&P=0&h=180", thongSo: "14 Cores (6P+8E), 20 Threads, Turbo 5.3GHz, LGA1700" },
    // VGA
    { ten: "ASUS ROG STRIX RTX 4090 OC 24GB", loai: "VGA", gia: 58000000, anh: "https://tse1.mm.bing.net/th/id/OIP.CG7eCbw6I1ePaUs64qEWPwHaHa?pid=Api&P=0&h=180", thongSo: "24GB GDDR6X, 16384 CUDA Cores" },
    // RAM
    { ten: "Corsair Dominator Platinum RGB 32GB DDR5 6000MHz", loai: "RAM", gia: 5500000, anh: "https://tse1.mm.bing.net/th/id/OIP.9zxFjUYrUERqxqQAX5h8YAHaEV?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 6000MHz CL30" },
];

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("🚀 Đã nối MongoDB...");
        await DanhMuc.deleteMany({});
        await SanPham.deleteMany({});
        await Order.deleteMany({});
        await OrderItem.deleteMany({});
        await BienThe.deleteMany({});

        const categories = await DanhMuc.insertMany([
            { ten: "CPU", moTa: "CPU" },
            { ten: "RAM", moTa: "RAM" },
            { ten: "Mainboard", moTa: "Main" },
            { ten: "VGA", moTa: "VGA" },
            { ten: "Ổ Cứng", moTa: "SSD" },
            { ten: "Nguồn", moTa: "PSU" },
            { ten: "Case", moTa: "Case" },
            { ten: "Tản Nhiệt", moTa: "Cooling" },
        ]);

        const categoryMap = {};
        categories.forEach(c => { categoryMap[c.ten] = c._id; });

        const insertedProducts = await SanPham.insertMany(danhSachFlashSale.map(item => ({
            ...item,
            idDanhMuc: categoryMap[item.loai] || categoryMap["CPU"],
            soLuong: 50,
            daBan: 0
        })));

        const variantsToInsert = [];
        insertedProducts.forEach((product) => {
            variantsToInsert.push({ ten: "Tiêu chuẩn", gia: product.gia, idSanPham: product._id, soLuong: 50, daBan: 0 });
        });
        await BienThe.insertMany(variantsToInsert);

        console.log("✅ Hoàn tất!");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
