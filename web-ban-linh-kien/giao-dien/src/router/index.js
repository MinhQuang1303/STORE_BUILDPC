import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import App from "../App";

// Placeholder components for routing demonstration
const AdminDashboard = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      Chào mừng đến với Bảng điều khiển
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-600 font-bold text-lg mb-1">1,234</p>
        <p className="text-gray-600 text-sm italic">Sản phẩm đã bán</p>
      </div>
      <div className="p-6 bg-green-50 rounded-lg border border-green-100">
        <p className="text-green-600 font-bold text-lg mb-1">56</p>
        <p className="text-gray-600 text-sm italic">Đơn hàng mới</p>
      </div>
      <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-purple-600 font-bold text-lg mb-1">890.5M VNĐ</p>
        <p className="text-gray-600 text-sm italic">Doanh thu tháng</p>
      </div>
    </div>
  </div>
);

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
          <div className="p-20 text-center text-2xl font-bold">
            Danh sách sản phẩm
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
        element: <AdminDashboard />,
      },
      {
        path: "products",
        element: <div className="text-xl">Quản lý linh kiện</div>,
      },
    ],
  },
]);

export default router;
