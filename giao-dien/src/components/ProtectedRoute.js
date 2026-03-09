// giao-dien/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Lấy thông tin user từ localStorage (được lưu khi đăng nhập thành công)
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.token) {
        // Nếu chưa đăng nhập, đá về trang login
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập, cho phép hiển thị nội dung bên trong (TrangBuildPC)
    return children;
};

export default ProtectedRoute;