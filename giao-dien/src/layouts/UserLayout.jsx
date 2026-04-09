import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from "../context/CartContext";
import ThanhThongBaoKhuyenMai from "../components/ThanhThongBaoKhuyenMai";
import CustomerChatWidget from "../components/CustomerChatWidget";
import AdminNotificationBell from "../components/AdminNotificationBell";
import CustomerNotificationBell from "../components/CustomerNotificationBell";
import { 
    Search, ShoppingCart, User, LogOut, Bell,
    ChevronDown, LayoutGrid, Cpu, Monitor, HardDrive, Zap, Box, Wind, MemoryStick,
    Phone, MapPin, ShieldCheck, Truck
} from 'lucide-react';

const UserLayout = () => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    // Live Search States
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        axios.get(`${apiUrl}/san-pham`)
            .then(res => setAllProducts(Array.isArray(res.data) ? res.data : (res.data.products || [])))
            .catch(err => console.log(err));
    }, []);

    // Logic lọc sản phẩm theo từ khoá
    const unaccent = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    const suggestedProducts = searchTerm.trim() === "" ? [] : allProducts.filter((p) => {
        const q = unaccent(searchTerm);
        const nameMatch = unaccent(p.ten).includes(q);
        const catMatch = p.loai && unaccent(p.loai).includes(q);
        const catObjMatch = p.idDanhMuc?.ten && unaccent(p.idDanhMuc.ten).includes(q);
        return nameMatch || catMatch || catObjMatch;
    }).slice(0, 5); // Lấy tối đa 5 gợi ý

    const categories = [
        { name: "CPU - Bộ vi xử lý", icon: <Cpu size={18}/>, path: "/san-pham?cat=cpu" },
        { name: "VGA - Card màn hình", icon: <Monitor size={18}/>, path: "/san-pham?cat=vga" },
        { name: "RAM - Bộ nhớ trong", icon: <MemoryStick size={18}/>, path: "/san-pham?cat=ram" },
        { name: "SSD - Ổ cứng", icon: <HardDrive size={18}/>, path: "/san-pham?cat=ssd" },
        { name: "Mainboard - Bo mạch chủ", icon: <LayoutGrid size={18}/>, path: "/san-pham?cat=main" },
        { name: "PSU - Nguồn", icon: <Zap size={18}/>, path: "/san-pham?cat=psu" },
        { name: "Case - Vỏ máy tính", icon: <Box size={18}/>, path: "/san-pham?cat=case" },
        { name: "Tản nhiệt CPU", icon: <Wind size={18}/>, path: "/san-pham?cat=tản nhiệt" },
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
        <div className="min-h-screen flex flex-col bg-[#f1f5f9] font-sans selection:bg-blue-100 selection:text-white">
            {/* --- TOP BAR --- */}
            <div className="bg-slate-900 text-slate-300 text-xs py-2 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-6">
                        <Link to="/ho-tro" className="flex items-center gap-2 hover:text-white cursor-pointer"><Phone size={14}/> Hotline: 1900 1234</Link>
                        <Link to="/showroom" className="flex items-center gap-2 hover:text-white cursor-pointer"><MapPin size={14}/> Hệ thống Showroom</Link>
                    </div>
                    <div className="flex gap-6">
                        <Link to="/bao-hanh" className="flex items-center gap-2 hover:text-white cursor-pointer"><ShieldCheck size={14}/> Chính sách bảo hành</Link>
                        <Link to="/don-hang-cua-toi" className="flex items-center gap-2 hover:text-white cursor-pointer"><Truck size={14}/> Tra cứu đơn hàng</Link>
                    </div>
                </div>
            </div>

            {/* --- MAIN HEADER --- */}
            <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-[1000]">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
                    {/* LOGO */}
                    <div 
                        className="text-3xl font-black tracking-tighter cursor-pointer flex items-center shrink-0"
                        onClick={() => navigate("/")}
                    >
                        <span className="text-white">STORE</span>
                        <span className="text-blue-400 italic mx-1">BUILD</span>
                        <span className="bg-white text-blue-600 px-2 py-0.5 rounded-lg text-xl self-center ml-1 shadow-inner">PC</span>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="flex-1 max-w-3xl relative hidden md:block group">
                        <input
                            type="text"
                            placeholder="Nhập tên linh kiện, mã sản phẩm bạn cần tìm..."
                            className="w-full pl-4 pr-12 py-3 bg-white text-slate-800 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all font-medium border-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onKeyDown={(e) => e.key === "Enter" && navigate(`/san-pham?q=${searchTerm}`)}
                        />
                        <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-slate-900 p-1.5 rounded-md text-white hover:bg-slate-800 transition">
                            <Search size={22} />
                        </button>

                        {/* Search Suggestions */}
                        {isSearchFocused && suggestedProducts.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-[1100]">
                                {suggestedProducts.map((p) => (
                                    <div 
                                        key={p._id}
                                        className="flex items-center gap-4 p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0"
                                        onClick={() => {
                                            navigate(`/san-pham/${p._id}`);
                                            setSearchTerm("");
                                        }}
                                    >
                                        <div className="w-12 h-12 flex-shrink-0 bg-white p-1 rounded-lg border border-slate-100">
                                            <img src={p.anh} alt={p.ten} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-slate-800 text-sm truncate">{p.ten}</div>
                                            <div className="text-blue-600 font-black text-sm">{p.gia?.toLocaleString()}đ</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4 shrink-0">
                        <Link to="/build" className="flex items-center gap-2 font-bold text-sm bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <Monitor size={18}/> Build PC
                        </Link>

                        {/* GIỎ HÀNG */}
                        <div 
                            className="relative flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors border border-slate-700 bg-slate-800/80"
                            onClick={() => navigate("/gio-hang")}
                        >
                            <ShoppingCart size={24} />
                            <div className="hidden lg:block text-xs font-bold leading-tight">
                                Giỏ hàng <br/>
                                <span className="text-blue-400">{cartItems?.length || 0} SP</span>
                            </div>
                            <span className="lg:hidden absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">
                                {cartItems?.length || 0}
                            </span>
                        </div>

                        {/* CHUÔNG THÔNG BÁO CHAT */}
                        {user && (
                            user.role === "admin" ? (
                                <div className="mt-1"><AdminNotificationBell iconClassName="text-white" /></div>
                            ) : (
                                <CustomerNotificationBell user={user} unreadChatCount={unreadChatCount} />
                            )
                        )}

                        {/* AUTH SECTION */}
                        {user ? (
                            <div className="relative group">
                                <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-blue-500 transition">
                                    <div className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:block text-xs font-medium">
                                        Xin chào,<br/>
                                        <b className="text-sm truncate w-24 block">{user.username}</b>
                                    </div>
                                </div>
                                {/* DROPDOWN */}
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="p-2 space-y-1">
                                        <Link to="/tai-khoan" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors">
                                            <User size={18} className="text-blue-600"/> Tài khoản của tôi
                                        </Link>
                                        <Link to="/don-hang-cua-toi" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors">
                                            <Box size={18} className="text-blue-600"/> Đơn hàng của tôi
                                        </Link>
                                        {user.role === "admin" && (
                                            <Link to="/admin" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors">
                                                <ShieldCheck size={18} className="text-purple-600"/> Quản trị hệ thống
                                            </Link>
                                        )}
                                        <button onClick={handleDangXuat} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-red-600 rounded-lg text-sm font-semibold transition-colors">
                                            <LogOut size={18} /> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => navigate("/dang-nhap")}
                                className="flex items-center gap-2 p-2 px-3 border border-white/40 hover:bg-white hover:text-blue-600 rounded-lg font-bold text-sm transition-all shadow-sm"
                            >
                                <User size={20}/> <span className="hidden sm:inline">Đăng nhập</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* --- MEGA MENU BOTTOM BAR --- */}
                <div className="bg-white text-slate-800 border-b border-slate-200 hidden md:block shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 flex relative">
                        {/* Danh mục Main */}
                        <div 
                            className="relative flex items-center gap-2 bg-[#f8fafc] px-6 py-3 font-bold text-sm cursor-pointer border-x border-slate-200 group w-64"
                            onMouseEnter={() => setIsCategoryOpen(true)}
                            onMouseLeave={() => setIsCategoryOpen(false)}
                        >
                            <LayoutGrid size={18} className="text-blue-600"/> 
                            DANH MỤC LINH KIỆN
                            <ChevronDown size={14} className="ml-auto text-slate-400 group-hover:rotate-180 transition-transform"/>

                            {/* DROPDOWN MENU */}
                            {isCategoryOpen && (
                                <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-t-0 border-slate-100 rounded-b-lg z-50 overflow-hidden">
                                    {categories.map((cat, idx) => (
                                        <Link 
                                            key={idx} 
                                            to={cat.path}
                                            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 hover:text-blue-600 border-b border-slate-50 transition-colors group/item"
                                        >
                                            <span className="text-slate-400 group-hover/item:text-blue-600 transition-colors">{cat.icon}</span>
                                            <span className="font-semibold text-[14px]">{cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick links */}
                        <div className="flex items-center flex-1">
                            <Link to="/flash-sale" className="px-5 py-3 text-[14px] font-bold text-red-600 hover:scale-105 active:scale-95 ml-4 flex items-center gap-2 bg-red-50 rounded-full px-6 py-1.5 transition-all animate-pulse shadow-sm border border-red-100">
                                <Zap size={16} fill="#dc2626"/> SIÊU ƯU ĐÃI THÁNG 4 - GIẢM ĐẾN 50%!
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <ThanhThongBaoKhuyenMai />

            {/* --- PAGE CONTENT --- */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-white border-t border-slate-200 pt-16 mt-20">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Col 1 */}
                    <div className="col-span-1">
                        <div className="text-3xl font-black tracking-tighter mb-4 flex items-center">
                            <span className="text-slate-800">STORE</span>
                            <span className="text-blue-600 italic mx-1">BUILD</span>
                            <span className="bg-slate-900 text-white px-2 py-0.5 rounded-lg text-xl ml-1">PC</span>
                        </div>
                        <p className="text-slate-600 text-[14px] leading-relaxed mb-5">
                            Hệ thống bán lẻ linh kiện máy tính, PC Gaming, PC Đồ họa hàng đầu. Cam kết chính hãng 100%, bảo hành uy tín 1 đổi 1.
                        </p>
                        <div className="font-black text-blue-600 text-2xl flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <Phone size={24} fill="#2563eb"/> 1900.1234
                        </div>
                    </div>

                    {/* Col 2 */}
                    <div>
                        <h4 className="font-bold mb-5 text-slate-800 uppercase text-[15px] border-b-2 border-blue-600 pb-2 inline-block">Về chúng tôi</h4>
                        <ul className="space-y-3 text-slate-600 text-[14px] font-medium">
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><Link to="/gioi-thieu" className="flex items-center gap-2 underline-offset-4 hover:underline">Giới thiệu hệ thống</Link></li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><Link to="/showroom" className="flex items-center gap-2 underline-offset-4 hover:underline">Hệ thống showroom</Link></li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><Link to="/tuyen-dung" className="flex items-center gap-2 underline-offset-4 hover:underline">Tuyển dụng</Link></li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><Link to="/bao-mat" className="flex items-center gap-2 underline-offset-4 hover:underline">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>

                    {/* Col 3 */}
                    <div>
                        <h4 className="font-bold mb-5 text-slate-800 uppercase text-[15px] border-b-2 border-blue-600 pb-2 inline-block">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-3 text-slate-600 text-[14px] font-medium">
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><Link to="/huong-dan-mua-hang" className="flex items-center gap-2 underline-offset-4 hover:underline">Hướng dẫn mua hàng online</Link></li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><Link to="/tra-gop" className="flex items-center gap-2 underline-offset-4 hover:underline">Hướng dẫn mua trả góp</Link></li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><Link to="/van-chuyen" className="flex items-center gap-2 underline-offset-4 hover:underline">Chính sách vận chuyển</Link></li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><Link to="/bao-hanh" className="flex items-center gap-2 underline-offset-4 hover:underline">Chính sách bảo hành & đổi trả</Link></li>
                        </ul>
                    </div>

                    {/* Col 4 */}
                    <div>
                        <h4 className="font-bold mb-5 text-slate-800 uppercase text-[15px] border-b-2 border-blue-600 pb-2 inline-block">Nhận tin & Thanh toán</h4>
                        <p className="text-slate-600 text-[13px] mb-3">Đăng ký để nhận thông tin khuyến mãi nhanh nhất</p>
                        <div className="flex gap-2 mb-6">
                            <input type="text" placeholder="Email của bạn..." className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition" />
                            <button className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-md shadow-blue-500/30">Gửi</button>
                        </div>
                        <div className="flex gap-4 items-center opacity-80 mt-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" width="40" alt="Visa" className="hover:scale-110 transition-transform cursor-pointer" />
                            <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" width="40" alt="Paypal" className="hover:scale-110 transition-transform cursor-pointer" />
                            <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" width="40" alt="Mastercard" className="hover:scale-110 transition-transform cursor-pointer" />
                        </div>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="bg-[#0f172a] py-5">
                    <div className="max-w-7xl mx-auto px-4 text-center flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-slate-400 text-[13px] font-medium">© 2026 STORE BUILD PC. Hệ thống bán lẻ linh kiện PC Gaming hàng đầu Việt Nam.</p>
                        <div className="flex gap-6 text-slate-500 text-[13px] font-semibold">
                            <span className="hover:text-white cursor-pointer transition-colors">Điều khoản dịch vụ</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Quy chế hoạt động</span>
                        </div>
                    </div>
                </div>
            </footer>
            {/* Thêm Chat Widget cho Khách Hàng */}
            {user && user.role !== "admin" && (
                <CustomerChatWidget 
                    user={user} 
                    unreadCount={unreadChatCount} 
                    setUnreadCount={setUnreadChatCount} 
                />
            )}
        </div>
    );
};

export default UserLayout;