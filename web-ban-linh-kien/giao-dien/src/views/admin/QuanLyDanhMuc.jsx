import React, { useState, useEffect } from "react";
import axios from "axios";
import PhanTrang from "../../components/PhanTrang";

const QuanLyDanhMuc = () => {
  const [danhMucs, setDanhMucs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ ten: "", moTa: "" });
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const API_URL = `${process.env.REACT_APP_API_URL}/danh-muc`;

  useEffect(() => {
    fetchDanhMucs();
  }, []);

  const fetchDanhMucs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setDanhMucs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
      setLoading(false);
    }
  };

  const handleOpenModal = (data = null) => {
    if (data) {
      setEditData(data);
      setFormData({ ten: data.ten, moTa: data.moTa || "" });
    } else {
      setEditData(null);
      setFormData({ ten: "", moTa: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setShowModal(false);
      fetchDanhMucs();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá danh mục này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDanhMucs();
      } catch (err) {
        alert("Lỗi khi xoá: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = danhMucs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h2>
          <p className="text-sm text-gray-500">
            Thêm, sửa, xoá các loại linh kiện máy tính
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg flex items-center"
        >
          <span className="mr-2">+</span> Thêm Danh mục
        </button>
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
                <th className="px-6 py-4">Tên danh mục</th>
                <th className="px-6 py-4">Mô tả</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
              {currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {item.ten}
                  </td>
                  <td className="px-6 py-4 italic text-gray-500">
                    {item.moTa || "Không có mô tả"}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 hover:text-blue-900 font-bold mr-4"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 font-bold"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
              {danhMucs.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <PhanTrang
            itemsPerPage={itemsPerPage}
            totalItems={danhMucs.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter border-l-4 border-blue-600 pl-4">
              {editData ? "Cập nhật Danh mục" : "Thêm Danh mục mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={formData.ten}
                  onChange={(e) =>
                    setFormData({ ...formData, ten: e.target.value })
                  }
                  required
                  placeholder="VD: CPU, Card màn hình..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                  Mô tả (Không bắt buộc)
                </label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) =>
                    setFormData({ ...formData, moTa: e.target.value })
                  }
                  rows="3"
                  placeholder="Nhập mô tả ngắn gọn..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center ${submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu lại"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyDanhMuc;
