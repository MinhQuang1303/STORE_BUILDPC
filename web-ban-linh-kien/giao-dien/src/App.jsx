import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [sanPhams, setSanPhams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/san-pham")
      .then((res) => {
        setSanPhams(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi API:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 border-l-8 border-blue-600 pl-6 uppercase tracking-tighter sm:text-5xl">
              Hệ thống Build PC <br />
              <span className="text-blue-600">Tự chọn chuyên nghiệp</span>
            </h1>
          </div>
          <div className="hidden lg:block">
            <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-600 transition-all shadow-xl flex items-center group">
              Bắt đầu Build ngay
              <span className="ml-3 group-hover:translate-x-2 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sanPhams.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="h-60 bg-white p-8 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={item.anh}
                    alt={item.ten}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    New
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                    {item.ten}
                  </h3>
                  <p className="text-gray-500 text-xs mb-4 line-clamp-2 h-8">
                    {item.thongSo}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-blue-600 text-xl font-black tracking-tighter">
                      {item.gia?.toLocaleString()}{" "}
                      <span className="text-xs">VNĐ</span>
                    </p>
                    <button className="bg-gray-100 text-slate-900 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-60H6"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
