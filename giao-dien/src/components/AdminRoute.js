import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    // Chưa đăng nhập -> quay lại đăng nhập
    return <Navigate to="/dang-nhap" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    // Nếu role nằm trong object user (VD: user.role === 'admin' hoặc user.user.role === 'admin')
    const role = user.role || user.user?.role;
    
    if (role === 'admin') {
      return <Outlet />;
    } else {
      // Đã đăng nhập nhưng không phải admin -> đá về trang chủ
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/dang-nhap" replace />;
  }
};

export default AdminRoute;
