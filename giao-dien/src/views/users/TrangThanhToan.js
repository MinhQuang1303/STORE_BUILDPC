import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TrangThanhToan = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Hứng dữ liệu an toàn, nếu không có thì trả về object rỗng để không bị crash trang
    const { items, tongCuoi, discount, phiVanChuyen, quà } = location.state || {};

    const [form, setForm] = useState({ ten: "", sdt: "", diaChi: "", ghiChu: "" });

    // Nếu khách gõ link trực tiếp mà chưa chọn đồ ở giỏ hàng
    if (!location.state) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Ối! Hình như giỏ hàng của bạn đang trống</h2>
                <button onClick={() => navigate('/gio-hang')}>Quay lại giỏ hàng</button>
            </div>
        );
    }

    const handleOrder = () => {
        if (!form.ten || !form.sdt || !form.diaChi) return alert("Vui lòng điền đủ thông tin giao hàng!");
        alert("✅ Đặt hàng thành công! NextGenPC sẽ liên hệ bạn sớm.");
        navigate('/');
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', display: 'flex', gap: '20px', padding: '20px' }}>
            {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG */}
            <div style={{ flex: 1.5, background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h3>🚚 THÔNG TIN GIAO HÀNG</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input type="text" placeholder="Họ và tên" onChange={e => setForm({...form, ten: e.target.value})} style={styles.input} />
                    <input type="text" placeholder="Số điện thoại" onChange={e => setForm({...form, sdt: e.target.value})} style={styles.input} />
                    <textarea placeholder="Địa chỉ nhận máy" onChange={e => setForm({...form, diaChi: e.target.value})} style={styles.input} rows="3" />
                </div>
            </div>

            {/* CỘT PHẢI: CHI TIẾT ĐƠN HÀNG */}
            <div style={{ flex: 1, background: '#1a1a1a', color: 'white', padding: '25px', borderRadius: '15px' }}>
                <h3>📋 CHI TIẾT ĐƠN HÀNG</h3>
                <div style={{ margin: '20px 0' }}>
                    {items.map(i => (
                        <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                            <span>{i.ten} (x{i.qty})</span>
                            <span>{(i.gia * i.qty).toLocaleString()}đ</span>
                        </div>
                    ))}
                </div>
                <hr style={{ borderColor: '#333' }} />
                <div style={{ marginTop: '15px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Phí ship:</span><span>{phiVanChuyen?.toLocaleString()}đ</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00f2fe' }}><span>Giảm giá:</span><span>-{discount?.toLocaleString()}đ</span></div>
                    
                    {quà && (
                        <div style={{ padding: '10px', background: '#333', borderRadius: '8px', borderLeft: '4px solid #f39c12' }}>
                            <small style={{ color: '#f39c12' }}>🎁 QUÀ TẶNG KÈM:</small>
                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{quà}</div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#e74c3c', marginTop: '15px' }}>
                        <span>TỔNG:</span><span>{tongCuoi?.toLocaleString()}đ</span>
                    </div>
                </div>

                <button onClick={handleOrder} style={styles.btnOrder}>XÁC NHẬN ĐẶT HÀNG</button>
            </div>
        </div>
    );
};

const styles = {
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
    btnOrder: { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }
};

export default TrangThanhToan;