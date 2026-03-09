// giao-dien/src/pages/TrangAdmin.js
import React, { useState, useEffect } from 'react';
import { layTatCaSanPham, themSanPhamMoi, xoaSanPham } from '../services/sanPhamService';

const TrangAdmin = () => {
    const [danhSach, setDanhSach] = useState([]);
    const [form, setForm] = useState({ ten: '', loai: 'CPU', gia: 0, anh: '', thongSo: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const res = await layTatCaSanPham();
        setDanhSach(res.data);
    };

    const handleThem = async (e) => {
        e.preventDefault();
        try {
            await themSanPhamMoi(form);
            alert("Thêm linh kiện thành công!");
            setForm({ ten: '', loai: 'CPU', gia: 0, anh: '', thongSo: '' }); // Reset form
            loadData();
        } catch (err) { alert("Lỗi khi thêm!"); }
    };

    const handleXoa = async (id) => {
        if (window.confirm("Xóa linh kiện này?")) {
            await xoaSanPham(id);
            loadData();
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial' }}>
            <h1>🛠️ QUẢN TRỊ KHO LINH KIỆN</h1>
            
            {/* FORM THÊM MỚI */}
            <div style={{ background: '#eee', padding: '20px', marginBottom: '30px', borderRadius: '10px' }}>
                <h3>Thêm linh kiện mới</h3>
                <form onSubmit={handleThem} style={{ display: 'grid', gap: '10px' }}>
                    <input type="text" placeholder="Tên linh kiện" value={form.ten} onChange={e => setForm({...form, ten: e.target.value})} required />
                    <select value={form.loai} onChange={e => setForm({...form, loai: e.target.value})}>
                        {['CPU', 'GPU', 'RAM', 'Mainboard', 'SSD', 'PSU', 'Case'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <input type="number" placeholder="Giá (VNĐ)" value={form.gia} onChange={e => setForm({...form, gia: e.target.value})} required />
                    <input type="text" placeholder="Link ảnh (URL)" value={form.anh} onChange={e => setForm({...form, anh: e.target.value})} />
                    <textarea placeholder="Thông số kỹ thuật" value={form.thongSo} onChange={e => setForm({...form, thongSo: e.target.value})} />
                    <button type="submit" style={{ background: '#27ae60', color: '#white', padding: '10px', border: 'none', cursor: 'pointer' }}>LƯU LINH KIỆN</button>
                </form>
            </div>

            {/* DANH SÁCH HIỆN CÓ */}
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead style={{ background: '#34495e', color: 'white' }}>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>Loại</th>
                        <th>Giá</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {danhSach.map(item => (
                        <tr key={item._id}>
                            <td><img src={item.anh} width="50" alt="" /></td>
                            <td>{item.ten}</td>
                            <td>{item.loai}</td>
                            <td>{item.gia.toLocaleString()} đ</td>
                            <td>
                                <button onClick={() => handleXoa(item._id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TrangAdmin;