import React from "react";
import { Outlet, Link } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-2xl font-black italic tracking-tighter hover:text-blue-400 transition-colors"
              >
                NEXTGEN<span className="text-blue-500">PC</span>
              </Link>
            </div>

            {/* Main Nav */}
            <nav className="hidden md:flex space-x-8 uppercase text-sm font-bold tracking-widest">
              <Link to="/" className="hover:text-blue-400 transition-colors">
                Trang chủ
              </Link>
              <Link
                to="/build-pc"
                className="text-blue-500 hover:text-blue-400 transition-colors border-b-2 border-blue-500"
              >
                Build PC
              </Link>
              <Link
                to="/products"
                className="hover:text-blue-400 transition-colors"
              >
                Sản phẩm
              </Link>
              <Link
                to="/services"
                className="hover:text-blue-400 transition-colors"
              >
                Dịch vụ
              </Link>
              <Link
                to="/contact"
                className="hover:text-blue-400 transition-colors"
              >
                Liên hệ
              </Link>
            </nav>

            {/* Cart & User */}
            <div className="flex items-center space-x-6">
              <div className="relative group cursor-pointer p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-all">
                <span className="text-xl">🛒</span>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </div>
              <div className="cursor-pointer p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-all">
                <span className="text-xl">👤</span>
              </div>
              <Link
                to="/admin"
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md font-bold transition-all uppercase"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero / Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-6 italic tracking-tighter">
                NEXTGEN<span className="text-blue-500">PC</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
                Hệ thống cung cấp linh kiện máy tính và dịch vụ Build PC chuyên
                nghiệp, đem đến trải nghiệm hiệu năng đỉnh cao cho game thủ và
                dân thiết kế.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-blue-600 transition-all"
                >
                  FB
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-blue-600 transition-all"
                >
                  YT
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-blue-600 transition-all"
                >
                  IG
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-400">Danh mục</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <Link
                    to="/build-pc"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Cấu hình có sẵn
                  </Link>
                </li>
                <li>
                  <Link
                    to="/build-pc"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Linh kiện rời
                  </Link>
                </li>
                <li>
                  <Link
                    to="/build-pc"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Dịch vụ sửa chữa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/build-pc"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Trade-in lên đời
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-400">Hỗ trợ</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Chính sách bảo hành
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Vận chuyển & Thanh toán
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Liên hệ CSKH
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-xs text-gray-500">
            <p>
              &copy; 2026 NEXTGEN PC. All rights reserved. Designed for
              excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
