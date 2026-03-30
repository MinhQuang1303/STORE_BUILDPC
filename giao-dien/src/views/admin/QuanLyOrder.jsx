import React, { useState, useEffect } from "react";
import axios from "axios";
import PhanTrang from "../../components/PhanTrang";

const QuanLyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const apiBase = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;
  const API_ORDERS = `${apiBase}/orders`;
  const userToken =
    JSON.parse(localStorage.getItem("user"))?.token ||
    localStorage.getItem("token");

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${userToken}` },
  });

  useEffect(() => {
    fetchOrders();
  }, [selectedUserId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = selectedUserId
        ? `${API_ORDERS}/nguoi-dung/${selectedUserId}`
        : API_ORDERS;
      const res = await axios.get(url, getAuthConfig());
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
      setLoading(false);
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `${API_ORDERS}/${id}/trang-thai`,
        {
          trangThai: newStatus,
        },
        getAuthConfig(),
      );
      // Cập nhật lại danh sách local
      setOrders(orders.map((order) => (order._id === id ? res.data : order)));
      // Nếu đang mở modal thì cập nhật luôn state selectedOrder
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      alert(
        "Lỗi cập nhật trạng thái: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      Shipping: "bg-purple-100 text-purple-700 border-purple-200",
      Delivered: "bg-green-100 text-green-700 border-green-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return `px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles["Pending"]}`;
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const danhSachNguoiDung = orders.reduce((acc, order) => {
    if (order.idUser?._id && !acc.some((u) => u._id === order.idUser._id)) {
      acc.push(order.idUser);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
            Quản lý Đơn hàng
          </h2>
          <p className="text-sm text-gray-500">
            Theo dõi và quản lý quá trình xử lý đơn hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="bg-white border border-gray-200 text-sm text-gray-700 px-3 py-2 rounded-lg outline-none"
          >
            <option value="">Tất cả người dùng</option>
            {danhSachNguoiDung.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username || user.email}
              </option>
            ))}
          </select>
          <button
            onClick={fetchOrders}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center"
          >
            <span className="mr-2">🔄</span> Làm mới
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
                  <th className="px-6 py-4">Mã Đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Ngày đặt</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                {currentItems.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {order.idUser?.username || "Khách vãng lai"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.soDienThoai}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 font-black text-blue-600">
                      {order.tongTien?.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={getStatusBadge(order.trangThai)}>
                        {order.trangThai}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetail(order)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      Chưa có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <PhanTrang
            itemsPerPage={itemsPerPage}
            totalItems={orders.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* Modal Chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                  Chi tiết đơn hàng
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  ID: {selectedOrder._id}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Thông tin khách hàng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest border-b pb-2">
                    Thông tin giao hàng
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-500 font-medium">
                        Người đặt:
                      </span>{" "}
                      <span className="font-bold">
                        {selectedOrder.idUser?.username}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500 font-medium">
                        Số điện thoại:
                      </span>{" "}
                      <span className="font-bold">
                        {selectedOrder.soDienThoai}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500 font-medium">
                        Địa chỉ:
                      </span>{" "}
                      <span className="font-bold text-slate-700">
                        {selectedOrder.diaChi}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500 font-medium">
                        Ghi chú:
                      </span>{" "}
                      <span className="italic text-gray-600">
                        {selectedOrder.ghiChu || "Không có ghi chú"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest border-b pb-2">
                    Trạng thái & Thanh toán
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm flex items-center justify-between">
                      <span className="text-gray-500 font-medium">
                        Trạng thái:
                      </span>
                      <select
                        value={selectedOrder.trangThai}
                        onChange={(e) =>
                          handleUpdateStatus(selectedOrder._id, e.target.value)
                        }
                        className={`ml-2 px-2 py-1 rounded-lg text-xs font-bold border outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
                          selectedOrder.trangThai === "Pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : selectedOrder.trangThai === "Confirmed"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : selectedOrder.trangThai === "Shipping"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : selectedOrder.trangThai === "Delivered"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </p>
                    <p className="text-sm flex items-center justify-between">
                      <span className="text-gray-500 font-medium">
                        Ngày đặt:
                      </span>
                      <span className="font-bold">
                        {new Date(selectedOrder.createdAt).toLocaleString(
                          "vi-VN",
                        )}
                      </span>
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 italic text-center">
                      <p className="text-xs text-blue-500 uppercase font-black mb-1 leading-none">
                        Tổng cộng
                      </p>
                      <p className="text-2xl font-black text-blue-700">
                        {selectedOrder.tongTien?.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest border-b pb-2">
                  Danh sách linh kiện ({selectedOrder.orderItems?.length || 0})
                </h4>
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <table className="min-w-full text-left">
                    <thead className="text-[10px] uppercase font-black text-gray-400 bg-gray-100">
                      <tr>
                        <th className="px-6 py-3">Sản phẩm</th>
                        <th className="px-6 py-3 text-center">Số lượng</th>
                        <th className="px-6 py-3 text-right">Đơn giá</th>
                        <th className="px-6 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.orderItems?.map((item, idx) => (
                        <tr key={idx} className="text-sm bg-white">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">
                              {item.idSanPham?.ten}
                            </div>
                            <div className="text-xs text-gray-500 italic">
                              {item.idBienThe?.ten || "Bản tiêu chuẩn"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold">
                            x{item.soLuong}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.gia?.toLocaleString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 text-right font-black text-slate-900">
                            {(item.gia * item.soLuong).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyOrder;
