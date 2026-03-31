import React, { useState, useEffect } from "react";
import axios from "axios";
import PhanTrang from "../../components/PhanTrang";

const QuanLyUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // Quản lý trạng thái xem chi tiết

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const API_URL = `${process.env.REACT_APP_API_URL}/users`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        setUsers(res.data); // Fallback if structure is different
      }
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy danh sách người dùng:", err);
      setLoading(false);
    }
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(users)
    ? users.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Quản lý Người dùng
          </h2>
          <p className="text-sm text-gray-500">
            Xem danh sách tài khoản trong hệ thống
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Tên đăng nhập</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Ngày tham gia</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
              {currentItems.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      👁 Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    Chưa có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <PhanTrang
            itemsPerPage={itemsPerPage}
            totalItems={users.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* Modal Xem Chỉ định (Read-Only) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              ✕
            </button>

            <div className="px-8 pb-8 relative">
               <div className="absolute -top-12 left-8 p-1 bg-white rounded-full shadow-lg">
                  <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-black text-white outline outline-2 outline-offset-2 outline-blue-100">
                    {selectedUser.username ? selectedUser.username.charAt(0).toUpperCase() : "U"}
                  </div>
               </div>

               <div className="pt-12">
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedUser.username}</h3>
                 <p className="text-emerald-600 text-sm font-bold flex items-center gap-1 mt-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                   Đang hoạt động
                 </p>
               </div>

               <div className="mt-6 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</span>
                    <span className="font-semibold text-slate-800">{selectedUser.email}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mã định danh</span>
                    <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{selectedUser._id || 'N/A'}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phân quyền</span>
                    <span className={`px-2 py-1 text-xs font-black uppercase tracking-wider rounded border ${selectedUser.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                      {selectedUser.role}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ngày đăng ký</span>
                    <span className="font-semibold text-slate-700">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                    </span>
                  </div>
               </div>

               <div className="mt-8 flex justify-end">
                   <button 
                     disabled
                     className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-bold border border-slate-200 cursor-not-allowed shadow-none flex items-center gap-2"
                   >
                     🔒 Chế độ Chỉ xem (Read-only)
                   </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyUser;
