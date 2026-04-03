import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

const TrangChiTiet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sp, setSp] = useState(null);
  const [selectedBienThe, setSelectedBienThe] = useState(null);
  const [sanPhamTuongTu, setSanPhamTuongTu] = useState([]);
  const [soLuong, setSoLuong] = useState(1);
  const { addToCart } = useContext(CartContext);

  // States cho Tabs & Đánh giá
  const [tabActive, setTabActive] = useState("specs");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ star: 5, comment: "", image: null });
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // 1. Lấy chi tiết sản phẩm
    axios.get(`http://localhost:5000/api/san-pham/${id}`)
      .then((res) => {
        setSp(res.data);
        if (res.data.bienThe && res.data.bienThe.length > 0) {
          setSelectedBienThe(res.data.bienThe[0]);
        } else {
          setSelectedBienThe(null);
        }
      })
      .catch((err) => console.error("Lỗi lấy chi tiết:", err));

    // 2. Lấy đánh giá riêng biệt từ LocalStorage cho sản phẩm này
    const savedReviews = localStorage.getItem(`reviews_${id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews([
        { id: 1, user: "Hệ thống", star: 5, comment: "Sản phẩm chính hãng, bảo hành tuyệt vời.", date: "01/01/2026", img: null }
      ]);
    }

    // 3. Lưu vào lịch sử xem (recentlyViewed)
    let viewedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    viewedIds = viewedIds.filter(itemId => itemId !== String(id)); // Xóa nếu trùng để đẩy lên đầu
    viewedIds.unshift(String(id)); // Thêm lên đầu danh sách
    if (viewedIds.length > 10) viewedIds.pop(); // Giữ tối đa 10 sản phẩm
    localStorage.setItem("recentlyViewed", JSON.stringify(viewedIds));

  }, [id]);

  useEffect(() => {
    if (sp) {
      axios.get(`http://localhost:5000/api/san-pham`).then((res) => {
        const allData = Array.isArray(res.data) ? res.data : (res.data.products || []);
        const currentCatId = sp.idDanhMuc?._id || sp.idDanhMuc;

        // Logic lọc thông minh: Cùng loại + Ưu tiên cùng thương hiệu
        const getBrand = (name) => ["intel", "amd", "asus", "msi", "gigabyte"].find(b => name.toLowerCase().includes(b)) || "";
        const currentBrand = getBrand(sp.ten);

        const filtered = allData.filter(item => 
          String(item.idDanhMuc?._id || item.idDanhMuc) === String(currentCatId) && 
          String(item._id) !== String(id) &&
          getBrand(item.ten) === currentBrand
        );

        if (filtered.length < 4) {
          const extra = allData.filter(item => 
            String(item.idDanhMuc?._id || item.idDanhMuc) === String(currentCatId) && 
            String(item._id) !== String(id) && !filtered.find(f => f._id === item._id)
          );
          setSanPhamTuongTu([...filtered, ...extra].slice(0, 4));
        } else {
          setSanPhamTuongTu(filtered.slice(0, 4));
        }
      });
    }
  }, [sp, id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
        setNewReview({ ...newReview, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendReview = () => {
    if (!newReview.comment.trim()) return alert("Vui lòng nhập nội dung!");
    const reviewMoi = {
      id: Date.now(),
      user: "Khách hàng",
      star: newReview.star,
      comment: newReview.comment,
      img: newReview.image,
      date: new Date().toLocaleDateString("vi-VN")
    };
    const updated = [reviewMoi, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
    setNewReview({ star: 5, comment: "", image: null });
    setImgPreview(null);
  };

  const avgStar = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.star, 0) / reviews.length).toFixed(1) 
    : 5;

  if (!sp) return <div style={styles.loadingContainer}><div className="spinner"></div><p>Đang tải dữ liệu...</p></div>;

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .product-container { animation: fadeIn 0.6s ease-out; }
        .image-zoom:hover { transform: scale(1.1); transition: 0.5s; cursor: zoom-in; }
        .btn-buy:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4); }
        .related-item:hover { border-color: #2563eb !important; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.08); }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #2563eb; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={styles.container} className="product-container">
        <div style={styles.breadcrumb}>Trang chủ / Linh kiện / <b>{sp.ten}</b></div>

        <div style={styles.mainLayout}>
          {/* CỘT 1: HÌNH ẢNH & TƯƠNG TỰ */}
          <div style={styles.imageCol}>
            <div style={styles.imageMainBox}><img src={sp.anh} style={styles.image} className="image-zoom" alt={sp.ten} /></div>
            <div style={styles.imageThumbnails}>
               {[1,2,3].map(i => <div key={i} style={styles.thumbBox}><img src={sp.anh} style={{width: "100%"}} alt="thumb" /></div>)}
            </div>

            <div style={styles.relatedSection}>
                <h3 style={styles.relatedTitle}>Sản phẩm tương tự</h3>
                <div style={styles.relatedGrid}>
                    {sanPhamTuongTu.map(item => (
                        <div key={item._id} className="related-item" style={styles.relatedCard} onClick={() => navigate(`/san-pham/${item._id}`)}>
                            <img src={item.anh} style={styles.relatedImg} alt={item.ten} />
                            <div style={styles.relatedInfo}>
                                <p style={styles.relatedName}>{item.ten}</p>
                                <p style={styles.relatedPrice}>{item.gia?.toLocaleString()} đ</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* CỘT 2: THÔNG TIN CHÍNH */}
          <div style={styles.infoCol}>
            <span style={styles.categoryBadge}>NEXTGEN PC STORE</span>
            <h1 style={styles.productTitle}>{sp.ten}</h1>
            <div style={styles.ratingRow}>
                <div style={styles.stars}>{"⭐".repeat(Math.round(avgStar))}</div>
                <span style={styles.reviewCount}>({reviews.length} đánh giá)</span>
                <span style={styles.skuText}>| Mã: {String(id).slice(-6).toUpperCase()}</span>
            </div>
            {/* LỰA CHỌN BIẾN THỂ */}
            {sp.bienThe && sp.bienThe.length > 0 && (
              <div style={styles.variantSection}>
                <h4 style={styles.variantTitle}>Chọn tùy chọn:</h4>
                <div style={styles.variantGrid}>
                  {sp.bienThe.map((bt) => (
                    <button
                      key={bt._id}
                      onClick={() => setSelectedBienThe(bt)}
                      style={
                        selectedBienThe?._id === bt._id
                          ? styles.variantBtnActive
                          : styles.variantBtn
                      }
                    >
                      {bt.ten}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.priceSection}>
                <div style={styles.priceMain}>{(selectedBienThe ? selectedBienThe.gia : sp.gia)?.toLocaleString()} đ</div>
                <div style={styles.priceOld}>{((selectedBienThe ? selectedBienThe.gia : sp.gia) * 1.1).toLocaleString()} đ</div>
                <div style={styles.discountTag}>-10%</div>
            </div>
            <div style={styles.shortDesc}>
                <p>• Bảo hành chính hãng 36 tháng</p>
                <p>• Hỗ trợ trả góp 0% qua thẻ tín dụng</p>
                <p>• Miễn phí lắp đặt khi Build PC tại cửa hàng</p>
            </div>
            <div style={styles.actionBox}>
                <div style={styles.qtyGroup}>
                    <button onClick={() => setSoLuong(Math.max(1, soLuong - 1))} style={styles.qtyBtn}>-</button>
                    <input type="number" value={soLuong} readOnly style={styles.qtyInput} />
                    <button onClick={() => setSoLuong(soLuong + 1)} style={styles.qtyBtn}>+</button>
                </div>
                <button className="btn-buy" style={styles.btnAddCart} onClick={() => {
                  const productToAdd = selectedBienThe 
                    ? { ...sp, gia: selectedBienThe.gia, ten: `${sp.ten} - ${selectedBienThe.ten}`, _id: `${sp._id}-${selectedBienThe._id}` }
                    : sp;
                  addToCart(productToAdd, soLuong);
                }}>🛒 THÊM VÀO GIỎ HÀNG</button>
            </div>
            <button className="btn-buy" style={styles.btnBuild} onClick={() => navigate("/build")}>🛠️ THÊM VÀO CẤU HÌNH PC</button>
          </div>

          {/* CỘT 3: DỊCH VỤ & KHUYẾN MÃI */}
          <div style={styles.policyCol}>
            <div style={styles.policyCard}>
                <h4 style={styles.policyTitle}>Yên tâm mua sắm</h4>
                <div style={styles.policyItem}><span style={styles.policyIcon}>🚚</span><div><div style={styles.policyLabel}>Giao nhanh 2h</div><div style={styles.policySub}>Nội thành Hà Nội & HCM</div></div></div>
                <div style={styles.policyItem}><span style={styles.policyIcon}>🔄</span><div><div style={styles.policyLabel}>Đổi trả dễ dàng</div><div style={styles.policySub}>Lỗi 1 đổi 1 trong 15 ngày</div></div></div>
                <div style={styles.policyItem}><span style={styles.policyIcon}>🛡️</span><div><div style={styles.policyLabel}>Chính hãng 100%</div><div style={styles.policySub}>Hoàn tiền x10 nếu hàng giả</div></div></div>
            </div>

            <div style={styles.promoCard}>
                <div style={{fontWeight: "800", marginBottom: "10px", color: "#c2410c", fontSize: "15px"}}>🎁 Khuyến mãi kèm theo</div>
                <p style={{fontSize: "13px", color: "#7c2d12", lineHeight: "1.5"}}>• Tặng Voucher 200k khi mua kèm Màn hình Gaming.<br/>• Giảm thêm 1% cho học sinh, sinh viên.</p>
            </div>
          </div>
        </div>

        {/* PHẦN TABS DƯỚI */}
        <div style={styles.specsWrapper}>
            <div style={styles.specsHeader}>
                <div style={tabActive === "specs" ? styles.activeTab : styles.inactiveTab} onClick={() => setTabActive("specs")}>Thông số kỹ thuật</div>
                <div style={tabActive === "reviews" ? styles.activeTab : styles.inactiveTab} onClick={() => setTabActive("reviews")}>Đánh giá ({reviews.length})</div>
            </div>
            <div style={styles.specsContent}>
                {tabActive === "specs" ? (
                    <table style={styles.specsTable}>
                        <tbody>
                          {sp.thongSo?.split(",").map((s, i) => (
                            <tr key={i} style={i % 2 === 0 ? {backgroundColor: "#f8fafc"} : {}}>
                                <td style={styles.specLabel}>{s.split(":")[0]?.trim()}</td>
                                <td style={styles.specValue}>{s.split(":")[1]?.trim() || s}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={styles.reviewSection}>
                        <div style={styles.reviewOverview}>
                            <div style={styles.avgBox}>
                                <div style={{fontSize: "50px", fontWeight: "900", color: "#f59e0b"}}>{avgStar}</div>
                                <div style={{color: "#fbbf24", fontSize: "20px"}}>⭐⭐⭐⭐⭐</div>
                                <div style={{fontSize: "14px", color: "#94a3b8", marginTop: "5px"}}>Dựa trên {reviews.length} đánh giá</div>
                            </div>
                            <div style={styles.starStats}>
                                {[5,4,3,2,1].map(s => (
                                    <div key={s} style={styles.statRow}>
                                        <span style={{width: "45px"}}>{s} sao</span>
                                        <div style={styles.statBg}><div style={{...styles.statFill, width: s === 5 ? "80%" : "5%"}}></div></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.reviewList}>
                            {reviews.map(rev => (
                                <div key={rev.id} style={styles.reviewItem}>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <strong style={{fontSize: "16px"}}>{rev.user}</strong>
                                        <span style={{fontSize: "12px", color: "#94a3b8"}}>{rev.date}</span>
                                    </div>
                                    <div style={{color: "#fbbf24", margin: "5px 0"}}>{"★".repeat(rev.star)}</div>
                                    <p style={{fontSize: "14px", color: "#475569"}}>{rev.comment}</p>
                                    {rev.img && <img src={rev.img} style={styles.reviewImgData} alt="user review" />}
                                </div>
                            ))}
                        </div>

                        <div style={styles.reviewForm}>
                            <h4 style={{marginBottom: "20px"}}>Đánh giá của bạn</h4>
                            <div style={{marginBottom: "15px"}}>
                                {[1,2,3,4,5].map(s => (
                                    <span key={s} style={{cursor: "pointer", fontSize: "30px", color: s <= newReview.star ? "#fbbf24" : "#e2e8f0"}} onClick={() => setNewReview({...newReview, star: s})}>★</span>
                                ))}
                            </div>
                            <textarea style={styles.reviewTextarea} placeholder="Bạn thấy sản phẩm này như thế nào? (Chất lượng, hiệu năng...)" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} />
                            <div style={{margin: "15px 0"}}>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                {imgPreview && <img src={imgPreview} style={styles.imgPreview} alt="preview" />}
                            </div>
                            <button style={styles.btnSubmitRev} onClick={handleSendReview}>Gửi đánh giá</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: "#f1f5f9", minHeight: "100vh", padding: "20px 0" },
  container: { maxWidth: "1350px", margin: "0 auto", padding: "0 15px" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh" },
  breadcrumb: { fontSize: "14px", color: "#94a3b8", marginBottom: "20px" },
  mainLayout: { display: "flex", gap: "25px", flexWrap: "wrap", marginBottom: "40px" },

  // Cột 1
  imageCol: { flex: "1.2", minWidth: "400px" },
  imageMainBox: { backgroundColor: "#fff", borderRadius: "20px", padding: "30px", height: "480px", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  image: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  imageThumbnails: { display: "flex", gap: "12px", marginTop: "15px" },
  thumbBox: { width: "85px", height: "85px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "8px", cursor: "pointer" },
  relatedSection: { marginTop: "30px", backgroundColor: "#fff", padding: "25px", borderRadius: "24px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  relatedTitle: { fontSize: "18px", fontWeight: "800", marginBottom: "20px", borderLeft: "5px solid #2563eb", paddingLeft: "15px" },
  relatedGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  relatedCard: { display: "flex", gap: "12px", padding: "12px", border: "1px solid #f1f5f9", borderRadius: "15px", cursor: "pointer", transition: "0.3s" },
  relatedImg: { width: "60px", height: "60px", objectFit: "contain" },
  relatedInfo: { flex: 1 },
  relatedName: { fontSize: "12px", fontWeight: "700", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  relatedPrice: { fontSize: "14px", fontWeight: "800", color: "#ef4444", marginTop: "5px" },

  // Cột 2
  infoCol: { flex: "1.5", minWidth: "450px", backgroundColor: "#fff", padding: "35px", borderRadius: "28px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  categoryBadge: { color: "#2563eb", fontWeight: "800", fontSize: "12px", letterSpacing: "1px" },
  productTitle: { fontSize: "32px", fontWeight: "900", color: "#0f172a", margin: "10px 0 15px" },
  ratingRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" },
  stars: { color: "#fbbf24", fontSize: "14px" },
  reviewCount: { color: "#94a3b8", fontSize: "14px" },
  skuText: { color: "#cbd5e1", fontSize: "13px" },
  priceSection: { display: "flex", alignItems: "baseline", gap: "15px", marginBottom: "25px", borderBottom: "1px solid #f1f5f9", paddingBottom: "25px" },
  priceMain: { fontSize: "38px", fontWeight: "900", color: "#ef4444" },
  priceOld: { fontSize: "20px", color: "#94a3b8", textDecoration: "line-through" },
  discountTag: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "5px 12px", borderRadius: "8px", fontWeight: "800", fontSize: "14px" },
  shortDesc: { fontSize: "15px", color: "#475569", lineHeight: "1.9", marginBottom: "30px" },
  actionBox: { display: "flex", gap: "15px", marginBottom: "15px" },
  qtyGroup: { display: "flex", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" },
  qtyBtn: { width: "50px", height: "55px", border: "none", backgroundColor: "#f8fafc", fontSize: "20px", cursor: "pointer" },
  qtyInput: { width: "50px", textAlign: "center", border: "none", fontWeight: "800", fontSize: "18px" },
  btnAddCart: { flex: 1, backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", fontSize: "16px", cursor: "pointer" },
  btnBuild: { width: "100%", backgroundColor: "#1e293b", color: "#fff", border: "none", padding: "18px", borderRadius: "12px", fontWeight: "800", cursor: "pointer", marginTop: "10px" },

  // Cột 3
  policyCol: { flex: "0.8", minWidth: "300px" },
  policyCard: { backgroundColor: "#fff", padding: "25px", borderRadius: "24px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", marginBottom: "20px" },
  policyTitle: { fontSize: "16px", fontWeight: "900", marginBottom: "25px" },
  policyItem: { display: "flex", gap: "15px", marginBottom: "22px" },
  policyIcon: { fontSize: "28px" },
  policyLabel: { fontWeight: "800", fontSize: "14px", color: "#334155" },
  policySub: { fontSize: "12px", color: "#94a3b8" },
  promoCard: { backgroundColor: "#fff7ed", padding: "20px", borderRadius: "20px", border: "1px dashed #fdba74" },

  // Tabs
  specsWrapper: { backgroundColor: "#fff", borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  specsHeader: { display: "flex", borderBottom: "1px solid #f1f5f9", backgroundColor: "#fdfdfd" },
  activeTab: { padding: "22px 40px", fontWeight: "800", color: "#2563eb", borderBottom: "4px solid #2563eb", cursor: "pointer" },
  inactiveTab: { padding: "22px 40px", color: "#94a3b8", cursor: "pointer", fontWeight: "600" },
  specsContent: { padding: "40px" },
  specsTable: { width: "100%", borderCollapse: "collapse" },
  specLabel: { padding: "18px 25px", fontWeight: "700", color: "#64748b", width: "30%", borderBottom: "1px solid #f1f5f9" },
  specValue: { padding: "18px 25px", color: "#1e293b", borderBottom: "1px solid #f1f5f9" },

  // Đánh giá Section
  reviewSection: { display: "flex", flexDirection: "column", gap: "40px" },
  reviewOverview: { display: "flex", gap: "60px", backgroundColor: "#f8fafc", padding: "35px", borderRadius: "20px", alignItems: "center" },
  avgBox: { textAlign: "center", borderRight: "1px solid #e2e8f0", paddingRight: "60px" },
  starStats: { flex: 1 },
  statRow: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" },
  statBg: { flex: 1, height: "10px", backgroundColor: "#e2e8f0", borderRadius: "10px" },
  statFill: { height: "100%", backgroundColor: "#f59e0b", borderRadius: "10px" },
  reviewList: { display: "flex", flexDirection: "column", gap: "30px" },
  reviewItem: { borderBottom: "1px solid #f1f5f9", paddingBottom: "25px" },
  reviewImgData: { width: "120px", height: "120px", objectFit: "cover", borderRadius: "12px", marginTop: "15px" },
  reviewForm: { backgroundColor: "#f8fafc", padding: "30px", borderRadius: "20px" },
  reviewTextarea: { width: "100%", height: "120px", padding: "15px", borderRadius: "12px", border: "1px solid #e2e8f0", fontFamily: "inherit", fontSize: "14px" },
  imgPreview: { width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px", marginTop: "10px" },
  btnSubmitRev: { backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "15px 35px", borderRadius: "10px", fontWeight: "800", cursor: "pointer" },

  // Cấu hình UI biến thể
  variantSection: { marginBottom: "25px" },
  variantTitle: { fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "#475569" },
  variantGrid: { display: "flex", gap: "12px", flexWrap: "wrap" },
  variantBtn: { border: "1px solid #cbd5e1", backgroundColor: "#fff", color: "#475569", padding: "10px 18px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" },
  variantBtnActive: { border: "2px solid #2563eb", backgroundColor: "#eff6ff", color: "#2563eb", padding: "9px 17px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 0 0 3px rgba(37,99,235,0.1)" }
};

export default TrangChiTiet;