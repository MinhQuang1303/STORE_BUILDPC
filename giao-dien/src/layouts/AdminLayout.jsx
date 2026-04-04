import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import AdminNotificationBell from "../components/AdminNotificationBell";

// Admin layout with sidebar and headers
const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 shadow-xl text-white flex-shrink-0 transition-all duration-300 flex flex-col">
        <div className="p-6">
          <Link to="/">
            <h2 className="text-2xl font-bold tracking-wider text-blue-400">
              STORE_BUILDPC
            </h2>
          </Link>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
            Admin Dashboard
          </p>
        </div>
        <nav className="mt-6 px-4">
          <Link
            to="/admin"
            className="flex items-center p-3 text-gray-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group mb-2"
          >
            <span className="mr-3">📊</span>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center p-3 text-gray-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group mb-2"
          >
            <span className="mr-3">📁</span>
            <span className="font-medium">Quản lý danh mục</span>
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center p-3 text-gray-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group mb-2"
          >
            <span className="mr-3">💻</span>
            <span className="font-medium">Quản lý linh kiện</span>
          </Link>
          <Link
            to="/admin/vouchers"
            className="flex items-center p-3 text-gray-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group mb-2"
          >
            <span className="mr-3">🎟️</span>
            <span className="font-medium">Mã giảm giá</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center p-3 text-gray-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group mb-2"
          >
            <span className="mr-3">🛒</span>
            <span className="font-medium">Đơn hàng</span>
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center p-3 text-gray-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group mb-2"
          >
            <span className="mr-3">👥</span>
            <span className="font-medium">Quản lý người dùng</span>
          </Link>
          <Link
            to="/admin/chat"
            className="flex items-center p-3 text-gray-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group mb-2 justify-between"
          >
            <div className="flex items-center">
                <span className="mr-3">💬</span>
                <span className="font-medium">Quản lý Chat</span>
            </div>
          </Link>
        </nav>

        <div className="mt-auto p-4 border-t border-slate-800">
            <button 
                onClick={() => {
                    localStorage.clear();
                    navigate("/dang-nhap");
                }}
                className="w-full flex items-center justify-center p-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors group"
            >
                <span className="font-medium">Thoát tài khoản</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 z-10">
          <div className="flex items-center">
            <button className="text-gray-500 hover:text-blue-600 mr-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800 uppercase">
              Quản trị hệ thống
            </h1>
          </div>
          <div className="flex items-center space-x-6 relative">
            <AdminNotificationBell />
            <div className="relative">
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
                <img
                  className="h-9 w-9 rounded-full border-2 border-blue-500 p-0.5"
                  src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                  alt="User avatar"
                />
                <span className="ml-2 hidden md:block">Quản trị viên</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
