const mongoose = typeof window === 'undefined' ? eval('require("mongoose")') : null;
const SanPham = typeof window === 'undefined' ? eval('require("./src/models/SanPham")') : null;

mongoose.connect('mongodb://127.0.0.1:27017/pc-builder')
.then(async () => {
    console.log("🚀 Đang kết nối pc-builder và làm mới kho hàng...");
    await SanPham.deleteMany({});

    const data = [
        // ===================== 1. CPU =====================
        { 
            ten: "Intel Core i9-14900K", loai: "CPU", gia: 15500000, 
            anh: "https://m.media-amazon.com/images/I/611b2we+9jL._AC_SL1500_.jpg", 
            thongSo: "24 Cores, 32 Threads, Socket LGA1700" 
        },
        { 
            ten: "Intel Core i5-12400F", loai: "CPU", gia: 3500000, 
            anh: "https://m.media-amazon.com/images/I/51HThHAE6tL._AC_SL1500_.jpg", 
            thongSo: "6 Cores, 12 Threads, Socket LGA1700" 
        },
        { 
            ten: "AMD Ryzen 7 7800X3D", loai: "CPU", gia: 10500000, 
            anh: "https://m.media-amazon.com/images/I/61EmdE+S1+L._AC_SL1500_.jpg", 
            thongSo: "8 Cores, 16 Threads, Socket AM5" 
        },
        { 
            ten: "AMD Ryzen 5 5600", loai: "CPU", gia: 3200000, 
            anh: "https://m.media-amazon.com/images/I/61bLtv0eYwL._AC_SL1500_.jpg", 
            thongSo: "6 Cores, 12 Threads, Socket AM4" 
     const danhSachFlashSale = [

        // ================================================================
        // CPU (20 sản phẩm) — ảnh từ Intel & AMD chính thức
        // ================================================================
        {
            ten: "Intel Core i9-14900K",
            loai: "CPU", gia: 15500000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.npXBd3C4CnFJL77HtxLwXwHaIl?pid=Api&P=0&h=180",
            thongSo: "24 Cores (8P+16E), 32 Threads, Turbo 6.0GHz, LGA1700"
        },
        {
            ten: "Intel Core i9-13900K",
            loai: "CPU", gia: 13500000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.pMi7ToFzNO7AYSuAZ7084QHaEc?pid=Api&P=0&h=180",
            thongSo: "24 Cores (8P+16E), 32 Threads, Turbo 5.8GHz, LGA1700"
        },
        {
            ten: "Intel Core i7-14700K",
            loai: "CPU", gia: 10200000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.Bu5PUPy2hosEtEXeED0-XAHaIe?pid=Api&P=0&h=180",
            thongSo: "20 Cores (8P+12E), 28 Threads, Turbo 5.6GHz, LGA1700"
        },
        {
            ten: "Intel Core i7-13700K",
            loai: "CPU", gia: 9500000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.Q-LbQMyCSWKbeiuAdYXNLwHaEC?pid=Api&P=0&h=180",
            thongSo: "16 Cores (8P+8E), 24 Threads, Turbo 5.4GHz, LGA1700"
        },
        {
            ten: "Intel Core i5-14600K",
            loai: "CPU", gia: 7200000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.ZkEOQYlmCTXgYj0yfqyngwHaD4?pid=Api&P=0&h=180",
            thongSo: "14 Cores (6P+8E), 20 Threads, Turbo 5.3GHz, LGA1700"
        },
        {
            ten: "Intel Core i5-13600K",
            loai: "CPU", gia: 6800000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.k20Yzni4GcbBxju1ajTOfQHaFj?pid=Api&P=0&h=180",
            thongSo: "14 Cores (6P+8E), 20 Threads, Turbo 5.1GHz, LGA1700"
        },
        {
            ten: "Intel Core i5-13400F",
            loai: "CPU", gia: 5200000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.JdBFpLA2XEBob_H-Au3DeAHaFj?pid=Api&P=0&h=180",
            thongSo: "10 Cores (6P+4E), 16 Threads, Turbo 4.6GHz, LGA1700"
        },
        {
            ten: "Intel Core i3-13100F",
            loai: "CPU", gia: 2800000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.ZPfQ8kuVdRTvSXOQAbQ4rwHaHa?pid=Api&P=0&h=180",
            thongSo: "4 Cores, 8 Threads, Turbo 4.5GHz, LGA1700"
        },
        {
            ten: "Intel Core i9-12900K",
            loai: "CPU", gia: 9800000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.9y_dsR6YdEoGgbeL9fJHvgHaFj?pid=Api&P=0&h=180",
            thongSo: "16 Cores (8P+8E), 24 Threads, Turbo 5.2GHz, LGA1700"
        },
        {
            ten: "Intel Core i7-12700K",
            loai: "CPU", gia: 7000000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.NeHlh1Wv6oHb3clDn-kCtAHaFj?pid=Api&P=0&h=180",
            thongSo: "12 Cores (8P+4E), 20 Threads, Turbo 5.0GHz, LGA1700"
        },
        {
            ten: "AMD Ryzen 9 7950X3D",
            loai: "CPU", gia: 24000000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.HiO3vf9Vt7b-UjHY1ZpIYAHaFj?pid=Api&P=0&h=180",
            thongSo: "16 Cores, 32 Threads, Turbo 5.7GHz, 3D V-Cache, AM5"
        },
        {
            ten: "AMD Ryzen 9 7900X",
            loai: "CPU", gia: 10800000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.0eE3gkzMtMluudaog7NgGAHaGn?pid=Api&P=0&h=180",
            thongSo: "12 Cores, 24 Threads, Turbo 5.6GHz, AM5"
        },
        {
            ten: "AMD Ryzen 7 7800X3D",
            loai: "CPU", gia: 10500000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.sEzKOERr3G4q7mGmr50_NQHaEL?pid=Api&P=0&h=180",
            thongSo: "8 Cores, 16 Threads, Turbo 5.0GHz, 3D V-Cache, AM5"
        },
        {
            ten: "AMD Ryzen 7 7700X",
            loai: "CPU", gia: 7500000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.sXT_wc8G0OGH3v1Z3bD2GQHaEK?pid=Api&P=0&h=180",
            thongSo: "8 Cores, 16 Threads, Turbo 5.4GHz, AM5"
        },
        {
            ten: "AMD Ryzen 5 7600X",
            loai: "CPU", gia: 5900000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.v2CQqwIJ0KZkDvvLMucmVQHaFQ?pid=Api&P=0&h=180",
            thongSo: "6 Cores, 12 Threads, Turbo 5.3GHz, AM5"
        },
        {
            ten: "AMD Ryzen 5 7600",
            loai: "CPU", gia: 4800000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.8CT6SBHLA303THKsvo8X7QHaFj?pid=Api&P=0&h=180",
            thongSo: "6 Cores, 12 Threads, Turbo 5.1GHz, AM5"
        },
        {
            ten: "AMD Ryzen 7 5800X3D",
            loai: "CPU", gia: 6200000,
            anh: "https://tse4.mm.bing.net/th?id=OIF.Ijtm8IuJM33IJNCq%2fDQD8g&pid=Api&P=0&h=180",
            thongSo: "8 Cores, 16 Threads, Turbo 4.5GHz, 3D V-Cache, AM4"
        },
        {
            ten: "AMD Ryzen 5 5600X",
            loai: "CPU", gia: 3600000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.x66LIRmpADYfd8zaDalKBwHaEK?pid=Api&P=0&h=180",
            thongSo: "6 Cores, 12 Threads, Turbo 4.6GHz, AM4"
        },
        {
            ten: "AMD Ryzen 9 5900X",
            loai: "CPU", gia: 7200000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.Cwdhna4kNQ_Q0cXfhm-oOwHaFj?pid=Api&P=0&h=180",
            thongSo: "12 Cores, 24 Threads, Turbo 4.8GHz, AM4"
        },
        {
            ten: "AMD Ryzen 5 5500",
            loai: "CPU", gia: 2500000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.o2mgloDPGeY4EJsmCTGE3wHaHX?pid=Api&P=0&h=180",
            thongSo: "6 Cores, 12 Threads, Turbo 4.2GHz, AM4"
        },

        // ===================== 2. Mainboard =====================
        { 
            ten: "ASUS ROG MAXIMUS Z790 HERO", loai: "Mainboard", gia: 18500000, 
            anh: "https://m.media-amazon.com/images/I/81B+e80P0-L._AC_SL1500_.jpg", 
            thongSo: "Socket LGA1700, Chuẩn RAM DDR5, ATX" 
        },
        { 
            ten: "MSI MAG B760M MORTAR WIFI", loai: "Mainboard", gia: 4200000, 
            anh: "https://m.media-amazon.com/images/I/81fHwYk4m4L._AC_SL1500_.jpg", 
            thongSo: "Socket LGA1700, Chuẩn RAM DDR4, m-ATX" 
        },
        { 
            ten: "Gigabyte X670E AORUS MASTER", loai: "Mainboard", gia: 13000000, 
            anh: "https://m.media-amazon.com/images/I/81y+O1rB2mL._AC_SL1500_.jpg", 
            thongSo: "Socket AM5, Chuẩn RAM DDR5, ATX" 
        },
        { 
            ten: "ASUS PRIME B550M-A WIFI", loai: "Mainboard", gia: 2800000, 
            anh: "https://m.media-amazon.com/images/I/81xUjNid2ZL._AC_SL1500_.jpg", 
            thongSo: "Socket AM4, Chuẩn RAM DDR4, m-ATX" 
        },

        // ===================== 3. RAM =====================
        { 
            ten: "Corsair Vengeance RGB 32GB DDR5", loai: "RAM", gia: 3800000, 
            anh: "https://m.media-amazon.com/images/I/612l1o7Uq+L._AC_SL1500_.jpg", 
            thongSo: "DDR5 6000MHz" 
        },
        { 
            ten: "G.Skill Trident Z RGB 16GB DDR4", loai: "RAM", gia: 1200000, 
            anh: "https://m.media-amazon.com/images/I/61Nl0b2fJtL._AC_SL1500_.jpg", 
            thongSo: "DDR4 3200MHz" 
        },

        // ===================== 4. VGA =====================
        { 
            ten: "ASUS ROG STRIX RTX 4090 24GB", loai: "VGA", gia: 58000000, 
            anh: "https://m.media-amazon.com/images/I/81r9HkX6YPL._AC_SL1500_.jpg", 
            thongSo: "24GB GDDR6X, Boost 2640MHz" 
        },
        { 
            ten: "MSI RTX 4060 Ti GAMING X 8GB", loai: "VGA", gia: 12200000, 
            anh: "https://m.media-amazon.com/images/I/71mJ04+q1nL._AC_SL1500_.jpg", 
            thongSo: "8GB GDDR6, Boost 2595MHz" 
        },
        { 
            ten: "Gigabyte RX 7800 XT GAMING OC", loai: "VGA", gia: 13500000, 
            anh: "https://m.media-amazon.com/images/I/71uGndX9yLL._AC_SL1500_.jpg", 
            thongSo: "16GB GDDR6, Boost 2430MHz" 
        },

        // ===================== 5. SSD =====================
        { 
            ten: "Samsung 980 PRO 1TB M.2 NVMe", loai: "SSD", gia: 2800000, 
            anh: "https://m.media-amazon.com/images/I/81Xm-v0B2PL._AC_SL1500_.jpg", 
            thongSo: "M.2 PCIe Gen 4.0, Đọc 7000MB/s" 
        },
        { 
            ten: "Crucial P3 500GB M.2 NVMe", loai: "SSD", gia: 1100000, 
            anh: "https://m.media-amazon.com/images/I/611ZzY7w+dL._AC_SL1500_.jpg", 
            thongSo: "M.2 PCIe Gen 3.0, Đọc 3500MB/s" 
        },

        // ===================== 6. PSU =====================
        { 
            ten: "Corsair RM850e 850W", loai: "PSU", gia: 3200000, 
            anh: "https://m.media-amazon.com/images/I/71eKee7AOhL._AC_SL1500_.jpg", 
            thongSo: "850W, 80 Plus Gold, Full Modular" 
        },
        { 
            ten: "Deepcool PK550D 550W", loai: "PSU", gia: 1150000, 
            anh: "https://m.media-amazon.com/images/I/61-9sI9t6aL._AC_SL1500_.jpg", 
            thongSo: "550W, 80 Plus Bronze" 
        },

        // ===================== 7. Case =====================
        { 
            ten: "NZXT H5 Flow Black", loai: "Case", gia: 2350000, 
            anh: "https://m.media-amazon.com/images/I/71t+709d1nL._AC_SL1500_.jpg", 
            thongSo: "Mid Tower, Kính cường lực" 
        },
        { 
            ten: "Lian Li O11 Dynamic (Bể cá)", loai: "Case", gia: 3500000, 
            anh: "https://m.media-amazon.com/images/I/81dG2rZ-4KL._AC_SL1500_.jpg", 
            thongSo: "Mid Tower, Kính Panorama" 
        },

        // ===================== 8. Tản nhiệt =====================
        { 
            ten: "Cooler Master MasterLiquid 240L", loai: "Tản nhiệt", gia: 1650000, 
            anh: "https://m.media-amazon.com/images/I/71SXXG8ZBeL._AC_SL1500_.jpg", 
            thongSo: "Tản nước AIO 240mm, ARGB" 
        },
        { 
            ten: "Deepcool AK400 Digital", loai: "Tản nhiệt", gia: 850000, 
            anh: "https://m.media-amazon.com/images/I/61I2a93K45L._AC_SL1500_.jpg", 
            thongSo: "Tản khí, LED hiển thị nhiệt độ" 
        },

        // ===================== 9. Laptop =====================
        { 
            ten: "MacBook Pro 16 M3 Max", loai: "Laptop", gia: 89000000, 
            anh: "https://m.media-amazon.com/images/I/618d5bS2lUL._AC_SL1500_.jpg", 
            thongSo: "Apple M3 Max, 36GB RAM, 1TB SSD" 
        },
        { 
            ten: "ASUS ROG Strix G16", loai: "Laptop", gia: 35000000, 
            anh: "https://m.media-amazon.com/images/I/81bL5bE9kML._AC_SL1500_.jpg", 
            thongSo: "i7-13650HX, RTX 4060, 16GB RAM, 512GB SSD" 
        },
        { 
            ten: "Dell Inspiron 15 3520", loai: "Laptop", gia: 15500000, 
            anh: "https://m.media-amazon.com/images/I/71qBvH-Y6uL._AC_SL1500_.jpg", 
            thongSo: "i5-1235U, 8GB RAM, 512GB SSD" 
        }
    ];

    await SanPham.insertMany(data);
    console.log(`✅ Thành công! Đã thêm ${data.length} linh kiện/laptop vào kho với ẢNH THẬT.`);
    process.exit();
})
.catch(err => {
    console.error("❌ Lỗi thực thi:", err);
    process.exit(1);
});
 // 3. EXPORT CHO REACT (Dùng kiểu này để không lỗi Syntax)
if (typeof exports !== 'undefined') {
    exports.danhSachFlashSale = danhSachFlashSale;
}

// 4. LOGIC KẾT NỐI DATABASE (Chỉ chạy khi dùng lệnh 'node')
if (typeof window === 'undefined' && mongoose) {
    mongoose.connect('mongodb://127.0.0.1:27017/pc-builder')
        .then(async () => {
            console.log("🚀 Đang kết nối pc-builder và làm mới kho hàng...");
            if (SanPham) {
                await SanPham.deleteMany({});
                await SanPham.insertMany(danhSachFlashSale);
                console.log(`✅ Thành công! Đã thêm ${danhSachFlashSale.length} linh kiện.`);
            }
            process.exit(0);
        })
        .catch(err => {
            console.error("❌ Lỗi thực thi:", err);
            process.exit(1);
        });
}
