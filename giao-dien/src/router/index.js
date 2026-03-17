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
import AuthPage from "../views/AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <TrangChu />,
      },
      {
        path: "san-pham",
        element: <TrangSanPham />,
      },
      {
        path: "san-pham/:id",
        element: <TrangChiTiet />,
      },
      {
        path: "build",
        element: <TrangBuildPC />,
      },
      {
        path: "build-pc", // Alias for build
        element: <TrangBuildPC />,
      },
      {
        path: "gio-hang",
        element: <TrangGioHang />,
      },
      {
        path: "login",
        element: <AuthPage isLogin={true} />,
      },
      {
        path: "register",
        element: <AuthPage isLogin={false} />,
      },
      {
        path: "products", // Compatibility for existing links
        element: <TrangSanPham />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "categories",
        element: <QuanLyDanhMuc />,
      },
      {
        path: "products",
        element: <QuanLySanPham />,
      },
      {
        path: "vouchers",
        element: <QuanLyMaGiamGia />,
      },
      {
        path: "users",
        element: <QuanLyUser />,
      },
      {
        path: "orders",
        element: <QuanLyOrder />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
