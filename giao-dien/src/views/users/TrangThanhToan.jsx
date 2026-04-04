import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import QRImage from '../../assets/images/QR.jpg';
import LeafletMapPicker from '../../components/LeafletMapPicker';

const TrangThanhToan = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { removeSelectedFromCart, showToast } = useCart();
    
    const { items, selectedItemIds, tongCuoi, discount, phiVanChuyen, quà, maVoucher } = location.state || {};

    const [form, setForm] = useState({ ten: "", sdt: "", diaChi: "", ghiChu: "" });
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState("COD");
    const [dangThanhToan, setDangThanhToan] = useState(false);
    const [showQR, setShowQR] = useState(false);
    
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [pendingMapAddress, setPendingMapAddress] = useState("");

    const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    const API_BASE = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userData = currentUser?.user || currentUser;
        const userId = userData?._id;
        if (!userId) return;

        fetch(`http://localhost:5000/api/user-addresses/user/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.length > 0) {
                    setSavedAddresses(data.data);
                    const def = data.data.find(a => a.isDefault) || data.data[0];
                    if (def) {
                        setSelectedAddressId(def._id);
                        setForm(prev => ({
                            ...prev,
                            ten: def.fullName || prev.ten,
                            sdt: def.phone || prev.sdt,
                            diaChi: def.address || prev.diaChi,
                        }));
                    }
                }
            })
            .catch(() => {});
    }, []);

    const handleSelectAddress = (addrId) => {
        setSelectedAddressId(addrId);
        if (!addrId) return;
        const addr = savedAddresses.find(a => a._id === addrId);
        if (addr) {
            setForm(prev => ({
                ...prev,
                ten: addr.fullName || prev.ten,
                sdt: addr.phone || prev.sdt,
                diaChi: addr.address || prev.diaChi,
            }));
        }
    };

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
                        idSanPham: item.idSanPhamGoc || item._id,
                        idBienThe: item.idBienThe || null,
                        soLuong: item.qty,
                    })),
                    tongTien: tongCuoi,
                    soTienGiam: discount || 0,
                    maVoucher: maVoucher || null,
                },
                { headers: { Authorization: `Bearer ${authToken}` } }
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
        <>
        <div style={{ maxWidth: '1000px', margin: '30px auto', display: 'flex', gap: '20px', padding: '20px', position: 'relative' }}>
            
            {/* MODAL QR */}
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
                    
                    {/* Chọn địa chỉ đã lưu */}
                    {savedAddresses.length > 0 && (
                        <div style={{ background: '#f0f7ff', borderRadius: '10px', padding: '14px', border: '1px solid #bfdbfe' }}>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#1d4ed8', marginBottom: '8px', margin: '0 0 10px 0' }}>
                                📍 Chọn từ địa chỉ đã lưu
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {savedAddresses.map(addr => (
                                    <label
                                        key={addr._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: selectedAddressId === addr._id ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                                            background: selectedAddressId === addr._id ? '#eff6ff' : 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="savedAddress"
                                            value={addr._id}
                                            checked={selectedAddressId === addr._id}
                                            onChange={() => handleSelectAddress(addr._id)}
                                            style={{ marginTop: '3px', accentColor: '#3b82f6' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                                                <span style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{addr.fullName}</span>
                                                {addr.isDefault && (
                                                    <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1d4ed8', fontWeight: '700', padding: '1px 8px', borderRadius: '20px' }}>Mặc định</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#475569' }}>{addr.phone}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{addr.address}</div>
                                        </div>
                                    </label>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => navigate('/so-dia-chi')}
                                    style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px 0', fontWeight: '600' }}
                                >
                                    + Quản lý địa chỉ trong Sổ địa chỉ →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Form nhập */}
                    <input type="text" placeholder="Họ và tên" value={form.ten} onChange={e => setForm({...form, ten: e.target.value})} style={styles.input} />
                    <input type="text" placeholder="Số điện thoại" value={form.sdt} onChange={e => setForm({...form, sdt: e.target.value})} style={styles.input} />
                    
                    {/* Địa chỉ + nút bản đồ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Địa chỉ nhận hàng</span>
                        <button
                          type="button"
                          onClick={() => { setPendingMapAddress(""); setIsMapOpen(true); }}
                          style={{ fontSize: '12px', fontWeight: '700', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          🗺️ Chọn từ Bản Đồ
                        </button>
                      </div>
                      <textarea placeholder="Địa chỉ nhận máy" value={form.diaChi} onChange={e => setForm({...form, diaChi: e.target.value})} style={styles.input} rows="3" />
                    </div>

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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#e74c3c', marginTop: '15px' }}>
                    <span>TỔNG:</span><span>{tongCuoi?.toLocaleString()}đ</span>
                </div>
                <button onClick={handleOrder} style={styles.btnOrder} disabled={dangThanhToan}>
                    {phuongThucThanhToan === "BANKING" ? "XEM MÃ QR THANH TOÁN" : "XÁC NHẬN ĐẶT HÀNG"}
                </button>
            </div>
        </div>

        {/* ===== MODAL BẢN ĐỒ ===== */}
        {isMapOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '640px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>🗺️ Chọn địa chỉ từ Bản Đồ</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Nhập địa chỉ ở ô tìm kiếm, hoặc click thẳng lên bản đồ</p>
                </div>
                <button onClick={() => setIsMapOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>×</button>
              </div>

              <LeafletMapPicker onLocationSelect={setPendingMapAddress} />

              {/* Footer */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setIsMapOpen(false)} style={{ padding: '8px 18px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '14px' }}>Hủy</button>
                <button
                  onClick={() => { if (pendingMapAddress) setForm(f => ({ ...f, diaChi: pendingMapAddress })); setIsMapOpen(false); }}
                  disabled={!pendingMapAddress}
                  style={{ padding: '8px 18px', fontWeight: '700', background: '#059669', color: 'white', border: 'none', borderRadius: '10px', cursor: pendingMapAddress ? 'pointer' : 'not-allowed', opacity: pendingMapAddress ? 1 : 0.4, fontSize: '14px' }}
                >
                  ✓ Xác nhận địa chỉ
                </button>
              </div>
            </div>
          </div>
        )}
        </>
    );
};

const styles = {
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
    btnOrder: { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalQR: { background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }
};

export default TrangThanhToan;