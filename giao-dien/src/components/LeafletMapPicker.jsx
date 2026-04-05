// Shared Leaflet map component - dùng vanilla Leaflet qua CDN (tránh lỗi react-leaflet với React 18)
import React, { useEffect, useRef, useState } from "react";

const loadLeaflet = () =>
  new Promise((resolve) => {
    if (window.L) { resolve(window.L); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });

const LeafletMapPicker = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const suggestBoxRef = useRef(null);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [reverseLoading, setReverseLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadLeaflet().then((L) => {
      if (mapInstanceRef.current || !mapRef.current) return;

      const map = L.map(mapRef.current, { zoomControl: true }).setView([10.8231, 106.6297], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      [100, 300, 600, 1000].forEach((ms) => setTimeout(() => map.invalidateSize(), ms));

      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) markerRef.current.setLatLng(e.latlng);
        else markerRef.current = L.marker(e.latlng).addTo(map);

        setShowSuggestions(false);
        setReverseLoading(true);
        setSelectedAddress("Đang tìm địa chỉ...");
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "vi" } }
          );
          const data = await res.json();
          const result = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setSelectedAddress(result);
          setSearchText(result);
          onLocationSelect(result);
        } catch {
          const fb = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setSelectedAddress(fb);
          onLocationSelect(fb);
        } finally {
          setReverseLoading(false);
        }
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Đóng dropdown gợi ý khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestBoxRef.current && !suggestBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    setSuggestions([]);

    // Cho phép nhập tự do - cập nhật địa chỉ ngay khi gõ
    if (val.trim()) {
      setSelectedAddress(val);
      onLocationSelect(val);
    } else {
      setSelectedAddress("");
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!val.trim() || val.trim().length < 3) {
      setShowSuggestions(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=6&countrycodes=vn`,
          { headers: { "Accept-Language": "vi" } }
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 500);
  };

  // Nhấn Enter: chọn gợi ý đầu tiên (nếu có) hoặc dùng text đang gõ
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else if (searchText.trim()) {
        // Dùng địa chỉ tự gõ không cần bản đồ
        setSelectedAddress(searchText.trim());
        onLocationSelect(searchText.trim());
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setSearchText("");
    setSelectedAddress("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (item) => {
    const L = window.L;
    const latlng = [parseFloat(item.lat), parseFloat(item.lon)];
    const addr = item.display_name;

    setSearchText(addr);
    setSelectedAddress(addr);
    setShowSuggestions(false);
    setSuggestions([]);
    onLocationSelect(addr);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(latlng, 16, { animate: true, duration: 1 });
      if (markerRef.current) markerRef.current.setLatLng(latlng);
      else markerRef.current = L.marker(latlng).addTo(mapInstanceRef.current);
    }
  };

  // Lấy tên ngắn gọn từ display_name (phần đầu trước dấu phẩy)
  const getShortName = (displayName) => {
    if (!displayName) return "";
    const parts = displayName.split(",");
    return parts.slice(0, 2).join(",").trim();
  };

  return (
    <div>
      {/* Search */}
      <div style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0", background: "white", position: "relative" }}
        ref={suggestBoxRef}
      >
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px" }}>🔍</span>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Nhập địa chỉ tùy ý hoặc tìm trên bản đồ... (Enter để xác nhận)"
            autoComplete="off"
            style={{
              width: "100%", padding: "9px 64px 9px 36px", border: "2px solid",
              borderColor: showSuggestions ? "#3b82f6" : "#dde2ea",
              borderRadius: showSuggestions ? "8px 8px 0 0" : "8px",
              fontSize: "13px", outline: "none", background: "#f8fafc",
              boxSizing: "border-box", transition: "border-color 0.2s"
            }}
          />
          {/* Nút xóa */}
          {searchText && (
            <button
              onClick={handleClear}
              style={{ position: "absolute", right: searchLoading ? "32px" : "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px", background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: "2px 4px" }}
              title="Xóa"
            >✕</button>
          )}
          {searchLoading && (
            <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>
              ⏳
            </span>
          )}
        </div>

        {/* Dropdown gợi ý địa chỉ */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", left: "12px", right: "12px",
            background: "white", border: "2px solid #3b82f6", borderTop: "none",
            borderRadius: "0 0 10px 10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 99999, overflow: "hidden"
          }}>
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(item)}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderBottom: idx < suggestions.length - 1 ? "1px solid #f1f5f9" : "none",
                  transition: "background 0.15s",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>📍</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", lineHeight: "1.3" }}>
                    {getShortName(item.display_name)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px", lineHeight: "1.4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "520px" }}>
                    {item.display_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ height: "310px", width: "100%" }} />

      {/* Result */}
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", minHeight: "48px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Địa chỉ đã chọn</p>
        <p style={{ fontSize: "13px", color: reverseLoading ? "#3b82f6" : selectedAddress ? "#1e293b" : "#94a3b8", fontWeight: selectedAddress ? "600" : "400", fontStyle: selectedAddress ? "normal" : "italic", margin: 0 }}>
          {reverseLoading ? "Đang tìm địa chỉ..." : selectedAddress || "Click vào điểm bất kỳ trên bản đồ..."}
        </p>
      </div>
    </div>
  );
};

export default LeafletMapPicker;
