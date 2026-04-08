import React, { useState, useEffect } from "react";
import axios from "axios";
import PhanTrang from "../../components/PhanTrang";
import toast from "react-hot-toast";
import { Ticket, Percent, Banknote, Calendar, Layers, CheckCircle2, XCircle, Trash2, Edit3, Plus, RefreshCcw } from "lucide-react";

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
  const [itemsPerPage] = useState(8);

  const API_URL = `${process.env.REACT_APP_API_URL}/ma-giam-gia`;
  const userToken = JSON.parse(localStorage.getItem("user"))?.token || localStorage.getItem("token");

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${userToken}` },
  });

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
      toast.error("Không thể tải danh sách mã giảm giá!");
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

    if (formData.giaTri < 0) {
      toast.error("Giá trị giảm giá không được nhỏ hơn 0");
      return;
    }

    if (formData.loaiGiamGia === "phanTram" && formData.giaTri > 100) {
      toast.error("Giảm giá theo phần trăm không được vượt quá 100%");
      return;
    }

    try {
      setSubmitting(true);
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, formData, getAuthConfig());
        toast.success("Cập nhật thành công! ✨");
      } else {
        await axios.post(API_URL, formData, getAuthConfig());
        toast.success("Đã tạo mã mới thành công! 🚀");
      }
      setShowModal(false);
      fetchMaGiamGias();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      } else {
          toast.error("Lỗi: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá mã giảm giá này? Thao tác này không thể hoàn tác.")) {
      try {
        await axios.delete(`${API_URL}/${id}`, getAuthConfig());
        toast.success("Đã xóa mã giảm giá!");
        fetchMaGiamGias();
      } catch (err) {
        toast.error("Lỗi khi xoá: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(maGiamGias) ? maGiamGias.slice(indexOfFirstItem, indexOfLastItem) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-2">
            <Ticket className="text-indigo-600" size={32} />
            QUẢN LÝ MÃ GIẢM GIÁ
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Thiết kế các chiến dịch khuyến mãi bùng nổ doanh số
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={fetchMaGiamGias}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Plus size={20} />
            Thêm Mã Mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                <Ticket size={80} />
            </div>
            <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Tổng số mã</p>
            <h3 className="text-4xl font-black mt-1">{maGiamGias.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Đang kích hoạt</p>
            <h3 className="text-4xl font-black mt-1 text-green-600">{maGiamGias.filter(v => v.trangThai).length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Đã hết hạn/Vô hiệu</p>
            <h3 className="text-4xl font-black mt-1 text-red-500">{maGiamGias.filter(v => !v.trangThai).length}</h3>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0"></div>
          </div>
          <p className="text-slate-400 font-bold mt-4 animate-pulse uppercase tracking-widest text-xs">Đang truy vấn dữ liệu...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Mã Khuyến Mãi</th>
                  <th className="px-8 py-5">Giá trị Ưu đãi</th>
                  <th className="px-8 py-5">Phân loại</th>
                  <th className="px-8 py-5">Sử dụng</th>
                  <th className="px-8 py-5">Hiệu lực</th>
                  <th className="px-8 py-5">Trạng thái</th>
                  <th className="px-8 py-5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white text-sm">
                {currentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                            <Ticket size={24} />
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-base">{item.ma}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-[150px]">{item.moTa || "Không có mô tả"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-indigo-600">
                          {item.loaiGiamGia === "phanTram" ? `${item.giaTri}%` : `${item.giaTri.toLocaleString()}đ`}
                        </span>
                        {item.giaTriGiamToiDa > 0 && (
                          <span className="text-[10px] text-slate-400 font-bold italic">Tối đa: {item.giaTriGiamToiDa.toLocaleString()}đ</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.loaiGiamGia === "phanTram" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      }`}>
                        {item.loaiGiamGia === "phanTram" ? <Percent size={12}/> : <Banknote size={12}/>}
                        {item.loaiGiamGia === "phanTram" ? "Phần trăm" : "Tiền mặt"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5 w-full max-w-[120px]">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-400">{item.daSuDung} lượt</span>
                            <span className="text-slate-700">{item.soLuong || "∞"}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ width: item.soLuong ? `${(item.daSuDung / item.soLuong) * 100}%` : '5%' }}
                            ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Calendar size={12} className="text-slate-400"/>
                            {new Date(item.ngayBatDau).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold">
                            <Calendar size={12} className="text-red-300"/>
                            {new Date(item.ngayHetHan).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {item.trangThai ? (
                        <span className="inline-flex items-center gap-1 text-green-600 font-black text-[10px] uppercase">
                          <CheckCircle2 size={14}/> Kích hoạt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-black text-[10px] uppercase">
                          <XCircle size={14}/> Vô hiệu
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-center">
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => handleOpenModal(item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Sửa mã"
                            >
                                <Edit3 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Xóa mã"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
                {maGiamGias.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                            <Ticket size={40} />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Hệ thống chưa có mã giảm giá nào</p>
                        <button onClick={() => handleOpenModal()} className="mt-4 text-indigo-600 font-black text-sm hover:underline">Tạo mã ngay bây giờ</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <PhanTrang
                itemsPerPage={itemsPerPage}
                totalItems={maGiamGias.length}
                paginate={setCurrentPage}
                currentPage={currentPage}
            />
          </div>
        </div>
      )}

      {/* MODAL - PREMIUM DESIGN */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[1001] p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-10 transform transition-all animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                <div>
                   <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                     {editData ? "Cập nhật chiến dịch" : "Tạo chiến dịch mới"}
                   </h3>
                   <p className="text-slate-400 text-sm font-medium">Thiết lập các thông số cho mã khuyến mãi</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 transition-colors">
                    <XCircle size={24} className="text-slate-300 hover:text-red-500" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Mã Code (In hoa)</label>
                  <input
                    type="text"
                    value={formData.ma}
                    onChange={(e) => setFormData({ ...formData, ma: e.target.value.toUpperCase() })}
                    required
                    placeholder="VD: BUILDPC2026"
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/30 focus:bg-white rounded-2xl outline-none transition-all font-black text-lg placeholder:font-medium uppercase tracking-widest"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Loại hình</label>
                      <select
                        value={formData.loaiGiamGia}
                        onChange={(e) => setFormData({ ...formData, loaiGiamGia: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl outline-none transition-all font-bold"
                      >
                        <option value="phanTram">Phần trăm</option>
                        <option value="giaTriCoDinh">Tiền mặt</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Giá trị</label>
                      <input
                        type="number"
                        value={formData.giaTri}
                        onChange={(e) => setFormData({ ...formData, giaTri: Number(e.target.value) })}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl outline-none transition-all font-black text-indigo-600"
                      />
                    </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Số lượng lượt dùng (0 = ∞)</label>
                  <input
                    type="number"
                    value={formData.soLuong}
                    onChange={(e) => setFormData({ ...formData, soLuong: Number(e.target.value) })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Đơn tối thiểu (đ)</label>
                  <input
                    type="number"
                    value={formData.giaTriDonHangToiThieu}
                    onChange={(e) => setFormData({ ...formData, giaTriDonHangToiThieu: Number(e.target.value) })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl outline-none transition-all font-bold"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Từ ngày</label>
                      <input
                        type="date"
                        value={formData.ngayBatDau}
                        onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Đến ngày</label>
                      <input
                        type="date"
                        value={formData.ngayHetHan}
                        onChange={(e) => setFormData({ ...formData, ngayHetHan: e.target.value })}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none transition-all font-bold text-sm"
                      />
                    </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                    <div>
                        <span className="block text-xs font-black uppercase text-slate-800">Trạng thái</span>
                        <span className="text-[10px] text-slate-400 font-bold italic">Cho phép người dùng sử dụng</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData.trangThai}
                            onChange={(e) => setFormData({ ...formData, trangThai: e.target.checked })}
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Tóm tắt mô tả</label>
                <textarea
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  rows="2"
                  placeholder="Ghi chú ngắn gọn về chiến dịch này..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl outline-none transition-all resize-none font-medium"
                />
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-black transition-all uppercase tracking-widest text-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-[2] px-8 py-4 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 ${
                    submitting ? "bg-indigo-300 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                      ĐANG XỬ LÝ
                    </>
                  ) : (editData ? "CẬP NHẬT CHIẾN DỊCH" : "BẮT ĐẦU CHIẾN DỊCH")}
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
