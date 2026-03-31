import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Calendar, MapPin, Phone, Lock, CheckCircle, Save, Camera, AlertCircle } from "lucide-react";
import axios from "axios";

const TrangHoSo = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    avatar: ""
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
          avatar: userData.avatar || ""
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
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/${user._id || user.id}`, data);
      if (res.data.success) {
        setMessage("Cập nhật thông tin thành công!");
        const updatedUser = res.data.data;
        setUser(updatedUser);
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(stored));
        
        // Cập nhật lên Window để Layout bắt kiện sự thay đổi (tuỳ chọn)
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
    <div className="min-h-screen bg-[#f8fafc] flex justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        
        {/* Cột trái: Hiển thị Thẻ định danh */}
        <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col pt-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div 
               className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-white/10 flex items-center justify-center mb-6 shadow-2xl relative group cursor-pointer"
               onClick={handleAvatarClick}
               title="Nhấn để thay đổi ảnh đại diện"
             >
                {avatarPreview || formData.avatar ? (
                  <img src={avatarPreview || getAvatarUrl(formData.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-white">{user.username.charAt(0).toUpperCase()}</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={28} />
                </div>
             </div>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
             
             <h2 className="text-3xl font-black text-center">{user.fullName || user.username}</h2>
             <p className="text-blue-200 font-medium mt-1 mb-8 opacity-90">{user.email}</p>
             
             <div className="w-full bg-white/10 rounded-2xl p-5 border border-white/20 backdrop-blur-md space-y-4">
               <div className="flex items-center gap-3">
                 <Shield className="text-blue-200" size={20} />
                 <div>
                   <p className="text-[10px] uppercase tracking-widest text-blue-200 font-bold opacity-80">Phân quyền</p>
                   <p className="font-bold text-sm">{user.role === 'admin' ? 'Quản Trị Viên' : 'Thành Viên'}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Calendar className="text-blue-200" size={20} />
                 <div>
                   <p className="text-[10px] uppercase tracking-widest text-blue-200 font-bold opacity-80">Ngày gia nhập</p>
                   <p className="font-bold text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Cột phải: Form cập nhật */}
        <div className="md:w-2/3 p-8 sm:p-12 pb-20 overflow-y-auto custom-scrollbar">
          
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-800 mb-1 flex items-center gap-2">
              <User size={24} className="text-blue-600" /> Hồ sơ cá nhân
            </h3>
            <p className="text-slate-500 text-sm">Cập nhật thông tin giao hàng và định danh thực tế.</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl font-bold flex items-center gap-2 border ${message.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {message.isError ? <AlertCircle size={18}/> : <CheckCircle size={18}/>} 
                {message.text}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Username (Khoá) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tên đăng nhập <span className="text-red-400">*</span></label>
                <input type="text" readOnly value={user.username} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" />
              </div>
              
              {/* Email (Khoá) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hộp Thư (Email) <span className="text-red-400">*</span></label>
                <input type="text" readOnly value={user.email} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Họ và Tên</label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm hover:border-blue-400" placeholder="VD: Nguyễn Văn A" />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Số điện thoại</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm hover:border-blue-400" placeholder="VD: 0987654321" />
              </div>
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Địa chỉ giao hàng</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm hover:border-blue-400" placeholder="Số nhà, Đường, Phường, Quận, Tỉnh/TP" />
            </div>



            <div className="pt-2">
              <button type="submit" className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2">
                <Save size={18} /> Lưu Thông Tin
              </button>
            </div>
          </form>

          {/* Dải phân cách */}
          <div className="my-10 h-px w-full bg-slate-200"></div>

          {/* Đổi Mật Khẩu */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200 pt-8">
            <div>
              <h3 className="text-2xl font-black text-slate-800 mb-1 flex items-center gap-2">
                <Lock size={24} className="text-red-500" /> Xác thực bảo mật
              </h3>
              <p className="text-slate-500 text-sm">Điền mật khẩu cũ để xác thực lệnh cấp mật khẩu mới.</p>
            </div>
            <button 
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-5 py-2 mt-2 sm:mt-0 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-600 hover:text-white transition-all text-sm w-full sm:w-auto"
            >
              {showPasswordForm ? "Huỷ thao tác" : "Yêu cầu đổi Mật khẩu"}
            </button>
          </div>

          <form onSubmit={handleUpdatePassword} className={`space-y-6 transition-all duration-300 ${showPasswordForm ? 'opacity-100 max-h-screen mt-6' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            {passMessage.text && (
              <div className={`p-4 rounded-xl font-bold flex items-center gap-2 border ${passMessage.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {passMessage.isError ? <AlertCircle size={18}/> : <CheckCircle size={18}/>} 
                {passMessage.text}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mật khẩu hiện tại</label>
                <input type="password" required value={passData.oldPassword} onChange={(e) => setPassData({...passData, oldPassword: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mật khẩu mới</label>
                <input type="password" required value={passData.newPassword} onChange={(e) => setPassData({...passData, newPassword: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Xác nhận mật khẩu mới</label>
                <input type="password" required value={passData.confirmPassword} onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="px-6 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 shadow-md transition-all">
                Cập Nhật Mật Khẩu
              </button>
            </div>
          </form>

        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default TrangHoSo;
