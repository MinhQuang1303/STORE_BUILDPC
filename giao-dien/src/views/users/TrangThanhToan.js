import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
// Import ảnh QR từ assets
import QRImage from '../../assets/images/QR.jpg'; 

const TrangThanhToan = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { removeSelectedFromCart, showToast } = useCart();
    
    const { items, selectedItemIds, tongCuoi, discount, phiVanChuyen, quà } = location.state || {};

    const [form, setForm] = useState({ ten: "", sdt: "", diaChi: "", ghiChu: "" });
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState("COD");
    const [dangThanhToan, setDangThanhToan] = useState(false);
    const [showQR, setShowQR] = useState(false); // Trạng thái hiển thị QR

    const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    const API_BASE = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

    if (!location.state) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Ối! Hình như giỏ hàng của bạn đang trống</h2>
                <button onClick={() => navigate('/gio-hang')}>Quay lại giỏ hàng</button>
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
            navigate("/dang-nhap");
            return;
        }

        // Nếu là chuyển khoản mà chưa hiện QR thì hiện QR trước khi submit
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
            showToast("Đặt hàng thành công!", "success");
            navigate('/');
        } catch (error) {
            showToast("Thanh toán thất bại.", "error");
        } finally {
            setDangThanhToan(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', display: 'flex', gap: '20px', padding: '20px', position: 'relative' }}>
            
            {/* MODAL QR THANH TOÁN */}
            {showQR && (
                <div style={styles.overlay}>
                    <div style={styles.modalQR}>
                        <h3>Quét mã để thanh toán</h3>
                        <p>Số tiền: <b style={{color: 'red'}}>{tongCuoi?.toLocaleString()}đ</b></p>
                        <img src={QRImage} alt="QR Code" style={{ width: '250px', borderRadius: '10px' }} />
                        <p style={{ fontSize: '12px', color: '#666' }}>Nội dung: CK [Số điện thoại của bạn]</p>
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                             <button onClick={() => setShowQR(false)} style={{ ...styles.btnOrder, background: '#95a5a6' }}>QUAY LẠI</button>
                             <button onClick={handleOrder} style={styles.btnOrder} disabled={dangThanhToan}>
                                {dangThanhToan ? "ĐANG KIỂM TRA..." : "TÔI ĐÃ CHUYỂN KHOẢN"}
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CỘT TRÁI */}
            <div style={{ flex: 1.5, background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h3>🚚 THÔNG TIN GIAO HÀNG</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input type="text" placeholder="Họ và tên" value={form.ten} onChange={e => setForm({...form, ten: e.target.value})} style={styles.input} />
                    <input type="text" placeholder="Số điện thoại" value={form.sdt} onChange={e => setForm({...form, sdt: e.target.value})} style={styles.input} />
                    <textarea placeholder="Địa chỉ nhận máy" value={form.diaChi} onChange={e => setForm({...form, diaChi: e.target.value})} style={styles.input} rows="3" />
                    <textarea placeholder="Ghi chú thêm" value={form.ghiChu} onChange={e => setForm({...form, ghiChu: e.target.value})} style={styles.input} rows="2" />
                    
                    <label>Phương thức thanh toán:</label>
                    <select value={phuongThucThanhToan} onChange={(e) => setPhuongThucThanhToan(e.target.value)} style={styles.input}>
                        <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                        <option value="BANKING">Chuyển khoản ngân hàng (QR Code)</option>
                    </select>
                </div>
            </div>

            {/* CỘT PHẢI */}
            <div style={{ flex: 1, background: '#1a1a1a', color: 'white', padding: '25px', borderRadius: '15px' }}>
                <h3>📋 CHI TIẾT ĐƠN HÀNG</h3>
                {/* ... (phần map items giữ nguyên) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#e74c3c', marginTop: '15px' }}>
                    <span>TỔNG:</span><span>{tongCuoi?.toLocaleString()}đ</span>
                </div>

                <button onClick={handleOrder} style={styles.btnOrder} disabled={dangThanhToan}>
                    {phuongThucThanhToan === "BANKING" ? "XEM MÃ QR THANH TOÁN" : "XÁC NHẬN ĐẶT HÀNG"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
    btnOrder: { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalQR: { background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }
};

export default TrangThanhToan;