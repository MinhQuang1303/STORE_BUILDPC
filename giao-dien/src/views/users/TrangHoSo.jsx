import React, { useEffect, useState } from "react";
import { User, Shield, Calendar, MapPin, Phone, Lock, CheckCircle, Save, Camera, AlertCircle, Package, Heart, Bell, Settings } from "lucide-react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar";

const TrangHoSo = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    avatar: "",
    dob: "",
    gender: ""
  });
  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [passMessage, setPassMessage] = useState({ text: "", isError: false });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const userData = parsed.user || parsed;
        setUser(userData);
        setFormData({
          fullName: userData.fullName || "",
          phone: userData.phone || "",
          address: userData.address || "",
          avatar: userData.avatar || "",
          dob: userData.dob || "",
          gender: userData.gender || "Khác"
        });
      } catch (err) { }
    }
  };

  const fileInputRef = React.useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads')) {
      return `${process.env.REACT_APP_API_URL.replace('/api', '')}${url}`;
    }
    return url;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("dob", formData.dob);
    data.append("gender", formData.gender);
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/${user._id || user.id}`, data);
      if (res.data.success) {
        const updatedUser = res.data.data;
        setUser(updatedUser);
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(stored));
        
        window.dispatchEvent(new Event("storage"));
        
        setMessage({ text: "Cập nhật thông tin thành công!", isError: false });
        setTimeout(() => setMessage({ text: "", isError: false }), 3000);
      }
    } catch (err) {
      setMessage({ text: "Cập nhật thất bại: " + (err.response?.data?.message || err.message), isError: true });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return setPassMessage({ text: "Mật khẩu xác nhận không khớp!", isError: true });
    }
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/users/${user._id || user.id}/password`, passData);
      if (res.data.success) {
        setPassMessage({ text: "Đổi mật khẩu thành công!", isError: false });
        setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPassMessage({ text: "", isError: false }), 3000);
      }
    } catch (err) {
      setPassMessage({ text: "Đổi mật khẩu thất bại: " + (err.response?.data?.message || err.message), isError: true });
    }
  };

  if (!user) return <div className="text-center p-20 font-bold text-slate-500">Đang tải hồ sơ...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Left */}
        <UserSidebar 
          user={user}
          onAvatarClick={handleAvatarClick}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          avatarPreview={avatarPreview}
          customAvatar={formData.avatar}
        />

        {/* Content Right */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Hồ Sơ Của Tôi</h3>
              <p className="text-slate-500 text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {message.text && (
                <div className={`p-4 rounded-xl font-bold flex items-center gap-2 border ${message.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {message.isError ? <AlertCircle size={18}/> : <CheckCircle size={18}/>} 
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1 */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tên đăng nhập</label>
                    <input type="text" readOnly value={user.username} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed focus:outline-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Họ và Tên</label>
                    <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-blue-400" placeholder="Nguyễn Văn A" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-blue-400" placeholder="0987654321" />
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <input type="email" readOnly value={user.email} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ngày sinh</label>
                    <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-blue-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Giới tính</label>
                    <div className="flex items-center gap-6 py-2.5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gender" value="Nam" checked={formData.gender === "Nam"} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-4 h-4 text-blue-600 cursor-pointer" />
                        <span className="text-slate-700 font-medium">Nam</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gender" value="Nữ" checked={formData.gender === "Nữ"} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-4 h-4 text-blue-600 cursor-pointer" />
                        <span className="text-slate-700 font-medium">Nữ</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gender" value="Khác" checked={formData.gender === "Khác"} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-4 h-4 text-blue-600 cursor-pointer" />
                        <span className="text-slate-700 font-medium">Khác</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address (Full width) */}
              <div className="pt-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ giao hàng</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all hover:border-blue-400" placeholder="Số nhà, Đường, Phường, Quận, Tỉnh/TP" />
              </div>

              <div className="pt-6">
                <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                  <Save size={18} /> Cập Nhật Thông Tin
                </button>
              </div>
            </form>

            <div className="my-10 h-px w-full bg-slate-100"></div>

            {/* Password Update */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Lock size={20} className="text-slate-600" /> Đổi Mật Khẩu
                </h3>
                <p className="text-slate-500 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản tốt hơn</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="px-5 py-2 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-all text-sm"
              >
                {showPasswordForm ? "Huỷ thao tác" : "Yêu cầu đổi mật khẩu"}
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className={`space-y-6 transition-all duration-300 ${showPasswordForm ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              {passMessage.text && (
                <div className={`p-4 rounded-xl font-bold flex items-center gap-2 border ${passMessage.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {passMessage.isError ? <AlertCircle size={18}/> : <CheckCircle size={18}/>} 
                  {passMessage.text}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu hiện tại</label>
                  <input type="password" required value={passData.oldPassword} onChange={(e) => setPassData({...passData, oldPassword: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu mới</label>
                  <input type="password" required value={passData.newPassword} onChange={(e) => setPassData({...passData, newPassword: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Xác nhận mật khẩu mới</label>
                  <input type="password" required value={passData.confirmPassword} onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none transition-all" />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 shadow-md transition-all">
                  Lưu Mật Khẩu
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangHoSo;
