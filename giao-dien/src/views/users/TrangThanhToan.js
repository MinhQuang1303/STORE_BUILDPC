import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import QRImage from '../../assets/images/QR.jpg'; 

const TrangThanhToan = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { removeSelectedFromCart, showToast } = useCart();
    
    const { items, selectedItemIds, tongCuoi } = location.state || {};

    const [form, setForm] = useState({ ten: "", sdt: "", diaChi: "", ghiChu: "" });
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState("COD");
    const [dangThanhToan, setDangThanhToan] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    const API_BASE = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

    if (!location.state) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-[#0b0f1a] transition-colors duration-300">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Ối! Giỏ hàng của bạn đang trống</h2>
                <button 
                    onClick={() => navigate('/gio-hang')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                >
                    Quay lại giỏ hàng
                </button>
            </div>
        );
    }

    const handleOrder = async () => {
        if (!form.ten || !form.sdt || !form.diaChi) {
            showToast("Vui lòng điền đủ thông tin giao hàng!", "error");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const authToken = currentUser?.token || localStorage.getItem("token");
        
        if (!authToken) {
            showToast("Bạn cần đăng nhập để thanh toán.", "error");
            navigate("/login");
            return;
        }

        if (phuongThucThanhToan === "BANKING" && !showQR) {
            setShowQR(true);
            return;
        }

        try {
            setDangThanhToan(true);
            await axios.post(
                `${API_BASE}/orders/thanh-toan`,
                {
                    diaChi: form.diaChi,
                    soDienThoai: form.sdt,
                    ghiChu: form.ghiChu,
                    phuongThucThanhToan,
                    items: (items || []).map((item) => ({
                        idSanPham: item._id,
                        soLuong: item.qty,
                    })),
                    tongTien: tongCuoi
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            removeSelectedFromCart(selectedItemIds || []);
            showToast("Đặt hàng thành công! Cảm ơn bạn.", "success");
            navigate('/');
        } catch (error) {
            showToast("Thanh toán thất bại. Vui lòng thử lại.", "error");
        } finally {
            setDangThanhToan(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-[#0b0f1a] min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-[1100px] mx-auto px-4 flex flex-col lg:flex-row gap-8 relative">
                
                {/* MODAL QR THANH TOÁN */}
                {showQR && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Quét mã để thanh toán</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Vui lòng chuyển chính xác số tiền bên dưới</p>
                            
                            <div className="text-3xl font-black text-red-500 mb-6 bg-red-50 dark:bg-red-900/20 py-3 rounded-2xl tracking-tighter">
                                {tongCuoi?.toLocaleString()} đ
                            </div>
                            
                            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-inner border border-slate-100">
                                <img src={QRImage} alt="QR Code" className="w-[220px] h-[220px] object-contain mx-auto" />
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-left mb-8 border border-blue-100 dark:border-blue-800">
                                <p className="text-[11px] uppercase font-bold text-blue-600 dark:text-blue-400 mb-1">Nội dung chuyển khoản:</p>
                                <p className="text-sm font-black text-slate-800 dark:text-white">CK {form.sdt}</p>
                            </div>

                            <div className="flex gap-3">
                                 <button 
                                    onClick={() => setShowQR(false)} 
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                 >
                                    QUAY LẠI
                                 </button>
                                 <button 
                                    onClick={handleOrder} 
                                    disabled={dangThanhToan}
                                    className="flex-[2] py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                                 >
                                    {dangThanhToan ? "ĐANG KIỂM TRA..." : "XÁC NHẬN ĐÃ CHUYỂN"}
                                 </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
                <div className="flex-[1.5] bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">🚚</span> THÔNG TIN GIAO HÀNG
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Người nhận máy</label>
                            <input 
                                type="text" 
                                placeholder="Nhập họ và tên..." 
                                value={form.ten} 
                                onChange={e => setForm({...form, ten: e.target.value})} 
                                className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Số điện thoại liên lạc</label>
                            <input 
                                type="text" 
                                placeholder="Nhập số điện thoại..." 
                                value={form.sdt} 
                                onChange={e => setForm({...form, sdt: e.target.value})} 
                                className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Địa chỉ nhận máy</label>
                            <textarea 
                                placeholder="Số nhà, tên đường, phường/xã..." 
                                value={form.diaChi} 
                                onChange={e => setForm({...form, diaChi: e.target.value})} 
                                rows="3"
                                className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Ghi chú (Không bắt buộc)</label>
                            <textarea 
                                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..." 
                                value={form.ghiChu} 
                                onChange={e => setForm({...form, ghiChu: e.target.value})} 
                                rows="2"
                                className="w-full mt-1 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white transition-all resize-none"
                            />
                        </div>
                        
                        <div className="pt-4">
                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Phương thức thanh toán</label>
                            <select 
                                value={phuongThucThanhToan} 
                                onChange={(e) => setPhuongThucThanhToan(e.target.value)} 
                                className="w-full mt-1 p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-slate-800 dark:text-white cursor-pointer"
                            >
                                <option value="COD">💵 Thanh toán khi nhận hàng (COD)</option>
                                <option value="BANKING">🏦 Chuyển khoản qua QR Code (Ưu tiên)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: CHI TIẾT ĐƠN HÀNG */}
                <div className="flex-1">
                    <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl text-white shadow-2xl sticky top-10 border border-slate-800">
                        <h3 className="text-lg font-black mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                            <span className="text-xl">📋</span> ĐƠN HÀNG CỦA BẠN
                        </h3>
                        
                        <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                            {(items || []).map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start gap-4 text-sm border-b border-slate-800/50 pb-3">
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-300 line-clamp-1">{item.ten}</p>
                                        <p className="text-[11px] text-slate-500">Số lượng: {item.qty}</p>
                                    </div>
                                    <p className="font-bold text-blue-400 whitespace-nowrap">{(item.gia * item.qty).toLocaleString()}đ</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Tạm tính:</span>
                                <span className="font-bold">{tongCuoi?.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Phí vận chuyển:</span>
                                <span className="text-green-500 font-bold">Miễn phí</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                                <span className="text-lg font-bold">TỔNG CỘNG:</span>
                                <span className="text-3xl font-black text-red-500 tracking-tighter">{tongCuoi?.toLocaleString()}đ</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleOrder} 
                            disabled={dangThanhToan}
                            className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-2 ${
                                phuongThucThanhToan === "BANKING" 
                                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20" 
                                : "bg-green-600 hover:bg-green-700 shadow-green-900/20"
                            }`}
                        >
                            {dangThanhToan ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                phuongThucThanhToan === "BANKING" ? "🚀 XEM MÃ QR THANH TOÁN" : "✅ XÁC NHẬN ĐẶT HÀNG"
                            )}
                        </button>
                        
                        <p className="text-[10px] text-slate-500 text-center mt-4 italic font-medium">
                            Bằng cách đặt hàng, bạn đồng ý với các điều khoản mua sắm của cửa hàng.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrangThanhToan;