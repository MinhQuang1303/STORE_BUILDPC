import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang từ thư mục /trang
import TrangChu from './trang/TrangChu';
import TrangBuildPC from './trang/TrangBuildPC';
import TrangChiTiet from './trang/TrangChiTiet';
import TrangGioHang from './trang/TrangGioHang';

// Import từ thư mục /pages
import AuthPage from './pages/AuthPage';
import TrangAdmin from './pages/TrangAdmin';

// Import các thành phần hỗ trợ
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext'; // Đảm bảo đường dẫn này đúng

function App() {
  return (
    // Bọc toàn bộ ứng dụng trong CartProvider để giỏ hàng hoạt động ở mọi trang
    <CartProvider>
      <Router>
        <Routes>
          {/* 1. Trang chủ bán hàng */}
          <Route path="/" element={<TrangChu />} />

          {/* 2. Trang tự build PC */}
          <Route path="/build" element={<TrangBuildPC />} />

          {/* 3. Trang chi tiết sản phẩm */}
          <Route path="/san-pham/:id" element={<TrangChiTiet />} />

          {/* 4. Trang giỏ hàng */}
          <Route path="/gio-hang" element={<TrangGioHang />} />

          {/* 5. Trang đăng nhập và đăng ký */}
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          
          {/* 6. Trang quản trị - Chỉ dành cho Admin */}
          <Route path="/admin" element={
            <ProtectedRoute isAdminRequired={true}>
              <TrangAdmin />
            </ProtectedRoute>
          } />

          {/* 7. Chuyển hướng các đường dẫn không tồn tại về Trang Chủ */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;