import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TradeInForm = ({ onSubmitSuccess, idOrder = null }) => {
  const [formData, setFormData] = useState({
    tenSanPham: '',
    loaiSanPham: 'CPU',
    moTa: '',
    tinhTrang: 'Fair',
    gia: 0,
  });
  const [loading, setLoading] = useState(false);

  const loaiOptions = ['CPU', 'GPU', 'RAM', 'SSD', 'HDD', 'Mainboard', 'PSU', 'Case', 'Cooler', 'Other'];
  const tinhTrangOptions = ['LikeNew', 'Good', 'Fair', 'Poor'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gia' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tenSanPham.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (formData.gia < 0) {
      toast.error('Giá không thể âm');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      
      const dataToSend = {
        ...formData,
        ...(idOrder && { idOrder })
      };

      const res = await axios.post(`${apiUrl}/trade-in`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        toast.success('Gửi yêu cầu trade-in thành công! Admin sẽ xác nhận trong 24 giờ');
        setFormData({
          tenSanPham: '',
          loaiSanPham: 'CPU',
          moTa: '',
          tinhTrang: 'Fair',
          gia: 0,
        });
        onSubmitSuccess && onSubmitSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-4">💰 Bán lại linh kiện cũ</h3>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4 flex gap-3">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">Admin sẽ xác nhận giá dựa vào tình trạng linh kiện bạn cung cấp. Giá tối đa bạn yêu cầu sẽ được duyệt.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Tên sản phẩm */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tên sản phẩm <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="tenSanPham"
            value={formData.tenSanPham}
            onChange={handleChange}
            placeholder="Ví dụ: RTX 3060 Ti Asus"
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Loại sản phẩm */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Loại linh kiện
          </label>
          <select
            name="loaiSanPham"
            value={formData.loaiSanPham}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loaiOptions.map(loai => (
              <option key={loai} value={loai}>{loai}</option>
            ))}
          </select>
        </div>

        {/* Tình trạng */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tình trạng
          </label>
          <select
            name="tinhTrang"
            value={formData.tinhTrang}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tinhTrangOptions.map(tt => (
              <option key={tt} value={tt}>
                {tt === 'LikeNew' ? 'Như mới' : tt === 'Good' ? 'Tốt' : tt === 'Fair' ? 'Bình thường' : 'Có vết sử dụng'}
              </option>
            ))}
          </select>
        </div>

        {/* Mô tả */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="moTa"
            value={formData.moTa}
            onChange={handleChange}
            placeholder="Mô tả tình trạng, lần sử dụng, lý do bán... (tối đa 500 ký tự)"
            maxLength={500}
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">{formData.moTa.length}/500</p>
        </div>

        {/* Giá mong muốn */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Giá mong muốn <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="gia"
              value={formData.gia}
              onChange={handleChange}
              placeholder="Nhập giá bạn mong muốn"
              min={0}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">₫</span>
          </div>
          {formData.gia > 0 && (
            <p className="text-sm text-slate-600 mt-2">
              Giá bạn yêu cầu: <span className="font-bold text-green-600">{formData.gia.toLocaleString('vi-VN')}₫</span>
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send size={20} />
        {loading ? 'Đang gửi...' : 'Gửi yêu cầu trade-in'}
      </button>
    </form>
  );
};

export default TradeInForm;
