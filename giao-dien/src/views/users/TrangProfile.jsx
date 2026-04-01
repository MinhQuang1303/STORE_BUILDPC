import React, { useState } from 'react';
import { 
    User, MapPin, Phone, ShieldCheck, History, 
    Bell, Lock, Trash2, Camera, Save, XCircle,
    LogIn, Edit3, Cpu, CheckCircle2, ShieldAlert, KeyRound, Smartphone,
    Mail, MessageSquare, Globe, Zap
} from 'lucide-react';

const TrangProfile = () => {
    const savedData = JSON.parse(localStorage.getItem("user"));
    const initialUser = savedData?.user || savedData || {};

    const [user, setUser] = useState(initialUser);
    const [activeTab, setActiveTab] = useState("thong-tin");
    
    // State cho 2FA
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    // State cho Thông báo
    const [notifications, setNotifications] = useState({
        emailOrder: true,
        emailPromo: false,
        smsLogin: true,
        webNews: true
    });

    // Form data cho Thông tin tài khoản
    const [formData, setFormData] = useState({
        username: initialUser.username || "Nghĩa",
        email: initialUser.email || "test@gmail.com",
        phone: initialUser.phone || "0708636496",
        address: initialUser.address || "Đường Trường Lưu"
    });

    // State riêng cho Địa chỉ giao hàng
    const [shippingData, setShippingData] = useState({
        receiverName: initialUser.username || "Nghĩa",
        receiverPhone: "0708636496",
        city: "TP. Hồ Chí Minh",
        district: "TP. Thủ Đức",
        detail: "Đường Trường Lưu, Phường Long Trường"
    });

    // Dữ liệu mẫu cho Lịch sử hoạt động
    const [activities] = useState([
        { id: 1, content: "Đăng nhập hệ thống", time: "14:15 - 01/04/2026", icon: <LogIn size={16}/>, status: "Thành công" },
        { id: 2, content: "Cập nhật thông tin cá nhân", time: "10:30 - 01/04/2026", icon: <Edit3 size={16}/>, status: "Thành công" },
        { id: 3, content: "Build cấu hình PC: Gaming Gen 14", time: "21:00 - 31/03/2026", icon: <Cpu size={16}/>, status: "Hoàn tất" },
        { id: 4, content: "Thay đổi địa chỉ giao hàng", time: "15:20 - 30/03/2026", icon: <MapPin size={16}/>, status: "Thành công" }
    ]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShippingChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveProfile = () => {
        const newData = { ...savedData, user: { ...initialUser, ...formData } };
        localStorage.setItem("user", JSON.stringify(newData));
        setUser(newData.user);
        alert("🎉 Thông tin đã được cập nhật!");
        window.dispatchEvent(new Event("storage")); 
    };

    const menuItems = [
        { id: "thong-tin", label: "Thông tin cá nhân", icon: <User size={18}/> },
        { id: "dia-chi", label: "Địa chỉ giao hàng", icon: <MapPin size={18}/> },
        { id: "lich-su", label: "Lịch sử hoạt động", icon: <History size={18}/> },
        { id: "bao-mat", label: "Bảo mật & 2FA", icon: <ShieldCheck size={18}/> },
        { id: "thong-bao", label: "Cài đặt thông báo", icon: <Bell size={18}/> },
    ];

    // Helper component cho Toggle Switch
    const Toggle = ({ enabled, onClick }) => (
        <button 
            onClick={onClick}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`}></div>
        </button>
    );

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
                    
                    {/* --- SIDEBAR --- */}
                    <div className="w-full shrink-0 sticky top-24">
                        <div className="bg-white dark:bg-[#0f172a] rounded-[32px] p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-500">
                            <div className="flex flex-col items-center mb-10">
                                <div className="relative group">
                                    <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-4xl font-black text-blue-600 shadow-inner group-hover:scale-105 transition-transform border border-transparent dark:border-slate-700">
                                        {formData.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 rounded-xl shadow-lg text-white hover:bg-blue-700 transition-all">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <h2 className="mt-5 font-bold text-lg text-slate-800 dark:text-white uppercase tracking-tighter">{formData.username}</h2>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-widest">{user.email}</p>
                            </div>

                            <nav className="space-y-1.5">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                                            activeTab === item.id 
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600"
                                        }`}
                                    >
                                        {item.icon} {item.label}
                                    </button>
                                ))}
                                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                        <Trash2 size={18}/> Xóa tài khoản
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <div className="w-full bg-white dark:bg-[#0f172a] rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-500">
                        
                        {/* TAB: THÔNG TIN CÁ NHÂN */}
                        {activeTab === "thong-tin" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter text-slate-800 dark:text-white">
                                    Thông tin tài khoản
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Tên của bạn</label>
                                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold text-slate-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2 opacity-60">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Email (Liên kết)</label>
                                        <input type="email" value={formData.email} disabled className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-slate-400 cursor-not-allowed italic" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Điện thoại</label>
                                        <div className="flex gap-3">
                                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold text-slate-800 dark:text-white" />
                                            <button className="px-5 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shrink-0">Xác minh</button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Địa chỉ</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold text-slate-800 dark:text-white" />
                                    </div>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <button onClick={handleSaveProfile} className="flex-1 md:flex-none px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Save size={16}/> Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TAB: ĐỊA CHỈ GIAO HÀNG */}
                        {activeTab === "dia-chi" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter text-slate-800 dark:text-white">
                                    Thông tin nhận hàng
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Tên người nhận</label>
                                        <input type="text" name="receiverName" value={shippingData.receiverName} onChange={handleShippingChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold text-slate-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Số điện thoại nhận hàng</label>
                                        <input type="text" name="receiverPhone" value={shippingData.receiverPhone} onChange={handleShippingChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold text-slate-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Tỉnh / Thành phố</label>
                                        <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold text-slate-800 dark:text-white appearance-none">
                                            <option>{shippingData.city}</option>
                                            <option>Hà Nội</option>
                                            <option>Đà Nẵng</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Quận / Huyện / TP</label>
                                        <input type="text" name="district" value={shippingData.district} onChange={handleShippingChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold text-slate-800 dark:text-white" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] ml-1">Địa chỉ chi tiết (Số nhà, tên đường, phường...)</label>
                                        <textarea name="detail" rows="3" value={shippingData.detail} onChange={handleShippingChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold text-slate-800 dark:text-white resize-none" />
                                    </div>
                                </div>
                                <div className="mt-10 flex gap-4">
                                    <button onClick={() => alert("✅ Đã lưu địa chỉ nhận hàng!")} className="flex-1 md:flex-none px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Save size={16}/> Lưu địa chỉ giao hàng
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TAB: LỊCH SỬ HOẠT ĐỘNG */}
                        {activeTab === "lich-su" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
                                        Lịch sử hoạt động
                                    </h3>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Dọn dẹp</button>
                                </div>
                                
                                <div className="space-y-4">
                                    {activities.map((act) => (
                                        <div key={act.id} className="group flex items-center gap-5 p-6 rounded-[28px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 hover:border-blue-500/50 transition-all duration-300">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                {act.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-[15px]">{act.content}</p>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/5 px-2 py-1 rounded-lg self-start md:self-center">
                                                        {act.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">{act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <button className="px-8 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-blue-600 transition-all border border-slate-100 dark:border-slate-800">
                                        Xem thêm lịch sử
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TAB: BẢO MẬT & 2FA */}
                        {activeTab === "bao-mat" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter text-slate-800 dark:text-white">
                                    Bảo mật hệ thống
                                </h3>

                                <div className="mb-10 p-6 rounded-[32px] bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Trạng thái tài khoản</p>
                                        <h4 className="text-lg font-bold text-slate-800 dark:text-white">Rất an toàn</h4>
                                    </div>
                                    <div className="ml-auto hidden md:block">
                                        <span className="text-[10px] font-black bg-emerald-500 text-white px-4 py-2 rounded-full uppercase tracking-tighter">Đã kiểm tra 100%</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Smartphone className="text-blue-600" size={20} />
                                            <h4 className="font-black text-sm uppercase tracking-widest text-slate-800 dark:text-white">Xác thực 2 lớp (2FA)</h4>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Thêm một lớp bảo mật bằng cách yêu cầu mã xác nhận từ điện thoại khi đăng nhập.
                                        </p>
                                        <div className={`p-6 rounded-[28px] border transition-all duration-300 flex items-center justify-between ${is2FAEnabled ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${is2FAEnabled ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <span className={`font-bold text-sm ${is2FAEnabled ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {is2FAEnabled ? "Đang bật" : "Đang tắt"}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                                className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${is2FAEnabled ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-700'}`}
                                            >
                                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${is2FAEnabled ? 'left-7' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <KeyRound className="text-blue-600" size={20} />
                                            <h4 className="font-black text-sm uppercase tracking-widest text-slate-800 dark:text-white">Đổi mật khẩu</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Mật khẩu hiện tại</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800 dark:text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Mật khẩu mới</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800 dark:text-white" />
                                            </div>
                                            <button className="w-full py-4 bg-slate-800 dark:bg-slate-700 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cập nhật mật khẩu</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 p-6 rounded-[32px] border border-orange-100 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-500/5 flex items-start gap-4">
                                    <ShieldAlert className="text-orange-500 shrink-0" size={24} />
                                    <div>
                                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Lưu ý quan trọng</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Khi bật 2FA, bạn sẽ cần ứng dụng Google Authenticator hoặc tin nhắn SMS để lấy mã đăng nhập. Đừng chia sẻ mã này với bất kỳ ai.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: CÀI ĐẶT THÔNG BÁO (MỚI CẬP NHẬT) */}
                        {activeTab === "thong-bao" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
                                            Cài đặt thông báo
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1 italic">Tùy chỉnh cách chúng tôi liên lạc với bạn</p>
                                    </div>
                                    <Zap className="text-yellow-500 animate-pulse" size={24} />
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Email Notifications */}
                                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                                                <Mail size={20} />
                                            </div>
                                            <h4 className="font-black text-[12px] uppercase tracking-[0.15em] text-slate-800 dark:text-white">Thông báo qua Email</h4>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-slate-700 dark:text-slate-200">Cập nhật đơn hàng</p>
                                                    <p className="text-xs text-slate-400">Nhận email khi trạng thái đơn hàng thay đổi</p>
                                                </div>
                                                <Toggle enabled={notifications.emailOrder} onClick={() => toggleNotification('emailOrder')} />
                                            </div>
                                            <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-slate-700 dark:text-slate-200">Khuyến mãi & Ưu đãi</p>
                                                    <p className="text-xs text-slate-400">Đừng bỏ lỡ các đợt giảm giá linh kiện PC</p>
                                                </div>
                                                <Toggle enabled={notifications.emailPromo} onClick={() => toggleNotification('emailPromo')} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Channels */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* SMS */}
                                        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl shrink-0">
                                                    <MessageSquare size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-[12px] uppercase tracking-[0.15em] text-slate-800 dark:text-white mb-1">Tin nhắn SMS</h4>
                                                    <p className="text-xs text-slate-400 leading-relaxed">Mã OTP và cảnh báo đăng nhập lạ</p>
                                                </div>
                                            </div>
                                            <Toggle enabled={notifications.smsLogin} onClick={() => toggleNotification('smsLogin')} />
                                        </div>

                                        {/* Web Push */}
                                        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl shrink-0">
                                                    <Globe size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-[12px] uppercase tracking-[0.15em] text-slate-800 dark:text-white mb-1">Trình duyệt</h4>
                                                    <p className="text-xs text-slate-400 leading-relaxed">Tin tức công nghệ và sự kiện mới nhất</p>
                                                </div>
                                            </div>
                                            <Toggle enabled={notifications.webNews} onClick={() => toggleNotification('webNews')} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex justify-end">
                                    <button onClick={() => alert("🔔 Đã lưu cài đặt thông báo!")} className="px-10 py-4 bg-slate-800 dark:bg-slate-700 hover:bg-blue-600 text-white rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2">
                                        Lưu cấu hình
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrangProfile;