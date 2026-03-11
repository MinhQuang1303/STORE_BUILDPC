import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import App from "../App";

import Dashboard from "../views/admin/Dashboard";
import QuanLyDanhMuc from "../views/admin/QuanLyDanhMuc";
import QuanLySanPham from "../views/admin/QuanLySanPham";
import QuanLyMaGiamGia from "../views/admin/QuanLyMaGiamGia";
import QuanLyUser from "../views/admin/QuanLyUser";
import QuanLyOrder from "../views/admin/QuanLyOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "products",
        element: (
          <div className="p-20 text-center text-2xl font-bold italic text-gray-400">
            Đang cập nhật danh sách...
          </div>
        ),
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
]);

export default router;
