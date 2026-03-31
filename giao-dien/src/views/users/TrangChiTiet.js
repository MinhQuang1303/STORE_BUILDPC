import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

const formatImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/200';
  if (url.startsWith('/uploads')) return `${process.env.REACT_APP_API_URL.replace('/api', '')}${url}`;
  return url;
};

const TrangChiTiet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sp, setSp] = useState(null);
  const [soLuong, setSoLuong] = useState(1);
  const [bienTheChon, setBienTheChon] = useState(null); // Biến thể đang chọn
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/san-pham/${id}`)
      .then((res) => {
        setSp(res.data);
        // Tự động chọn biến thể đầu tiên
        if (res.data.bienThe && res.data.bienThe.length > 0) {
          setBienTheChon(res.data.bienThe[0]);
        }

        // --- LƯU LỊCH SỬ XEM SẢN PHẨM ---
        const item = res.data;
        if (item) {
           let viewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
           viewed = viewed.filter(p => p._id !== item._id); // Xóa chống trùng
           viewed.unshift({
               _id: item._id,
               ten: item.ten,
               anh: item.anh,
               hinhAnh: item.hinhAnh,
               gia: item.gia,
               loai: item.loai
           });
           if (viewed.length > 5) viewed = viewed.slice(0, 5);
           localStorage.setItem('viewedProducts', JSON.stringify(viewed));
        }
      })
      .catch((err) => console.error("Lỗi lấy chi tiết:", err));
  }, [id]);

  if (!sp) return (
    <div style={styles.loadingContainer}>
      <div className="spinner"></div>
      <p>Đang chuẩn bị dữ liệu sản phẩm...</p>
    </div>
  );

  const listSpecs = sp.thongSo ? sp.thongSo.split(",").map((s) => s.trim()) : [];
  const giaHienThi = bienTheChon ? bienTheChon.gia : sp.gia;
  const soLuongCon = bienTheChon ? bienTheChon.soLuong : sp.soLuong;

  const handleAddToCart = () => {
    const productToAdd = {
      ...sp,
      gia: giaHienThi,
      idBienThe: bienTheChon ? (bienTheChon._id || bienTheChon.mongoId) : null,
      tenBienThe: bienTheChon ? bienTheChon.ten : null,
      // Dùng _id kết hợp bienThe để tạo key riêng trong giỏ
      _id: bienTheChon ? `${sp._id}_${bienTheChon._id || bienTheChon.mongoId}` : sp._id,
      idSanPhamGoc: sp._id,
    };
    addToCart(productToAdd, soLuong);
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .product-container { animation: fadeIn 0.6s ease-out; }
        .image-zoom:hover { transform: scale(1.1); transition: all 0.5s ease; cursor: zoom-in; }
        .btn-buy:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4); }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #2563eb; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .bien-the-btn { padding: 8px 18px; border-radius: 8px; border: 2px solid #e2e8f0; cursor: pointer; font-weight: 700; font-size: 14px; background: #fff; transition: all 0.2s; }
        .bien-the-btn:hover { border-color: #2563eb; color: #2563eb; }
        .bien-the-btn.active { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
        .bien-the-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div style={styles.container} className="product-container">
        <div style={styles.breadcrumb}>
           Trang chủ / <span style={{color: "#1e293b", fontWeight: "600"}}>{sp.ten}</span>
        </div>

        <div style={styles.mainLayout}>
          {/* CỘT TRÁI: HÌNH ẢNH */}
          <div style={styles.imageCol}>
            <div style={styles.imageMainBox}>
              {sp.anh ? (
                <img src={formatImageUrl(sp.anh)} alt={sp.ten} style={styles.image} className="image-zoom"
                  onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
              ) : null}
              <div style={{...styles.noImage, display: sp.anh ? 'none' : 'flex'}}>
                <span style={{fontSize: '60px'}}>📦</span>
                <span style={{color: '#94a3b8', marginTop: '10px'}}>Chưa có ảnh</span>
              </div>
            </div>
          </div>

          {/* CỘT GIỮA: THÔNG TIN VÀ MUA HÀNG */}
          <div style={styles.infoCol}>
            <span style={styles.categoryBadge}>{sp.idDanhMuc?.ten || ""}</span>
            <h1 style={styles.productTitle}>{sp.ten}</h1>
            
            <div style={styles.ratingRow}>
                <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
                <span style={styles.reviewCount}>(24 đánh giá)</span>
                <span style={styles.divider}>|</span>
                <span style={styles.skuText}>Mã: {sp._id?.substring(0, 8)?.toUpperCase()}</span>
            </div>

            <div style={styles.priceSection}>
                <div style={styles.priceMain}>{giaHienThi?.toLocaleString()} <span style={{fontSize: '18px'}}>đ</span></div>
                <div style={styles.priceOld}>{(giaHienThi * 1.1).toLocaleString()} đ</div>
                <div style={styles.discountTag}>-10%</div>
            </div>

            {/* CHỌN BIẾN THỂ */}
            {sp.bienThe && sp.bienThe.length > 0 && (
              <div style={styles.bienTheSection}>
                <div style={{fontWeight: "700", color: "#475569", marginBottom: "10px", fontSize: "14px"}}>
                  Phiên bản: <span style={{color: "#2563eb"}}>{bienTheChon?.ten}</span>
                </div>
                <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
                  {sp.bienThe.map((bt) => (
                    <button
                      key={bt._id || bt.mongoId}
                      className={`bien-the-btn ${bienTheChon?._id === bt._id ? 'active' : ''}`}
                      onClick={() => setBienTheChon(bt)}
                      disabled={bt.soLuong === 0}
                      title={bt.soLuong === 0 ? "Hết hàng" : `${bt.gia?.toLocaleString()}đ`}
                    >
                      {bt.ten}
                      {bt.soLuong === 0 && <span style={{fontSize: '10px', display: 'block', color: '#ef4444'}}>Hết hàng</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  <button onClick={() => setSoLuong(Math.min(soLuongCon || 99, soLuong + 1))} style={styles.qtyBtn}>+</button>
                </div>
                <span style={styles.stockText}>
                  {soLuongCon > 0 ? `⚡ Còn ${soLuongCon} sản phẩm` : "❌ Hết hàng"}
                </span>
              </div>

              <div style={styles.btnRow}>
                <button 
                  className="btn-buy"
                  style={{...styles.btnAddCart, opacity: soLuongCon === 0 ? 0.5 : 1}} 
                  onClick={handleAddToCart}
                  disabled={soLuongCon === 0}
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
          </div>
        </div>

        {/* PHẦN DƯỚI: THÔNG SỐ KỸ THUẬT */}
        <div style={styles.specsWrapper}>
            <div style={styles.specsHeader}>
                <div style={styles.activeTab}>Thông số kỹ thuật</div>
            </div>
            <div style={styles.specsContent}>
                {listSpecs.length > 0 ? (
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
                ) : (
                  <p style={{color: "#94a3b8", textAlign: "center", padding: "20px"}}>Chưa có thông số kỹ thuật.</p>
                )}
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
  imageCol: { flex: "1.2", minWidth: "400px" },
  imageMainBox: { backgroundColor: "#fff", borderRadius: "20px", padding: "40px", height: "500px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", overflow: "hidden" },
  image: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  noImage: { flexDirection: "column", alignItems: "center", color: "#94a3b8" },
  infoCol: { flex: "1.5", minWidth: "400px", backgroundColor: "#fff", padding: "35px", borderRadius: "24px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  categoryBadge: { color: "#2563eb", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" },
  productTitle: { fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "10px 0 15px 0", lineHeight: "1.2" },
  ratingRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  stars: { color: "#fbbf24", fontSize: "14px" },
  reviewCount: { color: "#94a3b8", fontSize: "14px" },
  divider: { color: "#e2e8f0" },
  skuText: { color: "#94a3b8", fontSize: "13px" },
  priceSection: { display: "flex", alignItems: "baseline", gap: "15px", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px", flexWrap: "wrap" },
  priceMain: { fontSize: "32px", fontWeight: "900", color: "#ef4444" },
  priceOld: { fontSize: "16px", color: "#94a3b8", textDecoration: "line-through" },
  discountTag: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "4px 10px", borderRadius: "6px", fontWeight: "700", fontSize: "14px" },
  bienTheSection: { marginBottom: "20px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "12px" },
  shortDesc: { fontSize: "14px", color: "#475569", lineHeight: "1.8", marginBottom: "25px" },
  actionBox: { backgroundColor: "#f8fafc", padding: "20px", borderRadius: "16px" },
  qtyRow: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", flexWrap: "wrap" },
  qtyGroup: { display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden" },
  qtyBtn: { width: "40px", height: "40px", border: "none", background: "none", fontSize: "20px", cursor: "pointer" },
  qtyInput: { width: "50px", textAlign: "center", border: "none", fontWeight: "800", fontSize: "16px" },
  stockText: { color: "#f97316", fontSize: "13px", fontWeight: "600" },
  btnRow: { display: "flex", gap: "15px", flexWrap: "wrap" },
  btnAddCart: { flex: 2, minWidth: "180px", backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.3s" },
  btnBuild: { flex: 1, minWidth: "140px", backgroundColor: "#1e293b", color: "#fff", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "13px", cursor: "pointer", transition: "all 0.3s" },
  policyCol: { flex: "0.8", minWidth: "250px" },
  policyCard: { backgroundColor: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  policyTitle: { fontSize: "16px", fontWeight: "800", marginBottom: "20px", color: "#1e293b" },
  policyItem: { display: "flex", gap: "15px", marginBottom: "20px" },
  policyIcon: { fontSize: "24px" },
  policyLabel: { fontWeight: "700", fontSize: "14px", color: "#334155" },
  policySub: { fontSize: "12px", color: "#94a3b8" },
  specsWrapper: { backgroundColor: "#fff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  specsHeader: { display: "flex", borderBottom: "1px solid #f1f5f9" },
  activeTab: { padding: "20px 40px", fontWeight: "800", color: "#2563eb", borderBottom: "3px solid #2563eb" },
  specsContent: { padding: "30px" },
  specsTable: { width: "100%", borderCollapse: "collapse" },
  specLabel: { padding: "12px 20px", fontWeight: "700", color: "#64748b", width: "30%", fontSize: "14px" },
  specValue: { padding: "12px 20px", color: "#1e293b", fontSize: "14px" },
};

export default TrangChiTiet;