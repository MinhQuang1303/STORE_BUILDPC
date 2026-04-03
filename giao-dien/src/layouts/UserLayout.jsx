import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from "../context/CartContext";
import ThanhThongBaoKhuyenMai from "../components/ThanhThongBaoKhuyenMai";
import { 
    Search, ShoppingCart, User, LogOut, 
    ChevronDown, LayoutGrid, Cpu, Monitor, HardDrive, Zap, Box, Wind, MemoryStick,
    Phone, MapPin, ShieldCheck, Truck
} from 'lucide-react';

const UserLayout = () => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // Live Search States
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/san-pham")
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
        { name: "Tản nhiệt CPU", icon: <Wind size={18}/>, path: "/san-pham?cat=cooler" },
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
                        <span className="flex items-center gap-2 hover:text-white cursor-pointer"><Phone size={14}/> Hotline: 1900 1234</span>
                        <span className="flex items-center gap-2 hover:text-white cursor-pointer"><MapPin size={14}/> Hệ thống Showroom</span>
                    </div>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2 hover:text-white cursor-pointer"><ShieldCheck size={14}/> Chính sách bảo hành</span>
                        <span className="flex items-center gap-2 hover:text-white cursor-pointer"><Truck size={14}/> Tra cứu đơn hàng</span>
                    </div>
                </div>
            </div>

            {/* --- MAIN HEADER (Red E-commerce Style) --- */}
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

                    {/* SEARCH BAR (Big & Prominent) */}
                    <div className="flex-1 max-w-3xl relative hidden md:block group">
                        <input
                            type="text"
                            placeholder="Bạn cần tìm linh kiện gì? (Nhấn Enter)"
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onKeyDown={(e) => {
                                if(e.key === "Enter") {
                                    setIsSearchFocused(false);
                                    navigate(`/san-pham?q=${e.target.value}`);
                                }
                            }}
                        />
                        
                        {/* HIỂN THỊ GỢI Ý KẾT QUẢ TÌM KIẾM */}
                        {isSearchFocused && searchTerm.trim() !== "" && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2">
                                {suggestedProducts.length > 0 ? (
                                    <>
                                        {suggestedProducts.map(p => (
                                            <div 
                                                key={p._id} 
                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // Tránh bị onBlur cướp focus
                                                    navigate(`/san-pham/${p._id}`);
                                                    setSearchTerm("");
                                                    setIsSearchFocused(false);
                                                }}
                                            >
                                                <img src={p.anh} alt={p.ten} className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-100 p-1" />
                                                <div className="flex-1 overflow-hidden">
                                                    <h4 className="text-sm font-bold truncate text-slate-800">{p.ten}</h4>
                                                    <p className="text-xs font-bold text-red-500 mt-1">{p.gia?.toLocaleString()} đ</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div 
                                            className="p-3 bg-blue-50 text-center text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors"
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Tránh bị onBlur cướp focus
                                                navigate(`/san-pham?q=${searchTerm}`);
                                                setSearchTerm("");
                                                setIsSearchFocused(false);
                                            }}
                                        >
                                            Xem tất cả kết quả cho "{searchTerm}"
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-500">
                                        Không tìm thấy sản phẩm nào khớp với "{searchTerm}".
                                    </div>
                                )}
                            </div>
                        )}
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
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><ChevronDown size={14} className="-rotate-90"/> Giới thiệu hệ thống</li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><ChevronDown size={14} className="-rotate-90"/> Hệ thống showroom</li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><ChevronDown size={14} className="-rotate-90"/> Tuyển dụng</li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><ChevronDown size={14} className="-rotate-90"/> Chính sách bảo mật</li>
                        </ul>
                    </div>

                    {/* Col 3 */}
                    <div>
                        <h4 className="font-bold mb-5 text-slate-800 uppercase text-[15px] border-b-2 border-blue-600 pb-2 inline-block">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-3 text-slate-600 text-[14px] font-medium">
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><ChevronDown size={14} className="-rotate-90"/> Hướng dẫn mua hàng online</li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><ChevronDown size={14} className="-rotate-90"/> Hướng dẫn mua trả góp</li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><ChevronDown size={14} className="-rotate-90"/> Chính sách vận chuyển</li>
                            <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"><ChevronDown size={14} className="-rotate-90"/> Chính sách bảo hành & đổi trả</li>
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
        </div>
    );
};

export default UserLayout;