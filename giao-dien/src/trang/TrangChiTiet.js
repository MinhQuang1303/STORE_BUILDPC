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
    
    // Lấy hàm addToCart từ Context
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/san-pham/${id}`)
            .then(res => setSp(res.data))
            .catch(err => console.error("Lỗi lấy chi tiết:", err));
    }, [id]);

    if (!sp) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải sản phẩm...</div>;

    return (
        <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
            <Banner />
            <div style={styles.container}>
                <div style={styles.flexBox}>
                    {/* Bên trái: Hình ảnh */}
                    <div style={styles.imageBox}>
                        <img src={sp.anh} alt={sp.ten} style={styles.mainImage} />
                    </div>

                    {/* Bên phải: Thông tin */}
                    <div style={styles.infoBox}>
                        <p style={styles.categoryBadge}>{sp.loai}</p>
                        <h1 style={styles.title}>{sp.ten}</h1>
                        <div style={styles.rating}>⭐ 5.0 | <span style={{color: '#666'}}>124 Đánh giá</span></div>
                        <h2 style={styles.price}>{sp.gia?.toLocaleString()} VNĐ</h2>
                        
                        <div style={styles.description}>
                            <h4>Mô tả sản phẩm:</h4>
                            <p>{sp.thongSo || "Đang cập nhật thông số kỹ thuật chi tiết cho sản phẩm này..."}</p>
                        </div>

                        <div style={styles.actionBox}>
                            <div style={styles.quantityBox}>
                                <button onClick={() => setSoLuong(Math.max(1, soLuong - 1))} style={styles.qtyBtn}>-</button>
                                <input type="number" value={soLuong} readOnly style={styles.qtyInput} />
                                <button onClick={() => setSoLuong(soLuong + 1)} style={styles.qtyBtn}>+</button>
                            </div>
                            
                            {/* Nút thêm vào giỏ hàng đã được kích hoạt */}
                            <button 
                                style={styles.addCartBtn} 
                                onClick={() => addToCart(sp, soLuong)}
                            >
                                THÊM VÀO GIỎ HÀNG
                            </button>
                        </div>
                        
                        <button onClick={() => navigate('/build')} style={styles.buildLink}>
                            🛠️ Dùng linh kiện này để Build PC ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '30px auto', backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
    flexBox: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
    imageBox: { flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '10px' },
    mainImage: { maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' },
    infoBox: { flex: '1.2', minWidth: '300px' },
    categoryBadge: { display: 'inline-block', padding: '5px 12px', backgroundColor: '#3498db', color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    title: { fontSize: '28px', margin: '15px 0', color: '#2c3e50' },
    price: { color: '#e74c3c', fontSize: '32px', fontWeight: 'bold', margin: '20px 0' },
    description: { borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '25px', lineHeight: '1.6', color: '#444' },
    actionBox: { display: 'flex', gap: '20px', alignItems: 'center' },
    quantityBox: { display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px' },
    qtyBtn: { padding: '8px 15px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' },
    qtyInput: { width: '50px', textAlign: 'center', border: 'none', fontSize: '16px', fontWeight: 'bold' },
    addCartBtn: { flex: 1, padding: '15px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
    buildLink: { marginTop: '20px', display: 'block', width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }
};

export default TrangChiTiet;