import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { CartContext } from "../context/CartContext";
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
    };

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
        </div>
    );
};

export default UserLayout;