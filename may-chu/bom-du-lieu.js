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
// DANH SÁCH 80 SẢN PHẨM (ĐÃ SỬA CHỮ 'anh:' THÀNH 'anh:')
// ================================================================
const danhSachFlashSale = [
    // CPU
    { ten: "Intel Core i9-14900K", loai: "CPU", gia: 15500000, anh: "https://tse2.mm.bing.net/th/id/OIP.npXBd3C4CnFJL77HtxLwXwHaIl?pid=Api&P=0&h=180", thongSo: "24 Cores (8P+16E), 32 Threads, Turbo 6.0GHz, LGA1700" },
    { ten: "Intel Core i9-13900K", loai: "CPU", gia: 13500000, anh: "https://tse1.mm.bing.net/th/id/OIP.pMi7ToFzNO7AYSuAZ7084QHaEc?pid=Api&P=0&h=180", thongSo: "24 Cores (8P+16E), 32 Threads, Turbo 5.8GHz, LGA1700" },
    { ten: "Intel Core i7-14700K", loai: "CPU", gia: 10200000, anh: "https://tse2.mm.bing.net/th/id/OIP.Bu5PUPy2hosEtEXeED0-XAHaIe?pid=Api&P=0&h=180", thongSo: "20 Cores (8P+12E), 28 Threads, Turbo 5.6GHz, LGA1700" },
    { ten: "Intel Core i7-13700K", loai: "CPU", gia: 9500000, anh: "https://tse3.mm.bing.net/th/id/OIP.Q-LbQMyCSWKbeiuAdYXNLwHaEC?pid=Api&P=0&h=180", thongSo: "16 Cores (8P+8E), 24 Threads, Turbo 5.4GHz, LGA1700" },
    { ten: "Intel Core i5-14600K", loai: "CPU", gia: 7200000, anh: "https://tse4.mm.bing.net/th/id/OIP.ZkEOQYlmCTXgYj0yfqyngwHaD4?pid=Api&P=0&h=180", thongSo: "14 Cores (6P+8E), 20 Threads, Turbo 5.3GHz, LGA1700" },
    { ten: "Intel Core i5-13600K", loai: "CPU", gia: 6800000, anh: "https://tse2.mm.bing.net/th/id/OIP.k20Yzni4GcbBxju1ajTOfQHaFj?pid=Api&P=0&h=180", thongSo: "14 Cores (6P+8E), 20 Threads, Turbo 5.1GHz, LGA1700" },
    { ten: "Intel Core i5-13400F", loai: "CPU", gia: 5200000, anh: "https://tse2.mm.bing.net/th/id/OIP.JdBFpLA2XEBob_H-Au3DeAHaFj?pid=Api&P=0&h=180", thongSo: "10 Cores (6P+4E), 16 Threads, Turbo 4.6GHz, LGA1700" },
    { ten: "Intel Core i3-13100F", loai: "CPU", gia: 2800000, anh: "https://tse4.mm.bing.net/th/id/OIP.ZPfQ8kuVdRTvSXOQAbQ4rwHaHa?pid=Api&P=0&h=180", thongSo: "4 Cores, 8 Threads, Turbo 4.5GHz, LGA1700" },
    { ten: "Intel Core i9-12900K", loai: "CPU", gia: 9800000, anh: "https://tse4.mm.bing.net/th/id/OIP.9y_dsR6YdEoGgbeL9fJHvgHaFj?pid=Api&P=0&h=180", thongSo: "16 Cores (8P+8E), 24 Threads, Turbo 5.2GHz, LGA1700" },
    { ten: "Intel Core i7-12700K", loai: "CPU", gia: 7000000, anh: "https://tse4.mm.bing.net/th/id/OIP.NeHlh1Wv6oHb3clDn-kCtAHaFj?pid=Api&P=0&h=180", thongSo: "12 Cores (8P+4E), 20 Threads, Turbo 5.0GHz, LGA1700" },
    { ten: "AMD Ryzen 9 7950X3D", loai: "CPU", gia: 24000000, anh: "https://tse4.mm.bing.net/th/id/OIP.HiO3vf9Vt7b-UjHY1ZpIYAHaFj?pid=Api&P=0&h=180", thongSo: "16 Cores, 32 Threads, Turbo 5.7GHz, 3D V-Cache, AM5" },
    { ten: "AMD Ryzen 9 7900X", loai: "CPU", gia: 10800000, anh: "https://tse3.mm.bing.net/th/id/OIP.0eE3gkzMtMluudaog7NgGAHaGn?pid=Api&P=0&h=180", thongSo: "12 Cores, 24 Threads, Turbo 5.6GHz, AM5" },
    { ten: "AMD Ryzen 7 7800X3D", loai: "CPU", gia: 10500000, anh: "https://tse4.mm.bing.net/th/id/OIP.sEzKOERr3G4q7mGmr50_NQHaEL?pid=Api&P=0&h=180", thongSo: "8 Cores, 16 Threads, Turbo 5.0GHz, 3D V-Cache, AM5" },
    { ten: "AMD Ryzen 7 7700X", loai: "CPU", gia: 7500000, anh: "https://tse4.mm.bing.net/th/id/OIP.sXT_wc8G0OGH3v1Z3bD2GQHaEK?pid=Api&P=0&h=180", thongSo: "8 Cores, 16 Threads, Turbo 5.4GHz, AM5" },
    { ten: "AMD Ryzen 5 7600X", loai: "CPU", gia: 5900000, anh: "https://tse1.mm.bing.net/th/id/OIP.v2CQqwIJ0KZkDvvLMucmVQHaFQ?pid=Api&P=0&h=180", thongSo: "6 Cores, 12 Threads, Turbo 5.3GHz, AM5" },
    { ten: "AMD Ryzen 5 7600", loai: "CPU", gia: 4800000, anh: "https://tse4.mm.bing.net/th/id/OIP.8CT6SBHLA303THKsvo8X7QHaFj?pid=Api&P=0&h=180", thongSo: "6 Cores, 12 Threads, Turbo 5.1GHz, AM5" },
    { ten: "AMD Ryzen 7 5800X3D", loai: "CPU", gia: 6200000, anh: "https://tse4.mm.bing.net/th?id=OIF.Ijtm8IuJM33IJNCq%2fDQD8g&pid=Api&P=0&h=180", thongSo: "8 Cores, 16 Threads, Turbo 4.5GHz, 3D V-Cache, AM4" },
    { ten: "AMD Ryzen 5 5600X", loai: "CPU", gia: 3600000, anh: "https://tse4.mm.bing.net/th/id/OIP.x66LIRmpADYfd8zaDalKBwHaEK?pid=Api&P=0&h=180", thongSo: "6 Cores, 12 Threads, Turbo 4.6GHz, AM4" },
    { ten: "AMD Ryzen 9 5900X", loai: "CPU", gia: 7200000, anh: "https://tse3.mm.bing.net/th/id/OIP.Cwdhna4kNQ_Q0cXfhm-oOwHaFj?pid=Api&P=0&h=180", thongSo: "12 Cores, 24 Threads, Turbo 4.8GHz, AM4" },
    { ten: "AMD Ryzen 5 5500", loai: "CPU", gia: 2500000, anh: "https://tse1.mm.bing.net/th/id/OIP.o2mgloDPGeY4EJsmCTGE3wHaHX?pid=Api&P=0&h=180", thongSo: "6 Cores, 12 Threads, Turbo 4.2GHz, AM4" },

    // GPU
    { ten: "ASUS ROG STRIX RTX 4090 OC 24GB", loai: "VGA", gia: 58000000, anh: "https://tse1.mm.bing.net/th/id/OIP.CG7eCbw6I1ePaUs64qEWPwHaHa?pid=Api&P=0&h=180", thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2640MHz" },
    { ten: "ASUS TUF Gaming RTX 4090 OC 24GB", loai: "VGA", gia: 54000000, anh: "https://tse4.mm.bing.net/th/id/OIP.a1SVhkmNbrfM7-TyGCuFiQHaFF?pid=Api&P=0&h=180", thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2610MHz" },
    { ten: "ASUS ROG STRIX RTX 4080 SUPER OC 16GB", loai: "VGA", gia: 30000000, anh: "https://tse1.mm.bing.net/th/id/OIP.xWf7E8ghXl-ucI-LKRChvQHaHa?pid=Api&P=0&h=180", thongSo: "16GB GDDR6X, 10240 CUDA Cores, Boost 2610MHz" },
    { ten: "ASUS TUF Gaming RTX 4080 OC 16GB", loai: "VGA", gia: 26000000, anh: "https://tse4.mm.bing.net/th/id/OIP.j-hcQedAFUQdWofukMl-DgHaEK?pid=Api&P=0&h=180", thongSo: "16GB GDDR6X, 9728 CUDA Cores, Boost 2580MHz" },
    { ten: "ASUS ROG STRIX RTX 4070 Ti SUPER OC 16GB", loai: "VGA", gia: 22000000, anh: "https://tse1.mm.bing.net/th/id/OIP.qvwQSI3DEJbNfoVCXLClOAHaHa?pid=Api&P=0&h=180", thongSo: "16GB GDDR6X, 8448 CUDA Cores, Boost 2670MHz" },
    { ten: "ASUS TUF Gaming RTX 4070 SUPER OC 12GB", loai: "VGA", gia: 17500000, anh: "https://tse2.mm.bing.net/th/id/OIP.zBDomNG4gekJf0pl5u-1AQHaGa?pid=Api&P=0&h=180", thongSo: "12GB GDDR6X, 7168 CUDA Cores, Boost 2535MHz" },
    { ten: "ASUS ROG STRIX RTX 4070 OC 12GB", loai: "VGA", gia: 16000000, anh: "https://tse1.mm.bing.net/th/id/OIP.0C84ZKRPKh_dqvX715U-uAHaHa?pid=Api&P=0&h=180", thongSo: "12GB GDDR6X, 5888 CUDA Cores, Boost 2565MHz" },
    { ten: "ASUS TUF Gaming RTX 4060 Ti OC 8GB", loai: "VGA", gia: 12000000, anh: "https://tse2.mm.bing.net/th/id/OIP.WKL1KR8amgiemKTp1XWf0wHaHl?pid=Api&P=0&h=180", thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz" },
    { ten: "ASUS TUF Gaming RTX 4060 OC 8GB", loai: "VGA", gia: 8500000, anh: "https://tse3.mm.bing.net/th/id/OIP.v9Un7aehEhWuFtQIdOL9owHaHa?pid=Api&P=0&h=180", thongSo: "8GB GDDR6, 3072 CUDA Cores, Boost 2505MHz" },
    { ten: "MSI GeForce RTX 4090 SUPRIM X 24G", loai: "VGA", gia: 56000000, anh: "https://tse3.mm.bing.net/th/id/OIP.ECO5LhJzoMCm9HW4YYnEhQHaHa?pid=Api&P=0&h=180", thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2625MHz" },
    { ten: "MSI GeForce RTX 4080 GAMING X TRIO 16G", loai: "VGA", gia: 26500000, anh: "https://tse1.mm.bing.net/th/id/OIP.vtJGHP6dV_Sa0zkJnENgtwHaHa?pid=Api&P=0&h=180", thongSo: "16GB GDDR6X, 9728 CUDA Cores, Boost 2580MHz" },
    { ten: "MSI GeForce RTX 4070 GAMING X TRIO 12G", loai: "VGA", gia: 15500000, anh: "https://tse1.mm.bing.net/th/id/OIP.K3HnDdEuDCwTROykz2btaAHaHP?pid=Api&P=0&h=180", thongSo: "12GB GDDR6X, 5888 CUDA Cores, Boost 2535MHz" },
    { ten: "MSI GeForce RTX 4060 Ti GAMING X TRIO 8G", loai: "VGA", gia: 12200000, anh: "https://tse1.mm.bing.net/th/id/OIP.dQCK-8VYngLjaupnNUWNAwHaF7?pid=Api&P=0&h=180", thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz" },
    { ten: "MSI GeForce RTX 4060 GAMING X 8G", loai: "VGA", gia: 9000000, anh: "https://tse1.mm.bing.net/th/id/OIP.8MVAzB3eSclnbDirjZtLpQHaGh?pid=Api&P=0&h=180", thongSo: "8GB GDDR6, 3072 CUDA Cores, Boost 2490MHz" },
    { ten: "Gigabyte RTX 4090 AORUS MASTER 24G", loai: "VGA", gia: 60000000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/9e0f4e1c2a455db2eb76fc8c9551d0d7/Product/30024/Png/2000", thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2640MHz" },
    { ten: "Gigabyte RTX 4080 SUPER GAMING OC 16G", loai: "VGA", gia: 28500000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/fd09b0cbb5e46a7e98f2af41c7f7c04d/Product/32802/Png/2000", thongSo: "16GB GDDR6X, 10240 CUDA Cores, Boost 2595MHz" },
    { ten: "Gigabyte RTX 4070 SUPER GAMING OC 12G", loai: "VGA", gia: 17000000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/c4b9b01aa1a86f99a53b6cd38d1aa6f4/Product/32312/Png/2000", thongSo: "12GB GDDR6X, 7168 CUDA Cores, Boost 2535MHz" },
    { ten: "Gigabyte RTX 4060 Ti GAMING OC 8G", loai: "VGA", gia: 11500000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/9dafe5e6b2f52c8bbfd553c1c24b3d1e/Product/31494/Png/2000", thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz" },
    { ten: "Gigabyte RX 7900 XTX GAMING OC 24G", loai: "VGA", gia: 28000000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/8f92f2e18e88a1bac2dc7b2a1b8bfb72/Product/30527/Png/2000", thongSo: "24GB GDDR6, 6144 SP, Boost 2615MHz" },
    { ten: "Gigabyte RX 7800 XT GAMING OC 16G", loai: "VGA", gia: 13500000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/15ebce03b4dc52b4a2d0b32c66df0b3c/Product/31781/Png/2000", thongSo: "16GB GDDR6, 3840 SP, Boost 2430MHz" },

    // RAM
    { ten: "Corsair Dominator Platinum RGB 32GB DDR5 6000MHz", loai: "RAM", gia: 5500000, anh: "https://tse1.mm.bing.net/th/id/OIP.9zxFjUYrUERqxqQAX5h8YAHaEV?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 6000MHz CL30, RGB" },
    { ten: "Corsair Dominator Titanium RGB 64GB DDR5 6000MHz", loai: "RAM", gia: 8500000, anh: "https://tse3.mm.bing.net/th/id/OIP.tDHUp2z7cLEFi5VGuJyrbAHaEZ?pid=Api&P=0&h=180", thongSo: "2x32GB DDR5 6000MHz CL30, RGB" },
    { ten: "Corsair Vengeance RGB 32GB DDR5 5600MHz", loai: "RAM", gia: 3800000, anh: "https://tse1.mm.bing.net/th/id/OIP.b6wu_CE6UwtIk2v2FS0AEwHaEg?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 5600MHz CL36, RGB" },
    { ten: "Corsair Vengeance RGB Pro 32GB DDR4 3600MHz", loai: "RAM", gia: 2200000, anh: "https://tse1.mm.bing.net/th/id/OIP.e-OolalcpAQepprpPRwbZwHaD2?pid=Api&P=0&h=180", thongSo: "2x16GB DDR4 3600MHz CL18, RGB" },
    { ten: "Corsair Vengeance LPX 16GB DDR4 3200MHz", loai: "RAM", gia: 950000, anh: "https://tse3.mm.bing.net/th/id/OIP.s-CiCOhHhsobAVO_zFpO_AHaHa?pid=Api&P=0&h=180", thongSo: "2x8GB DDR4 3200MHz CL16, Low Profile" },
    { ten: "Corsair Dominator Platinum RGB 32GB DDR4 3600MHz", loai: "RAM", gia: 3200000, anh: "https://tse3.mm.bing.net/th/id/OIP.kZbXUKwFFQ_aNohg_nLl4wHaD4?pid=Api&P=0&h=180", thongSo: "2x16GB DDR4 3600MHz CL18, RGB" },
    { ten: "G.Skill Trident Z5 RGB 32GB DDR5 6000MHz", loai: "RAM", gia: 4200000, anh: "https://tse3.mm.bing.net/th/id/OIP.OxiHwz4hyhB1gWN_uZ2UWQHaFi?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 6000MHz CL30, RGB" },
    { ten: "G.Skill Trident Z5 RGB 64GB DDR5 6000MHz", loai: "RAM", gia: 7200000, anh: "https://tse2.mm.bing.net/th/id/OIP.H1UpCNsbmmCxkgLwmZHbpwHaGC?pid=Api&P=0&h=180", thongSo: "2x32GB DDR5 6000MHz CL30, RGB" },
    { ten: "G.Skill Trident Z5 NEO RGB 32GB DDR5 AMD EXPO", loai: "RAM", gia: 4800000, anh: "https://tse2.mm.bing.net/th/id/OIP._nXSSciGaasctidenPZkVAHaFJ?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 6000MHz CL30, AMD EXPO" },
    { ten: "G.Skill Trident Z RGB 32GB DDR4 3600MHz", loai: "RAM", gia: 2100000, anh: "https://tse3.mm.bing.net/th/id/OIP.REN1hs5esEH6uqxNcdLhOwHaEd?pid=Api&P=0&h=180", thongSo: "2x16GB DDR4 3600MHz CL18, RGB" },
    { ten: "G.Skill Ripjaws V 16GB DDR4 3200MHz", loai: "RAM", gia: 880000, anh: "https://tse4.mm.bing.net/th/id/OIP.AFaE1kd7rHZnvUQuHffJXQHaE1?pid=Api&P=0&h=180", thongSo: "2x8GB DDR4 3200MHz CL16" },
    { ten: "G.Skill Trident Z5 RGB 32GB DDR5 7200MHz", loai: "RAM", gia: 6500000, anh: "https://tse1.mm.bing.net/th/id/OIP.qdHdZA7EvnEJP896GFraaAHaF-?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 7200MHz CL34, RGB" },
    { ten: "Kingston FURY Beast RGB 32GB DDR5 5200MHz", loai: "RAM", gia: 3500000, anh: "https://tse4.mm.bing.net/th/id/OIP.I0LeL9bTOFZbtdBswV67MAHaC6?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 5200MHz CL40, RGB" },
    { ten: "Kingston FURY Renegade RGB 32GB DDR5 6000MHz", loai: "RAM", gia: 4500000, anh: "https://tse3.mm.bing.net/th/id/OIP.5kNVU_xKV13D6WCDA_AnEwHaDk?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 6000MHz CL32, RGB" },
    { ten: "Kingston FURY Beast 32GB DDR4 3200MHz", loai: "RAM", gia: 1800000, anh: "https://tse2.mm.bing.net/th/id/OIP.tQ3Tm-8jjSfMr0XmnDxDAAHaEn?pid=Api&P=0&h=180", thongSo: "2x16GB DDR4 3200MHz CL16" },
    { ten: "Kingston FURY Beast 16GB DDR4 3200MHz", loai: "RAM", gia: 1250000, anh: "https://tse3.mm.bing.net/th/id/OIP.T8B5-aosxC_pf4vrAJxBSwHaEZ?pid=Api&P=0&h=180", thongSo: "1x16GB DDR4 3200MHz CL16" },
    { ten: "Kingston ValueRAM 8GB DDR4 3200MHz", loai: "RAM", gia: 480000, anh: "https://tse4.mm.bing.net/th/id/OIP.WMD6QZNsW9AvIfsWX7iGAgHaHa?pid=Api&P=0&h=180", thongSo: "1x8GB DDR4 3200MHz CL22" },
    { ten: "TeamGroup T-Force Delta RGB 32GB DDR5 5600MHz", loai: "RAM", gia: 3300000, anh: "https://tse2.mm.bing.net/th/id/OIP.ELoVw19fsm8CtIFJ-Dd7KwHaDC?pid=Api&P=0&h=180", thongSo: "2x16GB DDR5 5600MHz CL36, RGB" },
    { ten: "TeamGroup T-Force Delta RGB 64GB DDR5 5600MHz", loai: "RAM", gia: 6200000, anh: "https://tse3.mm.bing.net/th/id/OIP.eWHXqoyOoj-Nmdly2dB49gHaEH?pid=Api&P=0&h=180", thongSo: "2x32GB DDR5 5600MHz CL36, RGB" },
    { ten: "TeamGroup T-Force Vulcan 16GB DDR4 3200MHz", loai: "RAM", gia: 820000, anh: "https://tse1.mm.bing.net/th/id/OIP.aZm7INAcBgsaFsPzcnOgHgHaHa?pid=Api&P=0&h=180", thongSo: "2x8GB DDR4 3200MHz CL16" },

    // MAINBOARD
    { ten: "ASUS ROG MAXIMUS Z790 APEX ENCORE", loai: "Mainboard", gia: 22000000, anh: "https://tse1.mm.bing.net/th/id/OIP.SF2jz8x3VlecjoQm2W7e7wHaHa?pid=Api&P=0&h=180", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 7" },
    { ten: "ASUS ROG MAXIMUS Z790 HERO", loai: "Mainboard", gia: 18500000, anh: "https://tse2.mm.bing.net/th/id/OIP.IAtcLHeTuumxmXdbJG1fHwHaFc?pid=Api&P=0&h=180", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "ASUS ROG STRIX Z790-E GAMING WIFI", loai: "Mainboard", gia: 13500000, anh: "https://tse4.mm.bing.net/th/id/OIP.MLqOuzEOpLL4oN_yCM4WDAHaHY?pid=Api&P=0&h=180", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "ASUS PRIME Z790-P WIFI", loai: "Mainboard", gia: 6200000, anh: "https://tse4.mm.bing.net/th/id/OIP.wo-btyt4O_ZE__Kk5flYwAHaHa?pid=Api&P=0&h=180", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6" },
    { ten: "ASUS TUF Gaming B760-PLUS WIFI D4", loai: "Mainboard", gia: 4200000, anh: "https://tse1.mm.bing.net/th/id/OIP.fpyxdStYforxCjMYeZ-TtwHaGT?pid=Api&P=0&h=180", thongSo: "LGA1700, B760, DDR4, ATX, Wi-Fi 6" },
    { ten: "ASUS ROG CROSSHAIR X670E HERO", loai: "Mainboard", gia: 16000000, anh: "https://tse1.mm.bing.net/th/id/OIP.47PQRy5j1zGL9P-YxYiumgHaId?pid=Api&P=0&h=180", thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E" },
    { ten: "ASUS ROG STRIX B650E-F GAMING WIFI", loai: "Mainboard", gia: 7200000, anh: "https://tse4.mm.bing.net/th/id/OIP.jW0zrXhVs7MaByjWRv8RIwHaHY?pid=Api&P=0&h=180", thongSo: "AM5, B650E, DDR5, ATX, Wi-Fi 6E" },
    { ten: "ASUS PRIME B550M-A WIFI", loai: "Mainboard", gia: 2800000, anh: "https://tse4.mm.bing.net/th/id/OIP.UKJqpTUr1pEUFsscTf2YtwHaJH?pid=Api&P=0&h=180", thongSo: "AM4, B550, DDR4, m-ATX, Wi-Fi 5" },
    { ten: "MSI MEG Z790 ACE", loai: "Mainboard", gia: 17000000, anh: "https://tse4.mm.bing.net/th/id/OIP.fTuE6Tm0D1d4DPC5UT4J-wHaD3?pid=Api&P=0&h=180", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "MSI MAG Z790 TOMAHAWK WIFI DDR5", loai: "Mainboard", gia: 7500000, anh: "https://tse1.mm.bing.net/th/id/OIP.E7kKcOhFy6mHKoEPPHWkNwHaFA?pid=Api&P=0&h=180", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "MSI MAG B760M Mortar WiFi DDR5", loai: "Mainboard", gia: 4200000, anh: "https://tse2.mm.bing.net/th/id/OIP.anfC0IsgjkM-ucTxj6x5KQHaE4?pid=Api&P=0&h=180", thongSo: "LGA1700, B760, DDR5, m-ATX, Wi-Fi 6E" },
    { ten: "MSI MEG X670E ACE", loai: "Mainboard", gia: 15500000, anh: "https://tse1.mm.bing.net/th/id/OIP.0ks07ZEKExM47pfJfRfWEgHaEK?pid=Api&P=0&h=180", thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E" },
    { ten: "MSI MAG B650 TOMAHAWK WIFI", loai: "Mainboard", gia: 5500000, anh: "https://tse2.mm.bing.net/th/id/OIP.AqpElYDDt133S_ed9u0g8gHaES?pid=Api&P=0&h=180", thongSo: "AM5, B650, DDR5, ATX, Wi-Fi 6E" },
    { ten: "MSI MAG B550 TOMAHAWK", loai: "Mainboard", gia: 3200000, anh: "https://tse2.mm.bing.net/th/id/OIP.GJa7wUPnAciWO20YoT5B3gHaHa?pid=Api&P=0&h=180", thongSo: "AM4, B550, DDR4, ATX" },
    { ten: "Gigabyte Z790 AORUS MASTER", loai: "Mainboard", gia: 14000000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/93b3ee23de98a9b6df2f5ea9b27fa7d4/Product/29844/Png/2000", thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E" },
    { ten: "Gigabyte B760M AORUS ELITE AX DDR5", loai: "Mainboard", gia: 3900000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/29e1ad38dfab82af2ef2b2bed95e93f6/Product/30121/Png/2000", thongSo: "LGA1700, B760, DDR5, m-ATX, Wi-Fi 6E" },
    { ten: "Gigabyte H610M S2H V2 DDR4", loai: "Mainboard", gia: 1900000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/ba1f13f4f5c8e7b7a5f7f4c9c63e62f4/Product/29846/Png/2000", thongSo: "LGA1700, H610, DDR4, m-ATX" },
    { ten: "Gigabyte X670E AORUS MASTER", loai: "Mainboard", gia: 13000000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/53c3ed2fe979ddc08c71c30e0a52c0ea/Product/29629/Png/2000", thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E" },
    { ten: "Gigabyte B650M AORUS ELITE AX", loai: "Mainboard", gia: 4500000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/5e9bcb4d7bfaa23cf2fdb5cdac0e13dd/Product/30002/Png/2000", thongSo: "AM5, B650, DDR5, m-ATX, Wi-Fi 6E" },
    { ten: "Gigabyte B550 AORUS PRO AC", loai: "Mainboard", gia: 3800000, anh: "https://static.gigabyte.com/StaticFile/Image/Global/7b2e3e0d8f96fb1b24b5e30a49c1b2ec/Product/23571/Png/2000", thongSo: "AM4, B550, DDR4, ATX, Wi-Fi 6" },

    // VGA
    { ten: "ASUS ROG STRIX RX 7900 XTX OC 24GB", loai: "VGA", gia: 28000000, anh: "https://tse2.mm.bing.net/th/id/OIP.wPSMmKHn7Ysq7AsMthFJEQHaEK?pid=Api&P=0&h=180", thongSo: "24GB GDDR6, 6144 SP, Boost 2615MHz, AMD RDNA3" },
    { ten: "ASUS TUF Gaming RX 7800 XT OC 16GB", loai: "VGA", gia: 13500000, anh: "https://tse4.mm.bing.net/th/id/OIP.7uRJzN6EIQPH1_jV0tuwGwHaGJ?pid=Api&P=0&h=180", thongSo: "16GB GDDR6, 3840 SP, Boost 2430MHz, AMD RDNA3" },
    { ten: "MSI GeForce RTX 3080 GAMING X TRIO 10G", loai: "VGA", gia: 8000000, anh: "https://tse1.mm.bing.net/th/id/OIP.nYhGdMkPifJ3O2W2Tj-0FwHaFj?pid=Api&P=0&h=180", thongSo: "10GB GDDR6X, 8704 CUDA Cores, Boost 1800MHz" },
    { ten: "Gigabyte RTX 3070 GAMING OC 8G", loai: "VGA", gia: 6500000, anh: "https://tse4.mm.bing.net/th/id/OIP.rDfSSuLBj9pFaQlN3LIyywHaE8?pid=Api&P=0&h=180", thongSo: "8GB GDDR6, 5888 CUDA Cores, Boost 1815MHz" },
    { ten: "ASUS TUF RTX 3060 Ti OC 8GB", loai: "VGA", gia: 5500000, anh: "https://tse3.mm.bing.net/th/id/OIP.7mDQ2CjUhRiVMk8xG7HOoAHaGg?pid=Api&P=0&h=180", thongSo: "8GB GDDR6, 4864 CUDA Cores, Boost 1695MHz" },
    { ten: "MSI RX 6700 XT GAMING X 12G", loai: "VGA", gia: 5200000, anh: "https://tse4.mm.bing.net/th/id/OIP.sTgLcEOYh4pqFfhiPYa3UgHaHa?pid=Api&P=0&h=180", thongSo: "12GB GDDR6, 2560 SP, Boost 2581MHz, AMD RDNA2" },
    { ten: "Gigabyte RTX 3060 GAMING OC 12G", loai: "VGA", gia: 4800000, anh: "https://tse1.mm.bing.net/th/id/OIP.c6dYpCGioqKarN1zJlNVrwHaHa?pid=Api&P=0&h=180", thongSo: "12GB GDDR6, 3584 CUDA Cores, Boost 1837MHz" },
    { ten: "ASUS TUF RX 6600 OC 8GB", loai: "VGA", gia: 3800000, anh: "https://tse1.mm.bing.net/th/id/OIP.9T6Qm8bVfg03zM5xtOhMSQHaHa?pid=Api&P=0&h=180", thongSo: "8GB GDDR6, 1792 SP, Boost 2491MHz, AMD RDNA2" },
    { ten: "Gigabyte RTX 4070 Ti SUPER AERO OC 16G", loai: "VGA", gia: 24000000, anh: "https://tse2.mm.bing.net/th/id/OIP.WvK-nUSzLtzvYwXfO5H57QHaHa?w=180&h=180&c=7&r=0&o=5&pid=1.7", thongSo: "16GB GDDR6X, 8448 CUDA Cores" },
    { ten: "MSI GeForce RTX 4070 SUPER VENTUS 3X 12G", loai: "VGA", gia: 18500000, anh: "https://tse2.mm.bing.net/th/id/OIP.oA7YQ0_7z3XhTXXr8K-HjAHaEK?w=289&h=180&c=7&r=0&o=5&pid=1.7", thongSo: "12GB GDDR6X, 7168 CUDA Cores" },
    { ten: "ASUS Dual GeForce RTX 4060 Ti 8GB", loai: "VGA", gia: 11000000, anh: "https://tse1.mm.bing.net/th/id/OIP.8eZ1Z1Xz7_6K4Q5k3mK-_wHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7", thongSo: "8GB GDDR6, 4352 CUDA Cores" },
    { ten: "Gigabyte RX 7600 XT GAMING OC 16G", loai: "VGA", gia: 9500000, anh: "https://tse3.mm.bing.net/th/id/OIP.dI4Z_g_g-w_uW8_gQ_n-gQHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7", thongSo: "16GB GDDR6, 2048 SP" },
    { ten: "ASUS ROG Strix Radeon RX 7600 OC 8GB", loai: "VGA", gia: 8000000, anh: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop", thongSo: "8GB GDDR6, 2048 SP" },
    { ten: "MSI Radeon RX 6650 XT MECH 2X 8G OC", loai: "VGA", gia: 6000000, anh: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop", thongSo: "8GB GDDR6, 2048 SP" },
    { ten: "Gigabyte GeForce RTX 3050 WINDFORCE OC 8G", loai: "VGA", gia: 5500000, anh: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&auto=format&fit=crop", thongSo: "8GB GDDR6, 2560 CUDA Cores" },

    // Ổ CỨNG
    { ten: "Samsung 990 Pro 2TB NVMe PCIe 4.0", loai: "Ổ Cứng", gia: 2800000, anh: "/images/ổ cứng/SSD-Samsung-990-Pro-2TB-M2-PCIe-Gen-5.0-MZ-V9P2T0-hinh-3.jpg", thongSo: "2TB NVMe M.2 PCIe 4.0, Đọc 7450MB/s, Ghi 6900MB/s" },
    { ten: "Samsung 990 Pro 1TB NVMe PCIe 4.0", loai: "Ổ Cứng", gia: 1600000, anh: "/images/ổ cứng/SSD-Samsung-990-Pro-2TB-M2-PCIe-Gen-5.0-MZ-V9P2T0-hinh-3.jpg", thongSo: "1TB NVMe M.2 PCIe 4.0, Đọc 7450MB/s, Ghi 6900MB/s" },
    { ten: "WD Black SN850X 2TB NVMe PCIe 4.0", loai: "Ổ Cứng", gia: 2500000, anh: "/images/ổ cứng/o-cung-ssd-wd-black-sn850x-1tb-m2-pcie-4.0-wds100t2x0e-hinh-6_9fcfa09c0e494107ba661b3a975555e9_grande.png", thongSo: "2TB NVMe M.2 PCIe 4.0, Đọc 7300MB/s, Ghi 6600MB/s" },
    { ten: "Kingston KC3000 1TB NVMe PCIe 4.0", loai: "Ổ Cứng", gia: 1300000, anh: "/images/ổ cứng/ssd-kingston-kc3000-m-2-pcie-gen4-x4-nvme-512gb-skc3000s-512g-bb7cdb62-8f60-490f-bdcc-fe1dad6bea26-png-v-1638607506737.webp", thongSo: "1TB NVMe M.2 PCIe 4.0, Đọc 7000MB/s, Ghi 6000MB/s" },
    { ten: "Samsung 870 EVO 1TB SATA SSD", loai: "Ổ Cứng", gia: 1500000, anh: "/images/ổ cứng/870_evo_2_82353ec61b314d52a2b8f1dbdef73c44_e076c6388c624f0c94e7d8260ce7f0e5_master.jpg", thongSo: "1TB SATA III 2.5 inch, Đọc 560MB/s, Ghi 530MB/s" },
    { ten: "Crucial MX500 1TB SATA SSD", loai: "Ổ Cứng", gia: 1100000, anh: "/images/ổ cứng/ssd-crucial-mx500-1tb-2.5-inch-sata-iii-ct1000mx500ssd1_5f7305cd69a44783ad9474cb0d0f72c7_1024x1024.jpg", thongSo: "1TB SATA III 2.5 inch, Đọc 560MB/s, Ghi 510MB/s" },
    { ten: "Seagate Barracuda 2TB HDD 7200rpm", loai: "Ổ Cứng", gia: 1200000, anh: "/images/ổ cứng/hdd_seagate_baracuda_2tb_gearvn00_28582504c8d24597908c3a73effefa7a_e147c85ec46148acbdc7c7f8a729b68c_master.jpg", thongSo: "2TB HDD 3.5 inch SATA III, 7200RPM, Cache 256MB" },
    { ten: "WD Blue 1TB HDD 7200rpm", loai: "Ổ Cứng", gia: 850000, anh: "/images/ổ cứng/ssd_b0d99e46b0ac482d86f999d8c08fbf98_master.jpg", thongSo: "1TB HDD 3.5 inch SATA III, 7200RPM, Cache 64MB" },
    { ten: "Lexar NM800 Pro 1TB NVMe PCIe 4.0", loai: "Ổ Cứng", gia: 1950000, anh: "/images/ổ cứng/3df0f4e2a08676c088a986062736db45.jpg", thongSo: "1TB NVMe M.2, Đọc 7500MB/s, Ghi 6300MB/s" },
    { ten: "Corsair MP600 PRO XT 2TB NVMe", loai: "Ổ Cứng", gia: 3500000, anh: "/images/ổ cứng/ssd-corsair-mp600-core-xt-m-2-pcie-gen4-x4-nvme-1-b38ef5d9-0ef2-48da-accb-1cadc437ae6c.webp", thongSo: "2TB NVMe M.2 PCIe 4.0, Đọc 7100MB/s" },
    { ten: "AORUS Gen4 7000s Prem. 1TB NVMe", loai: "Ổ Cứng", gia: 2200000, anh: "/images/ổ cứng/ssd_ar_1tb_gen4_7000s-1_7b02b8dafe854ba79783b6741a1b98ef_master.jpg", thongSo: "1TB NVMe M.2 PCIe 4.0, Đọc 7000MB/s" },
    { ten: "Kingston NV2 1TB PCIe 4.0 NVMe", loai: "Ổ Cứng", gia: 1200000, anh: "/images/ổ cứng/thay-o-cung-ssd-kingston-nv2-m2-pcie-gen4-nvme-1tb-snv2s-1000g.webp", thongSo: "1TB NVMe M.2 PCIe 4.0, Đọc 3500MB/s" },
    { ten: "WD Blue SN580 500GB NVMe M.2", loai: "Ổ Cứng", gia: 850000, anh: "/images/ổ cứng/ssd-western-digital-blue-sn580-500gb-pcie-gen4-x4-nvme-m-2-wds500g3b0e-1.webp", thongSo: "500GB NVMe M.2 PCIe 4.0, Đọc 4000MB/s" },
    { ten: "Crucial P3 Plus 1TB PCIe 4.0 NVMe", loai: "Ổ Cứng", gia: 1300000, anh: "/images/ổ cứng/SSD-Crucial-P3-Plus-1TB-PCIe-4.0-3D-NAND-CT1000P3PSSD8-hinh-1.jpg", thongSo: "1TB NVMe M.2 PCIe 4.0, Đọc 5000MB/s" },
    { ten: "Seagate FireCuda 530 1TB NVMe M.2", loai: "Ổ Cứng", gia: 2300000, anh: "/images/ổ cứng/SSD-Seagate-Firecuda-530-1TB-M.2-PCIe-Gen4x4-NVMe-ZP1000GM30013.jpg", thongSo: "1TB NVMe M.2 PCIe 4.0, Đọc 7300MB/s" },

    // NGUỒN
    { ten: "Corsair HX1500i 1500W 80+ Platinum", loai: "Nguồn", gia: 7500000, anh: "/images/Nguồn/83111_nguon_corsair_hx1500i_2023_80_plus_platinum_mau_den_full_modular_x.jpg", thongSo: "1500W, 80+ Platinum, Full Modular, ATX 3.0, PCIe 5.0" },
    { ten: "Corsair RM1000x 1000W 80+ Gold", loai: "Nguồn", gia: 4200000, anh: "/images/Nguồn/9919-nguon-corsair-rm1000x-shift-1000.jpg", thongSo: "1000W, 80+ Gold, Full Modular, Zero RPM Fan Mode" },
    { ten: "Corsair RM850x 850W 80+ Gold", loai: "Nguồn", gia: 3200000, anh: "/images/Nguồn/49780_hugotech_cp_9020270_na122_600x600.jpg", thongSo: "850W, 80+ Gold, Full Modular, Zero RPM Fan Mode" },
    { ten: "Seasonic Focus GX-1000 1000W 80+ Gold", loai: "Nguồn", gia: 4500000, anh: "/images/Nguồn/ngu_n-seasonic-focus-plus-gold_947f103611664c0f91db49fa3498e710_master.jpg", thongSo: "1000W, 80+ Gold, Full Modular, Fanless Mode" },
    { ten: "Seasonic Focus GX-850 850W 80+ Gold", loai: "Nguồn", gia: 3500000, anh: "/images/Nguồn/ngu_n-seasonic-focus-plus-gold_947f103611664c0f91db49fa3498e710_master.jpg", thongSo: "850W, 80+ Gold, Full Modular, Fanless Mode" },
    { ten: "Cooler Master MWE Gold 750W V2", loai: "Nguồn", gia: 1800000, anh: "/images/Nguồn/46850_ngu___n_cooler_master_750w_mwe_750_____v2_80_plus_gold_non_modular__mpe_7501_acaag_eu__h1.jpg", thongSo: "750W, 80+ Gold, Semi Modular, 120mm Fan" },
    { ten: "Thermaltake Smart RGB 600W 80+ Bronze", loai: "Nguồn", gia: 900000, anh: "/images/Nguồn/33282-ngu----n-thermaltake-smart-pro-rgb-750w--80-plus-bronze-1-2.jpg", thongSo: "600W, 80+ Bronze, Non-Modular, RGB Fan 120mm" },
    { ten: "ASUS ROG Thor 1000W Platinum II", loai: "Nguồn", gia: 7500000, anh: "/images/Nguồn/41551_ngu___n_m__y_t__nh_asus_rog_thor_1000p2_1000w_platinum_ii__1_.jpg", thongSo: "1000W, 80+ Platinum, Full Modular, OLED Panel" },
    { ten: "ASUS ROG Strix 850W Gold Aura Edition", loai: "Nguồn", gia: 4500000, anh: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop", thongSo: "850W, 80+ Gold, Full Modular, Aura Sync" },
    { ten: "MSI MPG A850G PCIE5 850W 80 Plus Gold", loai: "Nguồn", gia: 3500000, anh: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop", thongSo: "850W, 80+ Gold, Full Modular, ATX 3.0" },
    { ten: "Gigabyte UD850GM 850W 80 Plus Gold", loai: "Nguồn", gia: 2800000, anh: "/images/Nguồn/ud850gm-pg5-07_compressed_2a47589f92f54033a66dcf3e0d5d16c6_master.jpg", thongSo: "850W, 80+ Gold, Full Modular" },
    { ten: "FSP Hydro G Pro 850W 80 Plus Gold", loai: "Nguồn", gia: 3200000, anh: "/images/Nguồn/85343_nguon_fsp_hydro_g_pro_hg2_850_80_plus_gold_cu_xuoc_tray_kem_modul.jpg", thongSo: "850W, 80+ Gold, Full Modular" },
    { ten: "Corsair CV650 650W 80+ Bronze", loai: "Nguồn", gia: 1200000, anh: "/images/Nguồn/cv650-jpeg.webp", thongSo: "650W, 80+ Bronze, Non-Modular" },
    { ten: "AcBel Tora 600W 80+ Bronze", loai: "Nguồn", gia: 800000, anh: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop", thongSo: "600W, 80+ Bronze, Non-Modular" },
    { ten: "Xigmatek X-Power III 650 600W", loai: "Nguồn", gia: 750000, anh: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop", thongSo: "600W, Standard 80+, Non-Modular" },

    // CASE
    { ten: "Lian Li PC-O11 Dynamic EVO RGB", loai: "Case", gia: 3500000, anh: "/images/Case/80645__lian_li_o11_dynamic_evo_rgb_black___o11dergbx__2_.jpg", thongSo: "Mid Tower ATX, Kính cường lực, Hỗ trợ E-ATX, 420mm Rad" },
    { ten: "ASUS ROG Strix Helios GX601 RGB", loai: "Case", gia: 5500000, anh: "/images/Case/case-asus-rog-strix-helios-rgb-gx601-_-atx-zmnxg_f2a49241d1ab43958e6b1e313b740669_master.jpg", thongSo: "Mid Tower ATX, Kính cường lực, Aura Sync RGB, Tool-free" },
    { ten: "NZXT H9 Elite Mid Tower", loai: "Case", gia: 4200000, anh: "/images/Case/case-nzxt-h7-flow-rgb-black.jpg", thongSo: "Mid Tower ATX/E-ATX, Kính cường lực 4 mặt, 420mm Rad" },
    { ten: "Corsair 5000D Airflow ATX", loai: "Case", gia: 3200000, anh: "/images/Case/Corsair-5000D-AIRFLOW-Tempered-Glass-Mid-Tower-ATX-Case-–-Black-h1.webp", thongSo: "Mid Tower ATX, Luồng khí tối ưu, Kính cường lực, 360mm Rad" },
    { ten: "Cooler Master HAF 500 ATX", loai: "Case", gia: 2200000, anh: "/images/Case/45562_haf500_gallery_8_image.jpg", thongSo: "Mid Tower ATX, 2x200mm ARGB Fan, Kính cường lực, 360mm Rad" },
    { ten: "Phanteks Eclipse P400A DRGB", loai: "Case", gia: 1800000, anh: "/images/Case/1603068871-PH-EC400ATG_DBK01_SYS02-thb.webp", thongSo: "Mid Tower ATX, 3x120mm DRGB Fan, Kính cường lực, 360mm Rad" },
    { ten: "Fractal Design Torrent Compact", loai: "Case", gia: 2800000, anh: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop", thongSo: "Mid Tower ATX, 2x180mm Front Fan, High Airflow" },
    { ten: "Lian Li Lancool 216 RGB Black", loai: "Case", gia: 2500000, anh: "/images/Case/case_lian_li_-_lancool_216___black___white_cao_cap_7ed11726940445e78a64079b6e321ec1_master.jpg", thongSo: "Mid Tower ATX, 2x 160mm ARGB Fans" },
    { ten: "NZXT H7 Flow RGB Black", loai: "Case", gia: 3500000, anh: "/images/Case/case-nzxt-h7-flow-rgb-black.jpg", thongSo: "Mid Tower ATX, Kính cường lực" },
    { ten: "Corsair 4000D Airflow Tempered Glass", loai: "Case", gia: 2000000, anh: "/images/Case/1770_corsair_4000d_airflow_tg_black_1_min.jpg", thongSo: "Mid Tower ATX, Kính cường lực" },
    { ten: "Hyte Y60 Panoramic ATX Black", loai: "Case", gia: 5200000, anh: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop", thongSo: "Mid Tower ATX, Kính cường lực 3 mặt" },
    { ten: "Montech Sky Two ARGB Black", loai: "Case", gia: 2100000, anh: "/images/Case/case-may-tinh-montech-sky-two-argb-black-caskytwoblmt.webp", thongSo: "Mid Tower ATX, Kính cường lực" },
    { ten: "Deepcool CH560 Digital Black", loai: "Case", gia: 2400000, anh: "/images/Case/case-deepcool-ch560-digital-black-_-atx-zttab_768c2ad49cf044f697b40f9ef81c502b_master.jpg", thongSo: "Mid Tower ATX, Kính cường lực" },
    { ten: "Fractal Design Meshify 2 Compact", loai: "Case", gia: 3000000, anh: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop", thongSo: "Mid Tower ATX, Kính cường lực" },
    { ten: "Xigmatek Duke 3F Black", loai: "Case", gia: 700000, anh: "/images/Case/case-xigmatek-duke-3f-en49080.png", thongSo: "Mid Tower ATX, Kính cường lực" },

    // TẢN NHIỆT
    { ten: "Corsair H150i Elite LCD 360mm AIO", loai: "Tản Nhiệt", gia: 6500000, anh: "/images/Tản Nhiệt/44673_t___n_nhi___t_n_____c_corsair_h150i_elite_lcd_xt.jpg", thongSo: "AIO 360mm, 3x120mm ARGB Fan, LCD Display, Intel/AMD" },
    { ten: "Corsair H100i Elite Capellix 240mm AIO", loai: "Tản Nhiệt", gia: 4200000, anh: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=400&auto=format&fit=crop", thongSo: "AIO 240mm, 2x120mm ARGB Fan, iCUE Control, Intel/AMD" },
    { ten: "NZXT Kraken Elite 360 RGB", loai: "Tản Nhiệt", gia: 7200000, anh: "/images/Tản Nhiệt/45665_t___n_nhi___t_n_____c_nzxt_kraken_elite_360_rgb_black__rl_kr36e_b1_apc__1_.jpg", thongSo: "AIO 360mm, LCD Display, 3x120mm RGB Fan, Intel/AMD" },
    { ten: "NZXT Kraken 240 RGB", loai: "Tản Nhiệt", gia: 3500000, anh: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=400&auto=format&fit=crop", thongSo: "AIO 240mm, 2x120mm RGB Fan, Intel LGA1700 / AMD AM5" },
    { ten: "Deepcool LT720 360mm AIO", loai: "Tản Nhiệt", gia: 3800000, anh: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=400&auto=format&fit=crop", thongSo: "AIO 360mm, 3x120mm ARGB Fan, Infinity Mirror Pump" },
    { ten: "Noctua NH-D15 Air Cooler", loai: "Tản Nhiệt", gia: 2200000, anh: "/images/Tản Nhiệt/31998_techzones_noctua_nh_d15_chromax_black.jpg", thongSo: "Air Cooling Tower, 2x140mm Fan, TDP 250W, Intel/AMD" },
    { ten: "be quiet! Dark Rock Pro 4", loai: "Tản Nhiệt", gia: 1800000, anh: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=400&auto=format&fit=crop", thongSo: "Air Cooling Tower, 2x135mm Fan, TDP 250W, Silent Wings" },
    { ten: "Cooler Master Hyper 212 Black Edition", loai: "Tản Nhiệt", gia: 650000, anh: "/images/Tản Nhiệt/_cooler_master_212_black_rgb_edtion_1_ad59d80a40c04493a3debef3c19a0f89_c7146db370a949ec855c235ac3775f0a_master.jpg", thongSo: "Air Cooling Tower, 1x120mm Fan, TDP 180W, Intel/AMD" },
    { ten: "ASUS ROG RYUJIN III 360 ARGB", loai: "Tản Nhiệt", gia: 9000000, anh: "/images/Tản Nhiệt/tan-nhiet-nuoc-aio-asus-rog-ryujin-iii-360-argb-extreme-0.jpg", thongSo: "AIO 360mm, LCD 3.5 inch Display" },
    { ten: "Phanteks Glacier One 360 MPH", loai: "Tản Nhiệt", gia: 4500000, anh: "/images/Tản Nhiệt/8684_glacier_one_360mp_01.jpg", thongSo: "AIO 360mm, Infinity Mirror Pump" },
    { ten: "Thermalright NH-D15 Chromax.black", loai: "Tản Nhiệt", gia: 2800000, anh: "/images/Tản Nhiệt/31998_techzones_noctua_nh_d15_chromax_black.jpg", thongSo: "Air Cooling Tower" },
    { ten: "DeepCool AK620 Digital", loai: "Tản Nhiệt", gia: 1600000, anh: "/images/Tản Nhiệt/tan-nhiet-khi-deepcool-ak620-digital-r-ak620-bkadmn-g-1-4d663d30-eb6c-442a-b108-08b0fa08bdac.webp", thongSo: "Air Cooling Tower, Digital Display" },
    { ten: "Thermalright Peerless Assassin 120 SE", loai: "Tản Nhiệt", gia: 1000000, anh: "/images/Tản Nhiệt/72070-thermalright-peerless-assassin-120-se-1.webp", thongSo: "Air Cooling Tower" },
    { ten: "ID-COOLING SE-207-XT BLACK", loai: "Tản Nhiệt", gia: 800000, anh: "/images/Tản Nhiệt/tan-nhiet-cpu-id-cooling-se-207-xt-argb-black8_35ab0d982b99497d9ad83f1882c31c26_master.jpg", thongSo: "Air Cooling Tower" },
    { ten: "Jonsbo CR-1000 EVO ARGB Black", loai: "Tản Nhiệt", gia: 400000, anh: "/images/Tản Nhiệt/46215_t___n_nhi___t_kh___jonsbo_cr_1000_evo_black__color_rgb___1_.jpg", thongSo: "Air Cooling Tower" },
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
        console.log("🧹 Đã làm sạch Danh mục, Sản phẩm và Đơn hàng cũ.");

        // =======================
        // 2. TẠO DANH MỤC TRƯỚC
        // =======================
        const categories = await DanhMuc.insertMany([
            { ten: "CPU", moTa: "Danh mục CPU" },
            { ten: "RAM", moTa: "Danh mục RAM" },
            { ten: "Mainboard", moTa: "Danh mục Mainboard" },
            { ten: "VGA", moTa: "Danh mục VGA" },
            { ten: "Ổ Cứng", moTa: "Danh mục Ổ Cứng (SSD/HDD)" },
            { ten: "Nguồn", moTa: "Danh mục Nguồn máy tính (PSU)" },
            { ten: "Case", moTa: "Danh mục Case (Vỏ máy tính)" },
            { ten: "Tản Nhiệt", moTa: "Danh mục Tản Nhiệt CPU" },
        ]);
        console.log("✅ Đã tạo Danh mục.");

        const categoryMap = {};
        categories.forEach(c => {
            categoryMap[c.ten] = c._id;
        });

        // =======================
        // 3. THÊM SẢN PHẨM 
        // =======================
        const dataWithCategory = danhSachFlashSale.map(item => ({
            ...item,
            idDanhMuc: categoryMap[item.loai] || categoryMap["CPU"], // Default to CPU if not found
            soLuong: 50,
            daBan: 0
        }));

        const insertedProducts = await SanPham.insertMany(dataWithCategory);
        console.log(`✅ Đã thêm ${insertedProducts.length} sản phẩm.`);

        await BienThe.deleteMany({});
        const variantsToInsert = [];
        insertedProducts.forEach((product) => {
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
            } else if (catName === "VGA" || catName === "GPU") {
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
