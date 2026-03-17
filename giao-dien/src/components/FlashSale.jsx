import React, { useState, useEffect } from 'react';

const FlashSale = ({ products }) => {
    const [timeLeft, setTimeLeft] = useState(3600 * 5); // 5 tiếng

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m}:${s}`;
    };

    return (
        <div style={{ background: '#e74c3c', padding: '20px', borderRadius: '15px', color: 'white', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>⚡ DEAL TRONG NGÀY (FLASH SALE)</h2>
                <div style={{ background: 'black', padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold' }}>
                    KẾT THÚC TRONG: {formatTime(timeLeft)}
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                {products.filter(p => p.isFlashSale).map(p => (
                    <div key={p._id} style={{ minWidth: '200px', background: 'white', padding: '10px', borderRadius: '10px', color: 'black' }}>
                        <img src={p.anh} width="100%" alt="" />
                        <h4 style={{ fontSize: '14px', margin: '10px 0' }}>{p.ten}</h4>
                        <span style={{ color: 'red', fontWeight: 'bold' }}>{p.giaGiam?.toLocaleString()}đ</span>
                        <del style={{ fontSize: '12px', color: '#999', marginLeft: '5px' }}>{p.gia?.toLocaleString()}đ</del>
                    </div>
                ))}
            </div>
        </div>
    );
};