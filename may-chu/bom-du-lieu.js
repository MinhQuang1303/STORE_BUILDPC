const mongoose = require('mongoose');
// Kiểm tra kỹ đường dẫn Model của bạn (thường là src/models/SanPham)
const SanPham = require('./src/models/SanPham'); 

mongoose.connect('mongodb://127.0.0.1:27017/pc-builder')
.then(async () => {
    console.log("🚀 Đang kết nối pc-builder và làm mới kho hàng...");
    await SanPham.deleteMany({}); 

    const data = [
        // --- CPU ---
        { 
            ten: "Intel Core i9-14900K", loai: "CPU", gia: 15500000, 
            anh: "https://nguyencongpc.vn/media/product/25732-b-intel-core-i9-14900k.jpg",
            thongSo: "24 Cores, 32 Threads, 6.0GHz" 
        },
        { 
            ten: "AMD Ryzen 7 7800X3D", loai: "CPU", gia: 10500000, 
            anh: "https://hanoicomputercdn.com/media/product/72223_cpu_amd_ryzen_7_7800x3d.jpg",
            thongSo: "8 Cores, 16 Threads, 3D V-Cache" 
        },
        { 
            ten: "Intel Core i5-13400F", loai: "CPU", gia: 5200000, 
            anh: "https://hanoicomputercdn.com/media/product/70415_cpu_intel_core_i5_13400f.jpg",
            thongSo: "10 Cores, 16 Threads" 
        },

        // --- GPU ---
        { 
            ten: "NVIDIA RTX 4090 ROG Strix", loai: "GPU", gia: 55000000, 
            anh: "https://hanoicomputercdn.com/media/product/67838_vga_asus_rog_strix_geforce_rtx_4090_24gb_gddr6x_0.jpg",
            thongSo: "24GB VRAM GDDR6X" 
        },
        { 
            ten: "NVIDIA RTX 4060 Ti", loai: "GPU", gia: 11500000, 
            anh: "https://hanoicomputercdn.com/media/product/73117_vga_gigabyte_geforce_rtx_4060_ti_gaming_oc_8g.jpg",
            thongSo: "8GB VRAM GDDR6" 
        },

        // --- RAM ---
        { 
            ten: "Corsair Vengeance RGB 32GB", loai: "RAM", gia: 3800000, 
            anh: "https://hanoicomputercdn.com/media/product/65487_ram_corsair_vengeance_rgb_32gb_2x16gb_ddr5_5600mhz_black_1.jpg",
            thongSo: "2x16GB DDR5 6000MHz" 
        },
        { 
            ten: "Kingston FURY Beast 16GB", loai: "RAM", gia: 1250000, 
            anh: "https://hanoicomputercdn.com/media/product/61081_ram_kingston_fury_beast_16gb_1x16gb_ddr4_3200mhz.jpg",
            thongSo: "1x16GB DDR4 3200MHz" 
        },

        // --- MAINBOARD ---
        { 
            ten: "ASUS ROG MAXIMUS Z790", loai: "Mainboard", gia: 18500000, 
            anh: "https://hanoicomputercdn.com/media/product/70125_mainboard_asus_rog_maximus_z790_hero.jpg",
            thongSo: "Socket LGA1700, DDR5" 
        },
        { 
            ten: "MSI MAG B760M Mortar", loai: "Mainboard", gia: 4200000, 
            anh: "https://hanoicomputercdn.com/media/product/70547_mainboard_msi_mag_b760m_mortar_wifi.jpg",
            thongSo: "Chipset B760, m-ATX" 
        },

        // --- SSD ---
        { 
            ten: "Samsung 990 Pro 1TB", loai: "SSD", gia: 2800000, 
            anh: "https://memoryzone.com.vn/media/product/o-cung-ssd-samsung-990-pro-pcie-4-0-nvme-m-2-2280-1tb-mz-v9p1t0bw.jpg",
            thongSo: "NVMe Gen4, Read 7450MB/s" 
        },

        // --- PSU (NGUỒN) ---
        { 
            ten: "Corsair RM1000x 1000W", loai: "PSU", gia: 4500000, 
            anh: "https://hanoicomputercdn.com/media/product/58122_nguon_corsair_rm1000x_80_plus_gold_full_modular.jpg",
            thongSo: "80 Plus Gold, Full Modular" 
        },

        // --- CASE ---
        { 
            ten: "NZXT H9 Flow White", loai: "Case", gia: 4100000, 
            anh: "https://hanoicomputercdn.com/media/product/71448_vo_case_nzxt_h9_flow_white.jpg",
            thongSo: "Mid-Tower, Dual-Chamber" 
        }
    ];

    await SanPham.insertMany(data);
    console.log(`✅ Thành công! Đã thêm ${data.length} linh kiện vào kho.`);
    process.exit();
})
.catch(err => {
    console.error("❌ Lỗi thực thi:", err);
    process.exit(1);
});