import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoutImg from '../assets/images/logout.jpg'; 

const DangKy = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 1. Kiểm tra mật khẩu khớp chưa
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // 2. Gửi dữ liệu lên API Backend
      const response = await axios.post("http://localhost:5000/api/auth/dang-ky", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201) {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        navigate("/dang-nhap"); 
      }
    } catch (error) {
      // 3. Hiển thị lỗi từ Server (ví dụ: Trùng email, trùng tên...)
      const message = error.response?.data?.message || "Lỗi đăng ký, vui lòng thử lại!";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse"></div>

      <div className="relative z-10 flex w-full max-w-6xl h-[700px] bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden m-4">
        
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden group">
          <img 
            src={logoutImg} 
            alt="Logout Tech" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#020617]/20 to-transparent opacity-80"></div>
          
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h1 className="text-5xl font-black italic tracking-tighter mb-4 uppercase font-orbitron">Join The Fleet</h1>
            <p className="text-gray-300 text-lg max-w-sm border-l-4 border-purple-500 pl-4">
              Tạo tài khoản để lưu lại những cấu hình PC đỉnh nhất và nhận ưu đãi độc quyền.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
          <div className="animate-fadeIn">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-white mb-2 font-orbitron">Đăng Ký</h2>
              <span className="h-1 w-20 bg-purple-500 block rounded-full mx-auto lg:mx-0"></span>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1 block">Tên người dùng</label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                    placeholder="NGUYEN VAN PC"
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                    placeholder="abc@example.com"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1 block">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1 block">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" required className="accent-purple-500 w-4 h-4 cursor-pointer" />
                <label className="text-xs text-gray-400 cursor-pointer">Tôi đồng ý với các điều khoản bảo mật</label>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black py-4 rounded-xl shadow-[0_10px_20px_rgba(168,85,247,0.3)] transition-all transform active:scale-95 uppercase tracking-widest italic">
                Khởi tạo tài khoản
              </button>
            </form>

            <p className="mt-6 text-center text-gray-500 text-sm">
              Đã có tài khoản? {' '}
              <Link to="/dang-nhap" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangKy;