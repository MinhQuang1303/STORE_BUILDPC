USE pc_builder;
-- CHẠY LỆNH NÀY SẼ DỌN DẸP DỮ LIỆU CŨ NẾU CẦN THIẾT
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE danh_gia;
-- TRUNCATE TABLE bien_the;
-- TRUNCATE TABLE san_pham;
-- TRUNCATE TABLE danh_muc;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. USERS
-- ==========================================
INSERT IGNORE INTO users (created_at, updated_at, username, email, password, role, full_name, phone, address, gender) VALUES 
(NOW(), NOW(), 'admin', 'admin@storebuildpc.com', '$2a$10$wT.fA37kK9rLMy.44Bpw1ey1/O1EpsDSt3r.F5p6M5Zk.P2/j2Bnm', 'admin', 'Quản Trị Viên', '0901234567', 'Quận 1, TP.HCM', 'Nam'),
(NOW(), NOW(), 'nguyenvana', 'nga@gmail.com', '$2a$10$wT.fA37kK9rLMy.44Bpw1ey1/O1EpsDSt3r.F5p6M5Zk.P2/j2Bnm', 'user', 'Nguyễn Văn A', '0988776655', 'Quận 3, TP.HCM', 'Nam'),
(NOW(), NOW(), 'tranthib', 'tranthib@gmail.com', '$2a$10$wT.fA37kK9rLMy.44Bpw1ey1/O1EpsDSt3r.F5p6M5Zk.P2/j2Bnm', 'user', 'Trần Thị B', '0912345678', 'Hà Nội', 'Nữ'),
(NOW(), NOW(), 'leduc', 'leduc@gmail.com', '$2a$10$wT.fA37kK9rLMy.44Bpw1ey1/O1EpsDSt3r.F5p6M5Zk.P2/j2Bnm', 'user', 'Lê Đức', '0977441122', 'Đà Nẵng', 'Nam');

-- ==========================================
-- 2. DANH MỤC LỚN ĐẦY ĐỦ
-- ==========================================
INSERT IGNORE INTO danh_muc (created_at, updated_at, ten, mo_ta) VALUES
(NOW(), NOW(), 'CPU - Vi xử lý', 'Trái tim của hệ thống PC'),
(NOW(), NOW(), 'VGA - Card màn hình', 'Sức mạnh đồ họa vô song'),
(NOW(), NOW(), 'Mainboard - Bo mạch chủ', 'Kết nối mọi thành phần linh kiện'),
(NOW(), NOW(), 'RAM - Bộ nhớ trong', 'Xử lý đa nhiệm mượt mà'),
(NOW(), NOW(), 'Ổ cứng SSD/HDD', 'Lưu trữ cực nhanh và an toàn'),
(NOW(), NOW(), 'Nguồn máy tính (PSU)', 'Cấp năng lượng ổn định bền bỉ'),
(NOW(), NOW(), 'Tản nhiệt', 'Làm mát hiệu quả cho CPU/VGA'),
(NOW(), NOW(), 'Vỏ Case', 'Thiết kế đẹp mắt, tối ưu luồng gió'),
(NOW(), NOW(), 'Màn hình máy tính', 'Hiển thị sắc nét, tần số quét cao'),
(NOW(), NOW(), 'Gear - Phím, Chuột, Tai nghe', 'Thiết bị ngoại vi Gaming');

-- Biến lưu trữ ID để tránh lỗi AUTO_INCREMENT
SET @idCPU = (SELECT id FROM danh_muc WHERE ten = 'CPU - Vi xử lý' LIMIT 1);
SET @idVGA = (SELECT id FROM danh_muc WHERE ten = 'VGA - Card màn hình' LIMIT 1);
SET @idMB = (SELECT id FROM danh_muc WHERE ten = 'Mainboard - Bo mạch chủ' LIMIT 1);
SET @idRAM = (SELECT id FROM danh_muc WHERE ten = 'RAM - Bộ nhớ trong' LIMIT 1);
SET @idSSD = (SELECT id FROM danh_muc WHERE ten = 'Ổ cứng SSD/HDD' LIMIT 1);
SET @idPSU = (SELECT id FROM danh_muc WHERE ten = 'Nguồn máy tính (PSU)' LIMIT 1);
SET @idCooler = (SELECT id FROM danh_muc WHERE ten = 'Tản nhiệt' LIMIT 1);
SET @idCase = (SELECT id FROM danh_muc WHERE ten = 'Vỏ Case' LIMIT 1);
SET @idMonitor = (SELECT id FROM danh_muc WHERE ten = 'Màn hình máy tính' LIMIT 1);
SET @idGear = (SELECT id FROM danh_muc WHERE ten = 'Gear - Phím, Chuột, Tai nghe' LIMIT 1);

