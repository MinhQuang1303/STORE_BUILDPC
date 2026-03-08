import React, { useState, useEffect } from 'react';
import { laySanPhamTheoLoai } from '../dich-vu/sanPhamService';

const TrangBuildPC = () => {
    const [danhSachLinhKien, setDanhSachLinhKien] = useState([]);
    const [loaiDangChon, setLoaiDangChon] = useState('CPU');
    const [cauHinh, setCauHinh] = useState({ CPU: null, GPU: null, RAM: null });

    // Khi người dùng đổi tab (VD: bấm vào GPU), tải danh sách GPU về
    useEffect(() => {
        const taiDuLieu = async () => {
            const data = await laySanPhamTheoLoai(loaiDangChon);
            setDanhSachLinhKien(data);
        };
        taiDuLieu();
    }, [loaiDangChon]);

    // Hàm chọn linh kiện đưa vào cấu hình
    const chonLinhKien = (sanPham) => {
        setCauHinh({ ...cauHinh, [sanPham.loai]: sanPham });
    };

    // Tính tổng tiền
    const tongTien = Object.values(cauHinh).reduce((total, item) => {
        return total + (item ? item.gia : 0);
    }, 0);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>🛠️ Xây Dựng Cấu Hình PC</h1>
            
            {/* Khu vực hiển thị cấu hình đã chọn */}
            <div style={{ border: '2px solid #333', padding: '15px', marginBottom: '20px' }}>
                <h3>Cấu hình của bạn:</h3>
                <p>CPU: {cauHinh.CPU ? cauHinh.CPU.tenSanPham : 'Chưa chọn'}</p>
                <p>GPU: {cauHinh.GPU ? cauHinh.GPU.tenSanPham : 'Chưa chọn'}</p>
                <p>RAM: {cauHinh.RAM ? cauHinh.RAM.tenSanPham : 'Chưa chọn'}</p>
                <h3 style={{ color: 'red' }}>Tổng tiền: {tongTien.toLocaleString()} VNĐ</h3>
            </div>

            {/* Menu chọn loại linh kiện */}
            <div style={{ marginBottom: '20px' }}>
                {['CPU', 'GPU', 'RAM'].map(loai => (
                    <button 
                        key={loai}
                        onClick={() => setLoaiDangChon(loai)}
                        style={{ 
                            marginRight: '10px', 
                            padding: '10px 20px',
                            background: loaiDangChon === loai ? '#007bff' : '#ccc',
                            color: '#fff', border: 'none', cursor: 'pointer'
                        }}
                    >
                        Chọn {loai}
                    </button>
                ))}
            </div>

            {/* Danh sách sản phẩm lấy từ API */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {danhSachLinhKien.map(sp => (
                    <div key={sp._id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                        <h4>{sp.tenSanPham}</h4>
                        <p>Giá: {sp.gia.toLocaleString()} đ</p>
                        <p>Thông số: {sp.thongSo}</p>
                        <button 
                            onClick={() => chonLinhKien(sp)}
                            style={{ background: 'green', color: 'white', padding: '5px 10px', border: 'none' }}
                        >
                            + Thêm vào cấu hình
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrangBuildPC;