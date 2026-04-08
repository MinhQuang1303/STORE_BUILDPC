import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Flame, Clock, ChevronRight } from "lucide-react";

/**
 * FlashSale Component Hub
 * Đã hợp nhất logic từ FlashSale.js và giao diện từ FlashSale.jsx
 * Bản chuẩn Premium cho STORE_BUILDPC
 */
const FlashSale = () => {
    const [danhSachHienTai, setDanhSachHienTai] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Lấy dữ liệu sản phẩm ngẫu nhiên để làm Flash Sale
        const fetchFlashSale = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/san-pham`);
                if (res.data && res.data.length > 0) {
                    const xaoTron = [...res.data].sort(() => 0.5 - Math.random());
                    setDanhSachHienTai(xaoTron.slice(0, 5));
                }
            } catch (err) {
                console.error("Lỗi lấy Flash Sale:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlashSale();

        // 2. Đồng hồ đếm ngược (Kết thúc vào cuối ngày)
        const timer = setInterval(() => {
            const now = new Date();
            const target = new Date();
            target.setHours(23, 59, 59, 999);
            const diff = target - now;

            if (diff > 0) {
                setTimeLeft({
                    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    m: Math.floor((diff / 1000 / 60) % 60),
                    s: Math.floor((diff / 1000) % 60),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNum = (num) => num.toString().padStart(2, "0");

    if (isLoading && danhSachHienTai.length === 0) return null;

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-600 rounded-[2rem] p-6 md:p-8 shadow-2xl">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

            <div className="relative z-10 flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/20 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-lg">
                            <Flame className="text-red-600" size={32} strokeWidth={3} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
                                Flash Sale <span className="text-yellow-400">Rực Lửa</span>
                            </h2>
                            <p className="text-red-100 text-sm font-medium opacity-80">Deal sốc mỗi ngày - Số lượng có hạn</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                        <Clock className="text-yellow-400" size={20} />
                        <span className="text-white/70 text-sm font-bold uppercase tracking-widest hidden sm:block">Kết thúc sau:</span>
                        <div className="flex items-center gap-2 font-mono text-2xl font-black text-white">
                            <span className="bg-white text-red-600 px-2 py-0.5 rounded-lg ml-2">{formatNum(timeLeft.h)}</span>
                            <span className="text-white animate-pulse">:</span>
                            <span className="bg-white text-red-600 px-2 py-0.5 rounded-lg">{formatNum(timeLeft.m)}</span>
                            <span className="text-white animate-pulse">:</span>
                            <span className="bg-white text-red-600 px-2 py-0.5 rounded-lg">{formatNum(timeLeft.s)}</span>
                        </div>
                    </div>
                </div>

                {/* Product Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {danhSachHienTai.map((item) => (
                        <Link 
                            to={`/san-pham/${item._id}`} 
                            key={item._id}
                            className="group bg-white rounded-3xl p-4 flex flex-col hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                        >
                            {/* Hot Badge */}
                            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full z-10 shadow-lg">
                                -35%
                            </div>

                            {/* Image Container */}
                            <div className="h-40 flex items-center justify-center mb-4 relative">
                                <img 
                                    src={item.anh} 
                                    alt={item.ten} 
                                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-red-600/0 to-red-600/0 group-hover:from-red-600/5 transition-all"></div>
                            </div>

                            {/* Info */}
                            <h3 className="font-bold text-slate-800 text-sm leading-tight h-10 overflow-hidden mb-3 line-clamp-2">
                                {item.ten}
                            </h3>

                            <div className="mt-auto">
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-red-600 text-lg font-black">{item.gia?.toLocaleString()}đ</span>
                                    <span className="text-slate-400 text-[10px] line-through">{(item.gia * 1.5).toLocaleString()}đ</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-4 bg-red-100 rounded-full overflow-hidden border border-red-200">
                                    <div 
                                        className="absolute h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-1000" 
                                        style={{ width: "75%" }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[9px] font-black text-white drop-shadow-md">🔥 ĐANG BÁN CHẠY</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer Link */}
                <div className="flex justify-center mt-2">
                    <Link 
                        to="/flash-sale" 
                        className="flex items-center gap-2 text-white/90 hover:text-white font-bold text-sm tracking-widest uppercase transition-all bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full border border-white/10 group"
                    >
                        Xem tất cả deal sốc <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FlashSale;