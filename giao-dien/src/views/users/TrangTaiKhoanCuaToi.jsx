import React, { useState, useEffect } from 'react';
import { User, FileText, LogOut, MapPin, ShoppingBag, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import MyTradeIns from '../../components/MyTradeIns';
import TrangDonHangCuaToi from './TrangDonHangCuaToi';

const TrangTaiKhoanCuaToi = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved).user || JSON.parse(saved) : null;
  });

  const [formData, setFormData] = useState({
    hoTen: user?.hoTen || user?.username || '',
    gioiTinh: user?.gioiTinh || '',
    soDienThoai: user?.soDienThoai || '',
    email: user?.email || '',
    ngaySinh: user?.ngaySinh ? new Date(user.ngaySinh) : null,
    diaChi: user?.diaChi || '',
  });

  const [viewedProducts, setViewedProducts] = useState([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('viewed_products') || '[]');
      setViewedProducts(saved);
    } catch(e){}
  }, []);
  
  const [day, setDay] = useState(formData.ngaySinh ? formData.ngaySinh.getDate() : '');
  const [month, setMonth] = useState(formData.ngaySinh ? formData.ngaySinh.getMonth() + 1 : '');
  const [year, setYear] = useState(formData.ngaySinh ? formData.ngaySinh.getFullYear() : '');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/dang-nhap';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      let submitData = { ...formData };
      if (day && month && year) {
        submitData.ngaySinh = new Date(year, month - 1, day);
      }
      
      const userId = user?._id || user?.id;
      if (!userId) {
         toast.error("Không tìm thấy ID người dùng!");
         return;
      }
      
      // Sử dụng đường dẫn API từ .env hoặc mặc định localhost:5000
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const res = await axios.put(`${apiUrl}/users/${userId}`, submitData);
      
      if (res.data.success) {
        toast.success("Cập nhật thông tin thành công!");
        const updatedUser = { ...user, ...res.data.user };
        setUser(updatedUser);
        
        // Cập nhật lại localStorage để reload không bị mất data mới
        const rawSaved = localStorage.getItem('user');
        if (rawSaved) {
           let parsedSaved = JSON.parse(rawSaved);
           if (parsedSaved.user) {
             parsedSaved.user = updatedUser;
           } else {
             parsedSaved = updatedUser;
           }
           localStorage.setItem('user', JSON.stringify(parsedSaved));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật!");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-slate-600 mb-6">Bạn cần đăng nhập để xem tài khoản</p>
          <a href="/dang-nhap" className="bg-[#e30019] text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition">
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  const days = Array.from({length: 31}, (_, i) => i + 1);
  const months = Array.from({length: 12}, (_, i) => i + 1);
  const years = Array.from({length: 100}, (_, i) => new Date().getFullYear() - i);

  const menuItems = [
    { id: 'profile', icon: User, label: 'Thông tin tài khoản' },
    { id: 'addresses', icon: MapPin, label: 'Sổ địa chỉ' },
    { id: 'orders', icon: ShoppingBag, label: 'Quản lý đơn hàng' },
    { id: 'viewed-products', icon: Eye, label: 'Sản phẩm đã xem' },
    { id: 'trade-in', icon: FileText, label: 'Trade-in (Bán lại linh kiện)' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-4 mb-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden border border-slate-200">
              {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover"/> : (user.hoTen?.charAt(0) || user.username?.charAt(0) || 'U')}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Tài khoản của</p>
              <p className="text-base font-bold text-slate-800 line-clamp-1" title={user.hoTen || user.username}>{user.hoTen || user.username}</p>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden py-2">
            <ul>
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button 
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isActive ? 'text-[#e30019] bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-transparent'}`}
                    >
                      <Icon size={20} className={isActive ? 'text-[#e30019]' : 'text-slate-500'} /> 
                      <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
                    </button>
                  </li>
                );
              })}
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 mt-1 border-t border-slate-100"
                >
                  <LogOut size={20} className="text-slate-500" /> 
                  <span>Đăng xuất</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-3/4 bg-white p-6 md:p-8">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-medium text-slate-800 mb-8">Thông tin tài khoản</h2>
              
              <form onSubmit={handleUpdateProfile} className="max-w-[600px]">
                <div className="flex flex-col md:flex-row md:items-center mb-6">
                  <label className="w-full md:w-1/4 text-sm font-medium text-slate-600 mb-2 md:mb-0 md:text-right md:pr-6">Họ Tên</label>
                  <div className="w-full md:w-3/4">
                    <input 
                      type="text" 
                      name="hoTen"
                      value={formData.hoTen}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-sm py-2 px-3 focus:outline-none focus:border-blue-500"
                      placeholder="Nhập họ tên"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center mb-6">
                  <label className="w-full md:w-1/4 text-sm font-medium text-slate-600 mb-2 md:mb-0 md:text-right md:pr-6">Giới tính</label>
                  <div className="w-full md:w-3/4 flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gioiTinh" 
                        value="Nam" 
                        checked={formData.gioiTinh === 'Nam'} 
                        onChange={handleChange}
                        className="w-4 h-4 cursor-pointer accent-[#e30019]"
                      />
                      <span className="text-sm">Nam</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gioiTinh" 
                        value="Nữ" 
                        checked={formData.gioiTinh === 'Nữ'} 
                        onChange={handleChange}
                        className="w-4 h-4 cursor-pointer accent-[#e30019]"
                      />
                      <span className="text-sm">Nữ</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center mb-6">
                  <label className="w-full md:w-1/4 text-sm font-medium text-slate-600 mb-2 md:mb-0 md:text-right md:pr-6">Số điện thoại</label>
                  <div className="w-full md:w-3/4">
                    <input 
                      type="tel" 
                      name="soDienThoai"
                      value={formData.soDienThoai}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-sm py-2 px-3 focus:outline-none focus:border-blue-500"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center mb-6">
                  <label className="w-full md:w-1/4 text-sm font-medium text-slate-600 mb-2 md:mb-0 md:text-right md:pr-6">Email</label>
                  <div className="w-full md:w-3/4">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-sm py-2 px-3 bg-slate-50 focus:outline-none"
                      placeholder="Nhập email"
                      readOnly // Thông thường email không cho sửa trực tiếp, nhưng tuỳ vào yêu cầu. Ở đây theo hình giống input bình thường nhưng em để cho phép nhập. Tạm bỏ readOnly nếu muốn sửa, nhưng DB đang unique.
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center mb-8">
                  <label className="w-full md:w-1/4 text-sm font-medium text-slate-600 mb-2 md:mb-0 md:text-right md:pr-6">Ngày sinh</label>
                  <div className="w-full md:w-3/4 flex gap-3">
                    <select value={day} onChange={(e) => setDay(e.target.value)} className="w-1/3 border border-slate-300 rounded-sm py-2 px-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                      <option value="">Ngày</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-1/3 border border-slate-300 rounded-sm py-2 px-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                      <option value="">Tháng</option>
                      {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="w-1/3 border border-slate-300 rounded-sm py-2 px-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                      <option value="">Năm</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row">
                  <div className="hidden md:block md:w-1/4 pr-6"></div>
                  <div className="w-full md:w-3/4">
                    <button type="submit" className="bg-[#e30019] text-white px-8 py-2 rounded-sm text-sm font-medium hover:bg-red-700 transition">
                      LƯU THAY ĐỔI
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'trade-in' && (
            <div>
              <h2 className="text-xl font-medium text-slate-800 mb-8 pb-3 border-b border-slate-100">Trade-in (Bán lại linh kiện)</h2>
              <MyTradeIns />
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-medium text-slate-800 mb-8 pb-3 border-b border-slate-100">Sổ địa chỉ</h2>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-md mb-6 text-sm">
                Địa chỉ này sẽ được điền mặc định ở màn hình thanh toán.
              </div>
              <form onSubmit={handleUpdateProfile} className="max-w-[600px]">
                <div className="flex flex-col mb-6">
                  <label className="text-sm font-medium text-slate-600 mb-2">Địa chỉ hiện tại của bạn</label>
                  <textarea 
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border border-slate-300 rounded-sm py-2 px-3 focus:outline-none focus:border-blue-500"
                    placeholder="Nhập địa chỉ đầy đủ (Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP)"
                  ></textarea>
                </div>
                <button type="submit" className="bg-[#e30019] text-white px-8 py-2 rounded-sm text-sm font-medium hover:bg-red-700 transition">
                  CẬP NHẬT ĐỊA CHỈ
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-medium text-slate-800 mb-6 pb-3 border-b border-slate-100">Quản lý đơn hàng</h2>
              <TrangDonHangCuaToi isEmbed={true} />
            </div>
          )}

          {activeTab === 'viewed-products' && (
            <div>
              <h2 className="text-xl font-medium text-slate-800 mb-6 pb-3 border-b border-slate-100">Sản phẩm đã xem</h2>
              {viewedProducts.length === 0 ? (
                <div className="text-center py-10 text-slate-500">Bạn chưa xem sản phẩm nào gần đây.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {viewedProducts.map(p => (
                    <a key={p._id} href={`/san-pham/${p._id}`} className="bg-white border hover:shadow-md transition rounded-md overflow-hidden group flex flex-col p-3">
                      <div className="block h-32 mb-3 self-center"><img src={p.anh} alt={p.ten} className="max-w-full max-h-full object-contain group-hover:scale-105 transition" /></div>
                      <div className="text-xs text-blue-600 mb-1 line-clamp-1">{p.loai}</div>
                      <div className="text-sm font-medium text-slate-800 line-clamp-2 mb-2 flex-grow">{p.ten}</div>
                      <div className="text-[#e30019] font-bold text-sm">{p.gia?.toLocaleString('vi-VN')} đ</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default TrangTaiKhoanCuaToi;
