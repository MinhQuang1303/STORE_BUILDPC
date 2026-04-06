import React, { useState } from 'react';
import { User, FileText, LogOut } from 'lucide-react';
import MyTradeIns from '../../components/MyTradeIns';

const TrangTaiKhoanCuaToi = () => {
  const [activeTab, setActiveTab] = useState('trade-in');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved).user || JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/dang-nhap';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-slate-600 mb-6">Bạn cần đăng nhập để xem tài khoản</p>
          <a href="/dang-nhap" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{user.username || user.ten || 'Người dùng'}</h1>
                <p className="text-slate-600 text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
            >
              <LogOut size={20} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('trade-in')}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'trade-in'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText size={20} className="inline mr-2" /> Trade-in (Bán lại linh kiện)
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User size={20} className="inline mr-2" /> Thông tin cá nhân
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
          {activeTab === 'trade-in' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">💰 Danh sách Trade-in của tôi</h2>
              <MyTradeIns />
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-600">Tên người dùng</label>
                  <p className="text-lg font-bold text-slate-800 mt-2">{user.username || user.ten}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Email</label>
                  <p className="text-lg font-bold text-slate-800 mt-2">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Số điện thoại</label>
                  <p className="text-lg font-bold text-slate-800 mt-2">{user.soDienThoai || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Loại tài khoản</label>
                  <p className="text-lg font-bold text-slate-800 mt-2">
                    {user.role === 'admin' ? '👨‍💼 Quản trị viên' : '👤 Khách hàng'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600">Địa chỉ</label>
                  <p className="text-lg font-bold text-slate-800 mt-2">{user.diaChi || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Cập nhật thông tin</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    ℹ️ Tính năng cập nhật thông tin sẽ được thêm vào trong phiên bản tiếp theo. 
                    Hiện tại, vui lòng liên hệ với Admin để thay đổi thông tin cá nhân.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrangTaiKhoanCuaToi;
