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

  // Lấy hàm addToCart từ Context (bây giờ nó đã tự kèm Toast xịn rồi)
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

    if (loiCauHinh.length > 0) return; // CartContext sẽ không được gọi nếu có lỗi

    if (type === "ADD_ALL") {
      if (danhSachChon.length === 0) return;
      
      // Thêm từng món vào giỏ hàng
      danhSachChon.forEach((sp) => {
        addToCart(sp, 1);
      });
    } else {
      // Logic thanh toán
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
    <div style={styles.page}>
      {/* CSS HOVER ANIMATION */}
      <style>{`
        .build-card:hover { transform: translateY(-5px); border-color: #2563eb !important; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .btn-hover:hover { filter: brightness(1.1); transform: scale(1.02); }
        .tab-item { transition: all 0.2s; }
        .tab-item:hover { background: #e2e8f0; }
      `}</style>

      <div style={styles.container}>
        {/* HEADER TRANG BUILD */}
        <div style={styles.headerSection}>
            <h1 style={styles.mainTitle}>🛠️ Xây dựng cấu hình PC</h1>
            <p style={styles.subTitle}>Chọn linh kiện phù hợp - Chúng tôi kiểm tra tính tương thích giúp bạn</p>
        </div>

        <div style={styles.mainLayout}>
          {/* CỘT TRÁI: CHỌN LINH KIỆN */}
          <div style={styles.leftCol}>
            <div style={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder="Tìm nhanh linh kiện..." 
                    style={styles.searchInput}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div style={styles.tabs}>
                {cacLoaiLinhKien.map((l) => (
                    <button
                    key={l}
                    className="tab-item"
                    style={loaiDangChon === l ? styles.tabActive : styles.tab}
                    onClick={() => setLoaiDangChon(l)}
                    >
                    {l}
                    </button>
                ))}
                </div>
            </div>

            <div style={styles.grid}>
              {sanPhamsHienThi.map((item) => (
                <div key={item._id} className="build-card" style={styles.card}>
                  <div style={styles.imgWrap}>
                    <img src={item.hinhAnh || item.anh} alt={item.ten} style={styles.img} />
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.badgeRow}>
                        <span style={styles.typeBadge}>{item.loai}</span>
                        <span style={styles.stockBadge}>Còn hàng</span>
                    </div>
                    <h4 style={styles.pName} title={item.ten}>{item.ten}</h4>
                    <p style={styles.price}>{item.gia?.toLocaleString()} đ</p>
                    <button
                      className="btn-hover"
                      onClick={() => chonLinhKien(item)}
                      style={styles.btnAdd}
                    >
                      + Thêm vào cấu hình
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT CẤU HÌNH */}
          <div style={styles.rightCol}>
            <div style={styles.sidebar}>
              <div style={styles.sideHeader}>
                <h3 style={styles.sideTitle}>Cấu hình hiện tại</h3>
                <button onClick={() => setDanhSachChon([])} style={styles.clearBtn}>Xóa hết</button>
              </div>

              {loiCauHinh.length > 0 && (
                <div style={styles.errorBox}>
                    {loiCauHinh.map((err, idx) => (
                        <div key={idx} style={styles.errorItem}>{err}</div>
                    ))}
                </div>
              )}

              <div style={styles.buildItems}>
                {danhSachChon.length === 0 ? (
                  <div style={styles.emptyState}>
                      <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" width="60" style={{opacity: 0.3}} />
                      <p>Vui lòng chọn linh kiện bên trái</p>
                  </div>
                ) : (
                    danhSachChon.map((item) => (
                        <div key={item._id} style={styles.itemRow}>
                          <div style={styles.itemIcon}>{item.loai === "CPU" ? "💻" : "🔌"}</div>
                          <div style={{ flex: 1 }}>
                            <div style={styles.itemName}>{item.ten}</div>
                            <div style={styles.itemPrice}>{item.gia?.toLocaleString()} đ</div>
                          </div>
                          <button
                            onClick={() => setDanhSachChon(danhSachChon.filter((i) => i._id !== item._id))}
                            style={styles.btnDel}
                          >✕</button>
                        </div>
                    ))
                )}
              </div>

              <div style={styles.footer}>
                <div style={styles.totalRow}>
                  <span>Tổng tiền dự kiến:</span>
                  <span style={styles.totalPrice}>{tongTien.toLocaleString()} đ</span>
                </div>
                
                <button
                  className="btn-hover"
                  disabled={danhSachChon.length === 0 || loiCauHinh.length > 0}
                  style={{...styles.btnGreen, opacity: (danhSachChon.length === 0 || loiCauHinh.length > 0) ? 0.5 : 1}}
                  onClick={() => handleAction("ADD_ALL")}
                >
                  🛒 Thêm cả bộ vào giỏ hàng
                </button>
                
                <button
                  className="btn-hover"
                  disabled={danhSachChon.length === 0 || loiCauHinh.length > 0}
                  style={{...styles.btnBlue, opacity: (danhSachChon.length === 0 || loiCauHinh.length > 0) ? 0.5 : 1}}
                  onClick={() => handleAction("PAY")}
                >
                  🚀 Thanh toán ngay
                </button>
                
                {loiCauHinh.length > 0 && <p style={styles.warningText}>* Vui lòng sửa lỗi tương thích để tiếp tục</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "50px" },
  container: { maxWidth: "1440px", margin: "0 auto", padding: "0 20px" },
  headerSection: { padding: "40px 0", textAlign: "left" },
  mainTitle: { fontSize: "32px", color: "#0f172a", fontWeight: "800", marginBottom: "8px" },
  subTitle: { color: "#64748b", fontSize: "16px" },
  
  mainLayout: { display: "flex", gap: "30px", alignItems: "flex-start" },
  leftCol: { flex: 1 },
  
  filterBar: { backgroundColor: "#fff", padding: "20px", borderRadius: "16px", marginBottom: "25px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  searchInput: { width: "100%", padding: "12px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "15px", outline: "none", fontSize: "15px" },
  
  tabs: { display: "flex", flexWrap: "wrap", gap: "10px" },
  tab: { padding: "10px 18px", borderRadius: "8px", border: "1px solid #e2e8f0", cursor: "pointer", backgroundColor: "#fff", color: "#475569", fontWeight: "600", fontSize: "14px" },
  tabActive: { padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#2563eb", color: "#fff", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)" },
  
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" },
  card: { backgroundColor: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", transition: "all 0.3s ease" },
  imgWrap: { height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" },
  img: { maxWidth: "90%", maxHeight: "90%", objectFit: "contain" },
  
  badgeRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  typeBadge: { fontSize: "11px", color: "#2563eb", fontWeight: "800", textTransform: "uppercase", backgroundColor: "#eff6ff", padding: "4px 8px", borderRadius: "6px" },
  stockBadge: { fontSize: "11px", color: "#10b981", fontWeight: "700" },
  
  pName: { fontSize: "15px", margin: "0 0 10px 0", height: "44px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", color: "#1e293b", lineHeight: "1.4" },
  price: { color: "#ef4444", fontWeight: "800", fontSize: "18px", marginBottom: "15px" },
  btnAdd: { marginTop: "auto", padding: "12px", backgroundColor: "#f1f5f9", color: "#1e293b", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", transition: "all 0.2s" },

  rightCol: { width: "420px", position: "sticky", top: "20px" },
  sidebar: { backgroundColor: "#1e293b", padding: "25px", borderRadius: "20px", color: "#fff", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  sideHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "15px" },
  sideTitle: { fontSize: "18px", fontWeight: "800" },
  clearBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "13px" },
  
  errorBox: { marginBottom: "20px" },
  errorItem: { backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", padding: "10px", borderRadius: "8px", fontSize: "12px", marginBottom: "8px", border: "1px solid rgba(239, 68, 68, 0.2)" },
  
  buildItems: { minHeight: "200px", maxHeight: "400px", overflowY: "auto", marginBottom: "20px", paddingRight: "5px" },
  emptyState: { textAlign: "center", padding: "40px 0", color: "#94a3b8" },
  itemRow: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #334155" },
  itemIcon: { fontSize: "20px" },
  itemName: { fontSize: "13px", fontWeight: "500", color: "#e2e8f0", marginBottom: "4px" },
  itemPrice: { fontSize: "14px", color: "#10b981", fontWeight: "700" },
  btnDel: { background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "16px" },
  
  footer: { borderTop: "1px solid #334155", paddingTop: "20px" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  totalPrice: { color: "#10b981", fontSize: "24px", fontWeight: "900" },
  
  btnGreen: { width: "100%", padding: "15px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", marginBottom: "12px", cursor: "pointer", transition: "all 0.2s" },
  btnBlue: { width: "100%", padding: "15px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" },
  warningText: { color: "#ef4444", fontSize: "12px", textAlign: "center", marginTop: "10px", fontWeight: "600" }
};

export default TrangBuildPC;