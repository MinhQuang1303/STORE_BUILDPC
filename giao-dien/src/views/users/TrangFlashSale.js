import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Zap, Timer, ShoppingCart, Flame, TrendingDown } from "lucide-react";

const TrangFlashSale = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [salePercent, setSalePercent] = useState(0);

    useEffect(() => {
        // 1. Tính toán phần trăm giảm giá theo NGÀY hiện tại (Kịch bản tự động)
        const day = new Date().getDate();
        // Logic: Càng về cuối tháng giảm càng sâu (Tối thiểu 20%, tối đa 50%)
        const calculatedPercent = Math.min(50, 20 + Math.floor(day / 2));
        setSalePercent(calculatedPercent);

        // 2. Lấy sản phẩm ngẫu nhiên để làm Flash Sale
        axios.get("http://localhost:5000/api/san-pham")
            .then(res => {
                const allData = Array.isArray(res.data) ? res.data : (res.data.products || []);
                const shuffled = [...allData].sort(() => 0.5 - Math.random());
                setProducts(shuffled.slice(0, 8));
            });

        // 3. ĐẾM NGƯỢC ĐẾN KẾT THÚC THÁNG 4 (30/04)
        const timer = setInterval(() => {
            const now = new Date();
            const campaignEnd = new Date(2026, 3, 30, 23, 59, 59); // Tháng 3 là tháng 4 (0-indexed)
            
            const diff = campaignEnd - now;
            if (diff <= 0) {
                clearInterval(timer);
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
            } else {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);
                setTimeLeft({ d, h, m, s });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen py-16 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                {/* HERO FLASH SALE */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-[50px] p-12 text-white shadow-2xl mb-16 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 opacity-10 rotate-12">
                        <Zap size={400} fill="white"/>
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 flex items-center gap-4">
                                <Zap className="animate-bounce" fill="white" size={60}/> Flash Sale
                            </h1>
                            <p className="text-xl font-bold bg-white/20 inline-block px-4 py-1 rounded-full border border-white/30 italic">
                                Siêu Ưu Đãi Tháng {new Date().getMonth() + 1} - Giảm độc quyền lên tới {salePercent}%!
                            </p>
                        </div>

                        <div className="bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center min-w-[300px]">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                                <Timer size={14}/> Kết thúc sau
                            </p>
                            <div className="flex gap-4 justify-center">
                                {[timeLeft.d, timeLeft.h, timeLeft.m, timeLeft.s].map((t, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-white text-red-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
                                            {String(t).padStart(2, '0')}
                                        </div>
                                        <span className="text-[10px] uppercase font-black mt-2 opacity-70">
                                            {i === 0 ? "Ngày" : i === 1 ? "Giờ" : i === 2 ? "Phút" : "Giây"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRODUCT LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(p => {
                        const price = p.gia || 0;
                        const discountedPrice = Math.floor(price * (1 - salePercent / 100));
                        
                        return (
                            <div key={p._id} className="bg-white rounded-[40px] p-8 border-2 border-slate-50 hover:border-red-500 hover:shadow-2xl transition-all group relative overflow-hidden shadow-sm">
                                {/* Discount Badge - LÀM NỔI BẬT HƠN */}
                                <div className="absolute top-0 right-0 bg-red-600 text-white font-black italic px-6 py-3 rounded-bl-[30px] text-lg shadow-xl z-20 flex flex-col items-center leading-none">
                                    <span className="text-[10px] uppercase font-black opacity-80 mb-1">GIẢM</span>
                                    {salePercent}%
                                </div>

                                <div className="h-48 flex items-center justify-center mb-8 relative">
                                    <img src={p.anh} alt={p.ten} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-3xl scale-125"></div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-800 line-clamp-2 text-sm uppercase italic h-10 leading-tight">{p.ten}</h3>
                                    
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-50 w-fit px-3 py-1 rounded-full">
                                        <Flame size={12} className="text-orange-500 animate-pulse"/> Đã bán: {Math.floor(Math.random() * 50) + 120}
                                    </div>

                                    {/* PHẦN GIÁ RÕ RÀNG NHƯ YÊU CẦU */}
                                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-400 text-sm line-through font-bold decoration-red-500/50 decoration-2">{price.toLocaleString()}đ</span>
                                            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-md font-black italic">TIẾT KIỆM {(price - discountedPrice).toLocaleString()} đ</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="text-4xl font-black text-red-600 tracking-tighter drop-shadow-sm">{discountedPrice.toLocaleString()}<span className="text-lg ml-1">đ</span></div>
                                            <button 
                                                onClick={() => navigate(`/san-pham/${p._id}`)}
                                                className="bg-slate-900 text-white p-4 rounded-[20px] hover:bg-red-600 hover:rotate-12 hover:scale-110 transition-all shadow-xl shadow-red-500/10"
                                            >
                                                <TrendingDown size={24}/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar Hỏa Tốc */}
                                    <div className="mt-6">
                                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                                            <span className="text-red-500">🔥 Sắp cháy hàng</span>
                                            <span>85%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-[2px]">
                                            <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FOOTER SALE */}
                <div className="mt-20 text-center">
                    <p className="text-slate-400 font-bold italic uppercase flex items-center justify-center gap-2">
                        <Zap size={16}/> Ưu đãi tự động làm mới mỗi 24h. Đừng bỏ lỡ! <Zap size={16}/>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrangFlashSale;
