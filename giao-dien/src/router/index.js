import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

// Admin views
import Dashboard from "../views/admin/Dashboard";
import QuanLyDanhMuc from "../views/admin/QuanLyDanhMuc";
import QuanLySanPham from "../views/admin/QuanLySanPham";
import QuanLyMaGiamGia from "../views/admin/QuanLyMaGiamGia";
import QuanLyUser from "../views/admin/QuanLyUser";
import QuanLyOrder from "../views/admin/QuanLyOrder";

// User views
import TrangChu from "../views/users/TrangChu";
import TrangBuildPC from "../views/users/TrangBuildPC";
import TrangChiTiet from "../views/users/TrangChiTiet";
import TrangGioHang from "../views/users/TrangGioHang";
import TrangSanPham from "../views/users/TrangSanPham";
import TrangDonHangCuaToi from "../views/users/TrangDonHangCuaToi";
import DangNhap from "../views/DangNhap";
import DangKy from "../views/DangKy";
import DatLaiMatKhau from "../views/DatLaiMatKhau"; 
import TrangThanhToan from "../views/users/TrangThanhToan";

// Component tạm thời để tránh lỗi "AuthSuccess is not defined"
const AuthSuccess = () => <div>Đăng nhập thành công! Đang chuyển hướng...</div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <TrangChu /> },
      { path: "san-pham", element: <TrangSanPham /> },
      { path: "san-pham/:id", element: <TrangChiTiet /> },
      { path: "build", element: <TrangBuildPC /> },
      { path: "build-pc", element: <TrangBuildPC /> },
      { path: "gio-hang", element: <TrangGioHang /> },
      { path: "thanh-toan", element: <TrangThanhToan /> },
      { path: "don-hang-cua-toi", element: <TrangDonHangCuaToi /> },
      { path: "dang-nhap", element: <DangNhap /> },
      { path: "dang-ky", element: <DangKy /> },
      { path: "dat-lai-mat-khau/:token", element: <DatLaiMatKhau /> },
      
      // THÊM DÒNG NÀY ĐỂ HẾT LỖI TRẮNG TRANG
      { path: "auth-success", element: <AuthSuccess /> }, 
      
      { path: "login", element: <Navigate to="/dang-nhap" replace /> },
      { path: "register", element: <Navigate to="/dang-ky" replace /> },
      { path: "products", element: <TrangSanPham /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "categories", element: <QuanLyDanhMuc /> },
      { path: "products", element: <QuanLySanPham /> },
      { path: "vouchers", element: <QuanLyMaGiamGia /> },
      { path: "users", element: <QuanLyUser /> },
      { path: "orders", element: <QuanLyOrder /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;