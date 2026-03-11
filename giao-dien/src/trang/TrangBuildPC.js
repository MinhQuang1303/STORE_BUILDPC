import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { xoaSanPham } from '../services/sanPhamService';
import Banner from '../components/Banner';

function TrangBuildPC() {
    // 1. Quản lý State
    const [sanPhams, setSanPhams] = useState([]); // Dữ liệu gốc từ API
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm từ Banner
    const [cauHinh, setCauHinh] = useState({ CPU: null, GPU: null, RAM: null });

    // Lấy thông tin user để kiểm tra quyền Admin
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const laAdmin = userStorage?.user?.vaiTro === 'admin';

    // 2. Tải dữ liệu từ Backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/san-pham')
            .then(res => setSanPhams(res.data))
            .catch(err => console.error("Lỗi API:", err));
    }, []);

    // 3. Logic xử lý
    const chonLinhKien = (sp) => {
        setCauHinh({ ...cauHinh, [sp.loai]: sp });
    };

    const handleXoa = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa linh kiện này?")) {
            try {
                await xoaSanPham(id);
                alert("Đã xóa thành công!");
                setSanPhams(sanPhams.filter(item => item._id !== id));
            } catch (error) {
                alert("Lỗi: " + (error.response?.data?.message || "Không thể xóa"));
            }
        }
    };

    // Tính tổng tiền
    const tongTien = Object.values(cauHinh).reduce((total, item) => {
        return total + (item ? item.gia : 0);
    }, 0);

    // Lọc danh sách sản phẩm theo từ khóa tìm kiếm (nhận từ Banner)
    const sanPhamsHienThi = sanPhams.filter(sp => 
        sp.ten.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial' }}>
            {/* BANNER: Chứa Store Name, Search, Acc Info, Logout */}
            <Banner onSearch={setSearchTerm} />

            <div style={{ padding: '30px' }}>
                <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>
                    🛠️ TỰ XÂY DỰNG CẤU HÌNH PC
                </h1>

                {/* KHU VỰC CẤU HÌNH ĐÃ CHỌN */}
                <div style={styles.buildSummary}>
                    <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Dàn máy của bạn:</h3>
                    <div style={styles.buildGrid}>
                        <div style={styles.buildItem}>
                            <strong>CPU:</strong> {cauHinh.CPU ? cauHinh.CPU.ten : <span style={{color: '#999'}}>Chưa chọn</span>}
                        </div>
                        <div style={styles.buildItem}>
                            <strong>GPU:</strong> {cauHinh.GPU ? cauHinh.GPU.ten : <span style={{color: '#999'}}>Chưa chọn</span>}
                        </div>
                        <div style={styles.buildItem}>
                            <strong>RAM:</strong> {cauHinh.RAM ? cauHinh.RAM.ten : <span style={{color: '#999'}}>Chưa chọn</span>}
                        </div>
                    </div>
                    <h2 style={{ color: '#e74c3c', marginTop: '15px', textAlign: 'right' }}>
                        Tổng cộng: {tongTien.toLocaleString()} VNĐ
                    </h2>
                </div>

                {/* DANH SÁCH LINH KIỆN LỌC THEO TÌM KIẾM */}
                <div style={styles.productGrid}>
                    {sanPhamsHienThi.length > 0 ? (
                        sanPhamsHienThi.map(item => (
                            <div key={item._id} style={styles.card}>
                                <div style={styles.imageContainer}>
                                    <img src={item.anh} alt={item.ten} style={styles.image} />
                                </div>
                                <h3 style={styles.productName}>{item.ten}</h3>
                                <p style={styles.thongSo}>{item.thongSo}</p>
                                <p style={styles.price}>{item.gia?.toLocaleString()} VNĐ</p>
                                
                                <button onClick={() => chonLinhKien(item)} style={styles.addBtn}>
                                    Thêm vào cấu hình
                                </button>

                                {laAdmin && (
                                    <button 
                                        onClick={() => handleXoa(item._id)} 
                                        style={styles.adminDelBtn}
                                    >
                                        🗑️ Xóa (Admin)
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Không tìm thấy linh kiện nào khớp với từ khóa.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// CSS-in-JS
const styles = {
    buildSummary: { border: '2px solid #2c3e50', padding: '20px', marginBottom: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    buildGrid: { display: 'flex', justifyContent: 'space-between', gap: '20px' },
    buildItem: { flex: 1, padding: '10px', backgroundColor: '#f1f2f6', borderRadius: '8px' },
    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
    card: { backgroundColor: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', transition: 'transform 0.2s' },
    imageContainer: { height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' },
    image: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
    productName: { fontSize: '18px', margin: '10px 0', height: '45px', overflow: 'hidden' },
    thongSo: { color: '#666', fontSize: '13px', height: '40px' },
    price: { color: '#e74c3c', fontSize: '20px', fontWeight: 'bold', margin: '10px 0' },
    addBtn: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' },
    adminDelBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', width: '100%', fontSize: '12px' }
};

export default TrangBuildPC;