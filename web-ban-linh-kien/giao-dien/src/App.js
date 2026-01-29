import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [sanPhams, setSanPhams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/san-pham')
      .then(res => setSanPhams(res.data))
      .catch(err => console.error("Lỗi API:", err));
  }, []);

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '40px' }}>🖥️ HỆ THỐNG BUILD PC TỰ CHỌN</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px' 
      }}>
        {sanPhams.map(item => (
          <div key={item._id} style={{ 
            backgroundColor: '#fff', borderRadius: '15px', padding: '20px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' 
          }}>
            <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
              <img src={item.anh} alt={item.ten} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '18px', margin: '10px 0' }}>{item.ten}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{item.thongSo}</p>
            <p style={{ color: '#e74c3c', fontSize: '22px', fontWeight: 'bold', margin: '15px 0' }}>
              {item.gia?.toLocaleString()} VNĐ
            </p>
            <button style={{ 
              backgroundColor: '#27ae60', color: 'white', border: 'none', 
              padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
            }}>
              Thêm vào cấu hình
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;