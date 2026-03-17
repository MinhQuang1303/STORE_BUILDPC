import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Sử dụng axios để lấy ID thật từ Backend

const FlashSale = () => {
  const [danhSachHienTai, setDanhSachHienTai] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    // 1. Lấy dữ liệu trực tiếp từ Backend để có ID (_id) chuẩn của MongoDB
    axios
      .get("http://localhost:5000/api/san-pham")
      .then((res) => {
        const tatCaSP = res.data;
        if (tatCaSP && tatCaSP.length > 0) {
          // Xáo trộn và lấy 4 món để làm Flash Sale
          const xaoTron = [...tatCaSP].sort(() => 0.5 - Math.random());
          setDanhSachHienTai(xaoTron.slice(0, 4));
        }
      })
      .catch((err) => console.error("Lỗi lấy sản phẩm từ Backend:", err));

    // 2. Logic đồng hồ đếm ngược
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num) => num.toString().padStart(2, "0");

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>⚡ FLASH SALE KẾT THÚC SAU:</div>
        <div style={styles.countdownBox}>
          <div style={styles.timeGroup}>
            <span style={styles.timeUnit}>{formatNum(timeLeft.d)}</span>
            <span style={styles.timeLabel}>Ngày</span>
          </div>
          <span style={styles.separator}>:</span>
          <div style={styles.timeGroup}>
            <span style={styles.timeUnit}>{formatNum(timeLeft.h)}</span>
            <span style={styles.timeLabel}>Giờ</span>
          </div>
          <span style={styles.separator}>:</span>
          <div style={styles.timeGroup}>
            <span style={styles.timeUnit}>{formatNum(timeLeft.m)}</span>
            <span style={styles.timeLabel}>Phút</span>
          </div>
          <span style={styles.separator}>:</span>
          <div style={styles.timeGroup}>
            <span style={styles.timeUnit}>{formatNum(timeLeft.s)}</span>
            <span style={styles.timeLabel}>Giây</span>
          </div>
        </div>
      </div>

      <div style={styles.productGrid}>
        {danhSachHienTai.map((item) => (
          <div key={item._id} style={styles.card}>
            <div style={styles.badge}>GIẢM SỐC</div>

            {/* ⚡ QUAN TRỌNG: Link dùng item._id lấy từ Backend */}
            <Link to={`/san-pham/${item._id}`} style={styles.linkWrapper}>
              <img src={item.anh} alt={item.ten} style={styles.productImg} />
            </Link>

            <Link to={`/san-pham/${item._id}`} style={styles.linkWrapper}>
              <h4 style={styles.productName}>{item.ten}</h4>
            </Link>

            <p style={styles.thongSo}>{item.thongSo}</p>

            <div style={styles.priceRow}>
              <span style={styles.newPrice}>{item.gia?.toLocaleString()}đ</span>
              <span style={styles.loaiTag}>{item.loai}</span>
            </div>

            <div style={styles.soldBar}>
              <div style={styles.progressFill}></div>
              <span style={styles.soldText}>🔥 Sắp cháy hàng</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#e30019",
    padding: "25px",
    borderRadius: "15px",
    margin: "20px 0",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    color: "white",
  },
  headerTitle: { fontSize: "22px", fontWeight: "bold" },
  countdownBox: { display: "flex", gap: "8px", alignItems: "flex-start" },
  timeGroup: { display: "flex", flexDirection: "column", alignItems: "center" },
  timeUnit: {
    backgroundColor: "white",
    color: "#e30019",
    padding: "5px 8px",
    borderRadius: "5px",
    fontSize: "18px",
    fontWeight: "bold",
    minWidth: "35px",
    textAlign: "center",
  },
  timeLabel: { fontSize: "10px", marginTop: "5px" },
  separator: { fontSize: "20px", fontWeight: "bold" },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "15px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  badge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#ffc107",
    color: "black",
    fontSize: "10px",
    fontWeight: "bold",
    padding: "3px 8px",
    borderRadius: "5px",
    zIndex: 1,
  },
  productImg: {
    width: "100%",
    height: "180px",
    objectFit: "contain",
    cursor: "pointer",
  },
  productName: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#333",
    height: "40px",
    overflow: "hidden",
    margin: "10px 0 5px 0",
  },
  thongSo: {
    fontSize: "11px",
    color: "#777",
    height: "35px",
    overflow: "hidden",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  newPrice: { color: "#e30019", fontWeight: "bold", fontSize: "17px" },
  loaiTag: {
    fontSize: "10px",
    backgroundColor: "#f0f0f0",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  soldBar: {
    backgroundColor: "#f5f5f5",
    height: "20px",
    borderRadius: "10px",
    position: "relative",
    overflow: "hidden",
    marginTop: "15px",
  },
  progressFill: { backgroundColor: "#ffc107", width: "65%", height: "100%" },
  soldText: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    fontSize: "11px",
    lineHeight: "20px",
    textAlign: "center",
    fontWeight: "bold",
  },
  linkWrapper: { textDecoration: "none", color: "inherit" },
};

export default FlashSale;
