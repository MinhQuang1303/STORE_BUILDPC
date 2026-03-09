import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Banner = ({ onSearch }) => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext); // Lấy dữ liệu giỏ hàng thực tế
    
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const user = userStorage?.user;

    const handleDangXuat = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            {/* Tên Store - Click để về trang chủ */}
            <div style={styles.logo} onClick={() => navigate('/')}>
                STORE_BUILDPC
            </div>

            {/* Thanh tìm kiếm */}
            <div style={styles.searchContainer}>
                <input 
                    type="text" 
                    placeholder="Tìm kiếm linh kiện..." 
                    style={styles.searchInput}
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                />
            </div>

            {/* Danh mục & Giỏ hàng */}
            <div style={styles.menuItems}>
                <span style={styles.item} onClick={() => navigate('/')}>Danh mục</span>
                
                {/* Giỏ hàng hiển thị số lượng thực tế */}
                <div style={styles.cartIcon} onClick={() => navigate('/gio-hang')}>
                    🛒 <span style={styles.cartBadge}>{cartItems.length}</span>
                </div>
            </div>

            {/* Thông tin tài khoản */}
            <div style={styles.authSection}>
                {user ? (
                    <div style={styles.userBox}>
                        <span style={styles.userName}>Hi, {user.ten}</span>
                        <button onClick={handleDangXuat} style={styles.logoutBtn}>
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} style={styles.loginBtn}>
                        Đăng nhập
                    </button>
                )}
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 50px',
        backgroundColor: '#2c3e50',
        color: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        cursor: 'pointer',
        color: '#3498db'
    },
    searchContainer: {
        flex: 1,
        margin: '0 30px',
    },
    searchInput: {
        width: '100%',
        padding: '8px 15px',
        borderRadius: '20px',
        border: 'none',
        outline: 'none'
    },
    menuItems: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginRight: '20px'
    },
    item: { cursor: 'pointer', fontWeight: '500' },
    cartIcon: { position: 'relative', fontSize: '20px', cursor: 'pointer' },
    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-10px',
        backgroundColor: '#e74c3c',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '12px'
    },
    authSection: { display: 'flex', alignItems: 'center' },
    userBox: { display: 'flex', alignItems: 'center', gap: '15px' },
    userName: { fontWeight: 'bold', color: '#f1c40f' },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid white',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: '0.3s'
    },
    loginBtn: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default Banner;