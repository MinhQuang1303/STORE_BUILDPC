import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Search, Filter, ShoppingCart, LayoutGrid, List, ChevronRight } from "lucide-react";
import { CartContext } from "../../context/CartContext";

const TrangSanPham = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  
  // Lấy các tham số từ URL (q cho tìm kiếm, cat cho danh mục)
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get("q") || "";
  const queryCat = searchParams.get("cat") || "";

  const [sanPhams, setSanPhams] = useState([]);
  const [danhMucs, setDanhMucs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Khởi tạo state dựa trên URL
  const [danhMucChon, setDanhMucChon] = useState(queryCat || "Tất cả");
  const [sapXepGia, setSapXepGia] = useState("mac-dinh");
  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [khoangGiaChon, setKhoangGiaChon] = useState("tat-ca");
  const [viewMode, setViewMode] = useState("grid");

  const priceRanges = [
      { id: "tat-ca", name: "Tất cả mức giá" },
      { id: "duoi-5tr", name: "Dưới 5 triệu" },
      { id: "5-10tr", name: "5 - 10 triệu" },
      { id: "10-20tr", name: "10 - 20 triệu" },
      { id: "tren-20tr", name: "Trên 20 triệu" },
  ];

  const handleViewDetail = (e, id) => {
      e.stopPropagation();
      navigate(`/san-pham/${id}`);
  };

  // Cập nhật State khi URL thay đổi (VD: đang ở trang này mà gõ tiếp vào ô tìm kiếm ở Header)
  useEffect(() => {
    setSearchQuery(querySearch);
    if (queryCat) {
        setDanhMucChon(queryCat);
    } else if (querySearch) {
        // Tự động nhảy vô Danh mục tương ứng nếu từ khoá có nhắc tới
        const q = querySearch.toLowerCase();
        const matchDm = danhMucs.find(dm => dm.ten.toLowerCase().includes(q) || q.includes(dm.ten.toLowerCase()));
        if (matchDm) setDanhMucChon(matchDm.ten);
        else setDanhMucChon("Tất cả");
    } else {
        setDanhMucChon("Tất cả");
    }
  }, [querySearch, queryCat, danhMucs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSanPham, resDanhMuc] = await Promise.all([
          axios.get("http://localhost:5000/api/san-pham"),
          axios.get("http://localhost:5000/api/danh-muc"),
        ]);
        setSanPhams(resSanPham.data);
        setDanhMucs(resDanhMuc.data);
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // TUYỆT ĐỐI KHÔNG ẨN CÁC SẢN PHẨM KHÁC, CHỈ SẮP XẾP ƯU TIÊN LÊN ĐẦU
  let filteredProducts = [...sanPhams];

  const q = searchQuery.toLowerCase().trim();
  
  filteredProducts.sort((a, b) => {
      const aCat = a.idDanhMuc?.ten || a.loai || "";
      const bCat = b.idDanhMuc?.ten || b.loai || "";
      
      // 1. Kiểm tra xem có trùng Danh mục đang chọn ở Sidebar không
      const aCatMatch = danhMucChon !== "Tất cả" && aCat === danhMucChon;
      const bCatMatch = danhMucChon !== "Tất cả" && bCat === danhMucChon;

      // 2. Kiểm tra xem có khớp từ khoá nhập ở ô search không
      const aSearchMatch = q !== "" && (a.ten.toLowerCase().includes(q) || aCat.toLowerCase().includes(q));
      const bSearchMatch = q !== "" && (b.ten.toLowerCase().includes(q) || bCat.toLowerCase().includes(q));
      
      // Nếu là Sản phẩm được ưu tiên (bởi Danh mục hiện tại HOẶC Từ khoá tìm kiếm)
      const aTotalMatch = aCatMatch || aSearchMatch;
      const bTotalMatch = bCatMatch || bSearchMatch;

      if (aTotalMatch && !bTotalMatch) return -1; // Đẩy lên trên
      if (!aTotalMatch && bTotalMatch) return 1;  // Đẩy xuống dưới
      
      // Mới khét giá tiền nếu đồ ngang nhau
      if (sapXepGia === "tang-dan") return a.gia - b.gia;
      if (sapXepGia === "giam-dan") return b.gia - a.gia;
      return 0;
  });

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    if (addToCart) addToCart(item, 1);
  };

  return (
    <div style={styles.pageBackground}>
      <style>{`
        .product-card { transition: all 0.3s ease; border: 1px solid #e2e8f0; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08); border-color: #3b82f6; }
        .filter-item { transition: all 0.2s ease; padding: 12px 15px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 10px; margin-bottom: 5px; color: #334155; font-weight: 500; }
        .filter-item:hover { background-color: #eff6ff; color: #2563eb; }
        .active-filter { background-color: #2563eb !important; color: #ffffff !important; font-weight: 600; }
        .btn-buy-now:hover { background-color: #1e40af !important; transform: scale(1.02); }
        @media (max-width: 992px) { .product-layout { flex-direction: column; } .product-sidebar { flex: 1 1 100%; } }
      `}</style>

      <div style={styles.container} className="product-page">
        <div style={styles.headerBox} className="product-header">
          <div>
            <h1 style={styles.mainTitle}>
              {danhMucChon !== "Tất cả" ? `Linh kiện ${danhMucChon}` : "Tất Cả Linh Kiện"}
            </h1>
            <p style={styles.subTitle}>
              {searchQuery ? `Kết quả tìm kiếm cho: "${searchQuery}"` : "Khám phá linh kiện PC chất lượng cao"}
            </p>
          </div>

          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Tìm tên linh kiện..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.layout} className="product-layout">
          <aside style={styles.sidebar} className="product-sidebar">
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Bộ lọc danh mục</h3>
              <div style={styles.filterList}>
                <div
                  className={`filter-item ${danhMucChon === "Tất cả" ? "active-filter" : ""}`}
                  onClick={() => {
                     setDanhMucChon("Tất cả");
                     setSearchQuery("");
                     navigate('/san-pham');
                  }}
                >
                  <span>📦</span> Tất cả
                </div>
                {danhMucs.map((dm) => (
                  <div
                    key={dm._id}
                    className={`filter-item ${danhMucChon === dm.ten ? "active-filter" : ""}`}
                    onClick={() => {
                        setDanhMucChon(dm.ten);
                        setSearchQuery("");
                        navigate(`/san-pham?cat=${dm.ten}`);
                    }}
                  >
                    <span>🔹</span> {dm.ten}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.sortCard}>
              <h3 style={styles.cardTitle}>Sắp xếp giá</h3>
              <select
                style={styles.selectInput}
                value={sapXepGia}
                onChange={(e) => setSapXepGia(e.target.value)}
              >
                <option value="mac-dinh">Mới nhất</option>
                <option value="tang-dan">Giá thấp đến cao</option>
                <option value="giam-dan">Giá cao đến thấp</option>
              </select>
            </div>
          </aside>

          <main style={styles.mainContent}>
            <div style={styles.toolbar}>
              <span>
                Tìm thấy <b>{filteredProducts.length}</b> sản phẩm
              </span>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {isLoading ? (
              <div style={styles.loading}>Đang lấy dữ liệu hàng hóa...</div>
            ) : (
              <div style={styles.productGrid}>
                {filteredProducts.map((sp) => (
                  <div
                    key={sp._id}
                    className="product-card"
                    style={styles.productCard}
                    onClick={() => navigate(`/san-pham/${sp._id}`)}
                  >
                    <div style={styles.imageBox}>
                      <img src={sp.anh} alt={sp.ten} style={styles.img} />
                      <div style={styles.typeTag}>{sp.idDanhMuc?.ten || sp.loai}</div>
                    </div>

                    <div style={styles.info}>
                      <h4 style={styles.productName}>{sp.ten}</h4>
                      <div style={styles.priceRow}>
                        <div style={styles.price}>{sp.gia?.toLocaleString()} đ</div>
                        <div style={styles.status}>● Còn hàng</div>
                      </div>
                      <div style={styles.buttonGroup}>
                        <button
                          type="button"
                          style={styles.btnDetail}
                          onClick={(e) => { e.stopPropagation(); navigate(`/san-pham/${sp._id}`); }}
                        >
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          className="btn-buy-now"
                          style={styles.btnCart}
                          onClick={(e) => handleQuickAdd(e, sp)}
                        >
                          🛒 Mua
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !isLoading && (
              <div style={styles.empty}>
                Không tìm thấy sản phẩm nào khớp với lựa chọn.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageBackground: { backgroundColor: "#f1f5f9", minHeight: "100vh", padding: "40px 0" },
  container: { maxWidth: "1350px", margin: "0 auto", padding: "0 20px" },
  headerBox: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" },
  mainTitle: { fontSize: "32px", fontWeight: "900", color: "#0f172a", margin: 0 },
  subTitle: { color: "#64748b", margin: "5px 0 0 0" },
  searchWrapper: { position: "relative", width: "100%", maxWidth: "400px" },
  searchInput: { width: "100%", padding: "12px 20px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px" },
  layout: { display: "flex", gap: "25px" },
  sidebar: { flex: "0 0 280px" },
  card: { backgroundColor: "#fff", borderRadius: "16px", padding: "15px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  sortCard: { marginTop: "20px", padding: "20px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: "16px", fontWeight: "800", marginBottom: "15px", paddingLeft: "10px", borderLeft: "4px solid #2563eb" },
  filterList: { display: "flex", flexDirection: "column" },
  selectInput: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" },
  mainContent: { flex: 1 },
  toolbar: { marginBottom: "20px", color: "#475569", fontSize: "15px" },
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
  productCard: { backgroundColor: "#fff", borderRadius: "20px", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" },
  imageBox: { height: "200px", position: "relative", backgroundColor: "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" },
  img: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  typeTag: { position: "absolute", top: "10px", left: "10px", backgroundColor: "#f1f5f9", color: "#2563eb", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800" },
  info: { padding: "20px", flex: 1, display: "flex", flexDirection: "column" },
  productName: { fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: "0 0 15px 0", minHeight: "42px", overflow: "hidden" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "10px" },
  price: { fontSize: "18px", fontWeight: "800", color: "#ef4444" },
  status: { fontSize: "12px", color: "#22c55e", fontWeight: "600" },
  buttonGroup: { display: "flex", gap: "10px", marginTop: "auto" },
  btnDetail: { flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600", cursor: "pointer" },
  btnCart: { flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "700", cursor: "pointer" },
  loading: { textAlign: "center", padding: "100px", fontSize: "18px", color: "#64748b" },
  error: { textAlign: "center", padding: "20px", marginBottom: "20px", backgroundColor: "#fee2e2", borderRadius: "14px", color: "#b91c1c", fontWeight: "600" },
  empty: { textAlign: "center", padding: "100px", backgroundColor: "#fff", borderRadius: "20px", color: "#64748b" },
};

export default TrangSanPham;