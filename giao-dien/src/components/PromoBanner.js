// giao-dien/src/components/PromoBanner.js
import React from 'react';

const PromoBanner = () => (
    <div style={styles.promoContainer}>
        <div style={styles.promoContent}>
            <h2 style={{ fontSize: '32px' }}>🔥 SIÊU SALE LINH KIỆN PC 2026</h2>
            <p>Giảm đến 30% cho các dòng RTX 50-Series và Intel Gen 16th</p>
            <button style={styles.promoBtn}>XEM NGAY</button>
        </div>
    </div>
);

const styles = {
    promoContainer: {
        background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        margin: '20px 0',
        borderRadius: '15px'
    },
    promoBtn: { backgroundColor: '#f1c40f', border: 'none', padding: '10px 30px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default PromoBanner;