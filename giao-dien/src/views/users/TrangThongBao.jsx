import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/UserSidebar";
import { Bell, Package, CheckCircle, Gift } from "lucide-react";

const TrangThongBao = () => {
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
            <div className="mb-8 border-b border-slate-100 pb-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Thông Báo Của Tôi</h3>
                <p className="text-slate-500 text-sm">Cập nhật tin tức và thông báo quan trọng</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">Đánh dấu tất cả đã đọc</button>
            </div>

            <div className="space-y-4">
              {/* Sample Notifications */}
              <div className="flex gap-4 p-4 border border-blue-100 bg-blue-50/50 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer relative">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Giao hàng thành công</h4>
                  <p className="text-sm text-slate-600 mb-2">Đơn hàng #DH12345 đã được giao thành công. Vui lòng kiểm tra sản phẩm và đánh giá.</p>
                  <p className="text-xs font-semibold text-slate-400">10 phút trước</p>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
              </div>

              <div className="flex gap-4 p-4 border border-slate-100 bg-white rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                  <Gift size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Voucher giảm giá đặc biệt!</h4>
                  <p className="text-sm text-slate-600 mb-2">Bạn nhận được mã giảm giá 10% cho đơn hàng đầu tiên tháng này. Lưu ngay!</p>
                  <p className="text-xs font-semibold text-slate-400">2 giờ trước</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-slate-100 bg-white rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Đơn hàng đang giao</h4>
                  <p className="text-sm text-slate-600 mb-2">Đơn hàng #DH67890 đang trên đường đến tay bạn.</p>
                  <p className="text-xs font-semibold text-slate-400">Hôm qua 14:30</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              Xem tất cả thông báo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangThongBao;
