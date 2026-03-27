import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Banner from '../components/Banner';
import { CartContext } from '../context/CartContext';

const TrangChiTiet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sp, setSp] = useState(null);
    const [soLuong, setSoLuong] = useState(1);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/san-pham/${id}`)
            .then(res => setSp(res.data))
            .catch(err => console.error("Lỗi lấy chi tiết:", err));
    }, [id]);

    if (!sp) return <div style={styles.loading}>Đang tải sản phẩm...</div>;

    // Giả sử thông số kỹ thuật được lưu dạng chuỗi cách nhau bởi dấu phẩy hoặc xuống dòng
    // Chúng ta sẽ biến nó thành một mảng để hiển thị dạng bảng chuyên nghiệp
    const listSpecs = sp.thongSo ? sp.thongSo.split(',').map(s => s.trim()) : [];

    return (
        <div style={styles.pageWrapper}>
            <Banner />
            
            <div style={styles.container}>
                {/* PHẦN 1: THÔNG TIN CHÍNH (ẢNH & MUA HÀNG) */}
                <div style={styles.mainInfoSection}>
                    <div style={styles.imageColumn}>
                        <div style={styles.mainImageBox}>
                            <img src={sp.anh} alt={sp.ten} style={styles.image} />
                        </div>
                    </div>

                    <div style={styles.detailColumn}>
                        <div style={styles.headerInfo}>
                            <span style={styles.categoryLabel}>{sp.loai}</span>
                            <h1 style={styles.productTitle}>{sp.ten}</h1>
                            <div style={styles.metaRow}>
                                <span style={styles.rating}>⭐ 5.0</span>
                                <span style={styles.divider}>|</span>
                                <span style={styles.sku}>Mã SP: {sp._id.substring(0, 8).toUpperCase()}</span>
                            </div>
                        </div>

                        <div style={styles.priceContainer}>
                            <h2 style={styles.priceText}>{sp.gia?.toLocaleString()} đ</h2>
                            <span style={styles.stockStatus}>● Còn hàng</span>
                        </div>

                        <div style={styles.buyBox}>
                            <div style={styles.qtyWrapper}>
                                <span style={{fontSize: '14px', fontWeight: '600'}}>Số lượng:</span>
                                <div style={styles.qtyControls}>
                                    <button onClick={() => setSoLuong(Math.max(1, soLuong - 1))} style={styles.qtyBtn}>-</button>
                                    <input type="number" value={soLuong} readOnly style={styles.qtyInput} />
                                    <button onClick={() => setSoLuong(soLuong + 1)} style={styles.qtyBtn}>+</button>
                                </div>
                            </div>
                            
                            <div style={styles.buttonGroup}>
                                <button 
                                    style={styles.addCartBtn} 
                                    onClick={() => addToCart(sp, soLuong)}
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                                <button onClick={() => navigate('/build')} style={styles.buildBtn}>
                                    🛠️ DÙNG ĐỂ BUILD PC
                                </button>
                            </div>
                        </div>

                        <div style={styles.trustBadges}>
                            <div style={styles.badgeItem}>🚚 Giao hàng toàn quốc</div>
                            <div style={styles.badgeItem}>🛡️ Bảo hành chính hãng</div>
                        </div>
                    </div>
                </div>

                {/* PHẦN 2: THÔNG SỐ KỸ THUẬT CHI TIẾT */}
                <div style={styles.specsSection}>
                    <h3 style={styles.specsTitle}>Thông số kỹ thuật chi tiết</h3>
                    <table style={styles.specsTable}>
                        <tbody>
                            {listSpecs.length > 0 ? listSpecs.map((spec, index) => {
                                const [label, value] = spec.split(':');
                                return (
                                    <tr key={index} style={index % 2 === 0 ? styles.trEven : {}}>
                                        <td style={styles.tdLabel}>{label || "Thông số"}</td>
                                        <td style={styles.tdValue}>{value || spec}</td>
                                    </tr>
                                );
                            }) : (
                                <tr><td style={styles.tdValue}>Đang cập nhật...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' },
    container: { maxWidth: '1200px', margin: '30px auto', padding: '0 15px' },
    loading: { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#64748b' },

    // Bố cục chính
    mainInfoSection: { display: 'flex', gap: '40px', backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '30px', flexWrap: 'wrap' },
    imageColumn: { flex: '1', minWidth: '350px' },
    mainImageBox: { border: '1px solid #f1f5f9', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' },
    image: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },

    // Cột thông tin
    detailColumn: { flex: '1.2', minWidth: '350px' },
    categoryLabel: { backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' },
    productTitle: { fontSize: '26px', color: '#0f172a', margin: '15px 0 10px 0', lineHeight: '1.3' },
    metaRow: { display: 'flex', alignItems: 'center', gap: '15px', color: '#94a3b8', fontSize: '14px', marginBottom: '20px' },
    divider: { color: '#e2e8f0' },

    priceContainer: { backgroundColor: '#fff7ed', padding: '20px', borderRadius: '12px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    priceText: { color: '#ea580c', fontSize: '30px', fontWeight: '800', margin: 0 },
    stockStatus: { color: '#16a34a', fontWeight: '600', fontSize: '14px' },

    // Mua hàng
    buyBox: { marginBottom: '30px' },
    qtyWrapper: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' },
    qtyControls: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' },
    qtyBtn: { width: '40px', height: '40px', border: 'none', backgroundColor: '#f8fafc', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' },
    qtyInput: { width: '50px', border: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' },
    
    buttonGroup: { display: 'flex', gap: '15px' },
    addCartBtn: { flex: 1, backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
    buildBtn: { flex: 1, backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },

    trustBadges: { display: 'flex', gap: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' },
    badgeItem: { fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' },

    // Bảng thông số
    specsSection: { backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    specsTitle: { fontSize: '20px', color: '#0f172a', marginBottom: '20px', borderLeft: '4px solid #2563eb', paddingLeft: '15px' },
    specsTable: { width: '100%', borderCollapse: 'collapse', fontSize: '15px' },
    trEven: { backgroundColor: '#f8fafc' },
    tdLabel: { padding: '12px 20px', color: '#64748b', fontWeight: '600', width: '30%', borderBottom: '1px solid #f1f5f9' },
    tdValue: { padding: '12px 20px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }
};

export default TrangChiTiet;