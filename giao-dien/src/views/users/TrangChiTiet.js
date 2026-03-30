import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

const TrangChiTiet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sp, setSp] = useState(null);
  const [soLuong, setSoLuong] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/san-pham/${id}`)
      .then((res) => setSp(res.data))
      .catch((err) => console.error("Lỗi lấy chi tiết:", err));
  }, [id]);

  if (!sp) return (
    <div style={styles.loadingContainer}>
      <div className="spinner"></div>
      <p>Đang chuẩn bị dữ liệu sản phẩm...</p>
    </div>
  );

  const listSpecs = sp.thongSo ? sp.thongSo.split(",").map((s) => s.trim()) : [];

  return (
    <div style={styles.pageWrapper}>
      {/* CSS ANIMATIONS & HOVER */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10)px; } to { opacity: 1; transform: translateY(0); } }
        .product-container { animation: fadeIn 0.6s ease-out; }
        .image-zoom:hover { transform: scale(1.1); transition: all 0.5s ease; cursor: zoom-in; }
        .btn-buy:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4); }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #2563eb; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={styles.container} className="product-container">
        {/* BREADCRUMB - Đường dẫn */}
        <div style={styles.breadcrumb}>
           Trang chủ / {sp.loai} / <span style={{color: "#1e293b", fontWeight: "600"}}>{sp.ten}</span>
        </div>

        <div style={styles.mainLayout}>
          {/* CỘT TRÁI: HÌNH ẢNH */}
          <div style={styles.imageCol}>
            <div style={styles.imageMainBox}>
              <img src={sp.anh} alt={sp.ten} style={styles.image} className="image-zoom" />
            </div>
            <div style={styles.imageThumbnails}>
                {[1,2,3].map(i => (
                    <div key={i} style={styles.thumbBox}><img src={sp.anh} style={{width: "100%"}} /></div>
                ))}
            </div>
          </div>

          {/* CỘT GIỮA: THÔNG TIN VÀ MUA HÀNG */}
          <div style={styles.infoCol}>
            <span style={styles.categoryBadge}>{sp.loai}</span>
            <h1 style={styles.productTitle}>{sp.ten}</h1>
            
            <div style={styles.ratingRow}>
                <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
                <span style={styles.reviewCount}>(24 đánh giá)</span>
                <span style={styles.divider}>|</span>
                <span style={styles.skuText}>Mã: {sp._id.substring(18).toUpperCase()}</span>
            </div>

            <div style={styles.priceSection}>
                <div style={styles.priceMain}>{sp.gia?.toLocaleString()} <span style={{fontSize: '18px'}}>đ</span></div>
                <div style={styles.priceOld}>{(sp.gia * 1.1).toLocaleString()} đ</div>
                <div style={styles.discountTag}>-10%</div>
            </div>

            <div style={styles.shortDesc}>
                <p>• Bảo hành chính hãng 36 tháng</p>
                <p>• Hỗ trợ trả góp 0% qua thẻ tín dụng</p>
                <p>• Miễn phí lắp đặt khi Build PC tại cửa hàng</p>
            </div>

            <div style={styles.actionBox}>
              <div style={styles.qtyRow}>
                <span style={{fontWeight: "700", color: "#475569"}}>Số lượng:</span>
                <div style={styles.qtyGroup}>
                  <button onClick={() => setSoLuong(Math.max(1, soLuong - 1))} style={styles.qtyBtn}>-</button>
                  <input type="number" value={soLuong} readOnly style={styles.qtyInput} />
                  <button onClick={() => setSoLuong(soLuong + 1)} style={styles.qtyBtn}>+</button>
                </div>
                <span style={styles.stockText}>⚡ Chỉ còn 5 sản phẩm cuối</span>
              </div>

              <div style={styles.btnRow}>
                <button 
                  className="btn-buy"
                  style={styles.btnAddCart} 
                  onClick={() => addToCart(sp, soLuong)}
                >
                  <span style={{fontSize: "20px"}}>🛒</span> THÊM VÀO GIỎ HÀNG
                </button>
                <button 
                  className="btn-buy"
                  style={styles.btnBuild} 
                  onClick={() => navigate("/build")}
                >
                  🛠️ THÊM VÀO CẤU HÌNH PC
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHÍNH SÁCH DỊCH VỤ */}
          <div style={styles.policyCol}>
            <div style={styles.policyCard}>
                <h4 style={styles.policyTitle}>Yên tâm mua sắm</h4>
                <div style={styles.policyItem}>
                    <span style={styles.policyIcon}>🚚</span>
                    <div>
                        <div style={styles.policyLabel}>Giao hàng nhanh</div>
                        <div style={styles.policySub}>Nội thành trong 2h</div>
                    </div>
                </div>
                <div style={styles.policyItem}>
                    <span style={styles.policyIcon}>🔄</span>
                    <div>
                        <div style={styles.policyLabel}>Đổi trả dễ dàng</div>
                        <div style={styles.policySub}>Lỗi 1 đổi 1 trong 15 ngày</div>
                    </div>
                </div>
                <div style={styles.policyItem}>
                    <span style={styles.policyIcon}>🛡️</span>
                    <div>
                        <div style={styles.policyLabel}>Chính hãng 100%</div>
                        <div style={styles.policySub}>Phát hiện hàng giả đền x10</div>
                    </div>
                </div>
            </div>

            <div style={styles.promoCard}>
                <div style={{fontWeight: "700", marginBottom: "10px", color: "#c2410c"}}>🎁 Khuyến mãi kèm theo</div>
                <p style={{fontSize: "13px", color: "#7c2d12"}}>Tặng Voucher 200k khi mua kèm Màn hình Gaming.</p>
            </div>
          </div>
        </div>

        {/* PHẦN DƯỚI: THÔNG SỐ KỸ THUẬT */}
        <div style={styles.specsWrapper}>
            <div style={styles.specsHeader}>
                <div style={styles.activeTab}>Thông số kỹ thuật</div>
                <div style={styles.inactiveTab}>Đánh giá người dùng</div>
            </div>
            <div style={styles.specsContent}>
                <table style={styles.specsTable}>
                    <tbody>
                    {listSpecs.map((spec, index) => {
                        const [label, value] = spec.split(":");
                        return (
                        <tr key={index} style={index % 2 === 0 ? {backgroundColor: "#f8fafc"} : {}}>
                            <td style={styles.specLabel}>{label?.trim() || "Tính năng"}</td>
                            <td style={styles.specValue}>{value?.trim() || spec}</td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: "#f1f5f9", minHeight: "100vh", padding: "20px 0" },
  container: { maxWidth: "1300px", margin: "0 auto", padding: "0 15px" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", color: "#64748b" },
  
  breadcrumb: { fontSize: "14px", color: "#94a3b8", marginBottom: "20px" },
  
  mainLayout: { display: "flex", gap: "25px", marginBottom: "40px", flexWrap: "wrap" },
  
  // Cột ảnh
  imageCol: { flex: "1.2", minWidth: "400px" },
  imageMainBox: { backgroundColor: "#fff", borderRadius: "20px", padding: "40px", height: "500px", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", overflow: "hidden" },
  image: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  imageThumbnails: { display: "flex", gap: "10px", marginTop: "15px" },
  thumbBox: { width: "80px", height: "80px", backgroundColor: "#fff", borderRadius: "10px", padding: "10px", border: "1px solid #e2e8f0", cursor: "pointer" },

  // Cột thông tin
  infoCol: { flex: "1.5", minWidth: "400px", backgroundColor: "#fff", padding: "35px", borderRadius: "24px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  categoryBadge: { color: "#2563eb", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" },
  productTitle: { fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: "10px 0 15px 0", lineHeight: "1.2" },
  
  ratingRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" },
  stars: { color: "#fbbf24", fontSize: "14px" },
  reviewCount: { color: "#94a3b8", fontSize: "14px" },
  skuText: { color: "#94a3b8", fontSize: "13px" },

  priceSection: { display: "flex", alignItems: "baseline", gap: "15px", marginBottom: "25px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" },
  priceMain: { fontSize: "36px", fontWeight: "900", color: "#ef4444" },
  priceOld: { fontSize: "18px", color: "#94a3b8", textDecoration: "line-through" },
  discountTag: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "4px 10px", borderRadius: "6px", fontWeight: "700", fontSize: "14px" },

  shortDesc: { fontSize: "14px", color: "#475569", lineHeight: "1.8", marginBottom: "30px" },

  actionBox: { backgroundColor: "#f8fafc", padding: "25px", borderRadius: "16px" },
  qtyRow: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" },
  qtyGroup: { display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden" },
  qtyBtn: { width: "45px", height: "45px", border: "none", background: "none", fontSize: "20px", cursor: "pointer", transition: "all 0.2s" },
  qtyInput: { width: "50px", textAlign: "center", border: "none", fontWeight: "800", fontSize: "16px" },
  stockText: { color: "#f97316", fontSize: "13px", fontWeight: "600" },

  btnRow: { display: "flex", gap: "15px" },
  btnAddCart: { flex: 2, backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "18px", borderRadius: "12px", fontWeight: "800", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.3s" },
  btnBuild: { flex: 1.2, backgroundColor: "#1e293b", color: "#fff", border: "none", padding: "18px", borderRadius: "12px", fontWeight: "800", fontSize: "14px", cursor: "pointer", transition: "all 0.3s" },

  // Cột chính sách
  policyCol: { flex: "0.8", minWidth: "250px" },
  policyCard: { backgroundColor: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", marginBottom: "20px" },
  policyTitle: { fontSize: "16px", fontWeight: "800", marginBottom: "20px", color: "#1e293b" },
  policyItem: { display: "flex", gap: "15px", marginBottom: "20px" },
  policyIcon: { fontSize: "24px" },
  policyLabel: { fontWeight: "700", fontSize: "14px", color: "#334155" },
  policySub: { fontSize: "12px", color: "#94a3b8" },
  promoCard: { backgroundColor: "#fff7ed", padding: "20px", borderRadius: "15px", border: "1px dashed #fdba74" },

  // Thông số kỹ thuật
  specsWrapper: { backgroundColor: "#fff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  specsHeader: { display: "flex", borderBottom: "1px solid #f1f5f9" },
  activeTab: { padding: "20px 40px", fontWeight: "800", color: "#2563eb", borderBottom: "3px solid #2563eb" },
  inactiveTab: { padding: "20px 40px", fontWeight: "600", color: "#94a3b8", cursor: "pointer" },
  specsContent: { padding: "40px" },
  specsTable: { width: "100%", borderCollapse: "collapse" },
  specLabel: { padding: "15px 25px", fontWeight: "700", color: "#64748b", width: "30%", fontSize: "15px" },
  specValue: { padding: "15px 25px", color: "#1e293b", fontSize: "15px" },
};

export default TrangChiTiet;