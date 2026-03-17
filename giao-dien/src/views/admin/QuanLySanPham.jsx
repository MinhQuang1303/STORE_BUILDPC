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
    bienThe: [], // Thêm mảng biến thể
  });
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
        bienThe:
          data.bienThe?.map((bt) => ({
            ...bt,
            soLuong: bt.soLuong || 0,
            daBan: bt.daBan || 0,
          })) || [], // Lấy biến thể hiện có
      });
      setPreview(data.anh);
    } else {
      setEditData(null);
      setFormData({
        ten: "",
        idDanhMuc: danhMucs[0]?._id || "",
        gia: "",
        thongSo: "",
        bienThe: [], // Khởi tạo mảng rỗng
      });
      setPreview(null);
    }
    setFile(null);
    setShowModal(true);
  };

  // Các hàm xử lý biến thể
  const handleAddVariant = () => {
    setFormData({
      ...formData,
      bienThe: [...formData.bienThe, { ten: "", gia: "", soLuong: 0 }],
    });
  };

  const handleRemoveVariant = (index) => {
    const newVariants = formData.bienThe.filter((_, i) => i !== index);
    setFormData({ ...formData, bienThe: newVariants });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.bienThe];
    newVariants[index][field] = value;
    setFormData({ ...formData, bienThe: newVariants });
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

    if (formData.bienThe.length === 0) {
      alert("Bạn phải tạo ít nhất một biến thể (phiên bản) cho sản phẩm!");
      return;
    }

    const data = new FormData();
    data.append("ten", formData.ten);
    data.append("idDanhMuc", formData.idDanhMuc);
    data.append("gia", formData.gia);
    data.append("thongSo", formData.thongSo);

    if (file) {
      data.append("anh", file);
    }

    // Gửi mảng biến thể dưới dạng JSON string để Backend xử lý
    // Lưu ý: sanPhamController cần nhận req.body.bienThe đã parse nếu dùng multer,
    // hoặc bạn có thể append từng phần nếu cần. Ở đây tôi dùng JSON.stringify cho tiện.
    // Tuy nhiên, multer mặc định không parse JSON trong FormData, nên ta sẽ append list.
    formData.bienThe.forEach((bt, index) => {
      data.append(`bienThe[${index}][ten]`, bt.ten);
      data.append(`bienThe[${index}][gia]`, bt.gia);
      data.append(`bienThe[${index}][soLuong]`, bt.soLuong || 0);
      data.append(`bienThe[${index}][daBan]`, bt.daBan || 0);
    });

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
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xoá sản phẩm này? Điều này sẽ xoá luôn các biến thể liên quan.",
      )
    ) {
      try {
        await axios.delete(`${API_SAN_PHAM}/${id}`);
        fetchData();
      } catch (err) {
        alert("Lỗi khi xoá: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Logic lọc và phân trang
  const filteredSanPhams = sanPhams.filter((item) => {
    const matchesSearch = item.ten
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      (item.idDanhMuc?._id || item.idDanhMuc) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSanPhams.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Quản lý Linh kiện
          </h2>
          <p className="text-sm text-gray-500">
            Danh sách các sản phẩm đang kinh doanh
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Tìm tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm font-medium w-full sm:w-48"
          >
            <option value="">Tất cả danh mục</option>
            {danhMucs.map((dm) => (
              <option key={dm._id} value={dm._id}>
                {dm.ten}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center whitespace-nowrap"
          >
            <span className="mr-2">+</span> Thêm Linh kiện
          </button>
        </div>
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
                  <th className="px-6 py-4">Biến thể</th>
                  <th className="px-6 py-4 text-center">Tổng kho</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4">Giá gốc</th>
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
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                        {item.bienThe?.length || 0} phiên bản
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-gray-700">
                        {item.soLuong || 0}
                      </div>
                      <div className="text-[10px] text-green-600 font-bold uppercase">
                        Đã bán: {item.daBan || 0}
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
                {currentItems.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      {searchTerm || selectedCategory
                        ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc."
                        : "Chưa có sản phẩm nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PhanTrang
            itemsPerPage={itemsPerPage}
            totalItems={filteredSanPhams.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full p-8 max-h-[90vh] overflow-y-auto transform transition-all scale-100">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter border-l-4 border-blue-600 pl-4">
              {editData ? "Cập nhật Linh kiện" : "Thêm Linh kiện mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                        Danh mục
                      </label>
                      <select
                        value={formData.idDanhMuc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            idDanhMuc: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="">-- Chọn --</option>
                        {danhMucs.map((dm) => (
                          <option key={dm._id} value={dm._id}>
                            {dm.ten}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                        Giá gốc (VNĐ)
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
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      Thông số kỹ thuật
                    </label>
                    <textarea
                      value={formData.thongSo}
                      onChange={(e) =>
                        setFormData({ ...formData, thongSo: e.target.value })
                      }
                      rows="2"
                      placeholder="Băng thông, xung nhịp, dung lượng..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                      Hình ảnh
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {preview && (
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-12 w-12 object-contain rounded border"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Phần quản lý biến thể */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-xs font-black uppercase text-gray-500">
                      Biến thể của sản phẩm
                    </label>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-200 transition-colors"
                    >
                      + Thêm biến thể
                    </button>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {formData.bienThe.map((bt, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                      >
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500">
                            Tên biến thể
                          </label>
                          <input
                            type="text"
                            placeholder="Tên bt (8GB...)"
                            value={bt.ten}
                            required
                            onChange={(e) =>
                              handleVariantChange(index, "ten", e.target.value)
                            }
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500">
                            Giá
                          </label>
                          <input
                            type="number"
                            placeholder="Giá (VNĐ)"
                            value={bt.gia}
                            required
                            min="0"
                            onChange={(e) =>
                              handleVariantChange(index, "gia", e.target.value)
                            }
                            className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase text-gray-500">
                            Số lượng
                          </label>
                          <input
                            type="number"
                            placeholder="Kho"
                            value={bt.soLuong}
                            required
                            min="0"
                            title="Số lượng trong kho"
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "soLuong",
                                e.target.value,
                              )
                            }
                            className="w-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {formData.bienThe.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-xs italic">
                        Chưa có biến thể nào được thêm.
                      </div>
                    )}
                  </div>
                </div>
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
                  {submitting
                    ? "Đang xử lý..."
                    : editData
                      ? "Cập nhật ngay"
                      : "Thêm sản phẩm"}
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
