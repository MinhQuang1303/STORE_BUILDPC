import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [overview, setOverview] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    users: 0,
  });
  const [doanhThuData, setDoanhThuData] = useState([]);
  const [trangThaiData, setTrangThaiData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovRes, dtRes, ttRes, rcRes] = await Promise.all([
          axios.get(`${API_URL}/thong-ke/overview`),
          axios.get(`${API_URL}/thong-ke/doanh-thu`),
          axios.get(`${API_URL}/thong-ke/trang-thai-don-hang`),
          axios.get(`${API_URL}/thong-ke/recent`),
        ]);

        if (ovRes.data.success) setOverview(ovRes.data.data);
        if (dtRes.data.success) setDoanhThuData(dtRes.data.data);
        if (ttRes.data.success) {
          // Format data cho PieChart
          const formattedTT = ttRes.data.data.map((item) => ({
            name: item._id,
            value: item.count,
          }));
          setTrangThaiData(formattedTT);
        }
        if (rcRes.data.success) setRecentOrders(rcRes.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">💰</div>
            <span className="text-green-500 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {overview.revenue?.toLocaleString()} VNĐ
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">📦</div>
            <span className="text-green-500 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Đơn hàng</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {overview.orders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              💻
            </div>
            <span className="text-blue-500 text-sm font-medium">Ổn định</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Sản phẩm</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {overview.products}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              👥
            </div>
            <span className="text-red-500 text-sm font-medium">-2%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Khách hàng</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {overview.users}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doanh thu theo tháng Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Biểu đồ doanh thu (VNĐ)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={doanhThuData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [
                    value.toLocaleString() + " VNĐ",
                    "Doanh thu",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trạng thái đơn hàng Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Phân loại đơn hàng
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trangThaiData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trangThaiData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Đơn hàng mới nhất</h3>
          <button className="text-blue-600 text-sm font-bold hover:underline">
            <Link to="/admin/orders">Xem tất cả</Link>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Ngày đặt</th>
                <th className="px-6 py-4 font-medium">Tổng tiền</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                        {order.idUser?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {order.idUser?.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.idUser?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">
                    {order.tongTien?.toLocaleString()} VNĐ
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.trangThai === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : order.trangThai === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : order.trangThai === "Shipping"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {order.trangThai}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
