import React, { useState, useEffect } from "react";
import axios from "axios";
import PhanTrang from "../../components/PhanTrang";

const QuanLySanPham = () => {
  const [sanPhams, setSanPhams] = useState([]);
  const [danhMucs, setDanhMucs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    ten: "",
    idDanhMuc: "",
    gia: "",
    thongSo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const API_SAN_PHAM = `${process.env.REACT_APP_API_URL}/san-pham`;
  const API_DANH_MUC = `${process.env.REACT_APP_API_URL}/danh-muc`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resSP, resDM] = await Promise.all([
        axios.get(API_SAN_PHAM),
        axios.get(API_DANH_MUC),
      ]);
      setSanPhams(resSP.data);
      setDanhMucs(resDM.data);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setLoading(false);
    }
  };

  const handleOpenModal = (data = null) => {
    if (data) {
      setEditData(data);
      setFormData({
        ten: data.ten,
        idDanhMuc: data.idDanhMuc?._id || data.idDanhMuc || "",
        gia: data.gia || "",
        thongSo: data.thongSo || "",
      });
      setPreview(data.anh);
    } else {
      setEditData(null);
      setFormData({
        ten: "",
        idDanhMuc: danhMucs[0]?._id || "",
        gia: "",
        thongSo: "",
      });
      setPreview(null);
    }
    setFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("ten", formData.ten);
    data.append("idDanhMuc", formData.idDanhMuc);
    data.append("gia", formData.gia);
    data.append("thongSo", formData.thongSo);
    if (file) {
      data.append("anh", file);
    }

    try {
      setSubmitting(true);
      if (editData) {
        await axios.put(`${API_SAN_PHAM}/${editData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_SAN_PHAM, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        await axios.delete(`${API_SAN_PHAM}/${id}`);
        fetchData();
      } catch (err) {
        alert("Lỗi khi xoá: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sanPhams.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Quản lý Linh kiện
          </h2>
          <p className="text-sm text-gray-500">
            Danh sách các sản phẩm đang kinh doanh
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg flex items-center"
        >
          <span className="mr-2">+</span> Thêm Linh kiện
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Hình ảnh</th>
                  <th className="px-6 py-4">Tên sản phẩm</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4">Giá bán</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                {currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={item.anh}
                        alt={item.ten}
                        className="w-12 h-12 object-contain rounded border border-gray-100 bg-white p-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.ten}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs">
                        {item.thongSo}
                      </div>
                    </td>
                    <td className="px-6 py-4 italic text-blue-600 font-medium">
                      {item.idDanhMuc?.ten || "Không xác định"}
                    </td>
                    <td className="px-6 py-4 font-black">
                      {item.gia?.toLocaleString("vi-VN")} VNĐ
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
                {sanPhams.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      Chưa có sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PhanTrang
            itemsPerPage={itemsPerPage}
            totalItems={sanPhams.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-auto transform transition-all scale-100">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter border-l-4 border-blue-600 pl-4">
              {editData ? "Cập nhật Linh kiện" : "Thêm Linh kiện mới"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Tên linh kiện
                  </label>
                  <input
                    type="text"
                    value={formData.ten}
                    onChange={(e) =>
                      setFormData({ ...formData, ten: e.target.value })
                    }
                    required
                    placeholder="VD: Intel Core i9-13900K..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={formData.idDanhMuc}
                    onChange={(e) =>
                      setFormData({ ...formData, idDanhMuc: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {danhMucs.map((dm) => (
                      <option key={dm._id} value={dm._id}>
                        {dm.ten}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Giá bán (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.gia}
                    onChange={(e) =>
                      setFormData({ ...formData, gia: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Thông số kỹ thuật
                  </label>
                  <textarea
                    value={formData.thongSo}
                    onChange={(e) =>
                      setFormData({ ...formData, thongSo: e.target.value })
                    }
                    rows="3"
                    placeholder="Băng thông, xung nhịp, dung lượng..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                    Hình ảnh sản phẩm
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {preview && (
                      <div className="h-32 w-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-2">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
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
                      Đang xử lý...
                    </>
                  ) : editData ? (
                    "Cập nhật ngay"
                  ) : (
                    "Thêm sản phẩm"
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

export default QuanLySanPham;
