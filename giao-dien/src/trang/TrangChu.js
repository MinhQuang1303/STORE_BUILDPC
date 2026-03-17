import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Banner from '../components/Banner';
import PromoBanner from '../components/PromoBanner';
import FlashSale from '../components/FlashSale'; // <-- 1. Thêm import này
import { useNavigate } from 'react-router-dom';

const TrangChu = () => {
    const navigate = useNavigate();
    const [sanPhams, setSanPhams] = useState([]);
    const categories = ['CPU', 'Mainboard', 'RAM', 'VGA', 'SSD', 'PSU', 'Case'];
    
    const combos = [
        { ten: 'PC Gaming', moTa: 'Chiến mượt AAA 4K', gia: '25.000.000đ' },
        { ten: 'PC Văn phòng', moTa: 'Gọn nhẹ, ổn định', gia: '8.500.000đ' },
        { ten: 'PC Đồ họa', moTa: 'Render video 8K cực nhanh', gia: '45.000.000đ' }
    ];

    // Lấy dữ liệu sản phẩm để hiển thị ở mục "Sản phẩm mới nhất"
    useEffect(() => {
        axios.get('http://localhost:5000/api/san-pham')
            .then(res => setSanPhams(res.data.slice(0, 8))) // Lấy 8 sản phẩm đầu tiên
            .catch(err => console.error("Lỗi lấy sản phẩm:", err));
    }, []);

    return (
        <div style={{ backgroundColor: '#f4f4f4', paddingBottom: '50px' }}>
            <Banner />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <PromoBanner />

                {/* 2. FLASH SALE (Chèn trực tiếp vào đây) */}
                <FlashSale />

                {/* 1. DANH MỤC LINH KIỆN */}
                <h3 style={styles.sectionTitle}>📁 DANH MỤC LINH KIỆN</h3>
                <div style={styles.categoryGrid}>
                    {categories.map(cat => (
                        <div key={cat} style={styles.categoryItem} onClick={() => navigate('/build')}>
                            <div style={{fontSize: '24px'}}>📦</div>
                            <div style={{fontWeight: 'bold', marginTop: '5px'}}>{cat}</div>
                        </div>
                    ))}
                </div>

                {/* 2. SẢN PHẨM MỚI NHẤT (CLICK ĐỂ XEM CHI TIẾT) */}
                <h3 style={styles.sectionTitle}>🔥 SẢN PHẨM MỚI NHẤT</h3>
                <div style={styles.productGrid}>
                    {sanPhams.map(item => (
                        <div 
                            key={item._id} 
                            style={styles.productCard}
                            onClick={() => navigate(`/san-pham/${item._id}`)} // Điều hướng đến trang chi tiết
                        >
                            <img src={item.anh} alt={item.ten} style={styles.productImg} />
                            <h4 style={styles.productName}>{item.ten}</h4>
                            <p style={styles.productPrice}>{item.gia?.toLocaleString()} VNĐ</p>
                            <button style={styles.detailBtn}>Xem chi tiết</button>
                        </div>
                    ))}
                </div>

                {/* 3. NÚT TỰ BUILD PC (Tính năng độc đáo) */}
                <div style={styles.buildCallToAction}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{margin: 0}}>🛠️ BẠN MUỐN TỰ TAY BUILD PC?</h2>
                        <p style={{margin: '10px 0 0 0'}}>Lựa chọn từng linh kiện theo sở thích và ngân sách của riêng bạn.</p>
                    </div>
                    <button onClick={() => navigate('/build')} style={styles.buildBtn}>BẮT ĐẦU BUILD NGAY</button>
                </div>

                {/* 4. COMBO ĐỀ XUẤT */}
                <h3 style={styles.sectionTitle}>📦 COMBO BUILD PC ĐỀ XUẤT</h3>
                <div style={styles.comboGrid}>
                    {combos.map(combo => (
                        <div key={combo.ten} style={styles.comboCard}>
                            <h4>{combo.ten}</h4>
                            <p style={{ fontSize: '14px', color: '#666' }}>{combo.moTa}</p>
                            <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '18px' }}>{combo.gia}</p>
                            <button style={styles.buyNowBtn}>MUA TRỌN BỘ</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    sectionTitle: { margin: '40px 0 20px 0', borderLeft: '5px solid #3498db', paddingLeft: '15px', textTransform: 'uppercase' },
    categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px', marginBottom: '40px' },
    categoryItem: { backgroundColor: 'white', padding: '20px', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', transition: '0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    
    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' },
    productCard: { backgroundColor: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: '0.3s' },
    productImg: { width: '100%', height: '150px', objectFit: 'contain' },
    productName: { fontSize: '16px', margin: '15px 0 10px 0', height: '40px', overflow: 'hidden' },
    productPrice: { color: '#e74c3c', fontWeight: 'bold', fontSize: '18px' },
    detailBtn: { marginTop: '10px', width: '100%', padding: '8px', border: '1px solid #3498db', color: '#3498db', background: 'none', borderRadius: '5px', cursor: 'pointer' },

    buildCallToAction: { display: 'flex', alignItems: 'center', backgroundColor: '#2c3e50', color: 'white', padding: '40px', borderRadius: '20px', marginBottom: '40px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
    buildBtn: { backgroundColor: '#27ae60', color: 'white', padding: '15px 40px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
    
    comboGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
    comboCard: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
    buyNowBtn: { width: '100%', marginTop: '15px', padding: '12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default TrangChu;