import React from 'react';

const VoucherModal = ({ vouchers, isOpen, onClose, onApply }) => {
    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ backgroundColor: '#1a1a1a', width: '100%', maxWidth: '450px', borderRadius: '20px', border: '1px solid #333', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,242,254,0.2)' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222' }}>
                    <h3 style={{ margin: 0, color: '#00f2fe', fontSize: '18px' }}>🎁 KHO VOUCHER CỦA BẠN</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>
                <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                    {vouchers.length === 0 ? <p style={{ color: '#666', textAlign: 'center' }}>Hiện chưa có mã nào!</p> : 
                        vouchers.map(v => (
                            <div key={v._id} style={{ display: 'flex', marginBottom: '15px', background: '#262626', borderRadius: '10px', border: '1px dashed #444', overflow: 'hidden' }}>
                                <div style={{ width: '80px', background: '#6366f1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                    <span style={{ fontSize: '20px' }}>{v.loaiGiamGia === 'phanTram' ? '%' : 'đ'}</span>
                                    <small style={{ fontSize: '10px' }}>VOUCHER</small>
                                </div>
                                <div style={{ flex: 1, padding: '12px', color: '#eee' }}>
                                    <b style={{ color: '#fff', fontSize: '16px' }}>{v.ma}</b>
                                    <p style={{ fontSize: '12px', margin: '4px 0', color: '#aaa' }}>Giảm {v.giaTri.toLocaleString()}{v.loaiGiamGia === 'phanTram' ? '%' : 'đ'}</p>
                                    <p style={{ fontSize: '10px', color: '#666' }}>Hết hạn: {new Date(v.ngayHetHan).toLocaleDateString('vi-VN')}</p>
                                    <button 
                                        onClick={() => { onApply(v.ma); onClose(); }}
                                        style={{ backgroundColor: '#00f2fe', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}
                                    >
                                        DÙNG NGAY
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;