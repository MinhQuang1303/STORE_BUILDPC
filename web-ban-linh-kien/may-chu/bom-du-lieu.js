const mongoose = require('mongoose');
// Đảm bảo đường dẫn này đúng với file model của bạn
const SanPham = require('./src/mo-hinh/SanPham'); 

mongoose.connect('mongodb://127.0.0.1:27017/pc-builder')
.then(async () => {
    console.log("🚀 Đang kết nối pc-builder và bơm dữ liệu...");
    await SanPham.deleteMany({}); // Xóa dữ liệu cũ để làm mới

    const data = [
        { 
            ten: "Intel Core i9-14900K", loai: "CPU", gia: 15500000, 
            anh: "https://nguyencongpc.vn/media/product/25732-b-intel-core-i9-14900k.jpg",
            thongSo: "24 Cores, 32 Threads" 
        },
        { 
            ten: "NVIDIA RTX 4090", loai: "GPU", gia: 55000000, 
            anh: "https://hanoicomputercdn.com/media/product/67838_vga_asus_rog_strix_geforce_rtx_4090_24gb_gddr6x_0.jpg",
            thongSo: "24GB VRAM GDDR6X" 
        },
        { 
            ten: "Samsung 990 Pro 1TB", loai: "SSD", gia: 2800000, 
            anh: "https://memoryzone.com.vn/media/product/o-cung-ssd-samsung-990-pro-pcie-4-0-nvme-m-2-2280-1tb-mz-v9p1t0bw.jpg",
            thongSo: "Read 7450MB/s" 
        },
        { 
            ten: "Corsair Vengeance RGB 32GB", loai: "RAM", gia: 3800000, 
            anh: "https://hanoicomputercdn.com/media/product/65487_ram_corsair_vengeance_rgb_32gb_2x16gb_ddr5_5600mhz_black_1.jpg",
            thongSo: "DDR5 6000MHz" 
        }
    ];

    await SanPham.insertMany(data);
    console.log("✅ Đã bơm dữ liệu thành công!");
    process.exit();
})
.catch(err => {
    console.error("❌ Lỗi rồi:", err);
    process.exit(1);
});