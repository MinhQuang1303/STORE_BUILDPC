import React, { useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const UserLayout = () => {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const userStorage = JSON.parse(localStorage.getItem("user"));
  const user = userStorage?.user;

  const handleDangXuat = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    // Nếu ở trang Build PC, có thể cần xử lý cụ thể hơn,
    // nhưng mặc định sẽ chuyển về trang Sản Phẩm với query if needed
    // Hiện tại chỉ hỗ trợ placeholder logic hoặc chuyển hướng.
    if (e.key === "Enter") {
      navigate(`/san-pham?q=${e.target.value}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-900">
      {/* Global Header (from Banner.js) */}
      <nav style={styles.nav}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => navigate("/")}>
          NEXTGEN<span style={{ color: "#fff" }}>PC</span>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm linh kiện..."
            style={styles.searchInput}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Navigation Links */}
        <div style={styles.menuItems}>
          <Link to="/" style={styles.navLink}>
            Trang chủ
          </Link>
          <Link to="/san-pham" style={styles.navLink}>
            Cửa hàng
          </Link>
          <Link to="/build" style={styles.navLink}>
            Build PC
          </Link>

          {/* Cart Icon */}
          <div style={styles.cartIcon} onClick={() => navigate("/gio-hang")}>
            🛒 <span style={styles.cartBadge}>{cartItems?.length || 0}</span>
          </div>
        </div>

        {/* Account Section */}
        <div style={styles.authSection}>
          {user ? (
            <div style={styles.userBox}>
              <span style={styles.userName}>
                Hi, {user.ten || user.username}
              </span>
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  style={styles.adminBtn}
                >
                  Admin
                </button>
              )}
              <button onClick={handleDangXuat} style={styles.logoutBtn}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} style={styles.loginBtn}>
              Đăng nhập
            </button>
          )}
        </div>
      </nav>

      {/* Page Content */}
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
                  className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-blue-600 transition-all font-bold"
                >
                  F
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-blue-600 transition-all font-bold"
                >
                  Y
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full hover:bg-blue-600 transition-all font-bold"
                >
                  I
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-400">Danh mục</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/san-pham"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Linh kiện rời
                  </Link>
                </li>
                <li>
                  <Link
                    to="/build"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Tự xây dựng cấu hình
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gio-hang"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Giỏ hàng
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

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 40px",
    backgroundColor: "#0f172a",
    color: "white",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "24px",
    fontWeight: "900",
    cursor: "pointer",
    color: "#3b82f6",
    letterSpacing: "-1px",
    fontStyle: "italic",
  },
  searchContainer: {
    flex: 1,
    margin: "0 40px",
    maxWidth: "500px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#1e293b",
    color: "white",
  },
  menuItems: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  navLink: {
    textDecoration: "none",
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: "14px",
    textTransform: "uppercase",
    transition: "color 0.2s",
  },
  cartIcon: {
    position: "relative",
    fontSize: "22px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  cartBadge: {
    position: "absolute",
    top: "-8px",
    right: "-10px",
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: "bold",
    border: "2px solid #0f172a",
  },
  authSection: { marginLeft: "20px" },
  userBox: { display: "flex", alignItems: "center", gap: "12px" },
  userName: { fontWeight: "600", color: "#f59e0b", fontSize: "14px" },
  adminBtn: {
    backgroundColor: "#8b5cf6",
    color: "white",
    border: "none",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s",
  },
  loginBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default UserLayout;
