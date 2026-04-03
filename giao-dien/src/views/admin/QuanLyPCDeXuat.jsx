import React, { useState, useEffect } from "react";
import axios from "axios";
import PhanTrang from "../../components/PhanTrang";

const formatImageUrl = (url) => {
  if (!url) return 'https://placehold.co/200';
  if (url.startsWith('/uploads')) return `${process.env.REACT_APP_API_URL?.replace('/api', '') || "http://localhost:5000"}${url}`;
  return url;
};

const SLOTS = [
  { id: "cpu", name: "Vi xử lý (CPU)", keywords: ["CPU", "Vi xử lý"] },
  { id: "main", name: "Bo mạch chủ (Mainboard)", keywords: ["Mainboard", "Bo mạch chủ"] },
  { id: "ram", name: "Bộ nhớ trong (RAM)", keywords: ["RAM"] },
  { id: "ssd", name: "Ổ cứng (SSD)", keywords: ["SSD", "Ổ cứng"] },
  { id: "vga", name: "Card màn hình (VGA)", keywords: ["VGA", "Card"] },
  { id: "psu", name: "Nguồn (PSU)", keywords: ["Nguồn", "PSU"] },
  { id: "case", name: "Vỏ máy tính (Case)", keywords: ["Case", "Vỏ", "Thùng"] },
  { id: "tanNhiet", name: "Tản nhiệt", keywords: ["Tản nhiệt", "Cooler", "Tản"] },
];

