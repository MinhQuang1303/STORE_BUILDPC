const mongoose = typeof window === 'undefined' ? eval('require("mongoose")') : null;
const SanPham = typeof window === 'undefined' ? eval('require("./src/models/SanPham")') : null;

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

        // ================================================================
        // GPU (20 sản phẩm) — ảnh từ ASUS, MSI, Gigabyte chính thức
        // ================================================================
        {
            ten: "ASUS ROG STRIX RTX 4090 OC 24GB",
            loai: "GPU", gia: 58000000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.CG7eCbw6I1ePaUs64qEWPwHaHa?pid=Api&P=0&h=180",
            thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2640MHz"
        },
        {
            ten: "ASUS TUF Gaming RTX 4090 OC 24GB",
            loai: "GPU", gia: 54000000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.a1SVhkmNbrfM7-TyGCuFiQHaFF?pid=Api&P=0&h=180",
            thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2610MHz"
        },
        {
            ten: "ASUS ROG STRIX RTX 4080 SUPER OC 16GB",
            loai: "GPU", gia: 30000000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.xWf7E8ghXl-ucI-LKRChvQHaHa?pid=Api&P=0&h=180",
            thongSo: "16GB GDDR6X, 10240 CUDA Cores, Boost 2610MHz"
        },
        {
            ten: "ASUS TUF Gaming RTX 4080 OC 16GB",
            loai: "GPU", gia: 26000000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.j-hcQedAFUQdWofukMl-DgHaEK?pid=Api&P=0&h=180",
            thongSo: "16GB GDDR6X, 9728 CUDA Cores, Boost 2580MHz"
        },
        {
            ten: "ASUS ROG STRIX RTX 4070 Ti SUPER OC 16GB",
            loai: "GPU", gia: 22000000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.qvwQSI3DEJbNfoVCXLClOAHaHa?pid=Api&P=0&h=180",
            thongSo: "16GB GDDR6X, 8448 CUDA Cores, Boost 2670MHz"
        },
        {
            ten: "ASUS TUF Gaming RTX 4070 SUPER OC 12GB",
            loai: "GPU", gia: 17500000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.zBDomNG4gekJf0pl5u-1AQHaGa?pid=Api&P=0&h=180",
            thongSo: "12GB GDDR6X, 7168 CUDA Cores, Boost 2535MHz"
        },
        {
            ten: "ASUS ROG STRIX RTX 4070 OC 12GB",
            loai: "GPU", gia: 16000000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.0C84ZKRPKh_dqvX715U-uAHaHa?pid=Api&P=0&h=180",
            thongSo: "12GB GDDR6X, 5888 CUDA Cores, Boost 2565MHz"
        },
        {
            ten: "ASUS TUF Gaming RTX 4060 Ti OC 8GB",
            loai: "GPU", gia: 12000000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.WKL1KR8amgiemKTp1XWf0wHaHl?pid=Api&P=0&h=180",
            thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz"
        },
        {
            ten: "ASUS TUF Gaming RTX 4060 OC 8GB",
            loai: "GPU", gia: 8500000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.v9Un7aehEhWuFtQIdOL9owHaHa?pid=Api&P=0&h=180",
            thongSo: "8GB GDDR6, 3072 CUDA Cores, Boost 2505MHz"
        },
        {
            ten: "MSI GeForce RTX 4090 SUPRIM X 24G",
            loai: "GPU", gia: 56000000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.ECO5LhJzoMCm9HW4YYnEhQHaHa?pid=Api&P=0&h=180",
            thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2625MHz"
        },
        {
            ten: "MSI GeForce RTX 4080 GAMING X TRIO 16G",
            loai: "GPU", gia: 26500000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.vtJGHP6dV_Sa0zkJnENgtwHaHa?pid=Api&P=0&h=180",
            thongSo: "16GB GDDR6X, 9728 CUDA Cores, Boost 2580MHz"
        },
        {
            ten: "MSI GeForce RTX 4070 GAMING X TRIO 12G",
            loai: "GPU", gia: 15500000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.K3HnDdEuDCwTROykz2btaAHaHP?pid=Api&P=0&h=180",
            thongSo: "12GB GDDR6X, 5888 CUDA Cores, Boost 2535MHz"
        },
        {
            ten: "MSI GeForce RTX 4060 Ti GAMING X TRIO 8G",
            loai: "GPU", gia: 12200000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.dQCK-8VYngLjaupnNUWNAwHaF7?pid=Api&P=0&h=180",
            thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz"
        },
        {
            ten: "MSI GeForce RTX 4060 GAMING X 8G",
            loai: "GPU", gia: 9000000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.8MVAzB3eSclnbDirjZtLpQHaGh?pid=Api&P=0&h=180",
            thongSo: "8GB GDDR6, 3072 CUDA Cores, Boost 2490MHz"
        },
        {
            ten: "Gigabyte RTX 4090 AORUS MASTER 24G",
            loai: "GPU", gia: 60000000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/9e0f4e1c2a455db2eb76fc8c9551d0d7/Product/30024/Png/2000",
            thongSo: "24GB GDDR6X, 16384 CUDA Cores, Boost 2640MHz"
        },
        {
            ten: "Gigabyte RTX 4080 SUPER GAMING OC 16G",
            loai: "GPU", gia: 28500000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/fd09b0cbb5e46a7e98f2af41c7f7c04d/Product/32802/Png/2000",
            thongSo: "16GB GDDR6X, 10240 CUDA Cores, Boost 2595MHz"
        },
        {
            ten: "Gigabyte RTX 4070 SUPER GAMING OC 12G",
            loai: "GPU", gia: 17000000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/c4b9b01aa1a86f99a53b6cd38d1aa6f4/Product/32312/Png/2000",
            thongSo: "12GB GDDR6X, 7168 CUDA Cores, Boost 2535MHz"
        },
        {
            ten: "Gigabyte RTX 4060 Ti GAMING OC 8G",
            loai: "GPU", gia: 11500000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/9dafe5e6b2f52c8bbfd553c1c24b3d1e/Product/31494/Png/2000",
            thongSo: "8GB GDDR6, 4352 CUDA Cores, Boost 2595MHz"
        },
        {
            ten: "Gigabyte RX 7900 XTX GAMING OC 24G",
            loai: "GPU", gia: 28000000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/8f92f2e18e88a1bac2dc7b2a1b8bfb72/Product/30527/Png/2000",
            thongSo: "24GB GDDR6, 6144 SP, Boost 2615MHz"
        },
        {
            ten: "Gigabyte RX 7800 XT GAMING OC 16G",
            loai: "GPU", gia: 13500000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/15ebce03b4dc52b4a2d0b32c66df0b3c/Product/31781/Png/2000",
            thongSo: "16GB GDDR6, 3840 SP, Boost 2430MHz"
        },

        // ================================================================
        // RAM (20 sản phẩm) — ảnh từ Corsair, G.Skill, Kingston chính thức
        // ================================================================
        {
            ten: "Corsair Dominator Platinum RGB 32GB DDR5 6000MHz",
            loai: "RAM", gia: 5500000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.9zxFjUYrUERqxqQAX5h8YAHaEV?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR5 6000MHz CL30, RGB"
        },
        {
            ten: "Corsair Dominator Titanium RGB 64GB DDR5 6000MHz",
            loai: "RAM", gia: 8500000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.tDHUp2z7cLEFi5VGuJyrbAHaEZ?pid=Api&P=0&h=180",
            thongSo: "2x32GB DDR5 6000MHz CL30, RGB"
        },
        {
            ten: "Corsair Vengeance RGB 32GB DDR5 5600MHz",
            loai: "RAM", gia: 3800000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.b6wu_CE6UwtIk2v2FS0AEwHaEg?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR5 5600MHz CL36, RGB"
        },
        {
            ten: "Corsair Vengeance RGB Pro 32GB DDR4 3600MHz",
            loai: "RAM", gia: 2200000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.e-OolalcpAQepprpPRwbZwHaD2?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR4 3600MHz CL18, RGB"
        },
        {
            ten: "Corsair Vengeance LPX 16GB DDR4 3200MHz",
            loai: "RAM", gia: 950000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.s-CiCOhHhsobAVO_zFpO_AHaHa?pid=Api&P=0&h=180",
            thongSo: "2x8GB DDR4 3200MHz CL16, Low Profile"
        },
        {
            ten: "Corsair Dominator Platinum RGB 32GB DDR4 3600MHz",
            loai: "RAM", gia: 3200000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.kZbXUKwFFQ_aNohg_nLl4wHaD4?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR4 3600MHz CL18, RGB"
        },
        {
            ten: "G.Skill Trident Z5 RGB 32GB DDR5 6000MHz",
            loai: "RAM", gia: 4200000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.OxiHwz4hyhB1gWN_uZ2UWQHaFi?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR5 6000MHz CL30, RGB"
        },
        {
            ten: "G.Skill Trident Z5 RGB 64GB DDR5 6000MHz",
            loai: "RAM", gia: 7200000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.H1UpCNsbmmCxkgLwmZHbpwHaGC?pid=Api&P=0&h=180",
            thongSo: "2x32GB DDR5 6000MHz CL30, RGB"
        },
        {
            ten: "G.Skill Trident Z5 NEO RGB 32GB DDR5 AMD EXPO",
            loai: "RAM", gia: 4800000,
            anh: "https://tse2.mm.bing.net/th/id/OIP._nXSSciGaasctidenPZkVAHaFJ?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR5 6000MHz CL30, AMD EXPO"
        },
        {
            ten: "G.Skill Trident Z RGB 32GB DDR4 3600MHz",
            loai: "RAM", gia: 2100000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.REN1hs5esEH6uqxNcdLhOwHaEd?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR4 3600MHz CL18, RGB"
        },
        {
            ten: "G.Skill Ripjaws V 16GB DDR4 3200MHz",
            loai: "RAM", gia: 880000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.AFaE1kd7rHZnvUQuHffJXQHaE1?pid=Api&P=0&h=180",
            thongSo: "2x8GB DDR4 3200MHz CL16"
        },
        {
            ten: "G.Skill Trident Z5 RGB 32GB DDR5 7200MHz",
            loai: "RAM", gia: 6500000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.qdHdZA7EvnEJP896GFraaAHaF-?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR5 7200MHz CL34, RGB"
        },
        {
            ten: "Kingston FURY Beast RGB 32GB DDR5 5200MHz",
            loai: "RAM", gia: 3500000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.I0LeL9bTOFZbtdBswV67MAHaC6?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR5 5200MHz CL40, RGB"
        },
        {
            ten: "Kingston FURY Renegade RGB 32GB DDR5 6000MHz",
            loai: "RAM", gia: 4500000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.5kNVU_xKV13D6WCDA_AnEwHaDk?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR5 6000MHz CL32, RGB"
        },
        {
            ten: "Kingston FURY Beast 32GB DDR4 3200MHz",
            loai: "RAM", gia: 1800000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.tQ3Tm-8jjSfMr0XmnDxDAAHaEn?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR4 3200MHz CL16"
        },
        {
            ten: "Kingston FURY Beast 16GB DDR4 3200MHz",
            loai: "RAM", gia: 1250000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.T8B5-aosxC_pf4vrAJxBSwHaEZ?pid=Api&P=0&h=180",
            thongSo: "1x16GB DDR4 3200MHz CL16"
        },
        {
            ten: "Kingston ValueRAM 8GB DDR4 3200MHz",
            loai: "RAM", gia: 480000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.WMD6QZNsW9AvIfsWX7iGAgHaHa?pid=Api&P=0&h=180",
            thongSo: "1x8GB DDR4 3200MHz CL22"
        },
        {
            ten: "TeamGroup T-Force Delta RGB 32GB DDR5 5600MHz",
            loai: "RAM", gia: 3300000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.ELoVw19fsm8CtIFJ-Dd7KwHaDC?pid=Api&P=0&h=180",
            thongSo: "2x16GB DDR5 5600MHz CL36, RGB"
        },
        {
            ten: "TeamGroup T-Force Delta RGB 64GB DDR5 5600MHz",
            loai: "RAM", gia: 6200000,
            anh: "https://tse3.mm.bing.net/th/id/OIP.eWHXqoyOoj-Nmdly2dB49gHaEH?pid=Api&P=0&h=180",
            thongSo: "2x32GB DDR5 5600MHz CL36, RGB"
        },
        {
            ten: "TeamGroup T-Force Vulcan 16GB DDR4 3200MHz",
            loai: "RAM", gia: 820000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.aZm7INAcBgsaFsPzcnOgHgHaHa?pid=Api&P=0&h=180",
            thongSo: "2x8GB DDR4 3200MHz CL16"
        },

        // ================================================================
        // MAINBOARD (20 sản phẩm) — ảnh từ ASUS, MSI, Gigabyte chính thức
        // ================================================================
        {
            ten: "ASUS ROG MAXIMUS Z790 APEX ENCORE",
            loai: "Mainboard", gia: 22000000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.SF2jz8x3VlecjoQm2W7e7wHaHa?pid=Api&P=0&h=180",
            thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 7"
        },
        {
            ten: "ASUS ROG MAXIMUS Z790 HERO",
            loai: "Mainboard", gia: 18500000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.IAtcLHeTuumxmXdbJG1fHwHaFc?pid=Api&P=0&h=180",
            thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "ASUS ROG STRIX Z790-E GAMING WIFI",
            loai: "Mainboard", gia: 13500000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.MLqOuzEOpLL4oN_yCM4WDAHaHY?pid=Api&P=0&h=180",
            thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "ASUS PRIME Z790-P WIFI",
            loai: "Mainboard", gia: 6200000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.wo-btyt4O_ZE__Kk5flYwAHaHa?pid=Api&P=0&h=180",
            thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6"
        },
        {
            ten: "ASUS TUF Gaming B760-PLUS WIFI D4",
            loai: "Mainboard", gia: 4200000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.fpyxdStYforxCjMYeZ-TtwHaGT?pid=Api&P=0&h=180",
            thongSo: "LGA1700, B760, DDR4, ATX, Wi-Fi 6"
        },
        {
            ten: "ASUS ROG CROSSHAIR X670E HERO",
            loai: "Mainboard", gia: 16000000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.47PQRy5j1zGL9P-YxYiumgHaId?pid=Api&P=0&h=180",
            thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "ASUS ROG STRIX B650E-F GAMING WIFI",
            loai: "Mainboard", gia: 7200000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.jW0zrXhVs7MaByjWRv8RIwHaHY?pid=Api&P=0&h=180",
            thongSo: "AM5, B650E, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "ASUS PRIME B550M-A WIFI",
            loai: "Mainboard", gia: 2800000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.UKJqpTUr1pEUFsscTf2YtwHaJH?pid=Api&P=0&h=180",
            thongSo: "AM4, B550, DDR4, m-ATX, Wi-Fi 5"
        },
        {
            ten: "MSI MEG Z790 ACE",
            loai: "Mainboard", gia: 17000000,
            anh: "https://tse4.mm.bing.net/th/id/OIP.fTuE6Tm0D1d4DPC5UT4J-wHaD3?pid=Api&P=0&h=180",
            thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "MSI MAG Z790 TOMAHAWK WIFI DDR5",
            loai: "Mainboard", gia: 7500000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.E7kKcOhFy6mHKoEPPHWkNwHaFA?pid=Api&P=0&h=180",
            thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "MSI MAG B760M Mortar WiFi DDR5",
            loai: "Mainboard", gia: 4200000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.anfC0IsgjkM-ucTxj6x5KQHaE4?pid=Api&P=0&h=180",
            thongSo: "LGA1700, B760, DDR5, m-ATX, Wi-Fi 6E"
        },
        {
            ten: "MSI MEG X670E ACE",
            loai: "Mainboard", gia: 15500000,
            anh: "https://tse1.mm.bing.net/th/id/OIP.0ks07ZEKExM47pfJfRfWEgHaEK?pid=Api&P=0&h=180",
            thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "MSI MAG B650 TOMAHAWK WIFI",
            loai: "Mainboard", gia: 5500000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.AqpElYDDt133S_ed9u0g8gHaES?pid=Api&P=0&h=180",
            thongSo: "AM5, B650, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "MSI MAG B550 TOMAHAWK",
            loai: "Mainboard", gia: 3200000,
            anh: "https://tse2.mm.bing.net/th/id/OIP.GJa7wUPnAciWO20YoT5B3gHaHa?pid=Api&P=0&h=180",
            thongSo: "AM4, B550, DDR4, ATX"
        },
        {
            ten: "Gigabyte Z790 AORUS MASTER",
            loai: "Mainboard", gia: 14000000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/93b3ee23de98a9b6df2f5ea9b27fa7d4/Product/29844/Png/2000",
            thongSo: "LGA1700, Z790, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "Gigabyte B760M AORUS ELITE AX DDR5",
            loai: "Mainboard", gia: 3900000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/29e1ad38dfab82af2ef2b2bed95e93f6/Product/30121/Png/2000",
            thongSo: "LGA1700, B760, DDR5, m-ATX, Wi-Fi 6E"
        },
        {
            ten: "Gigabyte H610M S2H V2 DDR4",
            loai: "Mainboard", gia: 1900000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/ba1f13f4f5c8e7b7a5f7f4c9c63e62f4/Product/29846/Png/2000",
            thongSo: "LGA1700, H610, DDR4, m-ATX"
        },
        {
            ten: "Gigabyte X670E AORUS MASTER",
            loai: "Mainboard", gia: 13000000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/53c3ed2fe979ddc08c71c30e0a52c0ea/Product/29629/Png/2000",
            thongSo: "AM5, X670E, DDR5, ATX, Wi-Fi 6E"
        },
        {
            ten: "Gigabyte B650M AORUS ELITE AX",
            loai: "Mainboard", gia: 4500000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/5e9bcb4d7bfaa23cf2fdb5cdac0e13dd/Product/30002/Png/2000",
            thongSo: "AM5, B650, DDR5, m-ATX, Wi-Fi 6E"
        },
        {
            ten: "Gigabyte B550 AORUS PRO AC",
            loai: "Mainboard", gia: 3800000,
            anh: "https://static.gigabyte.com/StaticFile/Image/Global/7b2e3e0d8f96fb1b24b5e30a49c1b2ec/Product/23571/Png/2000",
            thongSo: "AM4, B550, DDR4, ATX, Wi-Fi 6"
        },
    ];

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