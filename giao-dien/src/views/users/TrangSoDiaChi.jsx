import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/UserSidebar";

const TrangSoDiaChi = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed.user || parsed);
      } catch (err) {}
    }
  }, []);

  if (!user) return <div className="text-center p-20 font-bold text-slate-500">Đang tải thông tin...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Left */}
        <UserSidebar user={user} />

        {/* Content Right */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Sổ Địa Chỉ</h3>
                <p className="text-slate-500 text-sm">Quản lý địa chỉ giao hàng và nhận hàng</p>
              </div>
              <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                + Thêm Địa Chỉ
              </button>
            </div>

            <div className="space-y-4">
              {/* Default Address */}
              <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-6 relative">
                <div className="absolute top-6 right-6 flex gap-3 text-sm font-semibold">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">Sửa</button>
                  <button className="text-red-500 hover:text-red-700 transition-colors">Xóa</button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-slate-800">{user.fullName || user.username}</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                    Mặc định
                  </span>
                </div>
                <p className="text-slate-600 font-medium text-sm mb-1">{user.phone || "Chưa có số điện thoại"}</p>
                <p className="text-slate-500 text-sm">{user.address || "123 Đường Tạm, Phường Ví Dụ, Quận ABC, TP.HCM"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangSoDiaChi;