-- ==========================================
-- 3. SẢN PHẨM KHỔNG LỒ
-- ==========================================
INSERT IGNORE INTO san_pham (created_at, updated_at, ten, gia, thong_so, so_luong, da_ban, anh, hinh_anh_khac, id_danh_muc) VALUES
-- CPU 
(NOW(), NOW(), 'CPU Intel Core i9-14900K', 15500000, 'Socket: LGA 1700, Số nhân: 24, Số luồng: 32, Xung nhịp: 6.0 GHz, TDP: 125W', 50, 15, 'https://hanoicomputercdn.com/media/product/73814_cpu_intel_core_i9_14900k_.jpg', '', @idCPU),
(NOW(), NOW(), 'CPU Intel Core i5-13400F', 5100000, 'Socket: LGA 1700, Số nhân: 10, Số luồng: 16, Xung nhịp: 4.6 GHz, TDP: 65W', 120, 40, 'https://hanoicomputercdn.com/media/product/69595_cpu_intel_core_i5_13400f.jpg', '', @idCPU),
(NOW(), NOW(), 'CPU AMD Ryzen 9 7950X3D', 18900000, 'Socket: AM5, Số nhân: 16, Số luồng: 32, Xung nhịp: 5.7 GHz, Cache: 128MB', 30, 8, 'https://hanoicomputercdn.com/media/product/69389_cpu_amd_ryzen_9_7950x3d_1.jpg', '', @idCPU),
(NOW(), NOW(), 'CPU AMD Ryzen 5 7600X', 6150000, 'Socket: AM5, Số nhân: 6, Số luồng: 12, Xung nhịp: 5.3 GHz, TDP: 105W', 80, 20, 'https://hanoicomputercdn.com/media/product/69209_cpu_amd_ryzen_5_7600x_1.jpg', '', @idCPU),

-- VGA
(NOW(), NOW(), 'NVIDIA GeForce RTX 4090 24GB ROG Strix', 55000000, 'VRAM: 24GB GDDR6X, Chân cắm: PCIe 4.0, Nguồn yêu cầu: 1000W', 15, 2, 'https://hanoicomputercdn.com/media/product/69107_vga_asus_rog_strix_rtx_4090_o24g_eva_02_edition_3.jpg', '', @idVGA),
(NOW(), NOW(), 'GIGABYTE GeForce RTX 4060 Ti AERO 8G', 12900000, 'VRAM: 8GB GDDR6, Màu: Trắng tinh khôi, Nguồn yêu cầu: 500W', 45, 12, 'https://hanoicomputercdn.com/media/product/69123_vga_gigabyte_geforce_rtx_4060_ti_aero_oc_8g_2.jpg', '', @idVGA),
(NOW(), NOW(), 'ASUS TUF Gaming Radeon RX 7900 XTX 24GB', 28500000, 'VRAM: 24GB GDDR6, Giao tiếp: PCIe 4.0, Nguồn yêu cầu: 850W', 25, 5, 'https://hanoicomputercdn.com/media/product/69055_vga_asus_tuf_gaming_radeon_rx_7900_xtx_oc_edition_24gb_gddr6_3.jpg', '', @idVGA),

-- Mainboard
(NOW(), NOW(), 'Mainboard GIGABYTE Z790 AORUS MASTER', 13500000, 'Chipset: Z790, Form factor: E-ATX, Hỗ trợ RAM: DDR5 8000MHz', 25, 4, 'https://hanoicomputercdn.com/media/product/68222_mainboard_gigabyte_z790_aorus_master_ddr5__2_.jpg', '', @idMB),
(NOW(), NOW(), 'Mainboard MSI MAG B760M MORTAR WIFI', 4750000, 'Chipset: B760, Form factor: M-ATX, Hỗ trợ RAM: DDR5, Có Wifi 6E', 60, 22, 'https://hanoicomputercdn.com/media/product/69666_mainboard_msi_mag_b760m_mortar_wifi.jpg', '', @idMB),
(NOW(), NOW(), 'Mainboard ASUS ROG CROSSHAIR X670E HERO', 17900000, 'Chipset: X670E, Socket: AM5, Form factor: ATX, Hỗ trợ DDR5', 15, 3, 'https://hanoicomputercdn.com/media/product/68229_mainboard_asus_rog_crosshair_x670e_hero.jpg', '', @idMB),

