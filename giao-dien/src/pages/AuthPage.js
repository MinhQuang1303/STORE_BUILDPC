import React, { useState } from 'react';
import { dangKy, dangNhap } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ ten: '', email: '', matKhau: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const data = await dangNhap({ email: formData.email, matKhau: formData.matKhau });
                
                // QUAN TRỌNG: Lưu thông tin đăng nhập để Banner có thể hiện "Hi, Quang"
                localStorage.setItem('user', JSON.stringify(data));
                
                alert('Chào mừng ' + data.user.ten);

                // CHỈNH Ở ĐÂY: Chuyển hướng về Trang Chủ (/) thay vì (/build)
                navigate('/'); 
                
            } else {
                await dangKy(formData);
                alert('Đăng ký thành công! Hãy đăng nhập.');
                setIsLogin(true);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: 'center' }}>{isLogin ? '🔑 Đăng Nhập' : '📝 Đăng Ký'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input 
                        type="text" 
                        placeholder="Tên của bạn" 
                        style={styles.input}
                        onChange={(e) => setFormData({...formData, ten: e.target.value})} 
                    />
                )}
                <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    style={styles.input}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    required 
                    style={styles.input}
                    onChange={(e) => setFormData({...formData, matKhau: e.target.value})} 
                />
                
                <button type="submit" style={styles.button}>
                    {isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'}
                </button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} style={styles.switchText}>
                {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </p>
        </div>
    );
};

const styles = {
    container: { 
        maxWidth: '400px', 
        margin: '80px auto', 
        padding: '30px', 
        border: '1px solid #eee', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        backgroundColor: '#fff' 
    },
    input: { 
        display: 'block', 
        width: '100%', 
        padding: '12px', 
        marginBottom: '15px', 
        borderRadius: '6px', 
        border: '1px solid #ddd',
        boxSizing: 'border-box' 
    },
    button: { 
        width: '100%', 
        padding: '12px', 
        background: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px', 
        fontWeight: 'bold', 
        cursor: 'pointer' 
    },
    switchText: { 
        cursor: 'pointer', 
        color: '#007bff', 
        textAlign: 'center', 
        marginTop: '20px', 
        fontSize: '14px' 
    }
};

export default AuthPage;