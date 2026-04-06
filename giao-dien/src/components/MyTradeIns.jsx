import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyTradeIns = () => {
  const [tradeIns, setTradeIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchTradeIns();
  }, []);

  const fetchTradeIns = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${apiUrl}/trade-in/my-trade-ins`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setTradeIns(res.data.data || []);
    } catch (error) {
      toast.error('Lỗi tải danh sách trade-in');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xác nhận' },
      'Approved': { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Đã chấp nhận' },
      'Rejected': { icon: XCircle, color: 'bg-red-100 text-red-800', text: 'Từ chối' },
      'Paid': { icon: CheckCircle, color: 'bg-blue-100 text-blue-800', text: 'Đã thanh toán' },
    };
    const badge = badges[status] || badges['Pending'];
    const Icon = badge.icon;
    return (
      <div className={`${badge.color} px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 w-fit`}>
        <Icon size={16} /> {badge.text}
      </div>
    );
  };

  const filteredTradeIns = filter === 'All' 
    ? tradeIns 
    : tradeIns.filter(t => t.trangThai === filter);

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Đang tải...</div>;
  }

  if (tradeIns.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
        <Send size={32} className="mx-auto text-slate-400 mb-3" />
        <h3 className="text-lg font-semibold text-slate-700 mb-1">Chưa có yêu cầu trade-in nào</h3>
        <p className="text-slate-600">Bạn chưa gửi yêu cầu bán lại linh kiện cũ</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['All', 'Pending', 'Approved', 'Rejected', 'Paid'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {status === 'All' ? 'Tất cả' : status === 'Pending' ? 'Chờ xác nhận' : status === 'Approved' ? 'Đã chấp nhận' : status === 'Rejected' ? 'Từ chối' : 'Đã thanh toán'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredTradeIns.map((tradeIn) => (
          <div key={tradeIn._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-bold text-slate-800">{tradeIn.tenSanPham}</h4>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">{tradeIn.loaiSanPham}</span> • Tình trạng: <span className="font-semibold">{tradeIn.tinhTrang === 'LikeNew' ? 'Như mới' : tradeIn.tinhTrang === 'Good' ? 'Tốt' : tradeIn.tinhTrang === 'Fair' ? 'Bình thường' : 'Có vết sử dụng'}</span>
                </p>
              </div>
              {getStatusBadge(tradeIn.trangThai)}
            </div>

            {tradeIn.moTa && (
              <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg">{tradeIn.moTa}</p>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-slate-600 mb-1">Giá yêu cầu</p>
                <p className="text-lg font-bold text-blue-600">{tradeIn.gia.toLocaleString('vi-VN')}₫</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Giá áp dụng</p>
                <p className="text-lg font-bold text-green-600">{tradeIn.giaApDung?.toLocaleString('vi-VN') || 'Chờ duyệt'}₫</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Ngày gửi</p>
                <p className="text-sm font-semibold text-slate-700">{new Date(tradeIn.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            {tradeIn.ghiChuDuyet && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs font-semibold text-orange-800 mb-1">Ghi chú từ Admin:</p>
                <p className="text-sm text-orange-700">{tradeIn.ghiChuDuyet}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTradeIns;
