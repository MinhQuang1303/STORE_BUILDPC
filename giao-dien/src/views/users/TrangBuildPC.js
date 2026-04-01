import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

const formatImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/200";
  if (url.startsWith("/uploads")) {
    const baseUrl = process.env.REACT_APP_API_URL
      ? process.env.REACT_APP_API_URL.replace("/api", "")
      : "http://localhost:5000";
    return `${baseUrl}${url}`;
  }
  return url;
};

const SLOTS = [
  { id: "CPU", name: "Vi xử lý (CPU)", icon: "🧠" },
  { id: "Mainboard", name: "Bo mạch chủ (Mainboard)", icon: "🎛️" },
  { id: "RAM", name: "Bộ nhớ trong (RAM)", icon: "💾" },
  { id: "HDD", name: "Ổ cứng (HDD)", icon: "💽" },
  { id: "SSD", name: "Ổ cứng (SSD)", icon: "⚡" },
  { id: "VGA", name: "Card màn hình (VGA)", icon: "🎮" },
  { id: "PSU", name: "Nguồn (PSU)", icon: "🔌" },
  { id: "Case", name: "Vỏ máy tính (Case)", icon: "🖥️" },
  { id: "Tản nhiệt", name: "Tản nhiệt", icon: "❄️" },
  { id: "Màn hình", name: "Màn hình", icon: "📺" },
  { id: "Bàn phím", name: "Bàn phím", icon: "⌨️" },
  { id: "Chuột", name: "Chuột", icon: "🖱️" },
  { id: "Tai nghe", name: "Tai nghe", icon: "🎧" },
  { id: "Loa", name: "Loa máy tính", icon: "🔊" },
];

function isCategoryMatch(slotId, categoryName) {
  if (!categoryName) return false;
  const catName = categoryName.toLowerCase().trim();
  const slot = slotId.toLowerCase().trim();
  
  if (slot === "cpu") return catName.includes("cpu") || catName.includes("vi xử lý");
  if (slot === "mainboard") return catName.includes("mainboard") || catName.includes("bo mạch");
  if (slot === "ram") return catName.includes("ram") || catName.includes("bộ nhớ");
  if (slot === "hdd" || slot === "ssd") return catName.includes("ssd") || catName.includes("hdd") || catName.includes("ổ cứng");
  if (slot === "vga") return catName.includes("vga") || catName.includes("card màn hình");
  if (slot === "psu") return catName.includes("psu") || catName.includes("nguồn");
  if (slot === "case") return catName.includes("case") || catName.includes("vỏ");
  if (slot === "tản nhiệt") return catName.includes("tản");
  if (slot === "màn hình") return catName.includes("màn hình");
  if (["bàn phím", "chuột", "tai nghe", "loa"].includes(slot)) return catName.includes("gear") || catName.includes(slot);
  
  return catName.includes(slot);
}

