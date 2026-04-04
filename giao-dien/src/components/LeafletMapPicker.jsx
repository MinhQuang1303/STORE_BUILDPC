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
  const [selectedAddress, setSelectedAddress] = useState("");
  const [reverseLoading, setReverseLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

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

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!val.trim() || val.trim().length < 4) return;
    searchDebounceRef.current = setTimeout(async () => {
      if (!mapInstanceRef.current) return;
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=1&countrycodes=vn`,
          { headers: { "Accept-Language": "vi" } }
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const L = window.L;
          const latlng = [parseFloat(lat), parseFloat(lon)];
          mapInstanceRef.current.flyTo(latlng, 16, { animate: true, duration: 1 });
          if (markerRef.current) markerRef.current.setLatLng(latlng);
          else markerRef.current = L.marker(latlng).addTo(mapInstanceRef.current);
          const foundAddr = data[0].display_name || val;
          setSelectedAddress(foundAddr);
          onLocationSelect(foundAddr);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 700);
  };

  return (
    <div>
      {/* Search */}
      <div style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0", background: "white" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px" }}>🔍</span>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Nhập địa chỉ để tìm trên bản đồ..."
            style={{ width: "100%", padding: "8px 36px", border: "1px solid #dde2ea", borderRadius: "8px", fontSize: "13px", outline: "none", background: "#f8fafc", boxSizing: "border-box" }}
          />
          {searchLoading && (
            <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#3b82f6", fontSize: "12px" }}>⏳</span>
          )}
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ height: "330px", width: "100%" }} />

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
