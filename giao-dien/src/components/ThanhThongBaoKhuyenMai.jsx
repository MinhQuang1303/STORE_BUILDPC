import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Ticket, Zap, Sparkles } from "lucide-react";

const ThanhThongBaoKhuyenMai = () => {
  const [promotions, setPromotions] = useState([]);

  const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const apiBase = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get(`${apiBase}/ma-giam-gia`);
        const now = new Date();
        const validPromotions = (res.data || []).filter((item) => {
          const batDau = item.ngayBatDau ? new Date(item.ngayBatDau) : null;
          const hetHan = item.ngayHetHan ? new Date(item.ngayHetHan) : null;
          return item.trangThai && (!batDau || batDau <= now) && (!hetHan || hetHan >= now) && (item.daSuDung < item.soLuong);
        });
        setPromotions(validPromotions);
      } catch (error) {
        setPromotions([]);
      }
    };
    fetchPromotions();
  }, [apiBase]);

  const promoItems = useMemo(() => {
    if (promotions.length === 0) return [];
    return promotions.map((item) => {
      const giaTri = item.loaiGiamGia === "phanTram" 
        ? `${item.giaTri}%` 
        : `${(item.giaTri / 1000).toFixed(0)}K`;
      return { ma: item.ma, noiDung: `GIẢM ${giaTri} ĐƠN TỪ ${(item.giaTriDonHangToiThieu / 1000).toFixed(0)}K` };
    });
  }, [promotions]);

  if (promoItems.length === 0) return null;

  return (
    <div className="relative group overflow-hidden bg-[#0f172a] border-b border-white/10 py-2">
      {/* Lớp nền Gradient mờ ảo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 animate-pulse"></div>
      
      <div className="relative flex items-center h-7 px-4">
        {/* Nhãn "HOT DEAL" cố định bên trái */}
        <div className="z-10 flex items-center gap-1.5 bg-red-600 px-3 py-1 rounded-full shadow-lg shadow-red-500/40 mr-4">
          <Zap size={14} className="fill-white animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Hot Deal</span>
        </div>

        {/* Luồng chữ chạy vô tận (Duplicate để tạo vòng lặp mượt) */}
        <div className="flex whitespace-nowrap animate-marquee group-hover:pause">
          {[...promoItems, ...promoItems].map((promo, idx) => (
            <div key={idx} className="flex items-center mx-8 gap-3 text-xs font-bold tracking-wide">
              <Ticket size={14} className="text-blue-400" />
              <span className="text-white/90">MÃ: <span className="text-yellow-400 underline decoration-yellow-400/50 underline-offset-4">{promo.ma}</span></span>
              <span className="text-gray-400 ml-1">•</span>
              <span className="text-blue-100 uppercase italic">{promo.noiDung}</span>
              <Sparkles size={14} className="text-purple-400 ml-2" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
        .pause { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default ThanhThongBaoKhuyenMai;