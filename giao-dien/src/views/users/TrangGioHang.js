import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import axios from 'axios';
import VoucherModal from '../../components/VoucherModal';

const TrangGioHang = () => {
    const { 
        cartItems, removeFromCart, updateQty, 
        wishlistItems, moveBackToCart, removeFromWishlist, luuMuaSau 
    } = useContext(CartContext);
    const navigate = useNavigate();

    // States
    const [selectedItems, setSelectedItems] = useState([]); 
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isVoucherOpen, setIsVoucherOpen] = useState(false);
    const [allVouchers, setAllVouchers] = useState([]);

    // 1. Lấy danh sách voucher từ DB
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/ma-giam-gia`);
                setAllVouchers(res.data.filter(v => v.trangThai === true));
            } catch (err) { console.error("Lỗi lấy voucher:", err); }
        };
        fetchVouchers();
    }, []);

    // 2. Tính toán tiền nong
    const tongTienSelected = cartItems
        .filter(item => selectedItems.includes(item._id))
        .reduce((acc, item) => acc + (item.gia * item.qty), 0);

    const phiVanChuyen = (tongTienSelected > 5000000 || tongTienSelected === 0) ? 0 : 30000;
    
    // Logic Quà tặng 200tr của Quang
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

    // 3. Xử lý mã giảm giá
    const handleApplyCoupon = async (codeFromModal) => {
        const codeToUse = codeFromModal || couponCode;
        if (!codeToUse) return alert("Vui lòng nhập hoặc chọn mã!");
        
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/ma-giam-gia/kiem-tra/${codeToUse}`);
            const voucher = res.data;
            if (tongTienSelected < voucher.giaTriDonHangToiThieu) {
                alert(`Đơn hàng tối thiểu từ ${voucher.giaTriDonHangToiThieu.toLocaleString()}đ mới dùng được mã này!`);
                return;
            }
            let soTienGiam = voucher.loaiGiamGia === "phanTram" ? (tongTienSelected * voucher.giaTri) / 100 : voucher.giaTri;
            if (voucher.giaTriGiamToiDa && soTienGiam > voucher.giaTriGiamToiDa) soTienGiam = voucher.giaTriGiamToiDa;
            
            setDiscount(soTienGiam);
            setCouponCode(codeToUse);
            alert(`✅ Đã áp dụng mã ${codeToUse}!`);
        } catch (err) {
            alert(err.response?.data?.message || "Mã không hợp lệ!");
            setDiscount(0);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <VoucherModal 
                isOpen={isVoucherOpen} 
                vouchers={allVouchers} 
                onClose={() => setIsVoucherOpen(false)} 
                onApply={(code) => handleApplyCoupon(code)} 
            />

            <div style={{ maxWidth: '1100px', margin: '30px auto', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* BÊN TRÁI: GIỎ HÀNG & MUA SAU */}
                <div style={{ flex: 2, minWidth: '350px' }}>
                    
                    {/* KHỐI GIỎ HÀNG CHÍNH */}
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                        <h2 style={{ marginBottom: '20px' }}>🛒 GIỎ HÀNG</h2>
                        {cartItems.length === 0 ? <p style={{textAlign: 'center'}}>Trống trơn à Quang ơi!</p> : cartItems.map((item) => (
                            <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                                <input type="checkbox" checked={selectedItems.includes(item._id)} onChange={() => setSelectedItems(prev => prev.includes(item._id) ? prev.filter(i => i !== item._id) : [...prev, item._id])} style={{ width: '20px', height: '20px' }} />
                                <img src={item.anh} alt="" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0 }}>{item.ten}</h4>
                                    <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>{item.gia?.toLocaleString()}đ</p>
                                    <button onClick={() => luuMuaSau(item._id)} style={{ color: '#3498db', background: 'none', border: 'none', fontSize: '12px', cursor: 'pointer' }}>❤️ Lưu mua sau</button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px' }}>
                                    <button onClick={() => updateQty(item._id, item.qty - 1)} style={{ padding: '5px 10px', border: 'none' }}>-</button>
                                    <span style={{ padding: '0 10px' }}>{item.qty}</span>
                                    <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ padding: '5px 10px', border: 'none' }}>+</button>
                                </div>
                                <button onClick={() => removeFromCart(item._id)} style={{ color: '#ccc', border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
                            </div>
                        ))}
                    </div>

                    {/* KHỐI SẢN PHẨM ĐÃ LƯU (MUA SAU) */}
                    {wishlistItems && wishlistItems.length > 0 && (
                        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ color: '#636e72', marginBottom: '20px' }}>❤️ SẢN PHẨM ĐÃ LƯU (MUA SAU)</h3>
                            {wishlistItems.map(item => (
                                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', backgroundColor: '#fcfcfc', borderRadius: '10px', marginBottom: '10px', border: '1px solid #f1f1f1' }}>
                                    <img src={item.anh} alt="" style={{ width: '50px' }} />
                                    <div style={{ flex: 1 }}>
                                        <b style={{ fontSize: '14px' }}>{item.ten}</b>
                                        <p style={{ color: '#e74c3c', margin: 0, fontWeight: 'bold' }}>{item.gia?.toLocaleString()}đ</p>
                                    </div>
                                    <button onClick={() => moveBackToCart(item)} style={{ backgroundColor: '#0984e3', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm lại giỏ</button>
                                    <button onClick={() => removeFromWishlist(item._id)} style={{ color: '#b2bec3', background: 'none', border: 'none', cursor: 'pointer' }}>Xóa</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BÊN PHẢI: TỔNG KẾT & QUÀ TẶNG */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
                        <h3 style={{ marginTop: 0 }}>THANH TOÁN</h3>
                        
                        <button onClick={() => setIsVoucherOpen(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                            🎁 KHO VOUCHER NEXTGEN
                        </button>

                        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                            <input type="text" placeholder="MÃ GIẢM GIÁ..." value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
                            <button onClick={() => handleApplyCoupon()} style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>DÙNG</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tạm tính:</span><span>{tongTienSelected.toLocaleString()}đ</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Phí ship:</span><span>{phiVanChuyen === 0 ? "Miễn phí" : phiVanChuyen.toLocaleString() + "đ"}</span></div>
                            {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60', fontWeight: 'bold' }}><span>Giảm giá:</span><span>-{discount.toLocaleString()}đ</span></div>}
                            
                            {/* QUÀ TẶNG */}
                            {quaTang && (
                                <div style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '12px', border: '1px solid #00f2fe', marginTop: '10px' }}>
                                    <span style={{ color: '#00f2fe', fontWeight: 'bold', fontSize: '11px', display: 'block' }}>🎁 QUÀ TẶNG:</span>
                                    <b style={{ color: '#fff', fontSize: '13px' }}>{quaTang}</b>
                                </div>
                            )}

                            <hr style={{ border: '0.5px solid #eee' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
                                <span>TỔNG:</span><span>{thanhTienCuoiCung.toLocaleString()}đ</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => selectedItems.length > 0 ? navigate('/thanh-toan', { state: { items: cartItems.filter(i => selectedItems.includes(i._id)), tongCuoi: thanhTienCuoiCung, discount, phiVanChuyen, quà: quaTang } }) : alert("Vui lòng chọn sản phẩm!")}
                            style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            ĐẶT HÀNG NGAY
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrangGioHang;