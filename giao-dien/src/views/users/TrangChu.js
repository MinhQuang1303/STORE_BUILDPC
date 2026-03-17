import React, { useEffect, useState } from "react";
import axios from "axios";
import PromoBanner from "../../components/PromoBanner";
import FlashSale from "../../components/FlashSale"; // <-- 1. Thêm import này
import { useNavigate } from "react-router-dom";

const TrangChu = () => {
  const navigate = useNavigate();

  // 1. Cải tiến State: Thêm Loading và Error để UX chuyên nghiệp hơn
  const [sanPhams, setSanPhams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: "CPU", icon: "💻", name: "Vi xử lý (CPU)" },
    { id: "Mainboard", icon: "🎛️", name: "Bo mạch chủ" },
    { id: "RAM", icon: "📟", name: "RAM" },
    { id: "VGA", icon: "🎮", name: "Card màn hình" },
    { id: "SSD", icon: "💽", name: "Ổ cứng SSD" },
    { id: "PSU", icon: "⚡", name: "Nguồn (PSU)" },
    { id: "Case", icon: "🗄️", name: "Vỏ máy (Case)" },
  ];

  const combos = [
    {
      ten: "PC Gaming Esport",
      moTa: "Chiến mượt LOL, CS:GO, Valorant 144Hz",
      gia: 12500000,
      tag: "BÁN CHẠY",
    },
    {
      ten: "PC Creator Pro",
      moTa: "Render Video 4K, Edit Premiere mượt mà",
      gia: 35000000,
      tag: "CAO CẤP",
    },
    {
      ten: "PC Office Standard",
      moTa: "Gọn nhẹ, tối ưu tác vụ văn phòng",
      gia: 7900000,
      tag: "TIẾT KIỆM",
    },
  ];

  // 2. Tải dữ liệu an toàn
  useEffect(() => {
    const fetchSanPhams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/san-pham");
        setSanPhams(res.data.slice(0, 8)); // Lấy 8 sản phẩm nổi bật
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm lúc này.");
        setIsLoading(false);
      }
    };
    fetchSanPhams();
  }, []);

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <PromoBanner />

        {/* 2. FLASH SALE (Chèn trực tiếp vào đây) */}
        <FlashSale />

        {/* 1. DANH MỤC LINH KIỆN */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Danh mục linh kiện</h2>
          <span style={styles.sectionSubtitle}>Tìm kiếm nhanh theo nhóm</span>
        </div>

        <div style={styles.categoryGrid}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={styles.categoryCard}
              onClick={() => navigate("/build")}
            >
              <div style={styles.categoryIcon}>{cat.icon}</div>
              <div style={styles.categoryName}>{cat.name}</div>
            </div>
          ))}
        </div>

        {/* 2. SẢN PHẨM MỚI NHẤT */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Sản phẩm mới nhất</h2>
          <span style={styles.sectionSubtitle}>
            Những linh kiện vừa cập bến
          </span>
        </div>

        {isLoading ? (
          <div
            style={{ textAlign: "center", padding: "50px 0", color: "#64748b" }}
          >
            Đang tải dữ liệu sản phẩm...
          </div>
        ) : error ? (
          <div
            style={{ textAlign: "center", color: "#ef4444", padding: "20px" }}
          >
            {error}
          </div>
        ) : (
          <div style={styles.productGrid}>
            {sanPhams.map((item) => (
              <div
                key={item._id}
                style={styles.productCard}
                onClick={() => navigate(`/san-pham/${item._id}`)}
              >
                <div style={styles.imageBox}>
                  <img
                    src={item.anh}
                    alt={item.ten}
                    style={styles.productImg}
                  />
                </div>
                <div style={styles.productInfo}>
                  <h3 style={styles.productName} title={item.ten}>
                    {item.ten}
                  </h3>
                  <div style={styles.priceRow}>
                    <span style={styles.productPrice}>
                      {item.gia?.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <button style={styles.detailBtn}>Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. CTA TỰ BUILD PC (HERO SECTION) */}
        <div style={styles.buildCtaWrapper}>
          <div style={styles.buildCtaContent}>
            <h2 style={styles.buildCtaTitle}>
              TỰ TAY XÂY DỰNG CỖ MÁY TRONG MƠ
            </h2>
            <p style={styles.buildCtaDesc}>
              Công cụ Build PC thông minh giúp bạn kiểm tra tính tương thích và
              quản lý ngân sách dễ dàng.
            </p>
            <button
              onClick={() => navigate("/build")}
              style={styles.buildCtaBtn}
            >
              🚀 Trải nghiệm Build PC ngay
            </button>
          </div>
        </div>

        {/* 4. COMBO ĐỀ XUẤT */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>PC Build Sẵn Tối Ưu</h2>
          <span style={styles.sectionSubtitle}>
            Lắp ráp bởi chuyên gia - Cắm là chạy
          </span>
        </div>

        <div style={styles.comboGrid}>
          {combos.map((combo) => (
            <div key={combo.ten} style={styles.comboCard}>
              <div style={styles.comboBadge}>{combo.tag}</div>
              <h3 style={styles.comboTitle}>{combo.ten}</h3>
              <p style={styles.comboDesc}>{combo.moTa}</p>
              <div style={styles.comboPriceWrapper}>
                <span style={styles.comboPriceLabel}>Giá trọn bộ:</span>
                <span style={styles.comboPrice}>
                  {combo.gia.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <button style={styles.buyNowBtn}>Mua Ngay</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS (Hệ thống màu sắc và layout chuẩn mực)
const styles = {
  pageBackground: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    paddingBottom: "60px",
  },
  container: { maxWidth: "1280px", margin: "0 auto", padding: "0 20px" },

  // Headers
  sectionHeader: {
    margin: "50px 0 25px 0",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "10px",
  },
  sectionTitle: {
    fontSize: "24px",
    color: "#0f172a",
    margin: "0 0 5px 0",
    textTransform: "uppercase",
    fontWeight: "800",
  },
  sectionSubtitle: { color: "#64748b", fontSize: "15px" },

  // Categories
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  categoryCard: {
    backgroundColor: "#ffffff",
    padding: "20px 15px",
    borderRadius: "16px",
    textAlign: "center",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  categoryIcon: { fontSize: "32px", marginBottom: "10px" },
  categoryName: { fontSize: "14px", fontWeight: "600", color: "#334155" },

  // Products
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "24px",
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
  },
  imageBox: {
    padding: "20px",
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "180px",
  },
  productImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  productInfo: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  productName: {
    fontSize: "15px",
    color: "#0f172a",
    margin: "0 0 10px 0",
    height: "44px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    lineHeight: "1.4",
  },
  priceRow: { marginTop: "auto", marginBottom: "15px" },
  productPrice: { color: "#ef4444", fontWeight: "800", fontSize: "18px" },
  detailBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },

  // Build PC Call to Action
  buildCtaWrapper: {
    marginTop: "60px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "3px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  buildCtaContent: {
    backgroundColor: "#1e293b",
    borderRadius: "21px",
    padding: "50px 30px",
    textAlign: "center",
    backgroundImage:
      "radial-gradient(circle at top right, rgba(37, 99, 235, 0.2), transparent)",
  },
  buildCtaTitle: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "900",
    margin: "0 0 15px 0",
  },
  buildCtaDesc: {
    color: "#94a3b8",
    fontSize: "18px",
    maxWidth: "600px",
    margin: "0 auto 30px",
    lineHeight: "1.6",
  },
  buildCtaBtn: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    padding: "16px 40px",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.4)",
  },

  // Combos
  comboGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
  },
  comboCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  comboBadge: {
    position: "absolute",
    top: "-12px",
    left: "30px",
    backgroundColor: "#f59e0b",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  comboTitle: {
    fontSize: "22px",
    color: "#0f172a",
    margin: "15px 0 10px 0",
    fontWeight: "800",
  },
  comboDesc: {
    color: "#64748b",
    fontSize: "15px",
    margin: "0 0 20px 0",
    lineHeight: "1.5",
  },
  comboPriceWrapper: {
    marginTop: "auto",
    backgroundColor: "#f8fafc",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  comboPriceLabel: { color: "#475569", fontSize: "14px", fontWeight: "600" },
  comboPrice: { color: "#ef4444", fontSize: "22px", fontWeight: "900" },
  buyNowBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default TrangChu;
