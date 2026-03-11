import React, { useState, useEffect } from "react";
import axios from "axios";
import PhanTrang from "../../components/PhanTrang";

const QuanLyMaGiamGia = () => {
  const [maGiamGias, setMaGiamGias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    ma: "",
    moTa: "",
    loaiGiamGia: "phanTram",
    giaTri: 0,
    giaTriDonHangToiThieu: 0,
    giaTriGiamToiDa: 0,
    ngayBatDau: "",
    ngayHetHan: "",
    soLuong: 0,
    trangThai: true,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const API_URL = `${process.env.REACT_APP_API_URL}/ma-giam-gia`;

  useEffect(() => {
    fetchMaGiamGias();
  }, []);

  const fetchMaGiamGias = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setMaGiamGias(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy mã giảm giá:", err);
      setLoading(false);
    }
  };

  const handleOpenModal = (data = null) => {
    if (data) {
      setEditData(data);
      setFormData({
        ma: data.ma,
        moTa: data.moTa || "",
        loaiGiamGia: data.loaiGiamGia,
        giaTri: data.giaTri,
        giaTriDonHangToiThieu: data.giaTriDonHangToiThieu || 0,
        giaTriGiamToiDa: data.giaTriGiamToiDa || 0,
        ngayBatDau: data.ngayBatDau
          ? new Date(data.ngayBatDau).toISOString().split("T")[0]
          : "",
        ngayHetHan: data.ngayHetHan
          ? new Date(data.ngayHetHan).toISOString().split("T")[0]
          : "",
        soLuong: data.soLuong || 0,
        trangThai: data.trangThai,
      });
    } else {
      setEditData(null);
      setFormData({
        ma: "",
        moTa: "",
        loaiGiamGia: "phanTram",
        giaTri: 0,
        giaTriDonHangToiThieu: 0,
        giaTriGiamToiDa: 0,
        ngayBatDau: "",
        ngayHetHan: "",
        soLuong: 0,
        trangThai: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.giaTri < 0) {
      alert("Giá trị giảm giá không được nhỏ hơn 0");
      return;
    }

    if (formData.loaiGiamGia === "phanTram" && formData.giaTri > 100) {
      alert("Giảm giá theo phần trăm không được vượt quá 100%");
      return;
    }

    try {
      setSubmitting(true);
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setShowModal(false);
      fetchMaGiamGias();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá mã giảm giá này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMaGiamGias();
      } catch (err) {
        alert("Lỗi khi xoá: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = maGiamGias.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Quản lý Mã Giảm Giá
          </h2>
          <p className="text-sm text-gray-500">
            Tạo và quản lý các chương trình khuyến mãi
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg flex items-center"
        >
          <span className="mr-2">+</span> Thêm Mã Mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Mã</th>
                  <th className="px-6 py-4">Giá trị</th>
                  <th className="px-6 py-4">Loại</th>
                  <th className="px-6 py-4">Số lượng</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                {currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      {item.ma}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {item.giaTri.toLocaleString()}
                      {item.loaiGiamGia === "phanTram" ? "%" : "đ"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${item.loaiGiamGia === "phanTram" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
                      >
                        {item.loaiGiamGia === "phanTram"
                          ? "Phần trăm"
                          : "Cố định"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{item.daSuDung}</span> /{" "}
                      <span className="font-bold text-gray-900">
                        {item.soLuong || "∞"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-gray-500">
                        Bắt đầu:{" "}
                        {new Date(item.ngayBatDau).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-red-500 font-medium">
                        Hết hạn:{" "}
                        {new Date(item.ngayHetHan).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-black ${item.trangThai ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {item.trangThai ? "KÍCH HOẠT" : "VÔ HIỆU"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-900 font-bold mr-4 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900 font-bold transition-colors"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
                {maGiamGias.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      Chưa có mã giảm giá nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PhanTrang
            itemsPerPage={itemsPerPage}
            totalItems={maGiamGias.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 transform transition-all scale-100 my-8">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter border-l-4 border-indigo-600 pl-4">
              {editData ? "Cập nhật Mã Giảm Giá" : "Tạo Mã Giảm Giá Mới"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Mã Code
                  </label>
                  <input
                    type="text"
                    value={formData.ma}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ma: e.target.value.toUpperCase(),
                      })
                    }
                    required
                    placeholder="VD: GIAM20..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Loại Giảm Giá
                  </label>
                  <select
                    value={formData.loaiGiamGia}
                    onChange={(e) =>
                      setFormData({ ...formData, loaiGiamGia: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="phanTram">Phần trăm (%)</option>
                    <option value="giaTriCoDinh">Giá trị cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Giá trị giảm
                  </label>
                  <input
                    type="number"
                    value={formData.giaTri}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        giaTri: Number(e.target.value),
                      })
                    }
                    required
                    min="0"
                    max={
                      formData.loaiGiamGia === "phanTram" ? "100" : undefined
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Số lượng (0 = Không giới hạn)
                  </label>
                  <input
                    type="number"
                    value={formData.soLuong}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        soLuong: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Giá trị đơn hàng tối thiểu
                  </label>
                  <input
                    type="number"
                    value={formData.giaTriDonHangToiThieu}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        giaTriDonHangToiThieu: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={formData.ngayBatDau}
                    onChange={(e) =>
                      setFormData({ ...formData, ngayBatDau: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    value={formData.ngayHetHan}
                    onChange={(e) =>
                      setFormData({ ...formData, ngayHetHan: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center space-x-3 pt-4">
                  <input
                    type="checkbox"
                    id="trangThai"
                    checked={formData.trangThai}
                    onChange={(e) =>
                      setFormData({ ...formData, trangThai: e.target.checked })
                    }
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-all cursor-pointer"
                  />
                  <label
                    htmlFor="trangThai"
                    className="text-sm font-bold text-gray-700 cursor-pointer"
                  >
                    Kích hoạt mã ngay
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                  Mô tả chương trình
                </label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) =>
                    setFormData({ ...formData, moTa: e.target.value })
                  }
                  rows="2"
                  placeholder="VD: Giảm giá mùa hè cho đơn hàng trên 500k..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="md:col-span-2 flex space-x-3 pt-4">
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
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center ${submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {submitting
                    ? "Đang lưu..."
                    : editData
                      ? "Cập nhật"
                      : "Thêm mã"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyMaGiamGia;
