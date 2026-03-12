import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Banner from '../components/Banner';
import { CartContext } from '../context/CartContext'; 

function TrangBuildPC() {
    const navigate = useNavigate();
    const [sanPhams, setSanPhams] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [danhSachChon, setDanhSachChon] = useState([]);
    const [loaiDangChon, setLoaiDangChon] = useState('Tất cả');
    const [loiCauHinh, setLoiCauHinh] = useState([]); 

    const { addToCart } = useContext(CartContext); 
    const cacLoaiLinhKien = ['Tất cả', 'CPU', 'Mainboard', 'RAM', 'VGA', 'Ổ cứng', 'Nguồn', 'Case', 'Tản nhiệt'];

    const userStorage = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get('http://localhost:5000/api/san-pham')
            .then(res => setSanPhams(res.data))
            .catch(err => console.error("Lỗi API:", err));
    }, []);

    // Logic kiểm tra tương thích (Socket & RAM)
    useEffect(() => {
        let errors = [];
        const cpu = danhSachChon.find(item => item.loai === 'CPU');
        const main = danhSachChon.find(item => item.loai === 'Mainboard');
        const ram = danhSachChon.find(item => item.loai === 'RAM');

        if (cpu && main) {
            const regexSocket = /(LGA\s?\d+|AM\d+|Socket\s?\d+)/i;
            const cpuS = cpu.thongSo?.match(regexSocket)?.[0]?.replace(/\s|Socket/ig, '');
            const mainS = main.thongSo?.match(regexSocket)?.[0]?.replace(/\s|Socket/ig, '');
            if (cpuS && mainS && cpuS !== mainS) {
                errors.push(`❌ Lỗi Socket: CPU (${cpuS}) không khớp với Mainboard (${mainS}).`);
            }
        }

        if (main && ram) {
            const mRam = main.thongSo?.match(/DDR\d/i)?.[0]?.toUpperCase();
            const rRam = ram.thongSo?.match(/DDR\d/i)?.[0]?.toUpperCase();
            if (mRam && rRam && mRam !== rRam) {
                errors.push(`❌ Lỗi RAM: Mainboard hỗ trợ ${mRam} nhưng RAM là ${rRam}.`);
            }
        }
        setLoiCauHinh(errors);
    }, [danhSachChon]);

    // SỬA LỖI: Chọn linh kiện mới sẽ thay thế linh kiện cũ cùng loại
    const chonLinhKien = (sp) => {
        setDanhSachChon((prev) => {
            const index = prev.findIndex(item => item.loai === sp.loai);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = { ...sp, soLuong: 1 };
                return updated;
            }
            return [...prev, { ...sp, soLuong: 1 }];
        });
    };

    const handleAction = (type) => {
        if (!userStorage) {
            if (window.confirm("Bạn cần đăng nhập để tiếp tục. Đi đến trang đăng nhập?")) {
                navigate('/login');
            }
            return;
        }

        if (loiCauHinh.length > 0) {
            alert("Vui lòng sửa lỗi cấu hình trước khi tiếp tục!");
            return;
        }

        if (type === 'ADD_ALL') {
            if (danhSachChon.length === 0) return alert("Chưa chọn linh kiện nào!");
            danhSachChon.forEach(sp => addToCart(sp, sp.soLuong, true));
            alert("Toàn bộ cấu hình đã được thêm vào giỏ hàng!");
        } else {
            alert(`Tổng tiền: ${tongTien.toLocaleString()} đ. Đang chuyển hướng thanh toán...`);
        }
    };

    const tongTien = danhSachChon.reduce((t, i) => t + (i.gia * i.soLuong), 0);
    const sanPhamsHienThi = sanPhams.filter(sp => 
        sp.ten.toLowerCase().includes(searchTerm.toLowerCase()) && 
        (loaiDangChon === 'Tất cả' || sp.loai === loaiDangChon)
    );

    return (
        <div style={styles.page}>
            <Banner onSearch={setSearchTerm} />
            <div style={styles.container}>
                <div style={styles.mainLayout}>
                    {/* CỘT TRÁI */}
                    <div style={styles.leftCol}>
                        <div style={styles.tabs}>
                            {cacLoaiLinhKien.map(l => (
                                <button key={l} style={loaiDangChon === l ? styles.tabActive : styles.tab} onClick={() => setLoaiDangChon(l)}>{l}</button>
                            ))}
                        </div>
                        <div style={styles.grid}>
                            {sanPhamsHienThi.map(item => (
                                <div key={item._id} style={styles.card}>
                                    <div style={styles.imgWrap}><img src={item.anh} alt={item.ten} style={styles.img}/></div>
                                    <div style={styles.cardBody}>
                                        <span style={styles.typeBadge}>{item.loai}</span>
                                        <h4 style={styles.pName}>{item.ten}</h4>
                                        <p style={styles.price}>{item.gia?.toLocaleString()} đ</p>
                                        <button onClick={() => chonLinhKien(item)} style={styles.btnAdd}>+ Thêm vào cấu hình</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CỘT PHẢI */}
                    <div style={styles.rightCol}>
                        <div style={styles.sidebar}>
                            <h3 style={styles.sideTitle}>Dàn máy của bạn</h3>
                            {loiCauHinh.map((err, idx) => <div key={idx} style={styles.errorItem}>{err}</div>)}
                            <div style={styles.buildItems}>
                                {danhSachChon.length === 0 && <p style={styles.empty}>Chưa có linh kiện nào</p>}
                                {danhSachChon.map(item => (
                                    <div key={item._id} style={styles.itemRow}>
                                        <div style={{flex: 1}}>
                                            <div style={styles.itemName}>{item.ten}</div>
                                            <div style={styles.itemPrice}>{item.gia.toLocaleString()} đ</div>
                                        </div>
                                        <button onClick={() => setDanhSachChon(danhSachChon.filter(i => i._id !== item._id))} style={styles.btnDel}>✕</button>
                                    </div>
                                ))}
                            </div>
                            <div style={styles.footer}>
                                <div style={styles.totalRow}><span>Tổng cộng:</span><span style={styles.totalPrice}>{tongTien.toLocaleString()} đ</span></div>
                                <button style={styles.btnGreen} onClick={() => handleAction('ADD_ALL')}>🛒 Thêm cả bộ vào giỏ</button>
                                <button style={styles.btnBlue} onClick={() => handleAction('PAY')}>Thanh toán ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#f1f5f9', minHeight: '100vh' },
    container: { maxWidth: '1400px', margin: '0 auto', padding: '20px' },
    mainLayout: { display: 'flex', gap: '25px', alignItems: 'flex-start' },
    leftCol: { flex: 2 },
    tabs: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
    tab: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: '#fff' },
    tabActive: { padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' },
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '15px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' },
    imgWrap: { height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
    typeBadge: { fontSize: '10px', color: '#64748b', fontWeight: 'bold' },
    pName: { fontSize: '14px', margin: '5px 0', height: '40px', overflow: 'hidden' },
    price: { color: '#ef4444', fontWeight: 'bold' },
    btnAdd: { marginTop: '10px', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    rightCol: { flex: 1, position: 'sticky', top: '80px' },
    sidebar: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    sideTitle: { borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
    errorItem: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '8px', borderRadius: '6px', fontSize: '12px', marginBottom: '10px', fontWeight: 'bold' },
    buildItems: { maxHeight: '350px', overflowY: 'auto' },
    itemRow: { display: 'flex', padding: '10px 0', borderBottom: '1px solid #f1f5f9' },
    itemName: { fontSize: '12px', fontWeight: '500' },
    itemPrice: { fontSize: '12px', color: '#ef4444' },
    btnDel: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' },
    empty: { textAlign: 'center', color: '#94a3b8' },
    footer: { borderTop: '2px dashed #e2e8f0', paddingTop: '15px' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
    totalPrice: { color: '#ef4444', fontSize: '20px', fontWeight: 'bold' },
    btnGreen: { width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' },
    btnBlue: { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default TrangBuildPC;