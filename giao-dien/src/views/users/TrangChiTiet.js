import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

const TrangChiTiet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sp, setSp] = useState(null);
  const [soLuong, setSoLuong] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/san-pham/${id}`)
      .then((res) => setSp(res.data))
      .catch((err) => console.error("Lỗi lấy chi tiết:", err));
  }, [id]);

  if (!sp) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-[#0b0f1a] text-slate-500 transition-colors duration-300">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-medium">Đang chuẩn bị dữ liệu sản phẩm...</p>
    </div>
  );

  const listSpecs = sp.thongSo ? sp.thongSo.split(",").map((s) => s.trim()) : [];

  return (
    <div className="bg-slate-50 dark:bg-[#0b0f1a] min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-[1300px] mx-auto px-4">
        
        {/* BREADCRUMB */}
        <div className="text-sm text-slate-400 dark:text-slate-500 mb-6">
           Trang chủ / {sp.loai} / <span className="text-slate-900 dark:text-slate-200 font-semibold">{sp.ten}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* CỘT TRÁI: HÌNH ẢNH (4/12) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 sticky top-5">
              <img 
                src={sp.anh} 
                alt={sp.ten} 
                className="max-w-full max-h-[450px] object-contain hover:scale-105 transition-transform duration-500 cursor-zoom-in" 
              />
            </div>
            <div className="flex gap-4 mt-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl p-2 border border-slate-200 dark:border-slate-700 cursor-pointer overflow-hidden">
                        <img src={sp.anh} className="w-full h-full object-contain opacity-60 hover:opacity-100 transition-opacity" alt="thumbnail" />
                    </div>
                ))}
            </div>
          </div>

          {/* CỘT GIỮA: THÔNG TIN (7/12) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <span className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest">{sp.loai}</span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2 mb-4 leading-tight">{sp.ten}</h1>
                
                <div className="flex items-center gap-4 mb-6 text-sm">
                    <div className="text-yellow-400 flex">⭐⭐⭐⭐⭐</div>
                    <span className="text-slate-400 dark:text-slate-500">(24 đánh giá)</span>
                    <span className="text-slate-200 dark:text-slate-700">|</span>
                    <span className="text-slate-500 font-mono">ID: {sp._id.substring(18).toUpperCase()}</span>
                </div>

                <div className="flex items-baseline gap-4 mb-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl">
                    <div className="text-4xl font-black text-red-500">{sp.gia?.toLocaleString()} <span className="text-lg">đ</span></div>
                    <div className="text-lg text-slate-400 line-through">{(sp.gia * 1.1).toLocaleString()} đ</div>
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg font-bold text-sm">-10%</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">✅ Bảo hành chính hãng 36 tháng</div>
                    <div className="flex items-center gap-2">💳 Hỗ trợ trả góp 0%</div>
                    <div className="flex items-center gap-2">🛠️ Miễn phí lắp đặt tận nơi</div>
                    <div className="flex items-center gap-2">🚚 Giao hàng hỏa tốc 2h</div>
                </div>

                {/* ACTION BOX */}
                <div className="border-t border-slate-100 dark:border-slate-700 pt-8">
                    <div className="flex items-center gap-6 mb-6">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Số lượng:</span>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                            <button onClick={() => setSoLuong(Math.max(1, soLuong - 1))} className="w-10 h-10 flex items-center justify-center text-xl font-bold hover:text-blue-500 transition-colors">-</button>
                            <input type="number" value={soLuong} readOnly className="w-12 text-center bg-transparent font-black dark:text-white" />
                            <button onClick={() => setSoLuong(soLuong + 1)} className="w-10 h-10 flex items-center justify-center text-xl font-bold hover:text-blue-500 transition-colors">+</button>
                        </div>
                        <span className="text-orange-500 text-xs font-bold animate-pulse italic">⚡ Chỉ còn 5 sản phẩm cuối!</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => addToCart(sp, soLuong)}
                            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                        >
                            <span className="text-2xl text-white">🛒</span> THÊM VÀO GIỎ HÀNG
                        </button>
                        <button 
                            onClick={() => navigate("/build")}
                            className="flex-1 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            🛠️ BUILD PC
                        </button>
                    </div>
                </div>
            </div>

            {/* CHÍNH SÁCH NHANH */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                        <p className="text-xs font-bold dark:text-white">Lỗi là đổi</p>
                        <p className="text-[10px] text-slate-400">1 đổi 1 trong 15 ngày</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                        <p className="text-xs font-bold dark:text-white">Chính hãng</p>
                        <p className="text-[10px] text-slate-400">Đền x10 nếu hàng giả</p>
                    </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex items-center gap-3">
                    <span className="text-2xl">🎁</span>
                    <p className="text-[11px] font-bold text-orange-700 dark:text-orange-400">Tặng Voucher 200k khi mua kèm Màn hình.</p>
                </div>
            </div>
          </div>
        </div>

        {/* THÔNG SỐ KỸ THUẬT */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex border-b border-slate-100 dark:border-slate-700">
                <button className="px-8 py-5 font-black text-blue-600 border-b-4 border-blue-600 text-sm">THÔNG SỐ KỸ THUẬT</button>
                <button className="px-8 py-5 font-bold text-slate-400 dark:text-slate-500 text-sm hover:text-slate-600 transition-colors">ĐÁNH GIÁ (24)</button>
            </div>
            <div className="p-8">
                <div className="max-w-3xl">
                    <table className="w-full text-sm text-left">
                        <tbody>
                            {listSpecs.map((spec, index) => {
                                const [label, value] = spec.split(":");
                                return (
                                    <tr key={index} className={`${index % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-900/20" : ""} border-b border-slate-50 dark:border-slate-700/50`}>
                                        <td className="py-4 px-6 font-bold text-slate-500 dark:text-slate-400 w-1/3 italic">{label?.trim() || "Tính năng"}</td>
                                        <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-200">{value?.trim() || spec}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TrangChiTiet;