const QuanLyPCDeXuat = () => {
  const [pcs, setPcs] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // File state cho HÌNH ẢNH CHUNG của PC
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // File state cho HÌNH ẢNH PHỤ
  const [filesPhu, setFilesPhu] = useState([]);
  const [previewsPhu, setPreviewsPhu] = useState([]);

  // Dữ liệu chung
  const [info, setInfo] = useState({ name: "", price: "", tags: "", image: "" });
  // Dữ liệu các slot (lưu {product, quantity})
  const [selectedComponents, setSelectedComponents] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sub-modal chọn linh kiện
  const [activeSlot, setActiveSlot] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const API_URL = `${API_BASE}/cau-hinh-mau`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resPCs, resSP] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${API_BASE}/san-pham`)
      ]);
      setPcs(resPCs.data);
      setSanPhams(resSP.data);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setLoading(false);
    }
  };

  const parseProductString = (str, spList) => {
    if (!str) return null;
    const [ten, qtyStr] = str.split(";;;");
    const qty = parseInt(qtyStr) || 1;
    const p = spList.find(x => x.ten === ten) || { ten: ten, gia: 0, anh: "" };
    return { product: p, quantity: qty };
  };

  const handleOpenModal = (data = null) => {
    if (data) {
      setEditData(data);
      setInfo({
        name: data.name || "",
        price: data.price || "",
        tags: data.tags ? data.tags.join(",") : "",
        image: data.image || ""
      });
      setSelectedComponents({
        cpu: parseProductString(data.cpu, sanPhams),
        main: parseProductString(data.main, sanPhams),
        ram: parseProductString(data.ram, sanPhams),
        ssd: parseProductString(data.ssd, sanPhams),
        vga: parseProductString(data.vga, sanPhams),
        psu: parseProductString(data.psu, sanPhams),
        case: parseProductString(data.case, sanPhams),
        tanNhiet: parseProductString(data.tanNhiet, sanPhams),
      });
      setPreview(data.image);
      setPreviewsPhu(data.hinhAnhKhac || []);
    } else {
      setEditData(null);
      setInfo({ name: "", price: "", tags: "", image: "" });
      setSelectedComponents({});
      setPreview(null);
      setPreviewsPhu([]);
    }
    setFile(null);
    setFilesPhu([]);
    setShowModal(true);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    Object.values(selectedComponents).forEach(comp => {
      if (comp && comp.product && comp.product.gia) {
        total += comp.product.gia * comp.quantity;
      }
    });
    return total;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFilesPhuChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFilesPhu(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewsPhu(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const submitData = new FormData();
      submitData.append("ten", info.name);
      submitData.append("gia", info.price || calculateTotalPrice());
      submitData.append("tags", info.tags);

      // Thêm tên và số lượng linh kiện cách nhau bởi ;;;
      if (selectedComponents.cpu) submitData.append("cpu", `${selectedComponents.cpu.product.ten};;;${selectedComponents.cpu.quantity}`);
      if (selectedComponents.main) submitData.append("main", `${selectedComponents.main.product.ten};;;${selectedComponents.main.quantity}`);
      if (selectedComponents.ram) submitData.append("ram", `${selectedComponents.ram.product.ten};;;${selectedComponents.ram.quantity}`);
      if (selectedComponents.ssd) submitData.append("ssd", `${selectedComponents.ssd.product.ten};;;${selectedComponents.ssd.quantity}`);
      if (selectedComponents.vga) submitData.append("vga", `${selectedComponents.vga.product.ten};;;${selectedComponents.vga.quantity}`);
      if (selectedComponents.psu) submitData.append("psu", `${selectedComponents.psu.product.ten};;;${selectedComponents.psu.quantity}`);
      if (selectedComponents.case) submitData.append("case", `${selectedComponents.case.product.ten};;;${selectedComponents.case.quantity}`);
      if (selectedComponents.tanNhiet) submitData.append("tanNhiet", `${selectedComponents.tanNhiet.product.ten};;;${selectedComponents.tanNhiet.quantity}`);

      if (file) {
        submitData.append("anh", file);
      } else {
        submitData.append("anh", info.image);
      }
      
      filesPhu.forEach((f) => {
        submitData.append("hinhAnhKhac", f);
      });

      // Bổ sung hỗ trợ giữ lại ảnh phụ nếu không upload mới
      if (filesPhu.length === 0 && previewsPhu.length > 0) {
         submitData.append("hinhAnhKhacStr", previewsPhu.join(","));
      }

      if (editData) {
        await axios.put(`${API_URL}/${editData.id}`, submitData);
      } else {
        await axios.post(API_URL, submitData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá cấu hình này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (err) {
        alert("Lỗi khi xoá: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Logic filter san pham theo Modal hien tai
  const getFilteredProductsForActiveSlot = () => {
    if (!activeSlot) return [];
    const keywords = activeSlot.keywords;
    return sanPhams.filter(p => {
      const catName = p.idDanhMuc?.ten?.toUpperCase() || "";
      const isMatchCat = keywords.some(kw => catName.includes(kw.toUpperCase()));
      const isMatchSearch = p.ten.toLowerCase().includes(searchProduct.toLowerCase());
      return isMatchCat && isMatchSearch;
    });
  };

  const handleSelectProduct = (product) => {
    setSelectedComponents(prev => ({ ...prev, [activeSlot.id]: { product, quantity: 1 } }));
    setActiveSlot(null);
    setSearchProduct("");
  };

  const handleRemoveComponent = (slotId) => {
    const newComps = { ...selectedComponents };
    delete newComps[slotId];
    setSelectedComponents(newComps);
  };

  const handleChangeQty = (slotId, delta) => {
    setSelectedComponents(prev => {
      const comp = prev[slotId];
      if (!comp) return prev;
      const newQty = Math.max(1, comp.quantity + delta);
      return { ...prev, [slotId]: { ...comp, quantity: newQty } };
    });
  };

  // Giữ lấy tên sản phẩm gốc chứ không lấy dấu ;;;
  const displayNameOnly = (str) => {
    if (!str) return "";
    return str.split(";;;")[0];
  };

  const filteredPCs = pcs.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPCs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý PC Đề Xuất</h2>
          <p className="text-sm text-gray-500">Giao diện Build PC mẫu như người dùng</p>
        </div>
        <div className="flex gap-3 relative">
          <input
            type="text"
            placeholder="Tìm tên PC..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none w-64"
          />
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
          >
            + Thêm PC
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4">Tên cấu hình</th>
                <th className="px-6 py-4">Giá tiền</th>
                <th className="px-6 py-4">Cấu hình gọn</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img src={formatImageUrl(item.image)} className="w-16 h-16 object-cover rounded border" alt="" />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4 font-bold text-red-600">{item.price?.toLocaleString()} đ</td>
                  <td className="px-6 py-4 text-xs italic text-gray-500">{displayNameOnly(item.cpu)} <br/> {displayNameOnly(item.vga)}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleOpenModal(item)} className="text-blue-600 font-bold mr-4">Sửa</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold">Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PhanTrang itemsPerPage={itemsPerPage} totalItems={filteredPCs.length} paginate={setCurrentPage} currentPage={currentPage} />
        </div>
      )}

      {/* Main Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-100 rounded-2xl shadow-2xl max-w-6xl w-full h-[95vh] flex flex-col overflow-hidden relative">
            <div className="bg-white p-6 border-b border-gray-200 flex justify-between shrink-0">
              <h3 className="text-xl font-bold uppercase text-blue-700">
                {editData ? "Cập Nhật PC Mẫu" : "Build PC Mẫu Mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 font-bold">✖ Đóng</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Build Slots */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 uppercase text-sm">Danh sách linh kiện</h4>
                  
                  <div className="space-y-0 shadow-sm border rounded-xl overflow-hidden divide-y divide-gray-100">
                    {SLOTS.map((slot) => {
                      const comp = selectedComponents[slot.id];
                      return (
                        <div key={slot.id} className="p-4 flex items-center bg-white hover:bg-slate-50 transition-colors">
                          {/* Left: Icon & Label */}
                          <div className="w-[180px] pr-4 shrink-0">
                            <div className="text-sm font-bold text-slate-700">{slot.name}</div>
                          </div>
                          
                          {/* Right: Content */}
                          <div className="flex-1 flex justify-between items-center pl-4 border-l border-gray-100 min-h-[50px] min-w-0">
                            {comp && comp.product ? (
                              <div className="flex items-center w-full min-w-0">
                                <img src={formatImageUrl(comp.product.anh)} alt="" className="w-12 h-12 object-contain rounded mr-3 bg-white border shrink-0" />
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="text-sm font-bold text-slate-800 truncate" title={comp.product.ten}>{comp.product.ten}</div>
                                  <div className="text-sm font-bold text-red-500">{comp.product.gia?.toLocaleString()} đ</div>
                                </div>
                                <div className="flex items-center space-x-1 shrink-0 bg-slate-100 rounded p-1 mr-4 border">
                                  <button type="button" className="px-2 font-bold hover:bg-slate-200 rounded" onClick={() => handleChangeQty(slot.id, -1)}>-</button>
                                  <span className="text-xs font-bold w-4 text-center">{comp.quantity}</span>
                                  <button type="button" className="px-2 font-bold hover:bg-slate-200 rounded" onClick={() => handleChangeQty(slot.id, 1)}>+</button>
                                </div>
                                <div className="flex flex-col space-y-2 shrink-0">
                                  <button type="button" onClick={() => setActiveSlot(slot)} className="text-xs text-blue-600 hover:text-blue-800 font-bold text-right w-[40px]">Sửa</button>
                                  <button type="button" onClick={() => handleRemoveComponent(slot.id)} className="text-xs text-red-500 hover:text-red-700 font-bold text-right w-[40px]">Xóa</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <div className="text-sm italic text-gray-400">Vui lòng chọn linh kiện</div>
                                <button type="button" onClick={() => setActiveSlot(slot)} className="text-xs px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white font-bold transition-colors shrink-0">
                                  + Chọn
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              
              {/* Right Column: Info & Summary */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-0">
                  <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 uppercase text-sm">thông tin niêm yết</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Tên cấu hình *</label>
                      <input type="text" required value={info.name} onChange={e => setInfo({...info, name: e.target.value})} className="w-full p-2 border rounded-lg text-sm outline-blue-500" />
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-xs font-bold text-slate-500 mb-1">Chi phí tính linh kiện:</div>
                      <div className="text-xl font-black text-rose-600 mb-2">{calculateTotalPrice().toLocaleString()} đ</div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Giá bán dự kiến (VNĐ) *</label>
                      <input type="number" required value={info.price} onChange={e => setInfo({...info, price: e.target.value})} placeholder={calculateTotalPrice().toString()} className="w-full p-2 border rounded-lg text-sm text-blue-700 font-bold outline-blue-500" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Nội dung cấu hình / Tags mô tả</label>
                      <textarea rows="4" value={info.tags} onChange={e => setInfo({...info, tags: e.target.value})} placeholder="Nhập các Tags nhấn mạnh (Ví dụ: GAMING, RENDER) hoặc mô tả cấu hình..." className="w-full p-3 border rounded-lg text-sm outline-blue-500 resize-y" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Ảnh đại diện chính</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                      {preview && <img src={preview.startsWith('blob:') ? preview : formatImageUrl(preview)} alt="" className="mt-2 w-full h-32 object-contain rounded-xl border border-slate-200 bg-slate-50" />}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Hình ảnh phụ (Album)</label>
                      <input type="file" accept="image/*" multiple onChange={handleFilesPhuChange} className="w-full text-xs file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                      {previewsPhu && previewsPhu.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {previewsPhu.map((src, idx) => (
                            <img key={idx} src={src.startsWith('blob:') ? src : formatImageUrl(src)} alt="" className="w-12 h-12 object-cover rounded border border-slate-200" />
                          ))}
                        </div>
                      )}
                    </div>

                    <button type="button" onClick={handleSubmit} disabled={submitting} className={`w-full py-4 text-white rounded-xl font-black shadow-lg transition-colors mt-4 ${submitting ? 'bg-blue-400' : 'bg-green-600 hover:bg-green-700'}`}>
                      {submitting ? "Đang lưu..." : "LƯU CẤU HÌNH PC"}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Sub Modal: Component Selector */}
      {activeSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-4 bg-slate-900 border-b flex justify-between shrink-0 items-center">
              <h3 className="text-white font-bold uppercase text-sm">Chọn {activeSlot.name}</h3>
              <button onClick={() => setActiveSlot(null)} className="text-slate-400 hover:text-white font-bold p-1 hover:bg-slate-700 rounded transition-colors px-3">Đóng</button>
            </div>
            <div className="p-4 border-b bg-slate-50 shrink-0">
               <input
                 type="text"
                 placeholder={`Tìm kiếm ${activeSlot.name}...`}
                 value={searchProduct}
                 onChange={e => setSearchProduct(e.target.value)}
                 className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                 autoFocus
               />
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
               <div className="space-y-3">
                 {getFilteredProductsForActiveSlot().map(p => (
                   <div key={p._id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center hover:border-blue-300 transition-colors cursor-pointer group" onClick={() => handleSelectProduct(p)}>
                     <img src={formatImageUrl(p.anh)} alt="" className="w-16 h-16 object-contain rounded mr-4 p-1 border" />
                     <div className="flex-1 min-w-0 pr-4">
                       <div className="font-bold text-slate-800 text-sm mb-1 truncate">{p.ten}</div>
                       <div className="text-red-500 font-bold text-sm">{p.gia?.toLocaleString()} đ</div>
                     </div>
                     <button className="px-4 py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 whitespace-nowrap">
                       Chọn ngay
                     </button>
                   </div>
                 ))}
                 {getFilteredProductsForActiveSlot().length === 0 && (
                   <div className="text-center p-8 text-gray-400 italic text-sm">Không tìm thấy linh kiện nào.</div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyPCDeXuat;
