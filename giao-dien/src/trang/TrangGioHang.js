// giao-dien/src/trang/TrangGioHang.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Banner from '../components/Banner';

const TrangGioHang = () => {
    // Lấy thêm updateQty từ Context
    const { cartItems, removeFromCart, clearCart, updateQty } = useContext(CartContext);

    const tongTien = cartItems.reduce((acc, item) => acc + item.gia * item.qty, 0);

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Banner />
            <div style={styles.container}>
                <h2>🛒 GIỎ HÀNG CỦA BẠN</h2>
                {cartItems.length === 0 ? (
                    <p style={{textAlign: 'center', padding: '20px'}}>Giỏ hàng đang trống. Hãy tiếp tục mua sắm!</p>
                ) : (
                    <div>
                        {cartItems.map((item) => (
                            <div key={item._id} style={styles.cartItem}>
                                <img src={item.anh} alt={item.ten} style={styles.img} />
                                <div style={{ flex: 2 }}>
                                    <h4 style={{margin: '0 0 5px 0'}}>{item.ten}</h4>
                                    <p style={{margin: 0, color: '#666', fontSize: '14px'}}>
                                        Đơn giá: {item.gia.toLocaleString()} VNĐ
                                    </p>
                                </div>

                                {/* BỘ NÚT TĂNG GIẢM SỐ LƯỢNG */}
                                <div style={styles.quantityControl}>
                                    <button 
                                        onClick={() => updateQty(item._id, item.qty - 1)}
                                        style={styles.qtyBtn}
                                    >-</button>
                                    <span style={styles.qtyValue}>{item.qty}</span>
                                    <button 
                                        onClick={() => updateQty(item._id, item.qty + 1)}
                                        style={styles.qtyBtn}
                                    >+</button>
                                </div>

                                <div style={{ flex: 1, fontWeight: 'bold', textAlign: 'right' }}>
                                    {(item.gia * item.qty).toLocaleString()} VNĐ
                                </div>
                                
                                <button onClick={() => removeFromCart(item._id)} style={styles.delBtn}>
                                    🗑️
                                </button>
                            </div>
                        ))}
                        
                        <div style={styles.summary}>
                            <h3>Tổng thanh toán: <span style={{ color: '#e74c3c' }}>{tongTien.toLocaleString()} VNĐ</span></h3>
                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                                <button onClick={clearCart} style={styles.clearBtn}>Xóa hết</button>
                                <button style={styles.checkoutBtn}>THANH TOÁN NGAY</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Thêm các style mới vào object styles
const styles = {
    // ... các style cũ của bạn giữ nguyên, thêm/sửa các mục dưới đây:
    container: { maxWidth: '1000px', margin: '30px auto', padding: '20px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
    cartItem: { display: 'flex', alignItems: 'center', gap: '20px', padding: '15px 0', borderBottom: '1px solid #eee' },
    img: { width: '70px', height: '70px', objectFit: 'contain' },
    
    quantityControl: { 
        display: 'flex', 
        alignItems: 'center', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
        overflow: 'hidden'
    },
    qtyBtn: { 
        padding: '5px 12px', 
        backgroundColor: '#f8f9fa', 
        border: 'none', 
        cursor: 'pointer',
        fontSize: '16px'
    },
    qtyValue: { 
        padding: '0 15px', 
        fontWeight: 'bold',
        minWidth: '30px',
        textAlign: 'center'
    },

    delBtn: { color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', marginLeft: '15px' },
    summary: { marginTop: '30px', textAlign: 'right', borderTop: '2px solid #eee', paddingTop: '20px' },
    checkoutBtn: { padding: '12px 25px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    clearBtn: { padding: '12px 25px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default TrangGioHang;