-- RAM
(NOW(), NOW(), 'RAM Corsair Dominator Platinum RGB 32GB DDR5', 4750000, 'Dung lượng: 32GB (2x16GB), Tốc độ: 6200MHz, Chuẩn: DDR5, LED: RGB', 100, 30, 'https://hanoicomputercdn.com/media/product/68249_ram_corsair_dominator_platinum_rgb_2x16gb_ddr5_6200mhz_black.jpg', '', @idRAM),
(NOW(), NOW(), 'RAM Kingston FURY Beast 16GB DDR4', 1150000, 'Dung lượng: 16GB (1x16GB), Tốc độ: 3200MHz, Chuẩn: DDR4, Tản nhiệt: Nhôm đen', 200, 85, 'https://hanoicomputercdn.com/media/product/61665_ram_kingston_fury_beast_16gb_ddr4_3200_1.jpg', '', @idRAM),
(NOW(), NOW(), 'RAM G.Skill Trident Z5 RGB 64GB DDR5', 6800000, 'Dung lượng: 64GB (2x32GB), Tốc độ: 6000MHz, Tản nhiệt: Nhôm, LED RGB', 30, 10, 'https://hanoicomputercdn.com/media/product/68233_ram_g_skill_trident_z5_rgb_32gb.jpg', '', @idRAM),

-- SSD
(NOW(), NOW(), 'SSD Samsung 990 PRO 1TB PCIe 4.0 NVMe', 2850000, 'Dung lượng: 1TB, Chuẩn kết nối: PCIe 4.0, Đọc: 7450MB/s, Ghi: 6900MB/s', 80, 25, 'https://hanoicomputercdn.com/media/product/68664_ssd_samsung_990_pro_2tb.jpg', '', @idSSD),
(NOW(), NOW(), 'SSD Kingston NV2 500GB PCIe NVMe', 1050000, 'Dung lượng: 500GB, Chuẩn giao tiếp: PCIe NVMe, Đọc: 3500MB/s', 150, 60, 'https://hanoicomputercdn.com/media/product/68244_o_cung_ssd_kingston_nv2_500g_nvme_m2_2280_pcie_gen_4x4_1.jpg', '', @idSSD),

-- PSU
(NOW(), NOW(), 'Nguồn Corsair RM850e 850W 80 Plus Gold', 3200000, 'Công suất: 850W, Chuẩn hiệu suất: 80 Plus Gold, Modular: Full Modular', 50, 18, 'https://hanoicomputercdn.com/media/product/68673_nguon_corsair_rm850e_850w_80_plus_gold_1.jpg', '', @idPSU),
(NOW(), NOW(), 'Nguồn ASUS ROG Thor 1000W Platinum II', 9500000, 'Công suất: 1000W, Hiệu suất: 80 Plus Platinum, Có màn hình OLED', 20, 5, 'https://hanoicomputercdn.com/media/product/68669_nguon_asus_rog_thor_1000w_platinum_ii_1.jpg', '', @idPSU),

-- Tản Nhiệt
(NOW(), NOW(), 'Tản nhiệt nước NZXT Kraken Elite 360 RGB', 7900000, 'Loại tản: AIO Liquid Cooler, Fans: 3x120mm RGB, Màn hình LCD', 35, 12, 'https://hanoicomputercdn.com/media/product/68670_tan_nhiet_nuoc_nzxt_kraken_elite_360_rgb_black_1.jpg', '', @idCooler),
(NOW(), NOW(), 'Tản nhiệt khí Thermalright Peerless Assassin 120 SE', 850000, 'Tháp đôi (Dual Tower), Số fan: 2x120mm, Hỗ trợ AM5/LGA1700', 80, 35, 'https://hanoicomputercdn.com/media/product/68212_tan_nhiet_khi_thermalright_peerless_assassin_120_se.jpg', '', @idCooler),

-- Vỏ Case
(NOW(), NOW(), 'Vỏ Case Lian Li O11 Dynamic EVO Black', 3900000, 'Kích thước: Mid Tower, Kính cường lực 2 mặt, Luồng gió cực kỳ thoáng', 40, 11, 'https://hanoicomputercdn.com/media/product/68216_vo_case_lian_li_o11_dynamic_evo_black.jpg', '', @idCase),
(NOW(), NOW(), 'Vỏ Case NZXT H9 Flow White', 4300000, 'Màu: Trắng, Dual-Chamber, Khung thép và kính, Kèm 4 quạt F Series', 25, 9, 'https://hanoicomputercdn.com/media/product/68672_vo_case_nzxt_h9_flow_white_1.jpg', '', @idCase),

-- Màn hình
(NOW(), NOW(), 'Màn hình ASUS TUF Gaming VG27AQ3A 27inch 2K 180Hz', 7890000, 'Kích thước: 27 inch, Độ phân giải: 2K (2560x1440), Tần số: 180Hz', 40, 15, 'https://hanoicomputercdn.com/media/product/69387_man_hinh_asus_tuf_gaming_vg27aq3a.jpg', '', @idMonitor),
(NOW(), NOW(), 'Màn hình LG 27UP600-W 27inch 4K IPS', 6550000, 'Kích thước: 27inch, Tấm nền: IPS 4K, Phủ màu 95% DCI-P3, HDR400', 30, 10, 'https://hanoicomputercdn.com/media/product/68238_man_hinh_lg_27up600.jpg', '', @idMonitor),

-- Gear
(NOW(), NOW(), 'Bàn phím cơ AKKO 3098B Multi-modes Black Gold', 1950000, 'Switch: CS Jelly Pink, Type-C/Bluetooth/2.4GHz, Keycap PBT Double-Shot', 60, 20, 'https://hanoicomputercdn.com/media/product/68241_ban_phim_co_akko_3098b.jpg', '', @idGear),
(NOW(), NOW(), 'Chuột không dây Logitech G Pro X Superlight 2', 3690000, 'Cực nhẹ chỉ 60g, Switch Quang Học Mới, Cảm biến HERO 2', 40, 12, 'https://hanoicomputercdn.com/media/product/69388_chuot_logitech_g_pro_x_superlight_2_black.jpg', '', @idGear);

-- ==========================================
-- 4. BIẾN THỂ TRẢI DÀI
-- ==========================================
SET @s1  = (SELECT id FROM san_pham WHERE ten = 'CPU Intel Core i9-14900K' LIMIT 1);
SET @s2  = (SELECT id FROM san_pham WHERE ten = 'CPU Intel Core i5-13400F' LIMIT 1);
SET @s5  = (SELECT id FROM san_pham WHERE ten = 'NVIDIA GeForce RTX 4090 24GB ROG Strix' LIMIT 1);
SET @s21 = (SELECT id FROM san_pham WHERE ten = 'Bàn phím cơ AKKO 3098B Multi-modes Black Gold' LIMIT 1);

INSERT IGNORE INTO bien_the (created_at, updated_at, ten, gia, so_luong, da_ban, id_san_pham) VALUES
(NOW(), NOW(), 'Box Chính Hãng Tặng kèm quạt', 15500000, 30, 10, @s1),
(NOW(), NOW(), 'Tray (Không hộp bảo hành 36T)', 14900000, 20, 5, @s1),
(NOW(), NOW(), 'Phiên Bản Tiêu Chuẩn', 5100000, 120, 40, @s2),
(NOW(), NOW(), 'Màu Đen Nguyên Bản', 55000000, 10, 1, @s5),
(NOW(), NOW(), 'Màu Trắng Kèm Backplate', 57500000, 5, 1, @s5),
(NOW(), NOW(), 'Switch Jelly Pink', 1950000, 30, 10, @s21),
(NOW(), NOW(), 'Switch Jelly Purple', 1950000, 30, 10, @s21);

-- Tự động sinh Biến thể Tiêu chuẩn cho các Sản phẩm CÒN LẠI chưa được chèn ở trên
INSERT IGNORE INTO bien_the (created_at, updated_at, ten, gia, so_luong, da_ban, id_san_pham)
SELECT NOW(), NOW(), 'Tiêu chuẩn', gia, so_luong, da_ban, id
FROM san_pham 
WHERE id NOT IN (@s1, @s2, @s5, @s21);

-- ==========================================
-- 5. ĐÁNH GIÁ SẢN PHẨM KHỔNG LỒ
-- ==========================================
SET @u1 = (SELECT id FROM users WHERE username = 'nguyenvana' LIMIT 1);
SET @u2 = (SELECT id FROM users WHERE username = 'tranthib' LIMIT 1);
SET @u3 = (SELECT id FROM users WHERE username = 'leduc' LIMIT 1);

INSERT IGNORE INTO danh_gia (created_at, updated_at, so_sao, noi_dung, id_san_pham, id_user) VALUES
((NOW() - INTERVAL 1 DAY), (NOW() - INTERVAL 1 DAY), 5, 'Dùng chơi Game AAA bao mượt, render video xuất sắc trong tầm giá', @s1, @u1),
((NOW() - INTERVAL 2 HOUR), (NOW() - INTERVAL 2 HOUR), 5, 'Tuyệt vời, shop ship cực nhanh', @s1, @u2),
((NOW() - INTERVAL 5 DAY), (NOW() - INTERVAL 5 DAY), 4, 'Hàng xịn, hộp đẹp, nhưng giá mới ra hơi cao đó nha shop', @s5, @u3),
((NOW() - INTERVAL 1 MONTH), (NOW() - INTERVAL 1 MONTH), 5, 'Phím bấm rất êm, Switch Jelly Pink nảy ngon hơn cả Red Switch nhà Cherry', @s21, @u1),
((NOW() - INTERVAL 10 DAY), (NOW() - INTERVAL 10 DAY), 4, 'Bàn phím đẹp, layout 98% rất tiện gọn cho công việc kế toán', @s21, @u2);

-- BẠN ĐÃ CÓ DATA ĐỂ TEST THOẢI MÁI SAU KHI CHẠY SCRIPT NÀY!
