-- =====================================================
-- SCRIPT XÓA SẠCH TOÀN BỘ DỮ LIỆU (TRUNCATE ALL)
-- Chạy file này trong MySQL Workbench / phpMyAdmin
-- SAU ĐÓ chạy mock_data_test.sql để thêm dữ liệu mới
-- =====================================================

USE pc_builder;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE danh_gia;
TRUNCATE TABLE order_item;
TRUNCATE TABLE orders;
TRUNCATE TABLE bien_the;
TRUNCATE TABLE san_pham;
TRUNCATE TABLE danh_muc;
TRUNCATE TABLE ma_giam_gia;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Đã xóa sạch toàn bộ dữ liệu thành công!' AS KetQua;
