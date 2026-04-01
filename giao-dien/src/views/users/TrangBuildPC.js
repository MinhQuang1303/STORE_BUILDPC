import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

function TrangBuildPC() {
  const navigate = useNavigate();
  const [sanPhams, setSanPhams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [danhSachChon, setDanhSachChon] = useState([]);
  const [loaiDangChon, setLoaiDangChon] = useState("Tất cả");
  const [loiCauHinh, setLoiCauHinh] = useState([]);

  const { addToCart } = useContext(CartContext);

  const cacLoaiLinhKien = [
    "Tất cả", "CPU", "Mainboard", "RAM", "VGA", "Ổ cứng", "Nguồn", "Case", "Tản nhiệt",
  ];

  const userStorage = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/san-pham")
      .then((res) => setSanPhams(res.data))
      .catch((err) => console.error("Lỗi API:", err));
  }, []);

  // Logic kiểm tra tương thích Socket & RAM
  useEffect(() => {
    let errors = [];
    const cpu = danhSachChon.find((item) => item.loai === "CPU");
    const main = danhSachChon.find((item) => item.loai === "Mainboard");
    const ram = danhSachChon.find((item) => item.loai === "RAM");

    if (cpu && main) {
      const regexSocket = /(LGA\s?\d+|AM\d+|Socket\s?\d+)/i;
      const cpuS = cpu.thongSo?.match(regexSocket)?.[0]?.replace(/\s|Socket/gi, "");
      const mainS = main.thongSo?.match(regexSocket)?.[0]?.replace(/\s|Socket/gi, "");
      if (cpuS && mainS && cpuS.toUpperCase() !== mainS.toUpperCase()) {
        errors.push(`❌ Lỗi Socket: CPU (${cpuS}) không khớp với Mainboard (${mainS}).`);
      }
    }

    if (main && ram) {
      const mRam = main.thongSo?.match(/DDR\d/i)?.[0]?.toUpperCase();
      const rRam = ram.thongSo?.match(/DDR\d/i)?.[0]?.toUpperCase();
      if (mRam && rRam && mRam !== rRam) {
        errors.push(`❌ Lỗi RAM: Mainboard hỗ trợ ${mRam} nhưng RAM là ${rRam}.`);
      }
    }
    setLoiCauHinh(errors);
  }, [danhSachChon]);

  const chonLinhKien = (sp) => {
    setDanhSachChon((prev) => {
      const index = prev.findIndex((item) => item.loai === sp.loai);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...sp, soLuong: 1 };
        return updated;
      }
      return [...prev, { ...sp, soLuong: 1 }];
    });
  };

  const handleAction = (type) => {
    if (!userStorage) {
      navigate("/login");
      return;
    }
    if (loiCauHinh.length > 0) return;

    if (type === "ADD_ALL") {
      if (danhSachChon.length === 0) return;
      danhSachChon.forEach((sp) => {
        addToCart(sp, 1);
      });
    } else {
      navigate("/thanh-toan", { state: { buildPC: danhSachChon, total: tongTien } });
    }
  };

  const tongTien = danhSachChon.reduce((t, i) => t + (i.gia || 0) * (i.soLuong || 1), 0);
  
  const sanPhamsHienThi = sanPhams.filter(
    (sp) =>
      sp.ten.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (loaiDangChon === "Tất cả" || sp.loai === loaiDangChon),
  );

  return (
    <div className="bg-slate-50 dark:bg-[#0b0f1a] min-h-screen pb-12 transition-colors duration-300">
      <style>{`
        .build-card:hover { transform: translateY(-5px); border-color: #3b82f6 !important; }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-5">
        {/* HEADER */}
        <div className="py-10 text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">🛠️ Xây dựng cấu hình PC</h1>
            <p className="text-slate-500 dark:text-slate-400">Chọn linh kiện phù hợp - Chúng tôi kiểm tra tính tương thích giúp bạn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* CỘT TRÁI: CHỌN LINH KIỆN */}
          <div className="flex-1 w-full">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <input 
                    type="text" 
                    placeholder="Tìm nhanh linh kiện..." 
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                    {cacLoaiLinhKien.map((l) => (
                        <button
                            key={l}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                loaiDangChon === l 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                            }`}
                            onClick={() => setLoaiDangChon(l)}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sanPhamsHienThi.map((item) => (
                <div key={item._id} className="build-card bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex flex-col transition-all">
                  <div className="h-40 flex items-center justify-center mb-4 bg-white rounded-xl">
                    <img src={item.hinhAnh || item.anh} alt={item.ten} className="max-w-[80%] max-h-[80%] object-contain" />
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">{item.loai}</span>
                    <span className="text-[10px] font-bold text-green-500">Còn hàng</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 h-10 line-clamp-2 leading-tight">{item.ten}</h4>
                  <p className="text-red-500 font-black text-lg mb-4">{item.gia?.toLocaleString()} đ</p>
                  <button
                    onClick={() => chonLinhKien(item)}
                    className="mt-auto py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    + Thêm vào cấu hình
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT CẤU HÌNH */}
          <div className="w-full lg:w-[400px] sticky top-5">
            <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-3xl text-white shadow-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <h3 className="font-black text-lg">Cấu hình hiện tại</h3>
                <button onClick={() => setDanhSachChon([])} className="text-xs text-slate-400 hover:text-white underline">Xóa hết</button>
              </div>

              {loiCauHinh.length > 0 && (
                <div className="mb-6 space-y-2">
                    {loiCauHinh.map((err, idx) => (
                        <div key={idx} className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs leading-relaxed">
                            {err}
                        </div>
                    ))}
                </div>
              )}

              <div className="min-h-[150px] max-h-[350px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {danhSachChon.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                      <p className="text-4xl mb-2">📥</p>
                      <p className="text-sm">Chưa có linh kiện nào</p>
                  </div>
                ) : (
                    danhSachChon.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 py-3 border-b border-slate-700/50 last:border-0">
                          <div className="w-8 text-center">{item.loai === "CPU" ? "💻" : "🔌"}</div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-slate-300 line-clamp-1">{item.ten}</div>
                            <div className="text-sm font-bold text-green-400">{item.gia?.toLocaleString()} đ</div>
                          </div>
                          <button
                            onClick={() => setDanhSachChon(danhSachChon.filter((i) => i._id !== item._id))}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                          >✕</button>
                        </div>
                    ))
                )}
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-slate-400">Tổng cộng:</span>
                  <span className="text-2xl font-black text-green-400">{tongTien.toLocaleString()} đ</span>
                </div>
                
                <div className="space-y-3">
                    <button
                      disabled={danhSachChon.length === 0 || loiCauHinh.length > 0}
                      className="w-full py-4 bg-green-500 text-white rounded-xl font-black hover:bg-green-600 disabled:opacity-30 transition-all shadow-lg shadow-green-900/20"
                      onClick={() => handleAction("ADD_ALL")}
                    >
                      🛒 Thêm cả bộ vào giỏ
                    </button>
                    
                    <button
                      disabled={danhSachChon.length === 0 || loiCauHinh.length > 0}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 disabled:opacity-30 transition-all shadow-lg shadow-blue-900/20"
                      onClick={() => handleAction("PAY")}
                    >
                      🚀 Thanh toán ngay
                    </button>
                </div>
                
                {loiCauHinh.length > 0 && (
                    <p className="text-red-400 text-[10px] text-center mt-4 font-bold animate-pulse uppercase italic">
                        Vui lòng sửa lỗi tương thích để tiếp tục
                    </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrangBuildPC;