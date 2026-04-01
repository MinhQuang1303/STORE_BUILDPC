import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import axios from 'axios';
import VoucherModal from '../../components/VoucherModal';

const TrangGioHang = () => {
    const { 
        cartItems, removeFromCart, updateQty, 
        wishlistItems, moveBackToCart, removeFromWishlist, luuMuaSau,
        showToast 
    } = useContext(CartContext);
    const navigate = useNavigate();

    const [selectedItems, setSelectedItems] = useState([]); 
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isVoucherOpen, setIsVoucherOpen] = useState(false);
    const [allVouchers, setAllVouchers] = useState([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/ma-giam-gia`);
                setAllVouchers(res.data.filter(v => v.trangThai === true));
            } catch (err) { console.error("Lỗi lấy voucher:", err); }
        };
        fetchVouchers();
    }, []);

    const tongTienSelected = cartItems
        .filter(item => selectedItems.includes(item._id))
        .reduce((acc, item) => acc + (item.gia * item.qty), 0);

    const phiVanChuyen = (tongTienSelected > 5000000 || tongTienSelected === 0) ? 0 : 30000;
    
    const quaTang = 
        tongTienSelected > 200000000 ? "Ghế Công thái học Herman Miller Aeron (Bản Limited)" : 
        tongTienSelected > 150000000 ? "Màn hình Samsung Odyssey Neo G9 49 inch Dual UHD" : 
        tongTienSelected > 100000000 ? "Combo iPhone 15 Pro Max + Apple Watch Ultra 2" : 
        tongTienSelected > 70000000  ? "Card đồ họa ASUS ROG Strix RTX 4080 Super" : 
        tongTienSelected > 50000000  ? "Màn hình Gaming LG UltraGear 27 inch 2K 180Hz" : 
        tongTienSelected > 30000000  ? "Tai nghe không dây Sony WH-1000XM5" : 
        tongTienSelected > 20000000  ? "Bàn phím cơ Custom Aluminum (Full Mod)" : 
        tongTienSelected > 10000000  ? "Chuột Logitech G502 X Plus Wireless" : 
        tongTienSelected > 5000000   ? "Lót chuột Gaming Size XXL (LED RGB)" : 
        tongTienSelected > 2000000   ? "Bộ vệ sinh PC chuyên dụng 7 in 1" : null;

    const thanhTienCuoiCung = tongTienSelected + phiVanChuyen - discount;

    const handleApplyCoupon = async (codeFromModal) => {
        const codeToUse = codeFromModal || couponCode;
        if (!codeToUse) {
            showToast("Vui lòng nhập hoặc chọn mã giảm giá ! 🎫", "error");
            return;
        }
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/ma-giam-gia/kiem-tra/${codeToUse}`);
            const voucher = res.data;

            if (tongTienSelected < voucher.giaTriDonHangToiThieu) {
                showToast(`Đơn hàng tối thiểu ${voucher.giaTriDonHangToiThieu.toLocaleString()}đ! ⚠️`, "error");
                return;
            }

            let soTienGiam = voucher.loaiGiamGia === "phanTram" ? (tongTienSelected * voucher.giaTri) / 100 : voucher.giaTri;
            if (voucher.giaTriGiamToiDa && soTienGiam > voucher.giaTriGiamToiDa) soTienGiam = voucher.giaTriGiamToiDa;
            
            setDiscount(soTienGiam);
            setCouponCode(codeToUse);
            showToast(`Áp mã thành công! Giảm ${soTienGiam.toLocaleString()}đ 💸`, "success");
        } catch (err) {
            showToast(err.response?.data?.message || "Mã không hợp lệ!", "error");
            setDiscount(0);
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            showToast("Chọn sản phẩm để thanh toán! 🛒", "error");
            return;
        }
        navigate('/thanh-toan', { 
            state: { 
                items: cartItems.filter(i => selectedItems.includes(i._id)), 
                selectedItemIds: selectedItems,
                tongCuoi: thanhTienCuoiCung, 
                discount, 
                phiVanChuyen, 
                quà: quaTang 
            } 
        });
    };

    return (
        <div className="bg-slate-50 dark:bg-[#0b0f1a] min-h-screen py-10 px-5 transition-colors duration-300">
            <VoucherModal 
                isOpen={isVoucherOpen} 
                vouchers={allVouchers} 
                onClose={() => setIsVoucherOpen(false)} 
                onApply={(code) => handleApplyCoupon(code)} 
            />

            <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-6">
                
                {/* BÊN TRÁI: GIỎ HÀNG & MUA SAU */}
                <div className="flex-[2] space-y-6">
                    {/* GIỎ HÀNG */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-xl font-black mb-6 dark:text-white flex items-center gap-2">
                            🛒 GIỎ HÀNG 
                            <span className="text-sm font-normal text-slate-400">({cartItems.length})</span>
                        </h2>
                        
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-5xl mb-4">🧸</p>
                                <p className="text-slate-500 dark:text-slate-400">Giỏ hàng đang trống trơn!</p>
                            </div>
                        ) : cartItems.map((item) => (
                            <div key={item._id} className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 cursor-pointer accent-blue-600"
                                    checked={selectedItems.includes(item._id)} 
                                    onChange={() => setSelectedItems(prev => prev.includes(item._id) ? prev.filter(i => i !== item._id) : [...prev, item._id])} 
                                />
                                <div className="w-20 h-20 bg-white p-2 rounded-lg flex items-center justify-center">
                                    <img src={item.anh} alt="" className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold dark:text-slate-100 line-clamp-2 leading-tight mb-1">{item.ten}</h4>
                                    <p className="text-red-500 font-black mb-2 text-base">{item.gia?.toLocaleString()}đ</p>
                                    <button onClick={() => luuMuaSau(item._id)} className="text-blue-500 text-xs font-bold hover:underline">❤️ Lưu mua sau</button>
                                </div>
                                
                                <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
                                    <button onClick={() => updateQty(item._id, item.qty - 1)} className="px-3 py-1 bg-slate-50 dark:bg-slate-700 dark:text-white hover:bg-slate-200">-</button>
                                    <span className="px-3 font-bold dark:text-white">{item.qty}</span>
                                    <button onClick={() => updateQty(item._id, item.qty + 1)} className="px-3 py-1 bg-slate-50 dark:bg-slate-700 dark:text-white hover:bg-slate-200">+</button>
                                </div>
                                
                                <button onClick={() => removeFromCart(item._id)} className="text-slate-300 hover:text-red-500 transition-colors text-xl ml-2">🗑️</button>
                            </div>
                        ))}
                    </div>

                    {/* MUA SAU */}
                    {wishlistItems?.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-4">❤️ SẢN PHẨM ĐÃ LƯU</h3>
                            <div className="space-y-3">
                                {wishlistItems.map(item => (
                                    <div key={item._id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <img src={item.anh} alt="" className="w-12 h-12 object-contain" />
                                        <div className="flex-1">
                                            <b className="text-xs dark:text-slate-200 block line-clamp-1">{item.ten}</b>
                                            <p className="text-red-500 text-sm font-bold">{item.gia?.toLocaleString()}đ</p>
                                        </div>
                                        <button onClick={() => moveBackToCart(item)} className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">Thêm lại</button>
                                        <button onClick={() => removeFromWishlist(item._id)} className="text-slate-400 text-xs hover:text-red-500">Xóa</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* BÊN PHẢI: TỔNG KẾT */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 sticky top-5 transition-all">
                        <h3 className="font-black text-lg mb-5 pb-3 border-b border-slate-100 dark:border-slate-700 dark:text-white">THANH TOÁN</h3>
                        
                        <button 
                            onClick={() => setIsVoucherOpen(true)} 
                            className="w-100 py-3 bg-indigo-500 text-white rounded-xl mb-5 font-bold hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none transition-all block text-center w-full"
                        >
                            🎁 KHO VOUCHER 
                        </button>

                        <div className="flex gap-2 mb-6">
                            <input 
                                type="text" 
                                placeholder="MÃ GIẢM GIÁ..." 
                                className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:outline-none focus:border-blue-500"
                                value={couponCode} 
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                            />
                            <button onClick={() => handleApplyCoupon()} className="px-5 bg-slate-800 dark:bg-blue-600 text-white rounded-lg font-bold text-sm hover:opacity-90">DÙNG</button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm"><span>Tạm tính:</span><b>{tongTienSelected.toLocaleString()}đ</b></div>
                            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm"><span>Phí ship:</span><b>{phiVanChuyen === 0 ? "Miễn phí" : phiVanChuyen.toLocaleString() + "đ"}</b></div>
                            {discount > 0 && <div className="flex justify-between text-green-600 font-bold text-sm"><span>Giảm giá:</span><span>-{discount.toLocaleString()}đ</span></div>}
                            
                            {quaTang && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-dashed border-yellow-400 mt-2">
                                    <span className="text-[10px] font-black text-yellow-600 block uppercase mb-1">✨ Quà tặng kèm:</span>
                                    <b className="text-xs text-slate-800 dark:text-yellow-200 leading-tight">{quaTang}</b>
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end">
                                <span className="font-bold dark:text-white">TỔNG CỘNG:</span>
                                <span className="text-2xl font-black text-red-500">{thanhTienCuoiCung.toLocaleString()}đ</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-600 hover:-translate-y-1 transition-all"
                        >
                            ĐẶT HÀNG NGAY 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrangGioHang;