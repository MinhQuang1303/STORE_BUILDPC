import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const user = searchParams.get('user');

        if (token && user) {
            // 1. Lưu Token
            localStorage.setItem('token', token);
            // 2. Lưu User (Giải mã URI vì Backend gửi chuỗi đã encode)
            localStorage.setItem('user', decodeURIComponent(user));
            
            // 3. Ép load lại trang chủ để Header nhận diện account ngay
            window.location.href = "/"; 
        } else {
            navigate('/dang-nhap');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white font-sans">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2 italic">NEXTGEN PC</h2>
                <p className="text-gray-400">Đang đồng bộ tài khoản Google, đợi tí nhé...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;