import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
    Info, MapPin, Briefcase, ShieldAlert, Headphones, 
    ShoppingCart, CreditCard, Truck, RefreshCw, ChevronRight
} from "lucide-react";

const TrangChinhSach = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Kịch bản nội dung cho từng trang
    const config = {
        "/gioi-thieu": {
            title: "Giới thiệu hệ thống",
            icon: <Info size={32} className="text-blue-600"/>,
            content: (
                <div className="space-y-6 text-slate-700 leading-relaxed">
                    <p className="font-bold text-xl text-slate-900 italic underline">Chào mừng bạn đến với STORE BUILD PC</p>
                    <p>Được thành lập từ năm 2024, chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực cung cấp giải pháp máy tính chuyên sâu tại Việt Nam. Với sứ mệnh mang lại trải nghiệm tối ưu cho Game thủ và Designer chuyên nghiệp.</p>
                    <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-600">
                        <h4 className="font-black mb-2 uppercase text-blue-900">Tầm nhìn & Sứ mệnh</h4>
                        <p className="text-sm">Trở thành hệ thống bán lẻ linh kiện PC hàng đầu, nơi khách hàng không chỉ mua máy tính mà còn được tư vấn giải pháp kỹ thuật tối ưu nhất.</p>
                    </div>
                    <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800" className="rounded-3xl shadow-xl border-4 border-white" alt="văn phòng"/>
                </div>
            )
        },
        "/showroom": {
            title: "Hệ thống Showroom",
            icon: <MapPin size={32} className="text-red-500"/>,
            content: (
                <div className="space-y-8">
                    <div className="group border p-6 rounded-3xl hover:border-red-500 hover:shadow-xl transition-all bg-white">
                        <h4 className="font-black text-lg text-slate-800 mb-2 uppercase italic">Chi nhánh Miền Bắc (Trụ sở chính)</h4>
                        <p className="text-slate-600 text-sm"><MapPin size={14} className="inline mr-2"/> 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội</p>
                        <p className="text-slate-600 text-sm mt-1">📞 Hotline: 1900 1234 (Nhánh 1)</p>
                    </div>
                    <div className="group border p-6 rounded-3xl hover:border-blue-500 hover:shadow-xl transition-all bg-white">
                        <h4 className="font-black text-lg text-slate-800 mb-2 uppercase italic">Chi nhánh Miền Nam</h4>
                        <p className="text-slate-600 text-sm"><MapPin size={14} className="inline mr-2"/> 456 Đường CMT8, Quận 3, TP. Hồ Chí Minh</p>
                        <p className="text-slate-600 text-sm mt-1">📞 Hotline: 1900 1234 (Nhánh 2)</p>
                    </div>
                </div>
            )
        },
        "/tuyen-dung": {
            title: "Cơ hội nghề nghiệp",
            icon: <Briefcase size={32} className="text-orange-500"/>,
            content: (
                <div className="space-y-6">
                    <p className="font-bold text-slate-900 leading-relaxed text-lg italic uppercase tracking-tighter shadow-sm p-4 bg-orange-50 rounded-xl border border-orange-200">Gia nhập đội ngũ NEXTGEN - Cùng nhau bứt phá giới hạn công nghệ!</p>
                    <div className="space-y-4">
                        {[
                            { pos: "Kỹ thuật viên lắp ráp PC", salary: "10-15 Triệu", loc: "Hà Nội" },
                            { pos: "Tư vấn bán hàng (Sales)", salary: "8-20 Triệu (Hoa hồng cao)", loc: "TP.HCM" },
                            { pos: "Nhân viên Content Marketing", salary: "Thỏa thuận", loc: "Hà Nội" }
                        ].map((j, i) => (
                            <div key={i} className="flex justify-between items-center p-5 border-b hover:bg-slate-50 cursor-pointer group">
                                <div>
                                    <h5 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase italic">{j.pos}</h5>
                                    <p className="text-xs text-slate-500">{j.loc} | {j.salary}</p>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:translate-x-2 transition-transform"/>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        "/bao-mat": {
            title: "Chính sách bảo mật",
            icon: <ShieldAlert size={32} className="text-emerald-500"/>,
            content: (
                <div className="space-y-6 text-sm text-slate-600 leading-7">
                    <p>Chúng tôi tôn trọng và cam kết bảo vệ quyền riêng tư của bạn. Việc thu thập thông tin cá nhân được thực hiện minh bạch và an toàn tuyệt đối.</p>
                    <h5 className="font-black text-slate-900 border-l-4 border-emerald-500 pl-3 uppercase">1. Mục đích thu thập thông tin</h5>
                    <p>Xử lý đơn hàng, thông báo về giao hàng và hỗ trợ khách hàng. Cải thiện chất lượng dịch vụ thông qua khảo sát ý kiến.</p>
                    <h5 className="font-black text-slate-900 border-l-4 border-emerald-500 pl-3 uppercase">2. Cam kết bảo mật</h5>
                    <p>Thông tin của bạn sẽ không bao giờ được chia sẻ cho bên thứ ba ngoại trừ các đơn vị vận chuyển cần thiết để hoàn tất đơn hàng.</p>
                </div>
            )
        },
        "/huong-dan-mua-hang": {
            title: "Hướng dẫn mua hàng online",
            icon: <ShoppingCart size={32} className="text-purple-600"/>,
            content: (
                <div className="space-y-6">
                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black flex-shrink-0">1</div>
                        <div><h5 className="font-black text-slate-900 uppercase italic">Tìm kiếm & Lựa chọn</h5><p className="text-sm text-slate-500">Sử dụng thanh tìm kiếm hoặc Build PC để tạo cấu hình ưng ý.</p></div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black flex-shrink-0">2</div>
                        <div><h5 className="font-black text-slate-900 uppercase italic">Kiểm tra giỏ hàng</h5><p className="text-sm text-slate-500">Lựa chọn các linh kiện muốn thanh toán và áp mã giảm giá.</p></div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black flex-shrink-0">3</div>
                        <div><h5 className="font-black text-slate-900 uppercase italic">Xác nhận & Giao hàng</h5><p className="text-sm text-slate-500">Điền thông tin và chờ nhân viên gọi xác nhận trong 15 phút.</p></div>
                    </div>
                </div>
            )
        },
        "/tra-gop": {
            title: "Hướng dẫn mua trả góp",
            icon: <CreditCard size={32} className="text-blue-500"/>,
            content: (
                <div className="space-y-6">
                    <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-500/20">
                        <h4 className="font-black text-2xl uppercase italic tracking-tighter mb-2">Trả góp 0% Lãi suất</h4>
                        <p className="text-sm opacity-90">Hỗ trợ trả góp qua thẻ tín dụng của hơn 20 ngân hàng lớn.</p>
                    </div>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600 font-medium italic">
                        <li>Kỳ hạn linh hoạt: 3, 6, 9, 12 tháng.</li>
                        <li>Không cần chứng minh tài chính, không giữ giấy tờ.</li>
                        <li>Duyệt nhanh trong 5 phút.</li>
                    </ul>
                </div>
            )
        },
        "/van-chuyen": {
            title: "Chính sách vận chuyển",
            icon: <Truck size={32} className="text-slate-800"/>,
            content: (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Truck size={40} className="text-blue-600"/>
                        <div><h5 className="font-black uppercase text-slate-800 italic leading-none mb-1">Giao hàng hỏa tốc 2h</h5><p className="text-xs text-slate-500">Áp dụng cho đơn hàng nội thành Hà Nội & HCM.</p></div>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">Toàn bộ đơn hàng được đóng gói trong thùng xốp chuyên dụng, đảm bảo linh kiện PC không bị va đập trong quá trình vận chuyển toàn quốc.</p>
                </div>
            )
        },
        "/bao-hanh": {
            title: "Chính sách bảo hành",
            icon: <RefreshCw size={32} className="text-blue-500"/>,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl text-center"><h5 className="font-black text-blue-600 uppercase text-lg italic">1 đổi 1</h5><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Trong 15 ngày đầu</p></div>
                        <div className="bg-slate-50 p-4 rounded-2xl text-center"><h5 className="font-black text-blue-600 uppercase text-lg italic">Mượn hàng</h5><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Sử dụng khi BH</p></div>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">Tất cả sản phẩm bán ra đều được bảo hành theo tiêu chuẩn nhà sản xuất. Chúng tôi hỗ trợ gửi bảo hành hộ khách hàng đến các trung tâm của hãng miễn phí tiền công.</p>
                </div>
            )
        },
        "/ho-tro": {
            title: "Hỗ trợ khách hàng",
            icon: <Headphones size={32} className="text-blue-600"/>,
            content: (
                <div className="space-y-8">
                    <div className="text-center py-6">
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2 shadow-sm inline-block px-4 py-2 bg-slate-50 rounded-full border">Đội ngũ kỹ thuật 24/7</p>
                        <h4 className="text-4xl font-black italic tracking-tighter text-blue-600 mt-2">1900 1234</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border rounded-3xl bg-slate-50"><h5 className="font-black uppercase italic text-slate-800">Email kỹ thuật</h5><p className="text-sm text-blue-600 font-bold">tech-support@nextgen.vn</p></div>
                        <div className="p-6 border rounded-3xl bg-slate-50"><h5 className="font-black uppercase italic text-slate-800">Zalo OA</h5><p className="text-sm text-blue-600 font-bold">NEXTGEN Official</p></div>
                    </div>
                </div>
            )
        }
    };

    const currentPage = config[pathname] || config["/gioi-thieu"];

    const menu = [
        { label: "Về chúng tôi", path: "/gioi-thieu", icon: <Info size={16}/> },
        { label: "Hệ thống Showroom", path: "/showroom", icon: <MapPin size={16}/> },
        { label: "Tuyển dụng", path: "/tuyen-dung", icon: <Briefcase size={16}/> },
        { label: "Chính sách bảo mật", path: "/bao-mat", icon: <ShieldAlert size={16}/> },
        { label: "Mua hàng online", path: "/huong-dan-mua-hang", icon: <ShoppingCart size={16}/> },
        { label: "Mua trả góp 0%", path: "/tra-gop", icon: <CreditCard size={16}/> },
        { label: "Chính sách vận chuyển", path: "/van-chuyen", icon: <Truck size={16}/> },
        { label: "Chính sách bảo hành", path: "/bao-hanh", icon: <RefreshCw size={16}/> },
        { label: "Liên hệ hỗ trợ", path: "/ho-tro", icon: <Headphones size={16}/> },
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-16 font-sans">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* SIDEBAR MENU */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                            <div className="p-6 bg-slate-900 text-white"><h3 className="font-black italic uppercase tracking-tighter text-lg">Thông tin cửa hàng</h3></div>
                            <nav className="p-3">
                                {menu.map(item => (
                                    <Link 
                                        key={item.path} 
                                        to={item.path}
                                        className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold border-l-4 transition-all mb-1 ${pathname === item.path ? 'bg-blue-50 text-blue-600 border-blue-600' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50'}`}
                                    >
                                        {item.icon} {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="flex-1">
                        <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-16 border border-slate-100 relative overflow-hidden">
                            {/* Icon nền trang trí mờ */}
                            <div className="absolute -top-10 -right-10 opacity-5">
                                {React.cloneElement(currentPage.icon, { size: 300 })}
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-6 mb-12 border-b border-slate-100 pb-10">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center shadow-inner">
                                        {currentPage.icon}
                                    </div>
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">{currentPage.title}</h2>
                                </div>
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {currentPage.content}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TrangChinhSach;
