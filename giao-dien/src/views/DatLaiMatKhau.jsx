import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DatLaiMatKhau = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Mật khẩu không khớp!");

    try {
      // PATCH lên backend để đổi pass với token từ URL
      const res = await axios.patch(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      alert("Đổi mật khẩu thành công! Hãy đăng nhập lại.");
      navigate('/dang-nhap');
    } catch (err) {
      setMessage(err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white font-sans">
      <div className="bg-[#0f172a] p-10 rounded-[40px] border border-white/10 w-full max-w-md shadow-2xl backdrop-blur-xl">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400 italic">MẬT KHẨU MỚI</h2>
        <p className="text-gray-400 mb-8 text-sm text-center">Vui lòng thiết lập mật khẩu mạnh để bảo vệ tài khoản.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="password" 
            placeholder="Nhập mật khẩu mới" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 transition-all text-white"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Xác nhận mật khẩu" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 transition-all text-white"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-4 rounded-2xl font-black shadow-lg hover:from-cyan-500 hover:to-blue-500 transition-all transform active:scale-95 italic">
            XÁC NHẬN THAY ĐỔI
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 text-sm text-center font-medium bg-red-500/10 p-2 rounded-lg">{message}</p>}
      </div>
    </div>
  );
};

export default DatLaiMatKhau;