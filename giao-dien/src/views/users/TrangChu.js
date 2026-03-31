import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../../components/PromoBanner";
import FlashSale from "../../components/FlashSale";

// IMPORT CONTEXT
import { CartContext } from "../../context/CartContext"; 

const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%3E.bg%7Bfill%3A%23f3f4f6%3B%7D.text%7Bfill%3A%239ca3af%3Bfont-family%3A%27Arial%27%2Csans-serif%3Bfont-size%3A18px%3Bfont-weight%3Abold%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Crect%20class%3D%22bg%22%20width%3D%22200%22%20height%3D%22200%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20class%3D%22text%22%3ESTORE%20BUILDPC%3C%2Ftext%3E%3C%2Fsvg%3E";

const formatImageUrl = (url) => {
  if (!url) return fallbackImage;
  if (url.startsWith('/uploads')) return `${process.env.REACT_APP_API_URL.replace('/api', '')}${url}`;
  return url;
};

const ProductCard = ({ item, navigate, handleAddToCart }) => (
  <div className="product-card" style={styles.productCard} onClick={() => navigate(`/san-pham/${item._id || item.id}`)}>
    <div style={styles.imageBox}>
      <img 
        src={formatImageUrl(item.anh || item.hinhAnh)} 
        alt={item.ten} 
        style={styles.productImg} 
        onError={(e) => { e.target.src = fallbackImage }} 
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
        <button className="btn-detail-main" style={styles.btnDetail} onClick={(e) => { e.stopPropagation(); navigate(`/san-pham/${item._id || item.id}`); }}>
          Chi tiết
        </button>
        <button className="btn-cart-main" style={styles.btnCart} onClick={(e) => handleAddToCart(e, item)}>
          🛒
        </button>
      </div>
    </div>
  </div>
);

