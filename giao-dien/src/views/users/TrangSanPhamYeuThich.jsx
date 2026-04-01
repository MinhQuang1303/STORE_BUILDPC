import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/UserSidebar";

const TrangSanPhamYeuThich = () => {
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
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Sản Phẩm Yêu Thích</h3>
              <p className="text-slate-500 text-sm">Danh sách các sản phẩm bạn đã lưu</p>
            </div>

            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <span className="text-6xl mb-4">❤️</span>
              <p className="font-medium text-lg">Bạn chưa có sản phẩm yêu thích nào.</p>
              <p className="text-sm mt-2">Hãy thêm sản phẩm vào danh sách để xem lại sau nhé!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangSanPhamYeuThich;
