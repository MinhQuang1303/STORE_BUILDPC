import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang từ thư mục /trang
import TrangChu from './trang/TrangChu';
import TrangBuildPC from './trang/TrangBuildPC';
import TrangChiTiet from './trang/TrangChiTiet';
import TrangGioHang from './trang/TrangGioHang';
import TrangSanPham from './trang/TrangSanPham'; // Trang mới thêm

// Import từ thư mục /pages
import AuthPage from './pages/AuthPage';
import TrangAdmin from './pages/TrangAdmin';

// Import các thành phần hỗ trợ
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* 1. Trang chủ */}
          <Route path="/" element={<TrangChu />} />

          {/* 2. Trang tất cả sản phẩm (Cửa hàng) */}
          <Route path="/san-pham" element={<TrangSanPham />} />

          {/* 3. Trang tự build PC */}
          <Route path="/build" element={<TrangBuildPC />} />

          {/* 4. Trang chi tiết sản phẩm */}
          <Route path="/san-pham/:id" element={<TrangChiTiet />} />

          {/* 5. Trang giỏ hàng */}
          <Route path="/gio-hang" element={<TrangGioHang />} />

          {/* 6. Xác thực người dùng */}
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          
          {/* 7. Trang quản trị - Bảo mật bằng ProtectedRoute */}
          <Route path="/admin" element={
            <ProtectedRoute isAdminRequired={true}>
              <TrangAdmin />
            </ProtectedRoute>
          } />

          {/* 8. Xử lý đường dẫn không tồn tại */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;