const TrangBuildPC = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [sanPhams, setSanPhams] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState({});
  const [activeSlot, setActiveSlot] = useState(null); // Mở Modal cho slot nào
  const [searchTerm, setSearchTerm] = useState("");
  const [loiCauHinh, setLoiCauHinh] = useState([]);

  // States mới cho Biến Thể và Thông Số
  const [selectedVariants, setSelectedVariants] = useState({});
  const [expandedSpecs, setExpandedSpecs] = useState({});

  const userStorage = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/san-pham")
      .then((res) => setSanPhams(res.data))
      .catch((err) => console.error("Lỗi API:", err));
  }, []);

  // Kiểm tra tương thích cơ bản
  useEffect(() => {
    let errors = [];
    const cpu = selectedComponents["CPU"];
    const main = selectedComponents["Mainboard"];
    const ram = selectedComponents["RAM"];

    if (cpu && main) {
      const regexSocket = /(LGA\s?\d+|AM\d+|Socket\s?\d+)/i;
      const cpuS = cpu.thongSo?.match(regexSocket)?.[0]?.replace(/\s|Socket/gi, "");
      const mainS = main.thongSo?.match(regexSocket)?.[0]?.replace(/\s|Socket/gi, "");
      if (cpuS && mainS && cpuS.toUpperCase() !== mainS.toUpperCase()) {
        errors.push(`Lỗi Socket: CPU (${cpuS}) có thể không lắp vừa Mainboard (${mainS}).`);
      }
    }

    if (main && ram) {
      const mRam = main.thongSo?.match(/DDR\d/i)?.[0]?.toUpperCase();
      const rRam = ram.thongSo?.match(/DDR\d/i)?.[0]?.toUpperCase();
      if (mRam && rRam && mRam !== rRam) {
        errors.push(`Lỗi RAM: Mainboard dùng ${mRam} nhưng RAM lại là ${rRam}.`);
      }
    }
    setLoiCauHinh(errors);
  }, [selectedComponents]);

  const handleSelectProduct = (product) => {
    if (!activeSlot) return;
    setSelectedComponents((prev) => ({
      ...prev,
      [activeSlot]: { ...product, soLuong: 1 },
    }));
    setActiveSlot(null); // Đóng modal
    setSearchTerm("");
    setExpandedSpecs({}); // Reset các tab thông số đang mở
  };

  const handleRemoveComponent = (slotId) => {
    setSelectedComponents((prev) => {
      const newObj = { ...prev };
      delete newObj[slotId];
      return newObj;
    });
  };

  const handleIncreaseQuantity = (slotId) => {
    setSelectedComponents((prev) => {
      if (!prev[slotId]) return prev;
      return {
        ...prev,
        [slotId]: { ...prev[slotId], soLuong: prev[slotId].soLuong + 1 },
      };
    });
  };

  const handleDecreaseQuantity = (slotId) => {
    setSelectedComponents((prev) => {
      if (!prev[slotId]) return prev;
      const newQty = prev[slotId].soLuong - 1;
      if (newQty <= 0) {
        const newObj = { ...prev };
        delete newObj[slotId];
        return newObj;
      }
      return {
        ...prev,
        [slotId]: { ...prev[slotId], soLuong: newQty },
      };
    });
  };

  const tongTien = Object.values(selectedComponents).reduce((t, item) => t + (item.gia || 0) * (item.soLuong || 1), 0);

  const handleAddToCart = () => {
    if (!userStorage) {
      navigate("/dang-nhap");
      return;
    }
    const items = Object.values(selectedComponents);
    if (items.length === 0) return;

    items.forEach((item) => {
      addToCart(item, item.soLuong);
    });
  };

  const handleThanhToan = () => {
    if (!userStorage) {
      navigate("/dang-nhap");
      return;
    }
    const items = Object.values(selectedComponents);
    if (items.length === 0) return;
    navigate("/thanh-toan", { state: { buildPC: items, total: tongTien } });
  };

  // --- RENDERING MODAL ---
  const renderProductModal = () => {
    if (!activeSlot) return null;

    const slotInfo = SLOTS.find((s) => s.id === activeSlot);
    const filteredProducts = sanPhams.filter((sp) => {
      const categoryName = sp.idDanhMuc?.ten || sp.loai;
      const matchCategory = isCategoryMatch(activeSlot, categoryName);
      const matchSearch = sp.ten.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });

    return (
      <div style={styles.modalOverlay} onClick={() => setActiveSlot(null)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>Chỉ định linh kiện cho: {slotInfo?.name}</h2>
            <button style={styles.closeBtn} onClick={() => setActiveSlot(null)}>✕</button>
          </div>
          <div style={styles.modalBody}>
            <input
              type="text"
              placeholder={`Tìm ${slotInfo?.name}...`}
              style={styles.modalSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />

            <div style={styles.productGrid}>
              {filteredProducts.length === 0 ? (
                <div style={styles.emptyText}>Không tìm thấy sản phẩm nào phù hợp.</div>
              ) : (
                filteredProducts.map((sp) => {
                  const hasVariants = sp.bienThe && sp.bienThe.length > 0;
                  const selectedVariantIndex = selectedVariants[sp._id] || 0;
                  const currentVariant = hasVariants ? sp.bienThe[selectedVariantIndex] : null;

                  const displayPrice = currentVariant && currentVariant.gia ? currentVariant.gia : sp.gia;
                  const isExpanded = !!expandedSpecs[sp._id];

                  return (
                    <div key={sp._id} style={{...styles.pCard, ...(isExpanded ? {gridRowEnd: 'span 2'} : {})}}>
                      <div style={{ position: "relative" }}>
                        <img src={formatImageUrl(sp.anh || sp.hinhAnh)} alt={sp.ten} style={styles.pImg} />
                        <button 
                          style={styles.pBtnSpecs} 
                          title="Click để Xem/Ẩn thông số kỹ thuật" 
                          onClick={(e) => { e.stopPropagation(); setExpandedSpecs(prev => ({ ...prev, [sp._id]: !prev[sp._id] })); }}
                        >
                          🔍 Thông số
                        </button>
                      </div>
                      
                      <div style={styles.pInfo}>
                        <h4 style={styles.pName} title={sp.ten}>{sp.ten}</h4>

                        {hasVariants && (
                          <select 
                            style={styles.pVariantSelect}
                            value={selectedVariantIndex}
                            onChange={(e) => {
                              e.stopPropagation();
                              setSelectedVariants(prev => ({ ...prev, [sp._id]: parseInt(e.target.value) }));
                            }}
                          >
                            {sp.bienThe.map((bt, idx) => (
                              <option key={bt._id || idx} value={idx}>
                                {bt.ten} - {bt.gia?.toLocaleString()} đ
                              </option>
                            ))}
                          </select>
                        )}

                        <div style={styles.pPrice}>{displayPrice?.toLocaleString()} đ</div>

                        {isExpanded && (
                          <div style={styles.pSpecsBox}>
                            <div style={styles.pSpecsTitle}>Chi tiết kỹ thuật:</div>
                            <div style={styles.pSpecsText} dangerouslySetInnerHTML={{__html: sp.thongSo?.replace(/\n/g, '<br/>') || 'Đang cập nhật thông tin...'}} />
                          </div>
                        )}

                        <button 
                          style={styles.pBtnSelect} 
                          onClick={() => {
                            const productToAdd = { ...sp };
                            if (hasVariants && currentVariant) {
                              productToAdd.ten = `${sp.ten} - ${currentVariant.ten}`;
                              productToAdd.gia = currentVariant.gia;
                              productToAdd.variantId = currentVariant._id;
                            }
                            handleSelectProduct(productToAdd);
                          }}
                        >
                          + Chọn
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      {/* Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerContent}>
          <h1 style={styles.bannerTitle}>BUILD PC CHUYÊN NGHIỆP</h1>
          <p style={styles.bannerSub}>Tự do tinh chỉnh - Hiện thực hóa cố máy mơ ước của bạn</p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.layout}>
          {/* CỘT TRÁI: Slots Build */}
          <div style={styles.leftCol}>
            {loiCauHinh.length > 0 && (
              <div style={styles.warningBox}>
                <div style={styles.warningTitle}>⚠️ Lưu ý tương thích hệ thống:</div>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {loiCauHinh.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={styles.slotsCard}>
              <div style={styles.slotsHeader}>
                <h3>Danh sách linh kiện máy tính</h3>
                <button
                  style={styles.btnClear}
                  onClick={() => {
                    if (window.confirm("Bạn muốn làm mới cấu hình?")) setSelectedComponents({});
                  }}
                >
                  🔄 Làm mới cấu hình
                </button>
              </div>

              {SLOTS.map((slot) => {
                const isSelected = !!selectedComponents[slot.id];
                const item = selectedComponents[slot.id];

                return (
                  <div key={slot.id} style={styles.slotRow}>
                    <div style={styles.slotIconBox}>
                      <span style={{ fontSize: "24px" }}>{slot.icon}</span>
                    </div>
                    <div style={styles.slotInfo}>
                      <div style={styles.slotTitle}>{slot.name}</div>
                      {isSelected ? (
                        <div style={styles.slotSelectedItem}>
                          <img
                            src={formatImageUrl(item.anh || item.hinhAnh)}
                            alt={item.ten}
                            style={styles.slotSelectedImg}
                          />
                          <div style={styles.slotSelectedDetails}>
                            <h4 style={styles.slotSelectedName}>{item.ten}</h4>
                            <div style={styles.slotSelectedPrice}>
                              {item.gia?.toLocaleString()} đ
                              <span style={styles.slotQtyLabel}>x {item.soLuong}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={styles.slotEmptyText}>Vui lòng chọn linh kiện</div>
                      )}
                    </div>

                    <div style={styles.slotAction}>
                      {isSelected ? (
                        <div style={styles.qtyControls}>
                          <button style={styles.qtyBtn} onClick={() => handleDecreaseQuantity(slot.id)}>-</button>
                          <span style={styles.qtyValue}>{item.soLuong}</span>
                          <button style={styles.qtyBtn} onClick={() => handleIncreaseQuantity(slot.id)}>+</button>
                          <button style={styles.btnRemove} onClick={() => handleRemoveComponent(slot.id)}>✕</button>
                        </div>
                      ) : (
                        <button style={styles.btnChoose} onClick={() => setActiveSlot(slot.id)}>
                          + CHỌN {slot.id}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI: Tóm tắt */}
          <div style={styles.rightCol}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>CẤU HÌNH CỦA BẠN</h3>
              <div style={styles.summaryDivider}></div>
              <div style={styles.summaryTotalLabel}>Tổng chi phí ước tính:</div>
              <div style={styles.summaryPrice}>{tongTien.toLocaleString()} ₫</div>
              <div style={styles.summaryDivider}></div>

              <button
                style={{ ...styles.btnPrimary, opacity: tongTien === 0 ? 0.5 : 1 }}
                disabled={tongTien === 0}
                onClick={handleAddToCart}
              >
                🛒 Thêm cấu hình vào giỏ
              </button>

              <button
                style={{ ...styles.btnCheckout, opacity: tongTien === 0 ? 0.5 : 1 }}
                disabled={tongTien === 0}
                onClick={handleThanhToan}
              >
                🚀 Thanh toán ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {renderProductModal()}
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  banner: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
    padding: "60px 20px",
    textAlign: "center",
    color: "#fff",
    marginBottom: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  bannerTitle: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "900",
    letterSpacing: "1px",
  },
  bannerSub: {
    marginTop: "10px",
    color: "#94a3b8",
    fontSize: "18px",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
    paddingBottom: "100px",
  },
  layout: {
    display: "flex",
    gap: "30px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  leftCol: {
    flex: "1 1 calc(100% - 400px)",
    minWidth: "600px",
  },
  warningBox: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderLeft: "6px solid #ef4444",
    padding: "15px 20px",
    borderRadius: "10px",
    color: "#b91c1c",
    marginBottom: "20px",
  },
  warningTitle: {
    fontWeight: "800",
    marginBottom: "5px",
  },
  slotsCard: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  slotsHeader: {
    padding: "20px 30px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  btnClear: {
    background: "none",
    border: "1px solid #cbd5e1",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#475569",
    transition: "0.2s",
  },
  slotRow: {
    display: "flex",
    alignItems: "center",
    padding: "20px 30px",
    borderBottom: "1px dashed #e2e8f0",
    gap: "20px",
    transition: "background 0.2s",
  },
  slotIconBox: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  slotInfo: {
    flex: 1,
  },
  slotTitle: {
    fontSize: "15px",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "5px",
  },
  slotEmptyText: {
    color: "#94a3b8",
    fontSize: "14px",
    fontStyle: "italic",
  },
  slotSelectedItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  slotSelectedImg: {
    width: "50px",
    height: "50px",
    objectFit: "contain",
  },
  slotSelectedDetails: {},
  slotSelectedName: {
    margin: "0 0 5px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
  },
  slotSelectedPrice: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#ef4444",
  },
  slotQtyLabel: {
    color: "#64748b",
    fontSize: "13px",
    marginLeft: "10px",
    fontWeight: "500",
  },
  slotAction: {
    display: "flex",
    alignItems: "center",
  },
  btnChoose: {
    backgroundColor: "transparent",
    color: "#2563eb",
    border: "2px solid #2563eb",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.2s",
    textTransform: "uppercase",
    fontSize: "13px",
  },
  qtyControls: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: "10px",
    padding: "5px",
  },
  qtyBtn: {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  qtyValue: {
    margin: "0 15px",
    fontWeight: "800",
    fontSize: "14px",
  },
  btnRemove: {
    marginLeft: "15px",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fee2e2",
    color: "#ef4444",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  rightCol: {
    width: "350px",
    flexShrink: 0,
    position: "sticky",
    top: "30px",
  },
  summaryCard: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
  },
  summaryTitle: {
    margin: "0 0 20px 0",
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#38bdf8",
  },
  summaryDivider: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.1)",
    margin: "20px 0",
  },
  summaryTotalLabel: {
    fontSize: "16px",
    color: "#94a3b8",
    marginBottom: "10px",
  },
  summaryPrice: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#10b981",
  },
  btnPrimary: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    marginBottom: "15px",
    transition: "0.2s",
  },
  btnCheckout: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(5px)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: "1000px",
    height: "85vh",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    padding: "20px 30px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#64748b",
  },
  modalBody: {
    flex: 1,
    padding: "20px 30px",
    overflowY: "auto",
  },
  modalSearch: {
    width: "100%",
    padding: "15px 20px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    marginBottom: "20px",
    outline: "none",
    transition: "border 0.2s",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  pCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  pImg: {
    width: "100%",
    height: "140px",
    objectFit: "contain",
    marginBottom: "15px",
  },
  pInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  pName: {
    fontSize: "14px",
    fontWeight: "700",
    margin: "0 0 10px 0",
    height: "40px",
    overflow: "hidden",
    color: "#1e293b",
  },
  pPrice: {
    color: "#ef4444",
    fontWeight: "800",
    fontSize: "16px",
    marginBottom: "15px",
  },
  pBtnSelect: {
    marginTop: "auto",
    width: "100%",
    padding: "10px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },
  emptyText: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "50px",
    color: "#94a3b8",
    fontSize: "16px",
  },
  pBtnSpecs: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    backdropFilter: "blur(4px)",
    whiteSpace: "nowrap",
  },
  pVariantSelect: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "13px",
    color: "#334155",
    backgroundColor: "#f8fafc",
  },
  pSpecsBox: {
    backgroundColor: "#f1f5f9",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px",
    fontSize: "13px",
    border: "1px dashed #cbd5e1",
    maxHeight: "200px",
    overflowY: "auto",
  },
  pSpecsTitle: {
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "6px",
  },
  pSpecsText: {
    color: "#475569",
    lineHeight: "1.5",
  },
};

export default TrangBuildPC;