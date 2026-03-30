import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../../components/PromoBanner";
import FlashSale from "../../components/FlashSale";

// IMPORT CONTEXT
import { CartContext } from "../../context/CartContext"; 

const TrangChu = () => {
  const navigate = useNavigate();
  
  // Lấy hàm addToCart từ Context - Hàm này đã bao gồm logic hiện Toast ở trên cao
  const { addToCart } = useContext(CartContext); 

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

  useEffect(() => {
    const fetchSanPhams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/san-pham");
        setSanPhams(res.data.slice(0, 8)); 
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm.");
        setIsLoading(false);
      }
    };
    fetchSanPhams();
  }, []);

  // HÀM XỬ LÝ CLICK: Gọi trực tiếp từ Context
  const handleAddToCart = (e, item) => {
    e.stopPropagation(); // Không cho nhảy vào trang chi tiết khi bấm nút giỏ hàng
    if (addToCart) {
      // Truyền item vào, Context sẽ tự lo việc hiện Toast "kính mờ" phía trên
      addToCart(item, 1); 
    }
  };

  return (
    <div style={styles.pageBackground}>
      {/* Hiệu ứng Hover & Animation toàn cục */}
      <style>
        {`
          .product-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #e2e8f0; }
          .product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-color: #3b82f6; }
          .category-item { transition: all 0.2s; cursor: pointer; }
          .category-item:hover { background: #eff6ff; transform: scale(1.05); color: #2563eb; }
          .btn-cart-main:hover { background-color: #2563eb !important; color: white !important; transform: scale(1.1); }
          .btn-detail-main:hover { background-color: #f1f5f9 !important; }
        `}
      </style>

      <div style={styles.container}>
        <PromoBanner />
        <FlashSale />

        {/* SECTION DANH MỤC - Thiết kế tối giản */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Danh mục linh kiện</h2>
          <div style={styles.underline}></div>
        </div>
        <div style={styles.categoryGrid}>
          {categories.map((cat) => (
            <div key={cat.id} className="category-item" style={styles.categoryCard} onClick={() => navigate("/build")}>
              <div style={styles.categoryIcon}>{cat.icon}</div>
              <div style={styles.categoryName}>{cat.name}</div>
            </div>
          ))}
        </div>

        {/* SECTION SẢN PHẨM MỚI */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Sản phẩm mới nhất</h2>
          <div style={styles.underline}></div>
        </div>

        {isLoading ? (
          <div style={styles.loadingText}>Đang tải sản phẩm...</div>
        ) : (
          <div style={styles.productGrid}>
            {sanPhams.map((item) => (
              <div key={item._id} className="product-card" style={styles.productCard} onClick={() => navigate(`/san-pham/${item._id}`)}>
                <div style={styles.imageBox}>
                  <img 
                    src={item.anh || item.hinhAnh} 
                    alt={item.ten} 
                    style={styles.productImg} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200' }} 
                  />
                </div>
                
                <div style={styles.productInfo}>
                  <div style={styles.typeTag}>{item.loai}</div>
                  <h3 style={styles.productName}>{item.ten}</h3>
                  
                  <div style={styles.priceRow}>
                    <div style={styles.productPrice}>{item.gia?.toLocaleString()} đ</div>
                    <div style={styles.oldPrice}>{(item.gia * 1.1).toLocaleString()} đ</div>
                  </div>

                  <div style={styles.actionRow}>
                    <button 
                       className="btn-detail-main" 
                       style={styles.btnDetail}
                    >
                      Chi tiết
                    </button>
                    <button 
                      className="btn-cart-main" 
                      style={styles.btnCart} 
                      onClick={(e) => handleAddToCart(e, item)}
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BANNER BUILD PC - Chuyên nghiệp hơn */}
        <div style={styles.buildBanner}>
          <div style={styles.buildOverlay}>
            <h2 style={styles.buildTitle}>BẠN MUỐN TỰ BUILD PC THEO Ý MÌNH?</h2>
            <p style={styles.buildDesc}>Công cụ của chúng tôi giúp bạn chọn linh kiện chuẩn xác, tự động kiểm tra Socket và công suất nguồn.</p>
            <button style={styles.buildBtn} onClick={() => navigate("/build")}>
               BẮT ĐẦU BUILD MÁY NGAY 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageBackground: { backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" },
  container: { maxWidth: "1300px", margin: "0 auto", padding: "0 20px" },
  
  sectionHeader: { marginTop: "60px", marginBottom: "30px", textAlign: "center" },
  sectionTitle: { fontSize: "28px", fontWeight: "800", color: "#1e293b", marginBottom: "10px" },
  underline: { width: "60px", height: "4px", backgroundColor: "#2563eb", margin: "0 auto", borderRadius: "2px" },

  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" },
  categoryCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "16px", textAlign: "center", border: "1px solid #f1f5f9", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  categoryIcon: { fontSize: "32px", marginBottom: "10px" },
  categoryName: { fontSize: "14px", fontWeight: "700", color: "#475569" },

  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" },
  productCard: { backgroundColor: "#fff", borderRadius: "20px", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" },
  imageBox: { height: "240px", padding: "20px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  productImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  
  productInfo: { padding: "20px", flex: 1, display: "flex", flexDirection: "column" },
  typeTag: { fontSize: "11px", fontWeight: "800", color: "#2563eb", textTransform: "uppercase", marginBottom: "10px" },
  productName: { fontSize: "16px", fontWeight: "700", color: "#1e293b", height: "45px", overflow: "hidden", marginBottom: "15px", lineHeight: "1.4" },
  
  priceRow: { marginBottom: "20px" },
  productPrice: { color: "#ef4444", fontSize: "20px", fontWeight: "900" },
  oldPrice: { color: "#94a3b8", fontSize: "14px", textDecoration: "line-through" },

  actionRow: { display: "flex", gap: "10px", marginTop: "auto" },
  btnDetail: { flex: 1, padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#fff", fontWeight: "700", cursor: "pointer", transition: "0.2s" },
  btnCart: { width: "50px", height: "48px", border: "none", borderRadius: "12px", background: "#f1f5f9", fontSize: "20px", cursor: "pointer", transition: "0.3s" },

  buildBanner: { 
    marginTop: "80px", 
    borderRadius: "30px", 
    overflow: "hidden", 
    backgroundImage: "url('https://img.freepik.com/free-photo/view-illuminated-neon-gaming-keyboard-setup_23-2149529350.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  buildOverlay: { backgroundColor: "rgba(15, 23, 42, 0.85)", padding: "80px 40px", textAlign: "center", color: "#fff" },
  buildTitle: { fontSize: "36px", fontWeight: "900", marginBottom: "20px" },
  buildDesc: { fontSize: "18px", color: "#cbd5e1", maxWidth: "700px", margin: "0 auto 40px" },
  buildBtn: { backgroundColor: "#2563eb", color: "#fff", padding: "18px 40px", border: "none", borderRadius: "15px", fontSize: "18px", fontWeight: "800", cursor: "pointer", boxShadow: "0 10px 20px rgba(37, 99, 235, 0.3)" },
  loadingText: { textAlign: "center", padding: "100px", color: "#64748b", fontSize: "18px" }
};

export default TrangChu;