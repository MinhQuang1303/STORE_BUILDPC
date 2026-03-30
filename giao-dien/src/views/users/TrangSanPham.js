<<<<<<< HEAD
﻿import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const TrangSanPham = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get("q") || "";
  const queryCat = searchParams.get("cat") || "";
=======
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const TrangSanPham = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14

  const [sanPhams, setSanPhams] = useState([]);
  const [danhMucs, setDanhMucs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [danhMucChon, setDanhMucChon] = useState(queryCat || "Tat ca");
  const [sapXepGia, setSapXepGia] = useState("mac-dinh");
  const [timKiem, setTimKiem] = useState(querySearch);

<<<<<<< HEAD
  // Cập nhật khi URL thay đổi (vd: từ navbar search)
=======
  const [danhMucChon, setDanhMucChon] = useState("Tất cả");
  const [sapXepGia, setSapXepGia] = useState("mac-dinh");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Tất cả",
    "CPU",
    "Mainboard",
    "RAM",
    "VGA",
    "SSD",
    "PSU",
    "Case",
    "Tản nhiệt",
  ];

>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14
  useEffect(() => {
    if (queryCat) setDanhMucChon(queryCat);
    else setDanhMucChon("Tat ca");
    if (querySearch) setTimKiem(querySearch);
    else setTimKiem("");
  }, [queryCat, querySearch]);

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
<<<<<<< HEAD
        setError("Khong the tai danh sach san pham.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  let sanPhamsHienThi = [...sanPhams];
  if (danhMucChon !== "Tat ca") {
    sanPhamsHienThi = sanPhamsHienThi.filter(sp => sp.idDanhMuc?.ten === danhMucChon);
  }
  if (timKiem.trim()) {
    sanPhamsHienThi = sanPhamsHienThi.filter(sp =>
      sp.ten.toLowerCase().includes(timKiem.toLowerCase())
    );
=======
        setError("Không thể kết nối máy chủ.");
        setIsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  let filteredProducts = sanPhams.filter((sp) => {
    const matchCategory = danhMucChon === "Tất cả" || sp.loai === danhMucChon;
    const matchSearch = sp.ten.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (sapXepGia === "tang-dan") {
    filteredProducts.sort((a, b) => a.gia - b.gia);
  } else if (sapXepGia === "giam-dan") {
    filteredProducts.sort((a, b) => b.gia - a.gia);
>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14
  }
  if (sapXepGia === "tang-dan") sanPhamsHienThi.sort((a, b) => a.gia - b.gia);
  else if (sapXepGia === "giam-dan") sanPhamsHienThi.sort((a, b) => b.gia - a.gia);

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(item, 1);
    }
  };

  const handleViewDetail = (e, id) => {
    e.stopPropagation();
    navigate(`/san-pham/${id}`);
  };

  return (
    <div style={styles.pageBackground}>
<<<<<<< HEAD
      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <h1 style={styles.mainTitle}>
            {danhMucChon !== "Tat ca" ? danhMucChon : "TAT CA LINH KIEN"}
          </h1>
          <p style={styles.subTitle}>
            {danhMucChon !== "Tat ca"
              ? `Danh sach san pham thuoc danh muc ${danhMucChon}`
              : "Kham pha hang tram linh kien PC chat luong cao"}
          </p>
        </div>

        <div style={styles.layoutWrapper}>
          <div style={styles.sidebar}>
            <div style={styles.filterSection}>
              <h3 style={styles.filterTitle}>Tim kiem</h3>
              <input
                type="text"
                placeholder="Nhap ten linh kien..."
                value={timKiem}
                onChange={e => setTimKiem(e.target.value)}
                style={styles.searchBox}
              />
              <h3 style={{ ...styles.filterTitle, marginTop: "20px" }}>Danh muc</h3>
              <div style={styles.categoryList}>
                <label style={styles.radioLabel}>
                  <input type="radio" name="category" value="Tat ca"
                    checked={danhMucChon === "Tat ca"}
                    onChange={() => setDanhMucChon("Tat ca")}
                    style={styles.radioInput} />
                  <span style={{ fontWeight: danhMucChon === "Tat ca" ? "bold" : "normal", color: danhMucChon === "Tat ca" ? "#2563eb" : "#475569" }}>
                    Tat ca
                  </span>
                </label>
                {danhMucs.map(dm => (
                  <label key={dm._id} style={styles.radioLabel}>
                    <input type="radio" name="category" value={dm.ten}
                      checked={danhMucChon === dm.ten}
                      onChange={() => setDanhMucChon(dm.ten)}
                      style={styles.radioInput} />
                    <span style={{ fontWeight: danhMucChon === dm.ten ? "bold" : "normal", color: danhMucChon === dm.ten ? "#2563eb" : "#475569" }}>
                      {dm.ten}
=======
      <style>{`
        .product-page * {
          box-sizing: border-box;
        }

        .product-card {
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
          border-color: #3b82f6;
        }

        .filter-item {
          transition: all 0.2s ease;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
          color: #334155;
          font-weight: 500;
        }

        .filter-item:hover {
          background-color: #eff6ff;
          color: #2563eb;
        }

        .active-filter {
          background-color: #2563eb !important;
          color: #ffffff !important;
          font-weight: 600;
        }

        .btn-buy-now:hover {
          background-color: #1e40af !important;
          transform: scale(1.02);
        }

        .btn-detail:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        @media (max-width: 992px) {
          .product-layout {
            flex-direction: column;
          }

          .product-sidebar {
            flex: 1 1 100%;
          }
        }

        @media (max-width: 576px) {
          .product-header {
            align-items: stretch;
          }

          .product-title {
            font-size: 26px !important;
          }

          .product-toolbar {
            text-align: center;
          }
        }
      `}</style>

      <div style={styles.container} className="product-page">
        <div style={styles.headerBox} className="product-header">
          <div>
            <h1 style={styles.mainTitle} className="product-title">
              Linh Kiện Máy Tính
            </h1>
            <p style={styles.subTitle}>
              Tìm kiếm linh kiện phù hợp cho cấu hình của bạn
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
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`filter-item ${danhMucChon === cat ? "active-filter" : ""}`}
                    onClick={() => setDanhMucChon(cat)}
                  >
                    <span style={{ fontSize: "18px" }}>
                      {cat === "Tất cả" ? "📦" : "🔹"}
>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14
                    </span>
                    {cat}
                  </div>
                ))}
              </div>
            </div>

<<<<<<< HEAD
          <div style={styles.mainContent}>
            <div style={styles.toolbar}>
              <span style={styles.resultCount}>
                Hien thi <strong>{sanPhamsHienThi.length}</strong> san pham
                {timKiem && <span style={{ color: "#2563eb" }}> cho "{timKiem}"</span>}
                {danhMucChon !== "Tat ca" && <span style={{ color: "#10b981" }}> trong [{danhMucChon}]</span>}
              </span>
              <div style={styles.sortControl}>
                <label style={{ marginRight: "10px", color: "#64748b" }}>Sap xep:</label>
                <select style={styles.selectBox} value={sapXepGia} onChange={e => setSapXepGia(e.target.value)}>
                  <option value="mac-dinh">Moi nhat</option>
                  <option value="tang-dan">Gia: Thap den Cao</option>
                  <option value="giam-dan">Gia: Cao den Thap</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div style={styles.statusMessage}>Dang tai du lieu...</div>
            ) : error ? (
              <div style={{ ...styles.statusMessage, color: "#ef4444" }}>{error}</div>
            ) : sanPhamsHienThi.length === 0 ? (
              <div style={styles.statusMessage}>Khong tim thay san pham nao.</div>
            ) : (
              <div style={styles.productGrid}>
                {sanPhamsHienThi.map(item => (
                  <div key={item._id} style={styles.productCard} onClick={() => navigate("/san-pham/" + item._id)}>
                    <div style={styles.imageBox}>
                      <img src={item.anh} alt={item.ten} style={styles.productImg} />
                    </div>
                    <div style={styles.productInfo}>
                      <span style={styles.badge}>{item.idDanhMuc?.ten || "Linh kien"}</span>
                      <h3 style={styles.productName} title={item.ten}>{item.ten}</h3>
                      <div style={styles.priceRow}>
                        <span style={styles.productPrice}>{item.gia?.toLocaleString("vi-VN")} d</span>
                      </div>
                      <button style={styles.detailBtn}>Xem chi tiet</button>
=======
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
            <div style={styles.toolbar} className="product-toolbar">
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
                      <div style={styles.typeTag}>{sp.loai}</div>
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
                          className="btn-detail"
                          style={styles.btnDetail}
                          onClick={(e) => handleViewDetail(e, sp._id)}
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
>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !isLoading && !error && (
              <div style={styles.empty}>
                Không tìm thấy sản phẩm nào khớp với bộ lọc.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const styles = {
<<<<<<< HEAD
  pageBackground: { backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', Roboto, sans-serif", paddingBottom: "60px" },
  container: { maxWidth: "1280px", margin: "0 auto", padding: "0 20px" },
  pageHeader: { padding: "40px 0", borderBottom: "1px solid #e2e8f0", marginBottom: "30px" },
  mainTitle: { color: "#0f172a", fontSize: "28px", margin: "0 0 10px 0", fontWeight: "800" },
  subTitle: { color: "#64748b", fontSize: "16px", margin: 0 },
  layoutWrapper: { display: "flex", gap: "30px", alignItems: "flex-start" },
  sidebar: { flex: "0 0 250px", position: "sticky", top: "20px" },
  filterSection: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  filterTitle: { margin: "0 0 15px 0", fontSize: "16px", color: "#0f172a", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" },
  searchBox: { width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px", boxSizing: "border-box" },
  categoryList: { display: "flex", flexDirection: "column", gap: "12px" },
  radioLabel: { display: "flex", alignItems: "center", cursor: "pointer", fontSize: "15px" },
  radioInput: { marginRight: "10px", cursor: "pointer" },
  mainContent: { flex: "1 1 0%", minWidth: 0 },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: "15px 20px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #e2e8f0" },
  resultCount: { color: "#475569", fontSize: "15px" },
  sortControl: { display: "flex", alignItems: "center" },
  selectBox: { padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", cursor: "pointer", fontSize: "14px" },
  statusMessage: { textAlign: "center", padding: "50px", color: "#64748b", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" },
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" },
  productCard: { backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", cursor: "pointer", border: "1px solid #e2e8f0", transition: "transform 0.2s, box-shadow 0.2s", display: "flex", flexDirection: "column" },
  imageBox: { padding: "15px", backgroundColor: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", height: "160px" },
  productImg: { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" },
  productInfo: { padding: "15px", display: "flex", flexDirection: "column", flex: 1 },
  badge: { alignSelf: "flex-start", backgroundColor: "#f1f5f9", color: "#475569", fontSize: "12px", padding: "4px 8px", borderRadius: "4px", fontWeight: "600", marginBottom: "8px" },
  productName: { fontSize: "14px", color: "#0f172a", margin: "0 0 10px 0", height: "40px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.4" },
  priceRow: { marginTop: "auto", marginBottom: "15px" },
  productPrice: { color: "#ef4444", fontWeight: "bold", fontSize: "16px" },
  detailBtn: { width: "100%", padding: "8px", backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
=======
  pageBackground: {
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    padding: "40px 0",
  },
  container: {
    maxWidth: "1350px",
    margin: "0 auto",
    padding: "0 20px",
  },

  headerBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "900",
    color: "#0f172a",
    margin: 0,
  },
  subTitle: {
    color: "#64748b",
    margin: "5px 0 0 0",
  },

  searchWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 20px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "15px",
  },

  layout: {
    display: "flex",
    gap: "25px",
  },

  sidebar: {
    flex: "0 0 280px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "15px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
  sortCard: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "800",
    marginBottom: "15px",
    paddingLeft: "10px",
    borderLeft: "4px solid #2563eb",
  },
  filterList: {
    display: "flex",
    flexDirection: "column",
  },

  selectInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    outline: "none",
  },

  mainContent: {
    flex: 1,
  },
  toolbar: {
    marginBottom: "20px",
    color: "#475569",
    fontSize: "15px",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
  imageBox: {
    height: "200px",
    position: "relative",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  img: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  typeTag: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#f1f5f9",
    color: "#2563eb",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "800",
  },

  info: {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 15px 0",
    minHeight: "42px",
    overflow: "hidden",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  price: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ef4444",
  },
  status: {
    fontSize: "12px",
    color: "#22c55e",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
  },
  btnDetail: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },
  btnCart: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.2s",
  },

  loading: {
    textAlign: "center",
    padding: "100px",
    fontSize: "18px",
    color: "#64748b",
  },
  error: {
    textAlign: "center",
    padding: "18px 20px",
    marginBottom: "20px",
    backgroundColor: "#fee2e2",
    borderRadius: "14px",
    color: "#b91c1c",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    padding: "100px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    color: "#64748b",
  },
>>>>>>> fdcb9654aa8d2f635de75e238d805aee07d5cd14
};

export default TrangSanPham;