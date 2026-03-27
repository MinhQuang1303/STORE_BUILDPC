import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';

const TrangSanPham = () => {
    const navigate = useNavigate();
    
    // Quản lý State
    const [sanPhams, setSanPhams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State cho bộ lọc và sắp xếp
    const [danhMucChon, setDanhMucChon] = useState('Tất cả');
    const [sapXepGia, setSapXepGia] = useState('mac-dinh'); // mac-dinh, tang-dan, giam-dan

    const categories = ['Tất cả', 'CPU', 'Mainboard', 'RAM', 'VGA', 'SSD', 'PSU', 'Case', 'Tản nhiệt'];

    // Lấy dữ liệu từ Backend
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/san-pham');
                setSanPhams(res.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Lỗi lấy sản phẩm:", err);
                setError("Không thể tải danh sách sản phẩm.");
                setIsLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // Logic Lọc và Sắp xếp (Chạy mỗi khi render)
    let sanPhamsHienThi = [...sanPhams];

    // 1. Lọc theo danh mục
    if (danhMucChon !== 'Tất cả') {
        sanPhamsHienThi = sanPhamsHienThi.filter(sp => sp.loai === danhMucChon);
    }

    // 2. Sắp xếp theo giá
    if (sapXepGia === 'tang-dan') {
        sanPhamsHienThi.sort((a, b) => a.gia - b.gia);
    } else if (sapXepGia === 'giam-dan') {
        sanPhamsHienThi.sort((a, b) => b.gia - a.gia);
    }

    return (
        <div style={styles.pageBackground}>
            <Banner />
            
            <div style={styles.container}>
                {/* TIÊU ĐỀ TRANG */}
                <div style={styles.pageHeader}>
                    <h1 style={styles.mainTitle}>TẤT CẢ LINH KIỆN</h1>
                    <p style={styles.subTitle}>Khám phá hàng trăm linh kiện PC chất lượng cao</p>
                </div>

                <div style={styles.layoutWrapper}>
                    {/* CỘT TRÁI: BỘ LỌC (SIDEBAR) */}
                    <div style={styles.sidebar}>
                        <div style={styles.filterSection}>
                            <h3 style={styles.filterTitle}>Danh mục</h3>
                            <div style={styles.categoryList}>
                                {categories.map((cat, index) => (
                                    <label key={index} style={styles.radioLabel}>
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            value={cat}
                                            checked={danhMucChon === cat}
                                            onChange={(e) => setDanhMucChon(e.target.value)}
                                            style={styles.radioInput}
                                        />
                                        <span style={{
                                            fontWeight: danhMucChon === cat ? 'bold' : 'normal',
                                            color: danhMucChon === cat ? '#2563eb' : '#475569'
                                        }}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
                    <div style={styles.mainContent}>
                        {/* Thanh công cụ (Toolbar) */}
                        <div style={styles.toolbar}>
                            <span style={styles.resultCount}>
                                Hiển thị <strong>{sanPhamsHienThi.length}</strong> sản phẩm
                            </span>
                            <div style={styles.sortControl}>
                                <label style={{ marginRight: '10px', color: '#64748b' }}>Sắp xếp theo:</label>
                                <select 
                                    style={styles.selectBox}
                                    value={sapXepGia}
                                    onChange={(e) => setSapXepGia(e.target.value)}
                                >
                                    <option value="mac-dinh">Mới nhất</option>
                                    <option value="tang-dan">Giá: Thấp đến Cao</option>
                                    <option value="giam-dan">Giá: Cao đến Thấp</option>
                                </select>
                            </div>
                        </div>

                        {/* Hiển thị Loading/Error hoặc Grid Sản phẩm */}
                        {isLoading ? (
                            <div style={styles.statusMessage}>Đang tải dữ liệu...</div>
                        ) : error ? (
                            <div style={{...styles.statusMessage, color: '#ef4444'}}>{error}</div>
                        ) : sanPhamsHienThi.length === 0 ? (
                            <div style={styles.statusMessage}>Không tìm thấy sản phẩm nào trong danh mục này.</div>
                        ) : (
                            <div style={styles.productGrid}>
                                {sanPhamsHienThi.map(item => (
                                    <div 
                                        key={item._id} 
                                        style={styles.productCard}
                                        onClick={() => navigate(`/san-pham/${item._id}`)}
                                    >
                                        <div style={styles.imageBox}>
                                            <img src={item.anh} alt={item.ten} style={styles.productImg} />
                                        </div>
                                        <div style={styles.productInfo}>
                                            <span style={styles.badge}>{item.loai}</span>
                                            <h3 style={styles.productName} title={item.ten}>{item.ten}</h3>
                                            <div style={styles.priceRow}>
                                                <span style={styles.productPrice}>{item.gia?.toLocaleString('vi-VN')} đ</span>
                                            </div>
                                            <button style={styles.detailBtn}>Xem chi tiết</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hệ thống CSS-in-JS đồng bộ với dự án
const styles = {
    pageBackground: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, sans-serif", paddingBottom: '60px' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 20px' },
    
    pageHeader: { padding: '40px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '30px' },
    mainTitle: { color: '#0f172a', fontSize: '28px', margin: '0 0 10px 0', fontWeight: '800' },
    subTitle: { color: '#64748b', fontSize: '16px', margin: 0 },

    layoutWrapper: { display: 'flex', gap: '30px', alignItems: 'flex-start' },
    
    // Sidebar
    sidebar: { flex: '0 0 250px', position: 'sticky', top: '20px' },
    filterSection: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
    filterTitle: { margin: '0 0 15px 0', fontSize: '18px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
    categoryList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    radioLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '15px' },
    radioInput: { marginRight: '10px', cursor: 'pointer' },

    // Main Content
    mainContent: { flex: '1 1 0%', minWidth: 0 },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' },
    resultCount: { color: '#475569', fontSize: '15px' },
    sortControl: { display: 'flex', alignItems: 'center' },
    selectBox: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer', fontSize: '14px' },

    statusMessage: { textAlign: 'center', padding: '50px', color: '#64748b', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' },

    // Product Grid
    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
    productCard: { backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #e2e8f0', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column' },
    imageBox: { padding: '15px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px' },
    productImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
    productInfo: { padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 },
    badge: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', marginBottom: '8px' },
    productName: { fontSize: '14px', color: '#0f172a', margin: '0 0 10px 0', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' },
    priceRow: { marginTop: 'auto', marginBottom: '15px' },
    productPrice: { color: '#ef4444', fontWeight: 'bold', fontSize: '16px' },
    detailBtn: { width: '100%', padding: '8px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
};

export default TrangSanPham;