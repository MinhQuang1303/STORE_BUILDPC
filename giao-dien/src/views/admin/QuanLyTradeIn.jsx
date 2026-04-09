import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const QuanLyTradeIn = () => {
  const [tradeIns, setTradeIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');
  const [selectedTradeIn, setSelectedTradeIn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    giaApDung: 0,
    ghiChu: '',
  });

  useEffect(() => {
    fetchTradeIns();
  }, [filter]);

  const fetchTradeIns = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${apiUrl}/trade-in${filter !== 'All' ? `?status=${filter}` : ''}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setTradeIns(res.data.data || []);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.message;
      toast.error('Lỗi tải danh sách: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tradeIn) => {
    setSelectedTradeIn(tradeIn);
    setModalData({
      giaApDung: tradeIn.giaApDung || tradeIn.gia,
      ghiChu: tradeIn.ghiChuDuyet || '',
    });
    setShowModal(true);
  };

  const handleApprove = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res = await axios.patch(
        `${apiUrl}/trade-in/${selectedTradeIn._id}`,
        {
          trangThai: 'Approved',
          giaApDung: modalData.giaApDung,
          ghiChu: modalData.ghiChu,
        },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      if (res.data.success) {
        toast.success('Đã chấp nhận trade-in');
        setShowModal(false);
        fetchTradeIns();
      }
    } catch (error) {
      toast.error('Lỗi cập nhật trade-in');
    }
  };

  const handleReject = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res = await axios.patch(
        `${apiUrl}/trade-in/${selectedTradeIn._id}`,
        {
          trangThai: 'Rejected',
          ghiChu: modalData.ghiChu,
        },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );

      if (res.data.success) {
        toast.success('Đã từ chối trade-in');
        setShowModal(false);
        fetchTradeIns();
      }
    } catch (error) {
      toast.error('Lỗi cập nhật trade-in');
    }
  };

  const getTotalValue = () => {
    return tradeIns
      .filter(t => t.trangThai === 'Approved')
      .reduce((sum, t) => sum + (t.giaApDung || 0), 0);
  };

  return (
    <div className="w-full">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-semibold">Chờ xác nhận</p>
              <p className="text-3xl font-bold text-yellow-800">{tradeIns.filter(t => t.trangThai === 'Pending').length}</p>
            </div>
            <Clock size={32} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-semibold">Đã chấp nhận</p>
              <p className="text-3xl font-bold text-green-800">{tradeIns.filter(t => t.trangThai === 'Approved').length}</p>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-semibold">Từ chối</p>
              <p className="text-3xl font-bold text-red-800">{tradeIns.filter(t => t.trangThai === 'Rejected').length}</p>
            </div>
            <XCircle size={32} className="text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-semibold">Tổng giá duyệt</p>
              <p className="text-2xl font-bold text-blue-800">{(getTotalValue() / 1000000).toFixed(1)}M₫</p>
            </div>
            <DollarSign size={32} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['All', 'Pending', 'Approved', 'Rejected', 'Paid'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              filter === status
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {status === 'All' ? 'Tất cả' : status === 'Pending' ? 'Chờ xác nhận' : status === 'Approved' ? 'Đã chấp nhận' : status === 'Rejected' ? 'Từ chối' : 'Đã thanh toán'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Đang tải...</div>
        ) : tradeIns.length === 0 ? (
          <div className="text-center py-8 text-slate-500">Không có trade-in nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Sản phẩm</th>
                  <th className="px-4 py-3 text-left font-semibold">Loại</th>
                  <th className="px-4 py-3 text-left font-semibold">User</th>
                  <th className="px-4 py-3 text-left font-semibold">Tình trạng</th>
                  <th className="px-4 py-3 text-right font-semibold">Giá yêu cầu</th>
                  <th className="px-4 py-3 text-right font-semibold">Giá áp dụng</th>
                  <th className="px-4 py-3 text-center font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tradeIns.map((tradeIn) => (
                  <tr key={tradeIn._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-semibold text-slate-800">{tradeIn.tenSanPham}</td>
                    <td className="px-4 py-3 text-slate-600">{tradeIn.loaiSanPham}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>
                        <p className="font-semibold">{tradeIn.idUser?.ten || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{tradeIn.idUser?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tradeIn.trangThai === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        tradeIn.trangThai === 'Approved' ? 'bg-green-100 text-green-800' :
                        tradeIn.trangThai === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tradeIn.trangThai === 'Pending' ? 'Chờ xác nhận' :
                         tradeIn.trangThai === 'Approved' ? 'Đã chấp nhận' :
                         tradeIn.trangThai === 'Rejected' ? 'Từ chối' : 'Đã thanh toán'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {tradeIn.gia.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      {tradeIn.giaApDung?.toLocaleString('vi-VN') || '-'}₫
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openModal(tradeIn)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                        disabled={tradeIn.trangThai !== 'Pending'}
                      >
                        Duyệt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedTradeIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Duyệt Trade-in</h3>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Sản phẩm</p>
                <p className="font-bold text-slate-800">{selectedTradeIn.tenSanPham}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Giá yêu cầu</p>
                  <p className="font-bold text-slate-800">{selectedTradeIn.gia.toLocaleString('vi-VN')}₫</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Tình trạng</p>
                  <p className="font-bold text-slate-800">
                    {selectedTradeIn.tinhTrang === 'LikeNew' ? 'Như mới' : selectedTradeIn.tinhTrang === 'Good' ? 'Tốt' : selectedTradeIn.tinhTrang === 'Fair' ? 'Bình thường' : 'Có vết sử dụng'}
                  </p>
                </div>
              </div>

              {selectedTradeIn.moTa && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Mô tả</p>
                  <p className="text-sm bg-slate-50 p-2 rounded text-slate-700">{selectedTradeIn.moTa}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Giá áp dụng (₫)</label>
                <input
                  type="number"
                  value={modalData.giaApDung}
                  onChange={(e) => setModalData(prev => ({ ...prev, giaApDung: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Khuyến cáo: {(selectedTradeIn.gia * 0.7).toLocaleString('vi-VN')}₫ - {selectedTradeIn.gia.toLocaleString('vi-VN')}₫ tùy tình trạng
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú</label>
                <textarea
                  value={modalData.ghiChu}
                  onChange={(e) => setModalData(prev => ({ ...prev, ghiChu: e.target.value }))}
                  placeholder="Ghi chú cho user..."
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> Duyệt
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <XCircle size={18} /> Từ chối
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 bg-slate-200 text-slate-800 font-bold py-2 rounded-lg hover:bg-slate-300 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyTradeIn;
