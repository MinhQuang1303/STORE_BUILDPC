const mongoose = require("mongoose");
require("dotenv").config();

// Import Models
const User = require("./src/models/User");
const Order = require("./src/models/Order");
const OrderItem = require("./src/models/OrderItem");
const SanPham = require("./src/models/SanPham");
const DanhMuc = require("./src/models/DanhMuc"); 
const BienThe = require("./src/models/BienThe");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pc-builder";

// ================================================================
// DANH SÁCH 80 SẢN PHẨM (ĐÃ SỬA CHỮ 'anh:' THÀNH 'hinhAnh:')
// ================================================================
const danhSachFlashSale = [
    // CPU
    { ten: "Intel Core i9-14900K", loai: "CPU", gia: 15500000, hinhAnh: "intel-core-i9-14900k.png", thongSo: "24 Cores (8P+16E), 32 Threads, Turbo 6.0GHz, LGA1700" },
    { ten: "Intel Core i9-13900K", loai: "CPU", gia: 13500000, hinhAnh: "Intel-Core-I9-13900K-Processor-1.jpg", thongSo: "24 Cores (8P+16E), 32 Threads, Turbo 5.8GHz, LGA1700" },
    { ten: "Intel Core i7-14700K", loai: "CPU", gia: 10200000, hinhAnh: "Intel Core i7-14700K.png", thongSo: "20 Cores (8P+12E), 28 Threads, Turbo 5.6GHz, LGA1700" },
    { ten: "Intel Core i7-13700K", loai: "CPU", gia: 9500000, hinhAnh: "Intel Core i7-13700K.png", thongSo: "16 Cores (8P+8E), 24 Threads, Turbo 5.4GHz, LGA1700" },
    { ten: "Intel Core i5-14600K", loai: "CPU", gia: 7200000, hinhAnh: "Intel Core i5-14600K.png", thongSo: "14 Cores (6P+8E), 20 Threads, Turbo 5.3GHz, LGA1700" },
    { ten: "Intel Core i5-13600K", loai: "CPU", gia: 6800000, hinhAnh: "Intel Core i5-13600K.jpg", thongSo: "14 Cores (6P+8E), 20 Threads, Turbo 5.1GHz, LGA1700" },
    { ten: "Intel Core i5-13400F", loai: "CPU", gia: 5200000, hinhAnh: "Intel Core i5-13400F.jpg", thongSo: "10 Cores (6P+4E), 16 Threads, Turbo 4.6GHz, LGA1700" },
    { ten: "Intel Core i3-13100F", loai: "CPU", gia: 2800000, hinhAnh: "Intel Core i3-13100F.jpg", thongSo: "4 Cores, 8 Threads, Turbo 4.5GHz, LGA1700" },
    { ten: "Intel Core i9-12900K", loai: "CPU", gia: 9800000, hinhAnh: "Intel Core i9-12900K.jpg", thongSo: "16 Cores (8P+8E), 24 Threads, Turbo 5.2GHz, LGA1700" },
    { ten: "Intel Core i7-12700K", loai: "CPU", gia: 7000000, hinhAnh: "Intel Core i7-12700K.png", thongSo: "12 Cores (8P+4E), 20 Threads, Turbo 5.0GHz, LGA1700" },
    { ten: "AMD Ryzen 9 7950X3D", loai: "CPU", gia: 24000000, hinhAnh: "AMD Ryzen 9 7950X3D.jpg", thongSo: "16 Cores, 32 Threads, Turbo 5.7GHz, 3D V-Cache, AM5" },
    { ten: "AMD Ryzen 9 7900X", loai: "CPU", gia: 10800000, hinhAnh: "AMD Ryzen 9 7900X.jpg", thongSo: "12 Cores, 24 Threads, Turbo 5.6GHz, AM5" },
    { ten: "AMD Ryzen 7 7800X3D", loai: "CPU", gia: 10500000, hinhAnh: "AMD Ryzen 7 7800X3D.jpg", thongSo: "8 Cores, 16 Threads, Turbo 5.0GHz, 3D V-Cache, AM5" },
    { ten: "AMD Ryzen 7 7700X", loai: "CPU", gia: 7500000, hinhAnh: "AMD Ryzen 7 7700X.jpg", thongSo: "8 Cores, 16 Threads, Turbo 5.4GHz, AM5" },
    { ten: "AMD Ryzen 5 7600X", loai: "CPU", gia: 5900000, hinhAnh: "AMD Ryzen 5 7600X.jpg", thongSo: "6 Cores, 12 Threads, Turbo 5.3GHz, AM5" },
    { ten: "AMD Ryzen 5 7600", loai: "CPU", gia: 4800000, hinhAnh: "AMD Ryzen 5 7600.jpg", thongSo: "6 Cores, 12 Threads, Turbo 5.1GHz, AM5" },
    { ten: "AMD Ryzen 7 5800X3D", loai: "CPU", gia: 6200000, hinhAnh: "AMD Ryzen 7 5800X3D.png", thongSo: "8 Cores, 16 Threads, Turbo 4.5GHz, 3D V-Cache, AM4" },
    { ten: "AMD Ryzen 5 5600X", loai: "CPU", gia: 3600000, hinhAnh: "AMD Ryzen 5 5600X.jpg", thongSo: "6 Cores, 12 Threads, Turbo 4.6GHz, AM4" },
    { ten: "AMD Ryzen 9 5900X", loai: "CPU", gia: 7200000, hinhAnh: "AMD Ryzen 9 5900X.jpg", thongSo: "12 Cores, 24 Threads, Turbo 4.8GHz, AM4" },
    { ten: "AMD Ryzen 5 5500", loai: "CPU", gia: 2500000, hinhAnh: "AMD Ryzen 5 5500.jpg", thongSo: "6 Cores, 12 Threads, Turbo 4.2GHz, AM4" },

    // GPU
    { ten: "ASUS ROG STRIX RTX 4090 OC 24GB", loai: "GPU", gia: 58000000, hinhAnh: "ASUS ROG STRIX RTX 4090 OC 24GB.jpg", thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2640MHz" },
    { ten: "ASUS TUF Gaming RTX 4090 OC 24GB", loai: "GPU", gia: 54000000, hinhAnh: "ASUS TUF Gaming RTX 4090 OC 24GB.jpg", thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2610MHz" },
    { ten: "ASUS ROG STRIX RTX 4080 SUPER OC 16GB", loai: "GPU", gia: 30000000, hinhAnh: "ASUS ROG STRIX RTX 4080 SUPER OC 16GB.jpg", thongSo: "16GB GDDR6X, 10240 CUDA Cores, Boost 2610MHz" },
    { ten: "ASUS TUF Gaming RTX 4080 OC 16GB", loai: "GPU", gia: 26000000, hinhAnh: "ASUS TUF Gaming RTX 4080 OC 16GB.jpg", thongSo: "16GB GDDR6X, 9728 CUDA Cores, Boost 2580MHz" },
    { ten: "ASUS ROG STRIX RTX 4070 Ti SUPER OC 16GB", loai: "GPU", gia: 22000000, hinhAnh: "ASUS ROG STRIX RTX 4070 Ti SUPER OC 16GB.jpg", thongSo: "16GB GDDR6X, 8448 CUDA Cores, Boost 2670MHz" },
    { ten: "ASUS TUF Gaming RTX 4070 SUPER OC 12GB", loai: "GPU", gia: 17500000, hinhAnh: "Gigabyte RTX 4070 SUPER GAMING OC 12G.jpg", thongSo: "12GB GDDR6X, 7168 CUDA Cores, Boost 2535MHz" },
    { ten: "ASUS ROG STRIX RTX 4070 OC 12GB", loai: "GPU", gia: 16000000, hinhAnh: "ASUS ROG STRIX RTX 4070 OC 12GB.png", thongSo: "12GB GDDR6X, 5888 CUDA Cores, Boost 2565MHz" },
    { ten: "ASUS TUF Gaming RTX 4060 Ti OC 8GB", loai: "GPU", gia: 12000000, hinhAnh: "ASUS TUF Gaming RTX 4060 Ti OC 8GB.jpg", thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz" },
    { ten: "ASUS TUF Gaming RTX 4060 OC 8GB", loai: "GPU", gia: 8500000, hinhAnh: "ASUS TUF Gaming RTX 4060 OC 8GB.jpg", thongSo: "8GB GDDR6, 3072 CUDA Cores, Boost 2505MHz" },
    { ten: "MSI GeForce RTX 4090 SUPRIM X 24G", loai: "GPU", gia: 56000000, hinhAnh: "MSI GeForce RTX 4090 SUPRIM X 24G.jpg", thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2625MHz" },
    { ten: "MSI GeForce RTX 4080 GAMING X TRIO 16G", loai: "GPU", gia: 26500000, hinhAnh: "MSI GeForce RTX 4080 GAMING X TRIO 16G.jpg", thongSo: "16GB GDDR6X, 9728 CUDA Cores, Boost 2580MHz" },
    { ten: "MSI GeForce RTX 4070 GAMING X TRIO 12G", loai: "GPU", gia: 15500000, hinhAnh: "MSI GeForce RTX 4070 GAMING X TRIO 12G.jpg", thongSo: "12GB GDDR6X, 5888 CUDA Cores, Boost 2535MHz" },
    { ten: "MSI GeForce RTX 4060 Ti GAMING X TRIO 8G", loai: "GPU", gia: 12200000, hinhAnh: "MSI GeForce RTX 4060 Ti GAMING X TRIO 8G.jpg", thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz" },
    { ten: "MSI GeForce RTX 4060 GAMING X 8G", loai: "GPU", gia: 9000000, hinhAnh: "MSI GeForce RTX 4060 GAMING X 8G.png", thongSo: "8GB GDDR6, 3072 CUDA Cores, Boost 2490MHz" },
    { ten: "Gigabyte RTX 4090 AORUS MASTER 24G", loai: "GPU", gia: 60000000, hinhAnh: "Gigabyte RTX 4090 AORUS MASTER 24G.jpg", thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2640MHz" },
    { ten: "Gigabyte RTX 4080 SUPER GAMING OC 16G", loai: "GPU", gia: 28500000, hinhAnh: "Gigabyte RTX 4080 SUPER GAMING OC 16G.jpg", thongSo: "16GB GDDR6X, 10240 CUDA Cores, Boost 2595MHz" },
    { ten: "Gigabyte RTX 4070 SUPER GAMING OC 12G", loai: "GPU", gia: 17000000, hinhAnh: "Gigabyte RTX 4070 SUPER GAMING OC 12G.jpg", thongSo: "12GB GDDR6X, 7168 CUDA Cores, Boost 2535MHz" },
    { ten: "Gigabyte RTX 4060 Ti GAMING OC 8G", loai: "GPU", gia: 11500000, hinhAnh: "Gigabyte RTX 4060 Ti GAMING OC 8G.jpg", thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz" },
    { ten: "Gigabyte RX 7900 XTX GAMING OC 24G", loai: "GPU", gia: 28000000, hinhAnh: "Gigabyte RX 7900 XTX GAMING OC 24G.jpg", thongSo: "24GB GDDR6, 6144 SP, Boost 2615MHz" },
    { ten: "Gigabyte RX 7800 XT GAMING OC 16G", loai: "GPU", gia: 13500000, hinhAnh: "Gigabyte RX 7800 XT GAMING OC 16G.jpg", thongSo: "16GB GDDR6, 3840 SP, Boost 2430MHz" },

    // RAM
    { ten: "Corsair Dominator Platinum RGB 32GB DDR5 6000MHz", loai: "RAM", gia: 5500000, hinhAnh: "Corsair Dominator Platinum RGB 32GB DDR5 6000MHz.jpg", thongSo: "2x16GB DDR5 6000MHz CL30, RGB" },
    { ten: "Corsair Dominator Titanium RGB 64GB DDR5 6000MHz", loai: "RAM", gia: 8500000, hinhAnh: "Corsair Dominator Titanium RGB 64GB DDR5 6000MHz.jpg", thongSo: "2x32GB DDR5 6000MHz CL30, RGB" },
    { ten: "Corsair Vengeance RGB 32GB DDR5 5600MHz", loai: "RAM", gia: 3800000, hinhAnh: "Corsair Vengeance RGB 32GB DDR5 5600MHz.jpg", thongSo: "2x16GB DDR5 5600MHz CL36, RGB" },
    { ten: "Corsair Vengeance RGB Pro 32GB DDR4 3600MHz", loai: "RAM", gia: 2200000, hinhAnh: "Corsair Vengeance RGB Pro 32GB DDR4 3600MHz.jpg", thongSo: "2x16GB DDR4 3600MHz CL18, RGB" },
    { ten: "Corsair Vengeance LPX 16GB DDR4 3200MHz", loai: "RAM", gia: 950000, hinhAnh: "Corsair Vengeance LPX 16GB DDR4 3200MHz.jpg", thongSo: "2x8GB DDR4 3200MHz CL16, Low Profile" },
    { ten: "Corsair Dominator Platinum RGB 32GB DDR4 3600MHz", loai: "RAM", gia: 3200000, hinhAnh: "Corsair Dominator Platinum RGB 32GB DDR4 3600MHz.jpg", thongSo: "2x16GB DDR4 3600MHz CL18, RGB" },
    { ten: "G.Skill Trident Z5 RGB 32GB DDR5 6000MHz", loai: "RAM", gia: 4200000, hinhAnh: "G.Skill Trident Z5 RGB 32GB DDR5 6000MHz.jpg", thongSo: "2x16GB DDR5 6000MHz CL30, RGB" },
    { ten: "G.Skill Trident Z5 RGB 64GB DDR5 6000MHz", loai: "RAM", gia: 7200000, hinhAnh: "G.Skill Trident Z5 RGB 64GB DDR5 6000MHz.jpg", thongSo: "2x32GB DDR5 6000MHz CL30, RGB" },
    { ten: "G.Skill Trident Z5 NEO RGB 32GB DDR5 AMD EXPO", loai: "RAM", gia: 4800000, hinhAnh: "G.Skill Trident Z5 NEO RGB 32GB DDR5 AMD EXPO.jpg", thongSo: "2x16GB DDR5 6000MHz CL30, AMD EXPO" },
    { ten: "G.Skill Trident Z RGB 32GB DDR4 3600MHz", loai: "RAM", gia: 2100000, hinhAnh: "G.Skill Trident Z RGB 32GB DDR4 3600MHz.jpg", thongSo: "2x16GB DDR4 3600MHz CL18, RGB" },
    { ten: "G.Skill Ripjaws V 16GB DDR4 3200MHz", loai: "RAM", gia: 880000, hinhAnh: "G.Skill Ripjaws V 16GB DDR4 3200MHz.jpg", thongSo: "2x8GB DDR4 3200MHz CL16" },
    { ten: "G.Skill Trident Z5 RGB 32GB DDR5 7200MHz", loai: "RAM", gia: 6500000, hinhAnh: "G.Skill Trident Z5 RGB 32GB DDR5 7200MHz.jpg", thongSo: "2x16GB DDR5 7200MHz CL34, RGB" },
    { ten: "Kingston FURY Beast RGB 32GB DDR5 5200MHz", loai: "RAM", gia: 3500000, hinhAnh: "Kingston FURY Beast RGB 32GB DDR5 5200MHz.jpg", thongSo: "2x16GB DDR5 5200MHz CL40, RGB" },
    { ten: "Kingston FURY Renegade RGB 32GB DDR5 6000MHz", loai: "RAM", gia: 4500000, hinhAnh: "Kingston FURY Renegade RGB 32GB DDR5 6000MHz.jpg", thongSo: "2x16GB DDR5 6000MHz CL32, RGB" },
    { ten: "Kingston FURY Beast 32GB DDR4 3200MHz", loai: "RAM", gia: 1800000, hinhAnh: "Kingston FURY Beast 32GB DDR4 3200MHz.jpg", thongSo: "2x16GB DDR4 3200MHz CL16" },
    { ten: "Kingston FURY Beast 16GB DDR4 3200MHz", loai: "RAM", gia: 1250000, hinhAnh: "Kingston FURY Beast 16GB DDR4 3200MHz.jpg", thongSo: "1x16GB DDR4 3200MHz CL16" },
    { ten: "Kingston ValueRAM 8GB DDR4 3200MHz", loai: "RAM", gia: 480000, hinhAnh: "Kingston ValueRAM 8GB DDR4 3200MHz.jpg", thongSo: "1x8GB DDR4 3200MHz CL22" },
    { ten: "TeamGroup T-Force Delta RGB 32GB DDR5 5600MHz", loai: "RAM", gia: 3300000, hinhAnh: "TeamGroup T-Force Delta RGB 32GB DDR5 5600MHz.jpg", thongSo: "2x16GB DDR5 5600MHz CL36, RGB" },
    { ten: "TeamGroup T-Force Delta RGB 64GB DDR5 5600MHz", loai: "RAM", gia: 6200000, hinhAnh: "TeamGroup T-Force Delta RGB 64GB DDR5 5600MHz.jpg", thongSo: "2x32GB DDR5 5600MHz CL36, RGB" },
    { ten: "TeamGroup T-Force Vulcan 16GB DDR4 3200MHz", loai: "RAM", gia: 820000, hinhAnh: "TeamGroup T-Force Vulcan 16GB DDR4 3200MHz.jpg", thongSo: "2x8GB DDR4 3200MHz CL16" },

    // MAINBOARD
    { ten: "ASUS ROG MAXIMUS Z790 APEX ENCORE", loai: "Mainboard", gia: 22000000, hinhAnh: "ASUS ROG MAXIMUS Z790 APEX ENCORE.jpg", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 7" },
    { ten: "ASUS ROG MAXIMUS Z790 HERO", loai: "Mainboard", gia: 18500000, hinhAnh: "ASUS ROG MAXIMUS Z790 HERO.jpg", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "ASUS ROG STRIX Z790-E GAMING WIFI", loai: "Mainboard", gia: 13500000, hinhAnh: "ASUS ROG STRIX Z790-E GAMING WIFI.png", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "ASUS PRIME Z790-P WIFI", loai: "Mainboard", gia: 6200000, hinhAnh: "ASUS PRIME Z790-P WIFI.jpg", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6" },
    { ten: "ASUS TUF Gaming B760-PLUS WIFI D4", loai: "Mainboard", gia: 4200000, hinhAnh: "ASUS TUF Gaming B760-PLUS WIFI D4.jpg", thongSo: "LGA1700, B760, DDR4, ATX, Wi-Fi 6" },
    { ten: "ASUS ROG CROSSHAIR X670E HERO", loai: "Mainboard", gia: 16000000, hinhAnh: "ASUS ROG CROSSHAIR X670E HERO.jpg", thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E" },
    { ten: "ASUS ROG STRIX B650E-F GAMING WIFI", loai: "Mainboard", gia: 7200000, hinhAnh: "ASUS ROG STRIX B650E-F GAMING WIFI.jpg", thongSo: "AM5, B650E, DDR5, ATX, Wi-Fi 6E" },
    { ten: "ASUS PRIME B550M-A WIFI", loai: "Mainboard", gia: 2800000, hinhAnh: "ASUS PRIME B550M-A WIFI.png", thongSo: "AM4, B550, DDR4, m-ATX, Wi-Fi 5" },
    { ten: "MSI MEG Z790 ACE", loai: "Mainboard", gia: 17000000, hinhAnh: "MSI MEG Z790 ACE.jpg", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "MSI MAG Z790 TOMAHAWK WIFI DDR5", loai: "Mainboard", gia: 7500000, hinhAnh: "MSI MAG Z790 TOMAHAWK WIFI DDR5.jpg", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "MSI MAG B760M Mortar WiFi DDR5", loai: "Mainboard", gia: 4200000, hinhAnh: "MSI MAG B760M Mortar WiFi DDR5.jpg", thongSo: "LGA1700, B760, DDR5, m-ATX, Wi-Fi 6E" },
    { ten: "MSI MEG X670E ACE", loai: "Mainboard", gia: 15500000, hinhAnh: "MSI MEG X670E ACE.jpg", thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E" },
    { ten: "MSI MAG B650 TOMAHAWK WIFI", loai: "Mainboard", gia: 5500000, hinhAnh: "MSI MAG B650 TOMAHAWK WIFI.jpg", thongSo: "AM5, B650, DDR5, ATX, Wi-Fi 6E" },
    { ten: "MSI MAG B550 TOMAHAWK", loai: "Mainboard", gia: 3200000, hinhAnh: "MSI MAG B550 TOMAHAWK.jpg", thongSo: "AM4, B550, DDR4, ATX" },
    { ten: "Gigabyte Z790 AORUS MASTER", loai: "Mainboard", gia: 14000000, hinhAnh: "Gigabyte Z790 AORUS MASTER.jpg", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "Gigabyte B760M AORUS ELITE AX DDR5", loai: "Mainboard", gia: 3900000, hinhAnh: "Gigabyte B760M AORUS ELITE AX DDR5.jpg", thongSo: "LGA1700, B760, DDR5, m-ATX, Wi-Fi 6E" },
    { ten: "Gigabyte H610M S2H V2 DDR4", loai: "Mainboard", gia: 1900000, hinhAnh: "Gigabyte H610M S2H V2 DDR4.jpg", thongSo: "LGA1700, H610, DDR4, m-ATX" },
    { ten: "Gigabyte X670E AORUS MASTER", loai: "Mainboard", gia: 13000000, hinhAnh: "Gigabyte X670E AORUS MASTER.jpg", thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E" },
    { ten: "Gigabyte B650M AORUS ELITE AX", loai: "Mainboard", gia: 4500000, hinhAnh: "Gigabyte B650M AORUS ELITE AX.jpg", thongSo: "AM5, B650, DDR5, m-ATX, Wi-Fi 6E" },
    { ten: "Gigabyte B550 AORUS PRO AC", loai: "Mainboard", gia: 3800000, hinhAnh: "Gigabyte B550 AORUS PRO AC.jpg", thongSo: "AM4, B550, DDR4, ATX, Wi-Fi 6" },
];

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("🚀 Đã kết nối MongoDB. Đang dọn dẹp hệ thống...");

        // =======================
        // 1. XÓA SẠCH DỮ LIỆU CŨ (KHÔNG XÓA USER NỮA)
        // =======================
        await DanhMuc.deleteMany({});
        await SanPham.deleteMany({});
        await Order.deleteMany({});
        await OrderItem.deleteMany({});
        await BienThe.deleteMany({});
        console.log("🧹 Đã làm sạch Danh mục, Sản phẩm và Đơn hàng cũ.");

        // =======================
        // 2. TẠO DANH MỤC TRƯỚC
        // =======================
        const categories = await DanhMuc.insertMany([
            { ten: "CPU", moTa: "Danh mục CPU" },
            { ten: "GPU", moTa: "Danh mục GPU" },
            { ten: "RAM", moTa: "Danh mục RAM" },
            { ten: "Mainboard", moTa: "Danh mục Mainboard" },
        ]);
        console.log("✅ Đã tạo Danh mục.");

        const categoryMap = {};
        categories.forEach(c => {
            categoryMap[c.ten] = c._id; 
        });

        // =======================
        // 3. THÊM 80 SẢN PHẨM 
        // =======================
        const dataWithCategory = danhSachFlashSale.map((item) => {
            const { loai, hinhAnh, ...rest } = item;
            return {
                ...rest,
                anh: `/images/products/${hinhAnh}`,
                idDanhMuc: categoryMap[loai],
                soLuong: 50,
                daBan: 0,
            };
        });

        const insertedProducts = await SanPham.insertMany(dataWithCategory);
        console.log(`✅ Đã thêm ${insertedProducts.length} sản phẩm.`);

        const variantsToInsert = [];
        insertedProducts.forEach((product) => {
            // Tìm tên danh mục từ ID
            let catName = "";
            for (const [key, value] of Object.entries(categoryMap)) {
                if (String(value) === String(product.idDanhMuc)) {
                    catName = key;
                    break;
                }
            }

            if (catName === "RAM") {
                variantsToInsert.push({ ten: "8GB", gia: product.gia * 0.6, idSanPham: product._id, soLuong: 20, daBan: 0 });
                variantsToInsert.push({ ten: "16GB", gia: product.gia, idSanPham: product._id, soLuong: 20, daBan: 0 });
                variantsToInsert.push({ ten: "32GB", gia: product.gia * 1.8, idSanPham: product._id, soLuong: 10, daBan: 0 });
            } else if (catName === "GPU") {
                variantsToInsert.push({ ten: "Bản Thường", gia: product.gia, idSanPham: product._id, soLuong: 10, daBan: 0 });
                variantsToInsert.push({ ten: "Bản OC (Ép xung)", gia: product.gia + 1500000, idSanPham: product._id, soLuong: 5, daBan: 0 });
            } else {
                variantsToInsert.push({ ten: "Bản tiêu chuẩn", gia: product.gia, idSanPham: product._id, soLuong: product.soLuong || 50, daBan: product.daBan || 0 });
            }
        });
        await BienThe.insertMany(variantsToInsert);
        console.log(`✅ Đã thêm ${variantsToInsert.length} biến thể đa dạng.`);

        // =======================
        // 4. LẤY USER TỪ DATABASE ĐỂ TẠO ĐƠN HÀNG
        // =======================
        // Lấy danh sách các tài khoản khách hàng bạn đã tự tạo trước đó
        const normalUsers = await User.find({ role: "user" });

        if (normalUsers.length === 0) {
            console.log("⚠️ KHÔNG TÌM THẤY USER NÀO TRONG DATABASE!");
            console.log("⏭ Bỏ qua bước tạo Đơn Hàng. Bạn có thể vào Web tự tạo User để test nhé.");
        } else {
            console.log(`📦 Đã tìm thấy ${normalUsers.length} Khách hàng. Đang tạo đơn hàng giả lập cho 12 tháng...`);
            
            const trangThais = ["Pending", "Confirmed", "Shipping", "Delivered", "Cancelled"];

            for (let i = 0; i < 12; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);

                const numOrders = Math.floor(Math.random() * 4) + 2; // 2-5 đơn hàng mỗi tháng

                for (let j = 0; j < numOrders; j++) {
                    const randomUser = normalUsers[Math.floor(Math.random() * normalUsers.length)];
                    const randomTrangThai = i === 0 ? trangThais[Math.floor(Math.random() * 3)] : "Delivered"; 

                    const orderDate = new Date(date);
                    orderDate.setDate(Math.floor(Math.random() * 28) + 1); 

                    const newOrder = await Order.create({
                        idUser: randomUser._id,
                        tongTien: 0,
                        trangThai: randomTrangThai,
                        diaChi: "Hà Nội, Việt Nam",
                        soDienThoai: "0987654321",
                        createdAt: orderDate,
                    });

                    let total = 0;
                    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 sản phẩm mỗi đơn
                    
                    for (let k = 0; k < numItems; k++) {
                        const product = insertedProducts[Math.floor(Math.random() * insertedProducts.length)];
                        const qty = Math.floor(Math.random() * 2) + 1; // Số lượng 1-2 cái
                        const price = product.gia;

                        await OrderItem.create({
                            idOrder: newOrder._id,
                            idSanPham: product._id,
                            soLuong: qty,
                            gia: price,
                            createdAt: orderDate,
                        });
                        
                        total += price * qty;
                    }

                    newOrder.tongTien = total;
                    await newOrder.save();
                }
            }
            console.log("✅ Đã tạo xong đơn hàng mẫu!");
        }

        console.log("🎉 Hoàn tất quá trình nạp dữ liệu! Bật server lên và xem thành quả nào.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Lỗi trong quá trình chạy seed:", error);
        process.exit(1);
    }
};

// Chạy hàm
seedData();
