import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { CartContext } from "../context/CartContext";

const UserLayout = () => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const [user, setUser] = useState(null);

    // --- LOGIC TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI ĐĂNG NHẬP ---
    useEffect(() => {
        const checkUser = () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                try {
                    const parsedData = JSON.parse(savedUser);
                    // Lấy dữ liệu user. Nếu không có tên thì đặt mặc định là KhachHang
                    const userData = parsedData.user || parsedData;
                    setUser({
                        ...userData,
                        username: userData.username || userData.ten || "KhachHang"
                    });
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser(); // Chạy ngay khi load layout

        // Lắng nghe sự kiện để cập nhật ngay lập tức nếu thay đổi storage
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleDangXuat = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/dang-nhap"; 
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            navigate(`/san-pham?q=${e.target.value}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-900">
            {/* --- NAVIGATION BAR --- */}
            <nav style={styles.nav}>
                <div style={styles.logo} onClick={() => navigate("/")}>
                    STORE_BUILD<span style={{ color: "#fff" }}>PC</span>
                </div>

                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm linh kiện..."
                        style={styles.searchInput}
                        onKeyDown={handleSearch}
                    />
                </div>

                <div style={styles.menuItems}>
                    <Link to="/" style={styles.navLink}>Trang chủ</Link>
                    <Link to="/san-pham" style={styles.navLink}>Cửa hàng</Link>
                    <Link to="/build" style={styles.navLink}>Build PC</Link>

                    <div style={styles.cartIcon} onClick={() => navigate("/gio-hang")}>
                        🛒 <span style={styles.cartBadge}>{cartItems?.length || 0}</span>
                    </div>
                </div>

                <div style={styles.authSection}>
                    {user ? (
                        <div style={styles.userBox}>
                            <span style={styles.userName}>
                                Hi, {user.username}
                            </span>
                            {user.role === "admin" && (
                                <button onClick={() => navigate("/admin")} style={styles.adminBtn}>
                                    Admin
                                </button>
                            )}
                            <button onClick={handleDangXuat} style={styles.logoutBtn}>
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate("/dang-nhap")} style={styles.loginBtn}>
                            Đăng nhập
                        </button>
                    )}
                </div>
            </nav>

            {/* --- PAGE CONTENT --- */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4 italic">
                        STORE_BUILD<span className="text-blue-500">PC</span>
                    </h3>
                    <p className="text-gray-400 text-sm">&copy; 2026 STORE_BUILDPC. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const styles = {
    nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 40px", backgroundColor: "#0f172a", color: "white", position: "sticky", top: 0, zIndex: 1000 },
    logo: { fontSize: "24px", fontWeight: "900", cursor: "pointer", color: "#3b82f6", fontStyle: "italic" },
    searchContainer: { flex: 1, margin: "0 40px", maxWidth: "500px" },
    searchInput: { width: "100%", padding: "10px 18px", borderRadius: "10px", border: "none", outline: "none", backgroundColor: "#1e293b", color: "white" },
    menuItems: { display: "flex", alignItems: "center", gap: "25px" },
    navLink: { textDecoration: "none", color: "#f8fafc", fontWeight: "700", fontSize: "14px", textTransform: "uppercase" },
    cartIcon: { position: "relative", fontSize: "22px", cursor: "pointer" },
    cartBadge: { position: "absolute", top: "-8px", right: "-10px", backgroundColor: "#ef4444", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "11px", border: "2px solid #0f172a" },
    authSection: { marginLeft: "20px" },
    userBox: { display: "flex", alignItems: "center", gap: "12px" },
    userName: { fontWeight: "600", color: "#f59e0b", fontSize: "14px" },
    adminBtn: { backgroundColor: "#8b5cf6", color: "white", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
    logoutBtn: { backgroundColor: "transparent", color: "#94a3b8", border: "1px solid #334155", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
    loginBtn: { backgroundColor: "#2563eb", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
};

export default UserLayout;