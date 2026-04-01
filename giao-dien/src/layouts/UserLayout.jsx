import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { CartContext } from "../context/CartContext";
import ThanhThongBaoKhuyenMai from "../components/ThanhThongBaoKhuyenMai";
import { 
    Search, ShoppingCart, User, LogOut, 
    ChevronDown, LayoutGrid, Cpu, Monitor, HardDrive,
    Sun, Moon // Thêm icon mặt trời/mặt trăng
} from 'lucide-react';

const UserLayout = () => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    
    // --- LOGIC DARK MODE ---
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    // -----------------------

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
        <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#020617] font-sans transition-colors duration-500">
            {/* --- TOP HEADER --- */}
            <nav className="sticky top-0 z-[1000] bg-[#0f172a]/95 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-8">
                    
                    {/* LOGO */}
                    <div className="text-2xl font-black tracking-tighter cursor-pointer group flex items-center" onClick={() => navigate("/")}>
                        <span className="text-blue-500 group-hover:text-blue-400 transition-colors">STORE</span>
                        <span className="text-white italic underline decoration-blue-500 decoration-4">BUILD</span>
                        <span className="bg-blue-600 px-2 py-1 rounded-lg ml-1 text-sm self-start shadow-lg shadow-blue-500/50">PC</span>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="flex-1 max-w-xl relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm linh kiện..."
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 outline-none transition-all text-sm"
                            onKeyDown={(e) => e.key === "Enter" && navigate(`/san-pham?q=${e.target.value}`)}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">
                        {/* NÚT CHUYỂN DARK MODE */}
                        <button 
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-400 dark:text-blue-400 transition-all border border-slate-700 active:scale-90"
                            title={theme === 'light' ? "Bật chế độ tối" : "Bật chế độ sáng"}
                        >
                            {theme === "light" ? <Moon size={20} fill="currentColor"/> : <Sun size={20} fill="currentColor"/>}
                        </button>

                        <Link to="/build" className="hidden lg:block font-bold text-xs uppercase text-orange-400 hover:text-orange-300 transition-colors tracking-widest border border-orange-400/30 px-3 py-2 rounded-xl">Build PC</Link>

                        {/* GIỎ HÀNG */}
                        <div className="relative p-2.5 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-700" onClick={() => navigate("/gio-hang")}>
                            <ShoppingCart size={22} />
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f172a] shadow-lg shadow-blue-500/50">
                                {cartItems?.length || 0}
                            </span>
                        </div>

                        {/* AUTH SECTION */}
                        {user ? (
                            <div className="flex items-center gap-3 ml-2 border-l border-slate-700 pl-4">
                                <div className="text-right hidden sm:block leading-tight">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Member</p>
                                    <p className="text-sm font-bold text-blue-400 truncate max-w-[80px]">{user.username}</p>
                                </div>
                                <div className="relative group">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute top-full right-0 mt-4 w-56 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
                                        <Link to="/profile" className="flex items-center gap-2 p-3 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold transition-colors">
                                            <User size={16} className="text-blue-500"/> Hồ sơ cá nhân
                                        </Link>
                                        <Link to="/don-hang-cua-toi" className="flex items-center gap-2 p-3 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold transition-colors">
                                            📦 Đơn hàng
                                        </Link>
                                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                                        <button onClick={handleDangXuat} className="w-full flex items-center gap-2 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-bold transition-colors">
                                            <LogOut size={16} /> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => navigate("/dang-nhap")} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-600/30">
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <ThanhThongBaoKhuyenMai />

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-slate-950 text-white pt-20 pb-10 mt-20 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1">
                        <h3 className="text-xl font-black italic mb-6">STORE_BUILD<span className="text-blue-500">PC</span></h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Hệ thống Build PC cao cấp hàng đầu Việt Nam.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-slate-400 uppercase text-[10px] tracking-widest">Hỗ trợ</h4>
                        <ul className="space-y-3 text-slate-500 text-sm">
                            <li className="hover:text-blue-500 cursor-pointer">Bảo hành</li>
                            <li className="hover:text-blue-500 cursor-pointer">Giao hàng</li>
                        </ul>
                    </div>
                    <div className="col-span-1 md:col-span-2 bg-slate-900/30 p-8 rounded-[32px] border border-slate-800">
                        <h4 className="font-bold mb-4 text-sm uppercase">Newsletter</h4>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Email..." className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none" />
                            <button className="bg-blue-600 px-6 rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">OK</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-900 flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    <p>© 2026 STORE_BUILDPC</p>
                    <div className="flex gap-6">
                        <span>Privacy</span>
                        <span>Terms</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;