const TrangChu = () => {
  const navigate = useNavigate();
  
  // Lấy hàm addToCart từ Context - Hàm này đã bao gồm logic hiện Toast ở trên cao
  const { addToCart } = useContext(CartContext); 

  const [sanPhams, setSanPhams] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: "CPU", icon: "🧠", name: "Vi xử lý (CPU)" },
    { id: "Mainboard", icon: "🎛️", name: "Bo mạch chủ" },
    { id: "RAM", icon: "💾", name: "RAM" },
    { id: "VGA", icon: "🎮", name: "Card màn hình" },
    { id: "SSD", icon: "⚡", name: "Ổ cứng SSD" },
    { id: "HDD", icon: "💽", name: "Ổ cứng HDD" },
    { id: "PSU", icon: "🔌", name: "Nguồn (PSU)" },
    { id: "Case", icon: "🖥️", name: "Vỏ máy (Case)" },
    { id: "Tản nhiệt", icon: "❄️", name: "Tản nhiệt" },
    { id: "Màn hình", icon: "📺", name: "Màn hình" },
    { id: "Bàn phím", icon: "⌨️", name: "Bàn phím" },
    { id: "Chuột", icon: "🖱️", name: "Chuột" },
    { id: "Tai nghe", icon: "🎧", name: "Tai nghe" },
    { id: "Loa", icon: "🔊", name: "Loa máy tính" },
  ];

  useEffect(() => {
    const fetchSanPhams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/san-pham");
        setSanPhams(res.data); 
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm.");
        setIsLoading(false);
      }
    };
    fetchSanPhams();

    // Lấy danh sách sản phẩm đã xem từ LocalStorage
    const storedViewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    setViewedProducts(storedViewed);
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
            <div key={cat.id} className="category-item" style={styles.categoryCard} onClick={() => navigate(`/san-pham?cat=${cat.id}`)}>
              <div style={styles.categoryIcon}>{cat.icon}</div>
              <div style={styles.categoryName}>{cat.name}</div>
            </div>
          ))}
        </div>

        {/* SECTION SẢN PHẨM KHÁCH VỪA XEM */}
        {viewedProducts.length > 0 && (
          <div style={styles.tieredSection}>
            <div style={styles.tieredHeaderWhite}>
              <h2 style={styles.tieredTitleDark}>🕒 Sản phẩm vừa xem</h2>
            </div>
            <div style={styles.productGrid}>
              {viewedProducts.map(item => <ProductCard key={item._id || item.id} item={item} navigate={navigate} handleAddToCart={handleAddToCart} />)}
            </div>
          </div>
        )}

        {isLoading ? (
          <div style={styles.loadingText}>Đang tải sản phẩm...</div>
        ) : (
          <>
            {/* TẦNG 1: MÁY TÍNH ĐỂ BÀN (Lọc qua Case làm cấu hình giả lập PC) */}
            {sanPhams.filter(p => ["Case"].includes(p.loai)).length > 0 && (
              <div style={styles.tieredSection}>
                <div style={styles.tieredHeaderBlue}>
                  <h2 style={styles.tieredTitleWhite}>🖥️ MÁY TÍNH & PC Build Sẵn</h2>
                  <span className="view-more-btn-white" style={styles.tieredViewAllWhite} onClick={() => navigate('/san-pham?cat=Case')}>Xem tất cả &gt;</span>
                </div>
                <div style={styles.productGrid}>
                  {sanPhams.filter(p => ["Case"].includes(p.loai)).slice(0, 8).map(item => (
                     <ProductCard key={item._id} item={item} navigate={navigate} handleAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            )}

            {/* TẦNG 2: LINH KIỆN MÁY TÍNH */}
            {sanPhams.filter(p => ["CPU", "Mainboard", "RAM", "VGA", "SSD", "HDD", "PSU", "Tản nhiệt"].includes(p.loai)).length > 0 && (
              <div style={styles.tieredSection}>
                <div style={styles.tieredHeaderTeal}>
                  <h2 style={styles.tieredTitleWhite}>⚙️ LINH KIỆN MÁY TÍNH</h2>
                  <span className="view-more-btn-white" style={styles.tieredViewAllWhite} onClick={() => navigate('/san-pham')}>Xem tất cả &gt;</span>
                </div>
                <div style={styles.productGrid}>
                  {sanPhams.filter(p => ["CPU", "Mainboard", "RAM", "VGA", "SSD", "HDD", "PSU", "Tản nhiệt"].includes(p.loai)).slice(0, 8).map(item => (
                     <ProductCard key={item._id} item={item} navigate={navigate} handleAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            )}

            {/* TẦNG 3: MÀN HÌNH & PHỤ KIỆN */}
            {sanPhams.filter(p => ["Màn hình", "Bàn phím", "Chuột", "Tai nghe", "Loa"].includes(p.loai)).length > 0 && (
              <div style={styles.tieredSection}>
                <div style={styles.tieredHeaderOrange}>
                  <h2 style={styles.tieredTitleWhite}>🎮 MÀN HÌNH & PHỤ KIỆN GEAR</h2>
                  <span className="view-more-btn-white" style={styles.tieredViewAllWhite} onClick={() => navigate('/san-pham')}>Xem tất cả &gt;</span>
                </div>
                <div style={styles.productGrid}>
                  {sanPhams.filter(p => ["Màn hình", "Bàn phím", "Chuột", "Tai nghe", "Loa"].includes(p.loai)).slice(0, 8).map(item => (
                     <ProductCard key={item._id} item={item} navigate={navigate} handleAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            )}
            
            {/* TẦNG SẢN PHẨM TỔNG HỢP MỚI NHẤT (Nếu có đồ không thuộc mấy loại trên) */}
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Sản phẩm mới nhất</h2>
              <div style={styles.underline}></div>
            </div>
            <div style={styles.productGrid}>
               {sanPhams.slice(0, 8).map((item) => (
                  <ProductCard key={item._id} item={item} navigate={navigate} handleAddToCart={handleAddToCart} />
               ))}
            </div>
          </>
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

  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "15px" },
  categoryCard: { backgroundColor: "#fff", padding: "18px 10px", borderRadius: "20px", textAlign: "center", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
  categoryIcon: { fontSize: "36px", marginBottom: "12px" },
  categoryName: { fontSize: "12px", fontWeight: "700", color: "#475569" },

  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" },
  productCard: { backgroundColor: "#fff", borderRadius: "24px", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid transparent" },
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
  loadingText: { textAlign: "center", padding: "100px", color: "#64748b", fontSize: "18px" },

  // STYLE KHỐI PHÂN TẦNG (SECTIONING)
  tieredSection: { backgroundColor: "#fff", borderRadius: "20px", padding: "20px", marginBottom: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
  tieredHeaderBlue: { backgroundColor: "#2563eb", padding: "15px 25px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  tieredHeaderTeal: { backgroundColor: "#0d9488", padding: "15px 25px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  tieredHeaderOrange: { backgroundColor: "#ea580c", padding: "15px 25px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  tieredHeaderWhite: { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "15px 25px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  
  tieredTitleWhite: { color: "#fff", margin: 0, fontSize: "22px", fontWeight: "900", letterSpacing: "0.5px" },
  tieredTitleDark: { color: "#1e293b", margin: 0, fontSize: "20px", fontWeight: "800" },
  
  tieredViewAllWhite: { color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600", border: "1px solid rgba(255,255,255,0.4)", padding: "8px 18px", borderRadius: "8px", transition: "0.2s" },
};

export default TrangChu;