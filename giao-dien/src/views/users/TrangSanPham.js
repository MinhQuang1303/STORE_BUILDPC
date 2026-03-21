import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const TrangSanPham = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get("q") || "";
  const queryCat = searchParams.get("cat") || "";

  const [sanPhams, setSanPhams] = useState([]);
  const [danhMucs, setDanhMucs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [danhMucChon, setDanhMucChon] = useState(queryCat || "Tat ca");
  const [sapXepGia, setSapXepGia] = useState("mac-dinh");
  const [timKiem, setTimKiem] = useState(querySearch);

  // Cập nhật khi URL thay đổi (vd: từ navbar search)
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
  }
  if (sapXepGia === "tang-dan") sanPhamsHienThi.sort((a, b) => a.gia - b.gia);
  else if (sapXepGia === "giam-dan") sanPhamsHienThi.sort((a, b) => b.gia - a.gia);

  return (
    <div style={styles.pageBackground}>
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
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
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
};

export default TrangSanPham;