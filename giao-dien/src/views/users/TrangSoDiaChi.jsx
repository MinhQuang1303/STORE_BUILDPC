import React, { useEffect, useState, useRef } from "react";
import UserSidebar from "../../components/UserSidebar";

// Sử dụng Leaflet thuần qua CDN (không dùng react-leaflet để tránh xung đột)
const loadLeaflet = () => {
  return new Promise((resolve) => {
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
};

// Component bản đồ thuần Leaflet
const LeafletMap = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [reverseLoading, setReverseLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    loadLeaflet().then((L) => {
      if (mapInstanceRef.current || !mapRef.current) return;

      const map = L.map(mapRef.current, { zoomControl: true }).setView([10.8231, 106.6297], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Fix tile rendering: call invalidateSize multiple times to ensure tiles load
      [100, 300, 600, 1000].forEach(ms => setTimeout(() => { map.invalidateSize(); }, ms));

      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = L.marker(e.latlng).addTo(map);
        }
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
          const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setSelectedAddress(fallback);
          onLocationSelect(fallback);
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

  // Search address → pan map
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

          // Place marker
          if (markerRef.current) {
            markerRef.current.setLatLng(latlng);
          } else {
            markerRef.current = L.marker(latlng).addTo(mapInstanceRef.current);
          }
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
    <div className="flex flex-col h-full">
      {/* Search box */}
      <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Nhập địa chỉ để tìm trên bản đồ..."
            className="w-full pl-9 pr-10 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-slate-50"
          />
          {searchLoading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xs animate-pulse">⏳</span>
          )}
        </div>
      </div>

      {/* Map - fixed height to avoid tile rendering bug */}
      <div ref={mapRef} style={{ height: "330px", width: "100%" }} />

      {/* Selected address */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex-shrink-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Địa chỉ đã chọn</p>
        <p className={`text-sm leading-snug min-h-[18px] ${reverseLoading ? "text-blue-500 animate-pulse" : selectedAddress ? "text-slate-800 font-medium" : "text-slate-400 italic"}`}>
          {selectedAddress || "Click vào bất kỳ điểm nào trên bản đồ..."}
        </p>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const TrangSoDiaChi = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "", isDefault: false });

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [pendingMapAddress, setPendingMapAddress] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const userData = parsed.user || parsed;
        setUser(userData);
        if (userData?._id) fetchAddresses(userData._id);
      } catch {}
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAddresses = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user-addresses/user/${userId}`);
      const data = await res.json();
      if (data.success) setAddresses(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (addr = null) => {
    if (addr) {
      setEditingId(addr._id);
      setFormData({ fullName: addr.fullName || "", phone: addr.phone || "", address: addr.address || "", isDefault: addr.isDefault || false });
    } else {
      setEditingId(null);
      setFormData({ fullName: user?.fullName || user?.username || "", phone: user?.phone || "", address: "", isDefault: false });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingId(null); };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    const payload = { ...formData, userId: user._id };
    try {
      const url = editingId ? `http://localhost:5000/api/user-addresses/${editingId}` : `http://localhost:5000/api/user-addresses`;
      const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { fetchAddresses(user._id); handleCloseModal(); }
      else alert(data.message || "Có lỗi xảy ra");
    } catch { alert("Lỗi kết nối"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/user-addresses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchAddresses(user._id);
    } catch {}
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user-addresses/${id}/default`, { method: "PUT" });
      const data = await res.json();
      if (data.success) fetchAddresses(user._id);
    } catch {}
  };

  const handleOpenMap = () => { setPendingMapAddress(""); setIsMapOpen(true); };

  const handleConfirmMap = () => {
    if (pendingMapAddress) setFormData(prev => ({ ...prev, address: pendingMapAddress }));
    setIsMapOpen(false);
  };

  if (loading) return <div className="text-center p-20 font-bold text-slate-500">Đang tải thông tin...</div>;
  if (!user) return <div className="text-center p-20 font-bold text-slate-500">Vui lòng đăng nhập</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <UserSidebar user={user} />

        <div className="md:w-3/4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Sổ Địa Chỉ</h3>
                <p className="text-slate-500 text-sm">Quản lý địa chỉ giao hàng và nhận hàng</p>
              </div>
              <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                + Thêm Địa Chỉ
              </button>
            </div>

            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <div className="text-5xl mb-3">📍</div>
                  <p className="font-semibold">Bạn chưa có địa chỉ nào.</p>
                  <p className="text-sm mt-1">Hãy thêm địa chỉ để đặt hàng nhanh hơn!</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr._id} className={`border ${addr.isDefault ? "border-blue-200 bg-blue-50/50" : "border-slate-200"} rounded-xl p-6 relative`}>
                    <div className="absolute top-6 right-6 flex gap-3 text-sm font-semibold">
                      <button onClick={() => handleOpenModal(addr)} className="text-blue-600 hover:text-blue-800 transition-colors">Sửa</button>
                      <button onClick={() => handleDelete(addr._id)} className="text-red-500 hover:text-red-700 transition-colors">Xóa</button>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-slate-800">{addr.fullName}</h4>
                      {addr.isDefault ? (
                        <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Mặc định</span>
                      ) : (
                        <button onClick={() => handleSetDefault(addr._id)} className="text-xs bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 font-bold px-2.5 py-1 rounded-full transition-colors">
                          Thiết lập mặc định
                        </button>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium text-sm mb-1">{addr.phone}</p>
                    <p className="text-slate-500 text-sm">{addr.address}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL THÊM/SỬA ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và tên người nhận <span className="text-red-500">*</span></label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Nhập họ tên" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-700">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                  <button type="button" onClick={handleOpenMap}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full transition-colors">
                    🗺️ Chọn từ Bản Đồ
                  </button>
                </div>
                <textarea name="address" value={formData.address} onChange={handleInputChange} required rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <label htmlFor="isDefault" className="text-sm font-medium text-slate-700 cursor-pointer">Đặt làm địa chỉ mặc định</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-colors">Lưu địa chỉ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL BẢN ĐỒ ===== */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">🗺️ Chọn địa chỉ từ Bản Đồ</h3>
                <p className="text-xs text-slate-500 mt-0.5">Nhập địa chỉ ở ô tìm kiếm, hoặc click thẳng lên bản đồ</p>
              </div>
              <button onClick={() => setIsMapOpen(false)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">×</button>
            </div>

            {/* Map component */}
            <LeafletMap onLocationSelect={setPendingMapAddress} />

            {/* Footer buttons */}
            <div className="px-6 py-3 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button type="button" onClick={() => setIsMapOpen(false)} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors text-sm">
                Hủy
              </button>
              <button type="button" onClick={handleConfirmMap} disabled={!pendingMapAddress}
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                ✓ Xác nhận địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrangSoDiaChi;
