import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authBg from '../assets/images/login.jpg'; 

const DangNhap = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Hàm xử lý Đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/dang-nhap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // --- LƯU DỮ LIỆU ---
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        alert("Đăng nhập thành công!");

        // --- CHUYỂN TRANG VÀ LÀM MỚI TRẠNG THÁI (QUAN TRỌNG) ---
        // Dùng window.location.href để trang chủ nhận diện được localStorage mới ngay lập tức
        if (data.user.role === 'admin') {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        alert(data.message || "Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      alert("Lỗi kết nối Backend!");
    }
  };

  // 2. Hàm xử lý Google
  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  // 3. Hàm xử lý Quên mật khẩu
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }) 
      });
      if (response.ok) {
        alert("Link đổi mật khẩu đã được gửi vào Email!");
        setIsForgotPassword(false); 
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      <div className="relative z-10 flex w-full max-w-6xl h-[650px] bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden m-4">
        
        {/* BANNER TRÁI */}
        <div className="hidden lg:block lg:w-3/5 relative overflow-hidden group">
          <img src={authBg} alt="Tech" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] opacity-60"></div>
          <div className="absolute bottom-12 left-12 text-white">
            <h1 className="text-5xl font-black italic mb-4 font-orbitron">NEXT-GEN BUILD</h1>
            <p className="border-l-4 border-cyan-500 pl-4 text-gray-300">Khởi đầu kỷ nguyên công nghệ của riêng bạn.</p>
          </div>
        </div>

        {/* FORM PHẢI */}
        <div className="w-full lg:w-2/5 p-10 flex flex-col justify-center">
          {!isForgotPassword ? (
            <div className="animate-fadeIn">
              <h2 className="text-4xl font-bold text-white mb-8">Đăng Nhập</h2>
              <form className="space-y-5" onSubmit={handleLogin}>
                <input type="email" placeholder="Email" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Mật khẩu" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500" onChange={(e) => setPassword(e.target.value)} />
                <div className="text-right">
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-gray-400 hover:text-cyan-400 transition">Quên mật khẩu?</button>
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 italic uppercase">Xác nhận đăng nhập</button>
              </form>
              <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-4 text-gray-500 text-[10px] uppercase font-bold">Hoặc</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
              <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 rounded-2xl hover:bg-gray-200 transition-all shadow-md transform active:scale-95">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" className="w-5 h-5" alt="gg" />
                Đăng nhập bằng Google
              </button>
              <p className="mt-8 text-center text-gray-500 text-sm">Chưa có tài khoản? <Link to="/dang-ky" className="text-cyan-400 font-bold hover:underline">Đăng ký ngay</Link></p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <button onClick={() => setIsForgotPassword(false)} className="text-gray-400 mb-6 italic text-sm hover:text-white transition">← Quay lại đăng nhập</button>
              <h2 className="text-3xl font-bold text-white mb-4 italic">KHÔI PHỤC</h2>
              <form className="space-y-6" onSubmit={handleForgotPassword}>
                <input type="email" required placeholder="Email của bạn" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500" onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg transform active:scale-95 italic uppercase">Gửi link xác nhận</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DangNhap;