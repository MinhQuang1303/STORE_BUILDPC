import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../../components/PromoBanner";
import FlashSale from "../../components/FlashSale";
import { CartContext } from "../../context/CartContext"; 

const TrangChu = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); 
  const [sanPhams, setSanPhams] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Danh sách thương hiệu kèm mã màu đặc trưng của hãng
  const brandList = [
    { name: 'Intel', color: '#0071C5' },
    { name: 'AMD', color: '#ED1C24' },
    { name: 'NVIDIA', color: '#76B900' },
    { name: 'ASUS', color: '#00539B' },
    { name: 'MSI', color: '#FF0000' },
    { name: 'Gigabyte', color: '#0D448F' },
    { name: 'Samsung', color: '#1428A0' },
    { name: 'Corsair', color: '#FDB913' }
  ];

  const categories = [
    { id: "CPU", icon: "https://cdn-icons-png.flaticon.com/512/908/908424.png", name: "Vi xử lý (CPU)" },
    { id: "VGA", icon: "https://cdn-icons-png.flaticon.com/512/3408/3408506.png", name: "Card đồ họa" },
    { id: "Main", icon: "https://cdn-icons-png.flaticon.com/512/908/908429.png", name: "Bo mạch chủ" },
    { id: "RAM", icon: "https://cdn-icons-png.flaticon.com/512/2888/2888662.png", name: "Bộ nhớ RAM" },
    { id: "SSD", icon: "https://cdn-icons-png.flaticon.com/512/2888/2888656.png", name: "Ổ cứng SSD" },
    { id: "PSU", icon: "https://cdn-icons-png.flaticon.com/512/2950/2950005.png", name: "Nguồn máy tính" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/san-pham");
        const allProducts = Array.isArray(res.data) ? res.data : (res.data.products || []);
        setSanPhams(allProducts.slice(0, 12)); 

        const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        if (viewedIds.length > 0) {
          const viewedProducts = allProducts.filter(p => viewedIds.includes(String(p._id)));
          const sortedViewed = viewedIds.map(id => viewedProducts.find(p => String(p._id) === String(id))).filter(Boolean);
          setRecentlyViewed(sortedViewed);
        }
        setIsLoading(false);
      } catch (err) { setIsLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div style={styles.pageBackground}>
      <style>{`
        .p-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .p-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; border-color: #2563eb !important; }
        .cat-item:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .btn-buy-now { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); transition: 0.3s; border: none; color: #fff; cursor: pointer; }
        .btn-buy-now:hover { filter: brightness(1.1); transform: scale(1.02); }
        .brand-card:hover { border-color: currentColor !important; background: #fff !important; transform: scale(1.05); }
      `}</style>

      <div style={styles.container}>
        <PromoBanner />

        {/* 1. SERVICE BAR */}
        <div style={styles.featureBar}>
          <div style={styles.featureItem}><span style={styles.featureIcon}>🚚</span> <div><b>Giao hỏa tốc 2h</b><p style={styles.featureSub}>Nội thành HN & HCM</p></div></div>
          <div style={styles.featureItem}><span style={styles.featureIcon}>🛡️</span> <div><b>Bảo hành 36 tháng</b><p style={styles.featureSub}>Chính hãng 100%</p></div></div>
          <div style={styles.featureItem}><span style={styles.featureIcon}>🔄</span> <div><b>15 ngày đổi mới</b><p style={styles.featureSub}>Lỗi từ nhà sản xuất</p></div></div>
          <div style={styles.featureItem}><span style={styles.featureIcon}>💎</span> <div><b>Trả góp 0%</b><p style={styles.featureSub}>Qua thẻ tín dụng</p></div></div>
        </div>

        {/* 2. DANH MỤC */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Danh mục linh kiện</h2>
        </div>
        <div style={styles.categoryGrid}>
          {categories.map((cat) => (
            <div key={cat.id} style={styles.catCard} className="cat-item" onClick={() => navigate("/build")}>
              <img src={cat.icon} style={styles.catImg} alt={cat.name} />
              <span style={styles.catName}>{cat.name}</span>
            </div>
          ))}
        </div>

        <FlashSale />

        {/* 3. SẢN PHẨM MỚI NHẤT */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Gợi ý cho bạn</h2>
          <div style={styles.viewAll} onClick={() => navigate("/san-pham")}>Xem tất cả ➔</div>
        </div>

        {isLoading ? (
          <div style={styles.loading}>Đang tải dữ liệu...</div>
        ) : (
          <div style={styles.productGrid}>
            {sanPhams.map((item) => (
              <div key={item._id} className="p-card" style={styles.pCard} onClick={() => navigate(`/san-pham/${item._id}`)}>
                <div style={styles.badgeDiscount}>New</div>
                <div style={styles.imgWrapper}>
                  <img src={item.anh} style={styles.pImg} alt={item.ten} />
                </div>
                <div style={styles.pContent}>
                  <span style={styles.pType}>{item.loai}</span>
                  <h3 style={styles.pName}>{item.ten}</h3>
                  <div style={styles.pPriceRow}>
                     <div style={styles.pPrice}>{item.gia?.toLocaleString()} đ</div>
                     <div style={styles.pOldPrice}>{(item.gia * 1.1).toLocaleString()} đ</div>
                  </div>
                  <button 
                    style={styles.pBtn} 
                    className="btn-buy-now"
                    onClick={(e) => { e.stopPropagation(); addToCart(item, 1); }}
                  >
                    🛒 Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. BANNER BUILD PC */}
        <div style={styles.buildSection}>
          <div style={styles.buildBg}>
            <div style={styles.buildOverlay}>
              <h2 style={styles.buildTextLarge}>BUILD PC THEO CÁCH CỦA BẠN</h2>
              <p style={styles.buildTextSmall}>Hệ thống tự động kiểm tra tương thích linh kiện, Socket và công suất nguồn tối ưu.</p>
              <button style={styles.buildAction} onClick={() => navigate("/build")}>
                BẮT ĐẦU NGAY 🚀
              </button>
            </div>
          </div>
        </div>

        {/* 5. THƯƠNG HIỆU ĐỐI TÁC (ĐÃ CÓ MÀU CHỮ HÃNG) */}
        <div style={styles.brandSection}>
            <h3 style={styles.brandTitle}>Đối tác thương hiệu</h3>
            <div style={styles.brandGrid}>
                {brandList.map(brand => (
                    <div 
                        key={brand.name} 
                        className="brand-card"
                        style={{...styles.brandItem, color: brand.color, borderColor: brand.color + '33'}} // 33 là độ mờ của viền
                    >
                        {brand.name}
                    </div>
                ))}
            </div>
        </div>

        {/* 6. TIN TỨC CÔNG NGHỆ */}
        <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Tin tức & Hướng dẫn</h2>
            <div style={styles.viewAll}>Xem blog ➔</div>
        </div>
        <div style={styles.blogGrid}>
            {[
                { t: "Cách chọn nguồn chuẩn cho RTX 50 series", d: "Chọn nguồn không đủ công suất sẽ khiến dàn PC của bạn gặp lỗi..." },
                { t: "Top 5 CPU chơi game tốt nhất 2026", d: "Danh sách những vi xử lý đáng tiền nhất cho game thủ năm nay..." },
                { t: "Hướng dẫn tối ưu Windows 11 để chơi game", d: "Tăng thêm 20% FPS chỉ với vài bước cài đặt đơn giản sau đây..." }
            ].map((blog, i) => (
                <div key={i} style={styles.blogCard} className="p-card">
                    <div style={styles.blogImgBox}>
                        <img src={`https://picsum.photos/400/250?random=${i}`} style={styles.blogImg} alt="" />
                    </div>
                    <div style={styles.blogContent}>
                        <span style={{fontSize: '11px', color: '#2563eb', fontWeight: '800'}}>CẨM NANG PC</span>
                        <h4 style={styles.blogCardTitle}>{blog.t}</h4>
                        <p style={styles.blogDesc}>{blog.d}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* 7. LỊCH SỬ XEM */}
        {recentlyViewed.length > 0 && (
          <div style={styles.recentWrapper}>
            <div style={styles.recentHeader}>
              <h3 style={styles.recentTitle}>Sản phẩm bạn đã xem</h3>
              <span style={styles.clearHistory} onClick={() => {localStorage.removeItem("recentlyViewed"); setRecentlyViewed([]);}}>Xóa lịch sử</span>
            </div>
            <div style={styles.recentGrid}>
              {recentlyViewed.map(item => (
                <div key={item._id} style={styles.recentCard} onClick={() => navigate(`/san-pham/${item._id}`)}>
                   <img src={item.anh} style={styles.recentImg} alt="" />
                   <div style={styles.recentInfo}>
                      <div style={styles.recentName}>{item.ten}</div>
                      <div style={styles.recentPrice}>{item.gia?.toLocaleString()} đ</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageBackground: { backgroundColor: "#f4f6f8", minHeight: "100vh", paddingBottom: "100px" },
  container: { maxWidth: "1380px", margin: "0 auto", padding: "0 20px" },

  featureBar: { display: 'flex', justifyContent: 'space-around', background: '#fff', padding: '25px', borderRadius: '20px', margin: '30px 0', boxShadow: '0 2px 15px rgba(0,0,0,0.03)', border: '1px solid #eef2f6' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  featureIcon: { fontSize: '28px' },
  featureSub: { fontSize: '11px', color: '#94a3b8', margin: 0 },

  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '70px', marginBottom: '30px' },
  sectionTitle: { fontSize: '24px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' },
  viewAll: { color: '#2563eb', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },

  categoryGrid: { display: "grid", gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' },
  catCard: { background: '#fff', padding: '25px 15px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', transition: '0.3s', border: '1px solid #f1f5f9' },
  catImg: { width: '50px', marginBottom: '15px' },
  catName: { display: 'block', fontSize: '14px', fontWeight: '800', color: '#334155' },

  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" },
  pCard: { background: '#fff', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '1px solid #f1f5f9' },
  badgeDiscount: { position: 'absolute', top: '15px', left: '15px', background: '#10b981', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', zIndex: 2 },
  imgWrapper: { height: '230px', padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff' },
  pImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  pContent: { padding: '20px', paddingTop: '0' },
  pType: { fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' },
  pName: { fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '8px 0', height: '42px', overflow: 'hidden', lineHeight: '1.4' },
  pPriceRow: { marginBottom: '15px' },
  pPrice: { fontSize: '19px', fontWeight: '900', color: '#ef4444' },
  pOldPrice: { fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' },
  pBtn: { width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' },

  buildSection: { marginTop: "100px", borderRadius: "40px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)" },
  buildBg: { backgroundImage: "url('https://img.freepik.com/free-photo/view-illuminated-neon-gaming-keyboard-setup_23-2149529350.jpg')", backgroundSize: "cover", backgroundPosition: "center", padding: "100px 40px" },
  buildOverlay: { backgroundColor: "rgba(15, 23, 42, 0.85)", maxWidth: "800px", margin: "0 auto", padding: "60px 50px", borderRadius: "30px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" },
  buildTextLarge: { fontSize: "38px", fontWeight: "900", color: "#fff", marginBottom: "20px" },
  buildTextSmall: { fontSize: "17px", color: "#cbd5e1", marginBottom: "40px", lineHeight: "1.6" },
  buildAction: { backgroundColor: "#2563eb", color: "#fff", padding: "18px 60px", border: "none", borderRadius: "15px", fontWeight: "900", cursor: "pointer", fontSize: "17px" },

  brandSection: { marginTop: '100px', textAlign: 'center' },
  brandTitle: { fontSize: '18px', fontWeight: '700', color: '#94a3b8', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '3px' },
  brandGrid: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
  brandItem: { 
    minWidth: '150px', 
    padding: '20px', 
    border: '1px solid #e2e8f0', 
    borderRadius: '16px', 
    background: '#fff', 
    fontWeight: '900', 
    fontSize: '22px', 
    cursor: 'pointer',
    transition: '0.3s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
  },

  blogGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' },
  blogCard: { background: '#fff', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #f1f5f9' },
  blogImgBox: { height: '200px', overflow: 'hidden' },
  blogImg: { width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' },
  blogContent: { padding: '20px' },
  blogCardTitle: { fontSize: '16px', fontWeight: '800', margin: '10px 0', lineHeight: '1.4' },
  blogDesc: { fontSize: '13px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },

  recentWrapper: { marginTop: "100px", background: "#fff", padding: "40px", borderRadius: "32px", border: '1px solid #eef2f6' },
  recentHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  recentTitle: { fontSize: "22px", fontWeight: "900", color: '#0f172a' },
  clearHistory: { fontSize: "13px", color: "#94a3b8", cursor: "pointer", textDecoration: 'underline' },
  recentGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
  recentCard: { display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', border: '1px solid #f1f5f9', borderRadius: '16px', cursor: 'pointer', backgroundColor: '#f8fafc' },
  recentImg: { width: "65px", height: "65px", objectFit: "contain", background: '#fff', borderRadius: '10px' },
  recentInfo: { flex: 1, overflow: 'hidden' },
  recentName: { fontSize: "13px", fontWeight: "700", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  recentPrice: { color: "#ef4444", fontSize: "15px", fontWeight: "800" },

  loading: { textAlign: "center", padding: "100px", color: "#64748b", fontSize: "18px" }
};

export default TrangChu;