import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../../components/PromoBanner";
import FlashSale from "../../components/FlashSale";

import { CartContext } from "../../context/CartContext";

const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%3E.bg%7Bfill%3A%23f3f4f6%3B%7D.text%7Bfill%3A%239ca3af%3Bfont-family%3A%27Arial%27%2Csans-serif%3Bfont-size%3A18px%3Bfont-weight%3Abold%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Crect%20class%3D%22bg%22%20width%3D%22200%22%20height%3D%22200%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20class%3D%22text%22%3ESTORE%20BUILDPC%3C%2Ftext%3E%3C%2Fsvg%3E";

const formatImageUrl = (url) => {
  if (!url) return fallbackImage;
  if (url.startsWith('/uploads')) return `${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000'}${url}`;
  return url;
};

// Component thẻ sản phẩm mới (Theo thiết kế GearVN/Phong Vũ)
const ProductCard = ({ item, navigate, handleAddToCart, isFavorite, toggleFavorite }) => {
  const words = item.ten.split(' ');
  let brand = "OEM";
  if (words.length > 1) {
    const w1 = words[0].toUpperCase();
    if (["CPU", "VGA", "RAM", "SSD", "HDD", "PSU", "MAINBOARD", "CASE", "LAPTOP", "CHUỘT", "BÀN", "CÁP"].includes(w1)) {
       brand = words[1].toUpperCase();
       if(w1 === "CHUỘT") brand = words.length > 2 && words[1].toUpperCase()==="GAMING" ? words[2].toUpperCase() : words[1].toUpperCase();
       if(w1 === "BÀN" && words[1].toUpperCase()==="PHÍM") brand = words[2]?.toUpperCase() || "OEM";
    } else {
       brand = w1;
    }
  }

  // Tỷ lệ giả lập giảm giá
  const discountRate = 0.18;
  const oldPrice = Math.round(item.gia * (1 + discountRate));
  const saveAmount = oldPrice - item.gia;
  
  return (
    <div className="product-card" style={styles.productCard} onClick={() => navigate(`/san-pham/${item._id || item.id}`)}>
      <div style={styles.imageBox}>
        <img 
          src={formatImageUrl(item.anh || item.hinhAnh)} 
          alt={item.ten} 
          style={styles.productImg} 
          onError={(e) => { e.target.src = fallbackImage }} 
        />
        <div style={styles.saveBadge}>
          <div style={styles.saveBadgeTop}>TIẾT KIỆM</div>
          <div style={styles.saveBadgeBottom}>{saveAmount.toLocaleString()} ₫</div>
        </div>
      </div>
      
      <div style={styles.productInfo}>
        <div style={styles.brandRow}>
          <span style={styles.brandName}>{brand}</span>
          <span className="heart-icon" style={isFavorite ? styles.heartActive : styles.heartNormal} onClick={(e) => toggleFavorite(e, item._id || item.id)}>
            {isFavorite ? "💙" : "♡"}
          </span>
        </div>
        
        <h3 style={styles.productName} title={item.ten}>{item.ten}</h3>
        
        <div style={styles.priceContainer}>
          <div style={styles.productPrice}>{item.gia?.toLocaleString()} ₫</div>
          <div style={styles.oldPriceBlock}>
            <span style={styles.oldPrice}>{oldPrice.toLocaleString()} ₫</span>
            <span style={styles.discountPercent}>-{Math.round(discountRate * 100)}%</span>
          </div>
        </div>
        
        <div style={styles.actionRow}>
          <button className="btn-add-cart-new" style={styles.btnCartNew} onClick={(e) => handleAddToCart(e, item)}>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Component Section có nút scroll ────────────────────────────────────────
const ProductSection = ({ headerStyle, title, viewAllUrl, navigate, children }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  return (
    <div style={sectionStyles.tieredSection}>
      <div style={headerStyle}>
        <h2 style={sectionStyles.tieredTitle}>{title}</h2>
        <span className="view-more-text" style={sectionStyles.viewMoreText}
          onClick={() => navigate(viewAllUrl)}>Xem tất cả &gt;</span>
      </div>
      <div style={sectionStyles.scrollWrapper}>
        <button className="scroll-btn scroll-btn-left" style={sectionStyles.scrollBtn}
          onClick={() => scroll(-1)}>&#8249;</button>
        <div ref={scrollRef} className="horizontal-scroll">
          {children}
        </div>
        <button className="scroll-btn scroll-btn-right" style={sectionStyles.scrollBtn}
          onClick={() => scroll(1)}>&#8250;</button>
      </div>
    </div>
  );
};

const sectionStyles = {
  tieredSection: { backgroundColor: "#fff", marginBottom: "30px", overflow: "hidden" },
  tieredTitle: { color: "#fff", margin: 0, fontSize: "18px", fontWeight: "800", textTransform: "uppercase" },
  viewMoreText: { color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600", padding: "4px 8px" },
  scrollWrapper: { position: "relative", display: "flex", alignItems: "stretch" },
  scrollBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    cursor: "pointer",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    padding: 0,
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const TrangChu = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); 

  const [sanPhams, setSanPhams] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSanPhams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/san-pham");
        setSanPhams(res.data); 
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };
    fetchSanPhams();

    const storedViewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    setViewedProducts(storedViewed);

    const savedFavs = JSON.parse(localStorage.getItem('savedFavs') || '[]');
    setFavorites(savedFavs);
  }, []);

  const handleAddToCart = (e, item) => {
    e.stopPropagation(); 
    if (addToCart) addToCart(item, 1); 
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    let newFavs = [...favorites];
    if (newFavs.includes(id)) {
      newFavs = newFavs.filter(favId => favId !== id);
    } else {
      newFavs.push(id);
    }
    setFavorites(newFavs);
    localStorage.setItem('savedFavs', JSON.stringify(newFavs));
  };

  const isPhim = (p) => {
    const c = (p.idDanhMuc?.ten || p.loai || "").toLowerCase();
    return c.includes("phím") || c.includes("keyboard");
  };
  const isChuot = (p) => {
    const c = (p.idDanhMuc?.ten || p.loai || "").toLowerCase();
    return c.includes("chuột") || c.includes("mouse");
  };
  const isTaiNghe = (p) => {
    const c = (p.idDanhMuc?.ten || p.loai || "").toLowerCase();
    return c.includes("tai nghe") || c.includes("headset") || c.includes("headphone");
  };
  const isCore = (p) => {
    const c = (p.idDanhMuc?.ten || p.loai || "").toLowerCase();
    return c.includes("cpu") || c.includes("vi xử lý") || c.includes("mainboard") || c.includes("bo mạch") || c.includes("ram") || c.includes("bộ nhớ") || c.includes("vga") || c.includes("card") || c.includes("ssd") || c.includes("hdd") || c.includes("ổ cứng") || c.includes("psu") || c.includes("nguồn") || c.includes("tản");
  };
  const isCase = (p) => {
    const c = (p.idDanhMuc?.ten || p.loai || "").toLowerCase();
    return c.includes("case") || c.includes("vỏ");
  };

  const phimProducts  = sanPhams.filter(isPhim);
  const chuotProducts = sanPhams.filter(isChuot);
  const taiNgheProducts = sanPhams.filter(isTaiNghe);
  const monitorProducts = sanPhams.filter(p => {
    const c = (p.idDanhMuc?.ten || p.loai || "").toLowerCase();
    return (c.includes("màn hình") || c.includes("monitor")) && !c.includes("vga") && !c.includes("card");
  });
  const coreProducts = sanPhams.filter(isCore);
  const buildProducts = sanPhams.filter(isCase);

  return (
    <div style={styles.pageBackground}>
      <style>
        {`
          .product-card { 
             transition: all 0.3s ease; 
             border: 1px solid #e5e7eb; 
             background: #fff;
             height: 100%;
          }
          .product-card:hover { 
             transform: translateY(-2px); 
             box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); 
             border-color: #3b82f6; 
          }
          
          .btn-add-cart-new {
             transition: all 0.2s ease;
             background-color: transparent;
             color: #2563eb;
             border: 1px solid #2563eb;
             outline: none;
          }
          .btn-add-cart-new:hover {
             background-color: #2563eb;
             color: #ffffff;
             cursor: pointer;
          }
          
          .heart-icon {
             transition: transform 0.2s;
             cursor: pointer;
          }
          .heart-icon:hover {
             transform: scale(1.2);
          }

          .horizontal-scroll {
             display: flex;
             overflow-x: auto;
             scroll-snap-type: x mandatory;
             padding: 15px 46px 25px 46px;
             gap: 15px;
             scrollbar-width: none;
             -ms-overflow-style: none;
             flex: 1;
          }
          .horizontal-scroll::-webkit-scrollbar {
             display: none;
          }
          .p-card-wrap {
             scroll-snap-align: start;
             flex: 0 0 calc(20% - 12px);
             min-width: 230px;
             max-width: 250px;
          }

          @media (max-width: 1024px) {
             .p-card-wrap { flex: 0 0 calc(25% - 12px); }
          }
          @media (max-width: 768px) {
             .p-card-wrap { flex: 0 0 calc(33.333% - 10px); min-width: 200px; }
          }
          @media (max-width: 480px) {
             .p-card-wrap { flex: 0 0 calc(50% - 8px); min-width: 160px; }
          }
          
          .view-more-text:hover { opacity: 0.8; text-decoration: underline; }

          .scroll-btn {
             transition: all 0.2s ease;
          }
          .scroll-btn:hover {
             background: #2563eb !important;
             color: #fff !important;
             box-shadow: 0 4px 14px rgba(37,99,235,0.4) !important;
             transform: translateY(-50%) scale(1.1) !important;
          }
          .scroll-btn-left  { left: 6px !important; }
          .scroll-btn-right { right: 6px !important; }
        `}
      </style>

      <div style={styles.container}>
        <PromoBanner />
        <FlashSale />

        {isLoading ? (
          <div style={styles.loadingText}>Đang tải danh sách linh kiện...</div>
        ) : (
          <>
            {/* PHÍM CƠ GAMING */}
            {phimProducts.length > 0 && (
              <ProductSection headerStyle={styles.headerPhim} title="🎹 PHÍM CƠ GAMING" viewAllUrl="/san-pham?cat=Bàn phím" navigate={navigate}>
                {phimProducts.map(item => (
                  <div key={item._id || item.id} className="p-card-wrap">
                    <ProductCard item={item} navigate={navigate} handleAddToCart={handleAddToCart} isFavorite={favorites.includes(item._id || item.id)} toggleFavorite={toggleFavorite} />
                  </div>
                ))}
              </ProductSection>
            )}

            {/* CHUỘT GAMING */}
            {chuotProducts.length > 0 && (
              <ProductSection headerStyle={styles.headerChuot} title="🖱️ CHUỘT GAMING" viewAllUrl="/san-pham?cat=Chuột" navigate={navigate}>
                {chuotProducts.map(item => (
                  <div key={item._id || item.id} className="p-card-wrap">
                    <ProductCard item={item} navigate={navigate} handleAddToCart={handleAddToCart} isFavorite={favorites.includes(item._id || item.id)} toggleFavorite={toggleFavorite} />
                  </div>
                ))}
              </ProductSection>
            )}

            {/* TAI NGHE GAMING */}
            {taiNgheProducts.length > 0 && (
              <ProductSection headerStyle={styles.headerTaiNghe} title="🎧 TAI NGHE GAMING" viewAllUrl="/san-pham?cat=Tai nghe" navigate={navigate}>
                {taiNgheProducts.map(item => (
                  <div key={item._id || item.id} className="p-card-wrap">
                    <ProductCard item={item} navigate={navigate} handleAddToCart={handleAddToCart} isFavorite={favorites.includes(item._id || item.id)} toggleFavorite={toggleFavorite} />
                  </div>
                ))}
              </ProductSection>
            )}

            {/* MÀN HÌNH */}
            {monitorProducts.length > 0 && (
              <ProductSection headerStyle={styles.headerMonitor} title="🖥️ MÀN HÌNH MÁY TÍNH" viewAllUrl="/san-pham?cat=Màn hình" navigate={navigate}>
                {monitorProducts.map(item => (
                  <div key={item._id || item.id} className="p-card-wrap">
                    <ProductCard item={item} navigate={navigate} handleAddToCart={handleAddToCart} isFavorite={favorites.includes(item._id || item.id)} toggleFavorite={toggleFavorite} />
                  </div>
                ))}
              </ProductSection>
            )}

            {/* LINH KIỆN */}
            {coreProducts.length > 0 && (
              <ProductSection headerStyle={styles.headerCore} title="LINH KIỆN MÁY TÍNH & NÂNG CẤP" viewAllUrl="/san-pham" navigate={navigate}>
                {coreProducts.map(item => (
                  <div key={item._id || item.id} className="p-card-wrap">
                    <ProductCard item={item} navigate={navigate} handleAddToCart={handleAddToCart} isFavorite={favorites.includes(item._id || item.id)} toggleFavorite={toggleFavorite} />
                  </div>
                ))}
              </ProductSection>
            )}

            {/* PC BUILD & VỎ THÙNG */}
            {buildProducts.length > 0 && (
              <ProductSection headerStyle={styles.headerBuild} title="PC BUILD SẴN & VỎ THÙNG MÁY" viewAllUrl="/san-pham?cat=Case" navigate={navigate}>
                {buildProducts.map(item => (
                  <div key={item._id || item.id} className="p-card-wrap">
                    <ProductCard item={item} navigate={navigate} handleAddToCart={handleAddToCart} isFavorite={favorites.includes(item._id || item.id)} toggleFavorite={toggleFavorite} />
                  </div>
                ))}
              </ProductSection>
            )}
          </>
        )}

        {/* SECTION SẢN PHẨM KHÁCH VỪA XEM (Dạng Lưới / Ngang) */}
        {viewedProducts.length > 0 && (
          <div style={styles.tieredSectionBoxless}>
            <div style={styles.headerViewed}>
              <h2 style={styles.tieredTitleDark}>Sản phẩm vừa xem</h2>
            </div>
            <div className="horizontal-scroll" style={{ paddingLeft: 0, paddingRight: 0 }}>
              {viewedProducts.map(item => (
                 <div key={item._id || item.id} className="p-card-wrap">
                    <ProductCard item={item} navigate={navigate} handleAddToCart={handleAddToCart} isFavorite={favorites.includes(item._id || item.id)} toggleFavorite={toggleFavorite} />
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* BANNER BUILD PC TÙY CHỈNH */}
        <div style={styles.buildBanner}>
          <div style={styles.buildOverlay}>
            <h2 style={styles.buildTitle}>BẠN MUỐN TỰ BUILD PC THEO Ý MÌNH?</h2>
            <p style={styles.buildDesc}>Công cụ của chúng tôi giúp bạn chọn linh kiện chuẩn xác, tự động kiểm tra Socket và công suất nguồn tương thích 100%.</p>
            <button style={styles.buildBtn} onClick={() => navigate("/build")}>
               BẮT ĐẦU CHỌN LINH KIỆN 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageBackground: { backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "100px" },
  container: { maxWidth: "1280px", margin: "0 auto", padding: "0 10px" },

  // STYLE KHỐI PHÂN TẦNG ĐÚNG CHUẨN MẪU ẢNH
  tieredSectionBoxless: { backgroundColor: "transparent", marginBottom: "30px", marginTop: "40px" },

  headerPhim:    { backgroundColor: "#a855f7", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerChuot:   { backgroundColor: "#10b981", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerTaiNghe: { backgroundColor: "#f59e0b", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerMonitor: { backgroundColor: "#06b6d4", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerCore:    { backgroundColor: "#60a5fa", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerBuild:   { backgroundColor: "#cbd5e1", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerViewed:  { padding: "12px 0px", borderBottom: "2px solid #e5e7eb", marginBottom: "10px" },

  tieredTitleDark: { color: "#111827", margin: 0, fontSize: "20px", fontWeight: "700" },

  // PRODUCT CARD STYLES
  productCard: { display: "flex", flexDirection: "column" },
  imageBox: { height: "220px", position: "relative", padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" },
  productImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  
  saveBadge: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
    color: "#fff",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    zIndex: 2
  },
  saveBadgeTop: { fontSize: "9px", fontWeight: "800", textAlign: "center", padding: "3px 6px 1px", backgroundColor: "rgba(0,0,0,0.1)" },
  saveBadgeBottom: { fontSize: "12px", fontWeight: "900", textAlign: "center", padding: "2px 6px 4px" },

  productInfo: { padding: "15px", flex: 1, display: "flex", flexDirection: "column", borderTop: "1px solid #f3f4f6" },
  
  brandRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  brandName: { fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase" },
  heartNormal: { color: "#9ca3af", fontSize: "16px" },
  heartActive: { color: "#3b82f6", fontSize: "16px" },

  // Tên SP giới hạn 2 dòng (line-clamp)
  productName: { 
    fontSize: "14px", fontWeight: "500", color: "#1f2937", margin: "0 0 10px 0", 
    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "40px", lineHeight: "1.4" 
  },
  
  priceContainer: { marginBottom: "15px", marginTop: "auto" },
  productPrice: { color: "#1e3a8a", fontSize: "18px", fontWeight: "800", marginBottom: "2px" },
  oldPriceBlock: { display: "flex", alignItems: "center", gap: "10px" },
  oldPrice: { color: "#9ca3af", fontSize: "12px", textDecoration: "line-through" },
  discountPercent: { color: "#ef4444", fontSize: "11px", fontWeight: "700" },

  actionRow: { marginTop: "5px" },
  btnCartNew: { 
    width: "100%", padding: "10px 0", borderRadius: "6px",
    fontSize: "13px", fontWeight: "700", textAlign: "center",
  },

  loadingText: { textAlign: "center", padding: "100px", color: "#64748b", fontSize: "18px" },

  buildBanner: { 
    marginTop: "60px", 
    borderRadius: "20px", 
    overflow: "hidden", 
    backgroundImage: "url('https://img.freepik.com/free-photo/view-illuminated-neon-gaming-keyboard-setup_23-2149529350.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  buildOverlay: { backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "60px 20px", textAlign: "center", color: "#fff" },
  buildTitle: { fontSize: "28px", fontWeight: "900", marginBottom: "15px" },
  buildDesc: { fontSize: "16px", color: "#cbd5e1", maxWidth: "600px", margin: "0 auto 30px" },
  buildBtn: { backgroundColor: "#2563eb", color: "#fff", padding: "15px 30px", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "800", cursor: "pointer" },
};

export default TrangChu;