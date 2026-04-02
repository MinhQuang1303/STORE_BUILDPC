import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PromoBanner = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slides = [
    {
      tag: "🔥 FLASH SALE HÔM NAY",
      title: "RTX 4090 SERIES",
      subtitle: "Sức mạnh tối thượng cho mọi tác vụ",
      highlight: "Giảm đến 5.000.000đ",
      btn: "Mua ngay",
      cat: "GPU",
      bg: "linear-gradient(135deg, #0a0f1a 0%, #0f1a35 40%, #0a1628 100%)",
      accent: "#3b82f6",
      emoji: "🎮",
    },
    {
      tag: "⚡ MỚI VỀ",
      title: "INTEL 14TH GEN",
      subtitle: "Core i9-14900K — Hiệu năng đỉnh cao",
      highlight: "Turbo 6.0GHz",
      btn: "Xem CPU",
      cat: "CPU",
      bg: "linear-gradient(135deg, #0a0f1a 0%, #1a0f35 40%, #0a0f1a 100%)",
      accent: "#8b5cf6",
      emoji: "⚡",
    },
    {
      tag: "💾 COMBO HOT",
      title: "DDR5 6000MHz",
      subtitle: "G.Skill Trident Z5 — Tốc độ vượt trội",
      highlight: "Tặng tản nhiệt RGB",
      btn: "Xem RAM",
      cat: "RAM",
      bg: "linear-gradient(135deg, #0a0f1a 0%, #0f2a1a 40%, #0a0f1a 100%)",
      accent: "#10b981",
      emoji: "💾",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (idx) => {
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 300);
  };

  const slide = slides[current];

  return (
    <div style={{ ...styles.banner, background: slide.bg, transition: "background 0.5s ease" }}>
      {/* BG DECORATIONS */}
      <div style={{ ...styles.bgCircle1, backgroundColor: slide.accent + "15" }} />
      <div style={{ ...styles.bgCircle2, backgroundColor: slide.accent + "08" }} />
      <div style={styles.bgGrid} />

      <div style={styles.inner}>
        {/* LEFT CONTENT */}
        <div style={{ ...styles.content, opacity: animating ? 0 : 1, transform: animating ? "translateX(-20px)" : "translateX(0)", transition: "all 0.3s ease" }}>
          <div style={{ ...styles.tag, backgroundColor: slide.accent + "22", color: slide.accent, borderColor: slide.accent + "44" }}>
            {slide.tag}
          </div>
          <h1 style={styles.title}>{slide.title}</h1>
          <p style={styles.subtitle}>{slide.subtitle}</p>
          <div style={{ ...styles.highlight, color: slide.accent }}>
            <span style={styles.highlightDot}>●</span>
            {slide.highlight}
          </div>
          <div style={styles.btnRow}>
            <button
              style={{ ...styles.btnPrimary, backgroundColor: slide.accent }}
              onClick={() => navigate(`/san-pham?cat=${slide.cat}`)}
            >
              {slide.btn} →
            </button>
            <button style={styles.btnSecondary} onClick={() => navigate("/san-pham")}>
              Xem tất cả
            </button>
          </div>
        </div>

        {/* RIGHT EMOJI */}
        <div style={{ ...styles.emojiSide, opacity: animating ? 0 : 1, transition: "opacity 0.3s ease" }}>
          <div style={{ ...styles.emojiGlow, backgroundColor: slide.accent + "20" }}>
            <span style={styles.bigEmoji}>{slide.emoji}</span>
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div style={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{ ...styles.dot, backgroundColor: i === current ? slide.accent : "#334155", width: i === current ? "28px" : "8px" }}
          />
        ))}
      </div>

      {/* STATS BAR */}
      <div style={styles.statsBar}>
        {[
          { num: "10,000+", label: "Sản phẩm" },
          { num: "50,000+", label: "Khách hàng" },
          { num: "4.9★", label: "Đánh giá" },
          { num: "24/7", label: "Hỗ trợ" },
        ].map(s => (
          <div key={s.label} style={styles.statItem}>
            <span style={{ ...styles.statNum, color: slide.accent }}>{s.num}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  banner: { position: "relative", overflow: "hidden", minHeight: "420px", display: "flex", flexDirection: "column" },
  bgCircle1: { position: "absolute", width: "600px", height: "600px", borderRadius: "50%", top: "-200px", right: "-100px", pointerEvents: "none" },
  bgCircle2: { position: "absolute", width: "400px", height: "400px", borderRadius: "50%", bottom: "-150px", left: "30%", pointerEvents: "none" },
  bgGrid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" },

  inner: { maxWidth: "1280px", margin: "0 auto", padding: "60px 40px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, position: "relative", zIndex: 1 },

  content: { flex: 1 },
  tag: { display: "inline-block", fontSize: "12px", fontWeight: "700", padding: "6px 14px", borderRadius: "20px", border: "1px solid", marginBottom: "20px", letterSpacing: "0.5px" },
  title: { fontSize: "52px", fontWeight: "900", color: "#f8fafc", margin: "0 0 12px 0", lineHeight: "1.1", letterSpacing: "-1px" },
  subtitle: { fontSize: "18px", color: "#94a3b8", margin: "0 0 16px 0" },
  highlight: { fontSize: "16px", fontWeight: "700", marginBottom: "30px", display: "flex", alignItems: "center", gap: "8px" },
  highlightDot: { fontSize: "8px" },
  btnRow: { display: "flex", gap: "14px", alignItems: "center" },
  btnPrimary: { color: "white", border: "none", padding: "14px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "opacity 0.2s" },
  btnSecondary: { backgroundColor: "transparent", color: "#94a3b8", border: "1px solid #334155", padding: "14px 24px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },

  emojiSide: { display: "flex", alignItems: "center", justifyContent: "center", width: "280px" },
  emojiGlow: { width: "200px", height: "200px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  bigEmoji: { fontSize: "110px", filter: "drop-shadow(0 0 30px rgba(255,255,255,0.1))" },

  dots: { display: "flex", justifyContent: "center", gap: "8px", paddingBottom: "20px", position: "relative", zIndex: 1 },
  dot: { height: "8px", borderRadius: "4px", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 },

  statsBar: { display: "flex", justifyContent: "center", gap: "0", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 40px", borderRight: "1px solid rgba(255,255,255,0.06)" },
  statNum: { fontSize: "20px", fontWeight: "900" },
  statLabel: { fontSize: "12px", color: "#475569", marginTop: "2px" },
};

export default PromoBanner;