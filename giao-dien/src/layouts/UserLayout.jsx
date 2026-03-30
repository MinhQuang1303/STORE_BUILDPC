import React, { useState, useEffect, useContext, useRef } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
<<<<<<< HEAD
import axios from "axios";

const UserLayout = () => {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/san-pham")
      .then(res => setAllProducts(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedData = JSON.parse(savedUser);
          const userData = parsedData.user || parsedData;
          setUser({ ...userData, username: userData.username || userData.ten || "KhachHang" });
        } catch (e) { setUser(null); }
      } else { setUser(null); }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
=======
import ThanhThongBaoKhuyenMai from "../components/ThanhThongBaoKhuyenMai";
import { 
    Search, ShoppingCart, User, LogOut, 
    ChevronDown, LayoutGrid, Cpu, Monitor, HardDrive 
} from 'lucide-react'; // Cài đặt: npm install lucide-react

const UserLayout = () => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // Danh sách danh mục mẫu
    const categories = [
        { name: "CPU - Bộ vi xử lý", icon: <Cpu size={18}/>, path: "/san-pham?cat=cpu" },
        { name: "VGA - Card màn hình", icon: <Monitor size={18}/>, path: "/san-pham?cat=vga" },
        { name: "SSD - Ổ cứng", icon: <HardDrive size={18}/>, path: "/san-pham?cat=ssd" },
        { name: "Mainboard - Bo mạch chủ", icon: <LayoutGrid size={18}/>, path: "/san-pham?cat=main" },
    ];

    useEffect(() => {
        const checkUser = () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                try {
                    const parsedData = JSON.parse(savedUser);
                    const userData = parsedData.user || parsedData;
                    setUser({
                        ...userData,
                        username: userData.username || userData.ten || "Khách"
                    });
                } catch (e) { setUser(null); }
            } else { setUser(null); }
        };
        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleDangXuat = () => {
        localStorage.clear();
        setUser(null);
        navigate("/dang-nhap");
>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

<<<<<<< HEAD
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const keyword = val.toLowerCase();
    const filtered = allProducts
      .filter(sp =>
        sp.ten.toLowerCase().includes(keyword) ||
        sp.idDanhMuc?.ten?.toLowerCase().includes(keyword) ||
        sp.thongSo?.toLowerCase().includes(keyword)
      )
      .slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (sp) => {
    setSearchTerm("");
    setShowSuggestions(false);
    navigate("/san-pham/" + sp._id);
  };

  const handleSearchEnter = (e) => {
    if (e.key !== "Enter" || !searchTerm.trim()) return;
    setShowSuggestions(false);
    const keyword = searchTerm.trim().toLowerCase();
    const categories = [...new Set(allProducts.map(sp => sp.idDanhMuc?.ten).filter(Boolean))];
    const matchedCat = categories.find(cat => cat.toLowerCase() === keyword);
    if (matchedCat) {
      navigate("/san-pham?cat=" + matchedCat);
    } else {
      navigate("/san-pham?q=" + searchTerm.trim());
    }
    setSearchTerm("");
  };

  const handleDangXuat = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/dang-nhap";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0a0f1a", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate("/")}>
          NEXTGEN<span style={{ color: "#fff" }}>PC</span>
=======
    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans selection:bg-blue-100">
            {/* --- TOP HEADER (Glassmorphism) --- */}
            <nav className="sticky top-0 z-[1000] bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-8">
                    
                    {/* LOGO */}
                    <div 
                        className="text-2xl font-black tracking-tighter cursor-pointer group flex items-center"
                        onClick={() => navigate("/")}
                    >
                        <span className="text-blue-500 group-hover:text-blue-400 transition-colors">STORE</span>
                        <span className="text-white italic underline decoration-blue-500 decoration-4">BUILD</span>
                        <span className="bg-blue-600 px-2 py-1 rounded-lg ml-1 text-sm self-start">PC</span>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="flex-1 max-w-2xl relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Bạn cần tìm linh kiện gì? (Nhấn Enter)"
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 transition-all text-sm"
                            onKeyDown={(e) => e.key === "Enter" && navigate(`/san-pham?q=${e.target.value}`)}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-6">
                        {/* DANH MỤC DROPDOWN */}
                        <div className="relative group">
                            <button 
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider hover:text-blue-400 transition-colors"
                            >
                                <LayoutGrid size={18} /> Danh mục <ChevronDown size={14} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* MEGA MENU CONTENT */}
                            {isCategoryOpen && (
                                <div className="absolute top-full right-0 mt-4 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-2">
                                        {categories.map((cat, idx) => (
                                            <Link 
                                                key={idx} 
                                                to={cat.path} 
                                                onClick={() => setIsCategoryOpen(false)}
                                                className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors group"
                                            >
                                                <span className="text-slate-400 group-hover:text-blue-600 transition-colors">{cat.icon}</span>
                                                <span className="font-semibold text-sm">{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                                        <Link to="/san-pham" className="text-xs font-bold text-blue-600 hover:underline">Xem tất cả linh kiện</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/build" className="hidden lg:block font-bold text-sm uppercase text-orange-400 hover:text-orange-300 transition-colors">Build PC</Link>

                        {/* GIỎ HÀNG */}
                        <div 
                            className="relative p-2 hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                            onClick={() => navigate("/gio-hang")}
                        >
                            <ShoppingCart size={24} />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                                {cartItems?.length || 0}
                            </span>
                        </div>

                        {/* AUTH SECTION */}
                        <div className="h-8 w-[1px] bg-slate-700 mx-2 hidden sm:block"></div>
                        
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Xin chào</p>
                                    <p className="text-sm font-bold text-blue-400">{user.username}</p>
                                </div>
                                <div className="relative group">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition-transform">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    {/* USER MENU */}
                                    <div className="absolute top-full right-0 mt-4 w-48 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <div className="p-2 space-y-1">
                                            <Link to="/don-hang-cua-toi" className="flex items-center gap-2 p-3 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors">📦 Đơn hàng của tôi</Link>
                                            {user.role === "admin" && <Link to="/admin" className="flex items-center gap-2 p-3 text-purple-600 hover:bg-purple-50 rounded-xl text-sm font-bold transition-colors">🛠 Quản trị hệ thống</Link>}
                                            <button onClick={handleDangXuat} className="w-full flex items-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
                                                <LogOut size={16} /> Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => navigate("/dang-nhap")}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                            >
                                Đăng nhập
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <ThanhThongBaoKhuyenMai />

            {/* --- PAGE CONTENT --- */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-950 text-white pt-20 pb-10 mt-20">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-black italic mb-6">STORE_BUILD<span className="text-blue-500">PC</span></h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Hệ thống cung cấp giải pháp Build PC chuyên nghiệp, linh kiện chính hãng bảo hành lên đến 36 tháng.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-slate-100 uppercase text-xs tracking-widest">Dịch vụ</h4>
                        <ul className="space-y-4 text-slate-400 text-sm italic">
                            <li className="hover:text-blue-500 cursor-pointer transition-colors">Chính sách bảo hành</li>
                            <li className="hover:text-blue-500 cursor-pointer transition-colors">Vận chuyển siêu tốc</li>
                            <li className="hover:text-blue-500 cursor-pointer transition-colors">Trả góp 0% lãi suất</li>
                        </ul>
                    </div>
                    <div className="col-span-1 md:col-span-2 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                        <h4 className="font-bold mb-4 text-white">Đăng ký nhận khuyến mãi</h4>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Email của bạn..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                            <button className="bg-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">Gửi</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4">
                    <p>© 2026 STORE_BUILDPC. Designed with ❤️ for PC Builders.</p>
                    <div className="flex gap-6 italic underline underline-offset-4">
                        <span>Điều khoản</span>
                        <span>Bảo mật</span>
                        <span>Sitemap</span>
                    </div>
                </div>
            </footer>
>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14
        </div>

        <div style={styles.searchContainer} ref={searchRef}>
          <div style={{ position: "relative" }}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Tim kiem linh kien, CPU, GPU, RAM..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchEnter}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(""); setSuggestions([]); setShowSuggestions(false); }} style={styles.clearBtn}>×</button>
            )}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>Goi y tim kiem</div>
              {suggestions.map(sp => (
                <div
                  key={sp._id}
                  style={styles.suggestionItem}
                  onClick={() => handleSelectSuggestion(sp)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1e293b"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <img src={sp.anh} alt={sp.ten} style={styles.suggestionImg} />
                  <div style={styles.suggestionInfo}>
                    <div style={styles.suggestionName}>{sp.ten}</div>
                    <div style={styles.suggestionMeta}>
                      <span style={styles.suggestionCat}>{sp.idDanhMuc?.ten}</span>
                      <span style={styles.suggestionPrice}>{sp.gia?.toLocaleString("vi-VN")}d</span>
                    </div>
                  </div>
                </div>
              ))}
              <div
                style={styles.viewAll}
                onClick={() => {
                  setShowSuggestions(false);
                  const keyword = searchTerm.trim().toLowerCase();
                  const categories = [...new Set(allProducts.map(sp => sp.idDanhMuc?.ten).filter(Boolean))];
                  const matchedCat = categories.find(cat => cat.toLowerCase() === keyword);
                  navigate(matchedCat ? "/san-pham?cat=" + matchedCat : "/san-pham?q=" + searchTerm);
                  setSearchTerm("");
                }}
              >
                Xem tat ca ket qua cho "{searchTerm}" →
              </div>
            </div>
          )}
        </div>

        <div style={styles.menuItems}>
          <Link to="/" style={styles.navLink}>Trang chu</Link>
          <Link to="/san-pham" style={styles.navLink}>Cua hang</Link>
          <Link to="/build" style={styles.navLink}>Build PC</Link>
          <div style={styles.cartWrap} onClick={() => navigate("/gio-hang")}>
            <span style={styles.cartIcon}>🛒</span>
            {cartItems?.length > 0 && <span style={styles.cartBadge}>{cartItems.length}</span>}
          </div>
        </div>

        <div style={styles.authSection}>
          {user ? (
            <div style={styles.userBox}>
              <div style={styles.userAvatar}>{user.username?.[0]?.toUpperCase()}</div>
              <span style={styles.userName}>Hi, {user.username}</span>
              {user.role === "admin" && (
                <button onClick={() => navigate("/admin")} style={styles.adminBtn}>Admin</button>
              )}
              <button onClick={handleDangXuat} style={styles.logoutBtn}>Dang xuat</button>
            </div>
          ) : (
            <button onClick={() => navigate("/dang-nhap")} style={styles.loginBtn}>Dang nhap</button>
          )}
        </div>
      </nav>

      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>NEXTGEN<span style={{ color: "#3b82f6" }}>PC</span></div>
            <p style={styles.footerDesc}>Chuyen cung cap linh kien may tinh chinh hang, chat luong cao voi gia ca canh tranh nhat thi truong.</p>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerCol}>
              <div style={styles.footerColTitle}>San pham</div>
              {["CPU", "GPU", "RAM", "Mainboard"].map(c => (
                <div key={c} style={styles.footerLink} onClick={() => navigate(`/san-pham?cat=${c}`)}>{c}</div>
              ))}
            </div>
            <div style={styles.footerCol}>
              <div style={styles.footerColTitle}>Ho tro</div>
              {["Chinh sach bao hanh", "Huong dan mua hang", "Lien he", "FAQ"].map(l => (
                <div key={l} style={styles.footerLink}>{l}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <span>2026 NEXTGEN PC. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

<<<<<<< HEAD
const styles = {
  nav: { display: "flex", alignItems: "center", gap: "20px", padding: "14px 40px", backgroundColor: "#0d1526", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 1000 },
  logo: { fontSize: "22px", fontWeight: "900", cursor: "pointer", color: "#3b82f6", fontStyle: "italic", whiteSpace: "nowrap", letterSpacing: "-0.5px" },
  searchContainer: { flex: 1, maxWidth: "520px", position: "relative" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", zIndex: 1 },
  searchInput: { width: "100%", padding: "10px 36px 10px 36px", borderRadius: "10px", border: "1px solid #1e293b", outline: "none", backgroundColor: "#111827", color: "white", fontSize: "14px", boxSizing: "border-box", transition: "border-color 0.2s" },
  clearBtn: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "18px", lineHeight: 1, padding: 0 },
  dropdown: { position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, backgroundColor: "#0d1526", border: "1px solid #1e293b", borderRadius: "12px", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", zIndex: 9999, overflow: "hidden" },
  dropdownHeader: { padding: "10px 16px 6px", fontSize: "11px", color: "#475569", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" },
  suggestionItem: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", cursor: "pointer", transition: "background 0.15s", borderTop: "1px solid #1e293b" },
  suggestionImg: { width: "44px", height: "44px", objectFit: "contain", backgroundColor: "#1e293b", borderRadius: "8px", padding: "4px", flexShrink: 0 },
  suggestionInfo: { flex: 1, minWidth: 0 },
  suggestionName: { fontSize: "13px", color: "#e2e8f0", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  suggestionMeta: { display: "flex", justifyContent: "space-between", marginTop: "4px" },
  suggestionCat: { fontSize: "11px", color: "#475569", backgroundColor: "#1e293b", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" },
  suggestionPrice: { fontSize: "12px", color: "#f59e0b", fontWeight: "700" },
  viewAll: { padding: "12px 16px", textAlign: "center", color: "#3b82f6", fontSize: "13px", cursor: "pointer", fontWeight: "700", borderTop: "1px solid #1e293b", backgroundColor: "#111827" },
  menuItems: { display: "flex", alignItems: "center", gap: "24px" },
  navLink: { textDecoration: "none", color: "#94a3b8", fontWeight: "600", fontSize: "14px", transition: "color 0.2s" },
  cartWrap: { position: "relative", cursor: "pointer", fontSize: "22px" },
  cartIcon: { display: "block" },
  cartBadge: { position: "absolute", top: "-6px", right: "-8px", backgroundColor: "#ef4444", color: "white", borderRadius: "50%", padding: "1px 5px", fontSize: "10px", fontWeight: "800", border: "2px solid #0d1526", minWidth: "18px", textAlign: "center" },
  authSection: { marginLeft: "auto", flexShrink: 0 },
  userBox: { display: "flex", alignItems: "center", gap: "10px" },
  userAvatar: { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px" },
  userName: { fontWeight: "600", color: "#f59e0b", fontSize: "14px" },
  adminBtn: { backgroundColor: "#8b5cf6", color: "white", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
  logoutBtn: { backgroundColor: "transparent", color: "#64748b", border: "1px solid #1e293b", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  loginBtn: { backgroundColor: "#3b82f6", color: "white", border: "none", padding: "10px 22px", borderRadius: "9px", cursor: "pointer", fontWeight: "700", fontSize: "14px" },
  footer: { backgroundColor: "#0d1526", borderTop: "1px solid #1e293b" },
  footerInner: { maxWidth: "1280px", margin: "0 auto", padding: "50px 40px 30px", display: "flex", gap: "60px", flexWrap: "wrap" },
  footerBrand: { flex: "0 0 280px" },
  footerLogo: { fontSize: "24px", fontWeight: "900", color: "white", fontStyle: "italic", marginBottom: "14px" },
  footerDesc: { color: "#475569", fontSize: "14px", lineHeight: "1.6" },
  footerLinks: { display: "flex", gap: "60px", flex: 1 },
  footerCol: {},
  footerColTitle: { color: "#f1f5f9", fontWeight: "800", fontSize: "14px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" },
  footerLink: { color: "#475569", fontSize: "14px", marginBottom: "10px", cursor: "pointer", transition: "color 0.2s" },
  footerBottom: { maxWidth: "1280px", margin: "0 auto", padding: "16px 40px", borderTop: "1px solid #1e293b", color: "#334155", fontSize: "13px", textAlign: "center" },
};

export default UserLayout;
=======
export default UserLayout;
>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14
