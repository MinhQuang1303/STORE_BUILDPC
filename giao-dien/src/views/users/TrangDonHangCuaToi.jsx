import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrangDonHangCuaToi = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const apiBase = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;
  const API_ORDERS = `${apiBase}/orders`;

  const getStatusStyle = (status) => {
    const map = {
      Pending: "bg-yellow-100 text-yellow-700",
      Confirmed: "bg-blue-100 text-blue-700",
      Shipping: "bg-purple-100 text-purple-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  useEffect(() => {
    const fetchMyOrders = async () => {
      let userData = null;
      try {
        userData = JSON.parse(localStorage.getItem("user"));
      } catch (error) {
        localStorage.removeItem("user");
      }
      const token = userData?.token || localStorage.getItem("token");

      if (!token) {
        navigate("/dang-nhap");
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");
        const res = await axios.get(`${API_ORDERS}/cua-toi`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (error) {
        const status = error.response?.status;
        if (status === 404) {
          setErrorMessage("Không tìm thấy API đơn hàng của tôi. Hãy khởi động lại backend để cập nhật route mới.");
        } else {
          setErrorMessage(error.response?.data?.message || "Không tải được đơn hàng. Vui lòng thử lại.");
        }
        console.error("Lỗi tải đơn hàng của tôi:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [API_ORDERS, navigate]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase">Đơn hàng của tôi</h1>
        <p className="text-sm text-gray-500">Theo dõi trạng thái xử lí các đơn bạn đã đặt</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : errorMessage ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-700">
          {errorMessage}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 font-mono">
                    Mã đơn: #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.trangThai)}`}>
                    {order.trangThai}
                  </span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">Sản phẩm</th>
                      <th className="px-4 py-3 text-center">SL</th>
                      <th className="px-4 py-3 text-right">Đơn giá</th>
                      <th className="px-4 py-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.orderItems?.map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">{item.idSanPham?.ten}</div>
                          <div className="text-xs text-gray-500">{item.idBienThe?.ten || "Bản tiêu chuẩn"}</div>
                        </td>
                        <td className="px-4 py-3 text-center font-bold">x{item.soLuong}</td>
                        <td className="px-4 py-3 text-right">{item.gia?.toLocaleString("vi-VN")}đ</td>
                        <td className="px-4 py-3 text-right font-bold">
                          {(item.gia * item.soLuong).toLocaleString("vi-VN")}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-col md:flex-row md:justify-between gap-2 text-sm">
                <div className="text-gray-600">
                  <span className="font-semibold">Địa chỉ:</span> {order.diaChi}
                </div>
                <div className="font-black text-blue-700 text-base">
                  Tổng tiền: {order.tongTien?.toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrangDonHangCuaToi;
