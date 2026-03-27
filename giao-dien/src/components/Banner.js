import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link vào đây
import { CartContext } from '../context/CartContext';

const Banner = ({ onSearch }) => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext); 
    
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const user = userStorage?.user;

    const handleDangXuat = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            {/* Logo - Click về trang chủ */}
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

            {/* Menu điều hướng */}
            <div style={styles.menuItems}>
                <Link to="/" style={styles.navLink}>Trang chủ</Link>
                <Link to="/san-pham" style={styles.navLink}>Cửa hàng</Link>
                <Link to="/build" style={styles.navLink}>Build PC</Link>
                
                {/* Giỏ hàng */}
                <div style={styles.cartIcon} onClick={() => navigate('/gio-hang')}>
                    🛒 <span style={styles.cartBadge}>{cartItems.length}</span>
                </div>
            </div>

            {/* Khu vực tài khoản */}
            <div style={styles.authSection}>
                {user ? (
                    <div style={styles.userBox}>
                        <span style={styles.userName}>Hi, {user.ten}</span>
                        {user.vaiTro === 'admin' && (
                            <button onClick={() => navigate('/admin')} style={styles.adminBtn}>Admin</button>
                        )}
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
        padding: '12px 40px',
        backgroundColor: '#1e293b', // Đổi sang màu xanh đen hiện đại hơn
        color: 'white',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    logo: {
        fontSize: '22px',
        fontWeight: '800',
        cursor: 'pointer',
        color: '#3b82f6',
        letterSpacing: '1px'
    },
    searchContainer: {
        flex: 1,
        margin: '0 40px',
        maxWidth: '500px'
    },
    searchInput: {
        width: '100%',
        padding: '10px 18px',
        borderRadius: '10px',
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        backgroundColor: '#334155',
        color: 'white'
    },
    menuItems: {
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
    },
    navLink: {
        textDecoration: 'none',
        color: '#cbd5e1',
        fontWeight: '600',
        fontSize: '15px',
        transition: 'color 0.2s'
    },
    cartIcon: { 
        position: 'relative', 
        fontSize: '22px', 
        cursor: 'pointer',
        marginLeft: '10px'
    },
    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-10px',
        backgroundColor: '#ef4444',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '11px',
        fontWeight: 'bold',
        border: '2px solid #1e293b'
    },
    authSection: { marginLeft: '20px' },
    userBox: { display: 'flex', alignItems: 'center', gap: '12px' },
    userName: { fontWeight: '600', color: '#f59e0b', fontSize: '14px' },
    adminBtn: {
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        padding: '5px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: '#94a3b8',
        border: '1px solid #475569',
        padding: '6px 14px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s'
    },
    loginBtn: {
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
    }
};

export default Banner;