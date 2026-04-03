import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";
import { Cpu, LayoutGrid, MemoryStick, Monitor, HardDrive, Zap, Box, Wind, Search, X, Plus, AlertTriangle, CheckCircle, ShoppingCart, Printer } from "lucide-react";

const buildSlots = [
  { id: "CPU", name: "Vi xử lý (CPU)", icon: <Cpu size={24}/>, required: true },
  { id: "Mainboard", name: "Bo mạch chủ", icon: <LayoutGrid size={24}/>, required: true },
  { id: "RAM", name: "RAM", icon: <MemoryStick size={24}/>, required: true },
  { id: "VGA", name: "Card màn hình", icon: <Monitor size={24}/>, required: false },
  { id: "Ổ Cứng", name: "Ổ cứng", icon: <HardDrive size={24}/>, required: true },
  { id: "Nguồn", name: "Nguồn (PSU)", icon: <Zap size={24}/>, required: true },
  { id: "Case", name: "Vỏ máy (Case)", icon: <Box size={24}/>, required: true },
  { id: "Tản Nhiệt", name: "Tản nhiệt", icon: <Wind size={24}/>, required: false },
];

function TrangBuildPC() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [sanPhams, setSanPhams] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loiCauHinh, setLoiCauHinh] = useState([]);
  
  const [activeModalSlot, setActiveModalSlot] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userStorage = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/san-pham");
        setSanPhams(res.data);
      } catch (err) {
        console.error("Lỗi API:", err);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    let errors = [];
    const cpu = selectedItems["CPU"];
    const main = selectedItems["Mainboard"];
    const ram = selectedItems["RAM"];

    if (cpu && main) {
      const regexSocket = /(LGA\s?\d+|AM\d+|Socket\s?\d+)/i;
      const cpuS = cpu.thongSo?.match(regexSocket)?.[0]?.replace(/\s|Socket/gi, "");
      const mainS = main.thongSo?.match(regexSocket)?.[0]?.replace(/\s|Socket/gi, "");
      if (cpuS && mainS && cpuS.toUpperCase() !== mainS.toUpperCase()) {
        errors.push(`Lỗi Socket: CPU (${cpuS}) không khớp với Mainboard (${mainS}).`);
      }
    }

    if (main && ram) {
      const mRam = main.thongSo?.match(/DDR\d/i)?.[0]?.toUpperCase();
      const rRam = ram.thongSo?.match(/DDR\d/i)?.[0]?.toUpperCase();
      if (mRam && rRam && mRam !== rRam) {
        errors.push(`Lỗi RAM: Mainboard hỗ trợ ${mRam} nhưng RAM là ${rRam}.`);
      }
    }
    setLoiCauHinh(errors);
  }, [selectedItems]);

  const tongTien = Object.values(selectedItems).reduce((sum, item) => sum + (item?.gia || 0) * (item?.soLuong || 1), 0);
  const selectedCount = Object.values(selectedItems).length;

  const handleSelectProduct = (product) => {
    setSelectedItems(prev => ({
        ...prev,
        [activeModalSlot]: { ...product, soLuong: 1 }
    }));
    setActiveModalSlot(null);
    setSearchQuery("");
  };

  const handleRemoveProduct = (slotId) => {
    setSelectedItems(prev => {
        const newItems = { ...prev };
        delete newItems[slotId];
        return newItems;
    });
  };

  const handleAddAllToCart = () => {
    if (!userStorage) {
      navigate("/login");
      return;
    }
    if (loiCauHinh.length > 0 || selectedCount === 0) return;
    
    Object.values(selectedItems).forEach(sp => {
        if(addToCart) addToCart(sp, sp.soLuong || 1);
    });
    alert("Đã thêm toàn bộ bộ PC vào giỏ hàng thành công!");
  };

  const handlePrint = () => {
    if (selectedCount === 0) {
        alert("Vui lòng chọn ít nhất 1 linh kiện để in báo giá!");
        return;
    }

    let printContents = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;">
            <div style="text-align: center; border-bottom: 2px solid #e50027; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #e50027; margin: 0;">BÁO GIÁ CẤU HÌNH PC</h1>
                <p style="color: #666; margin-top: 5px;">STORE BUILD PC - Uy tín hàng đầu Việt Nam</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Linh kiện</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Sản phẩm</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Đơn giá</th>
                    </tr>
                </thead>
                <tbody>
    `;

    buildSlots.forEach(slot => {
        const item = selectedItems[slot.id];
        if (item) {
            printContents += `
                <tr>
                    <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">${slot.name}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${item.ten}</td>
                    <td style="padding: 12px; border: 1px solid #ddd; text-align: right; color: #e50027; font-weight: bold;">${item.gia?.toLocaleString()} đ</td>
                </tr>
            `;
        }
    });

    printContents += `
                </tbody>
            </table>
            
            <div style="text-align: right; font-size: 24px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
                Khách cần thanh toán: <span style="color: #e50027;">${tongTien.toLocaleString()} đ</span>
            </div>
            
            <div style="margin-top: 50px; text-align: center; font-style: italic; color: #888; font-size: 14px;">
                * Báo giá có giá trị trong ngày. Vui lòng liên hệ Hotline 1900.1234 để được hỗ trợ.
            </div>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>In Cấu Hình PC</title></head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Đợi ảnh load xong mới in
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 500);
  };

  const modalProducts = sanPhams.filter(sp => {
    if(!activeModalSlot) return false;
    const matchType = sp.loai === activeModalSlot;
    const matchSearch = sp.ten.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="bg-[#f1f5f9] min-h-screen pb-40 font-sans">
      
      {/* HEADER BUILD PC */}
      <div className="bg-white border-b border-slate-200 py-8 mb-8 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <span className="bg-slate-900 text-white p-2 rounded-xl"><LayoutGrid size={28}/></span>
                XÂY DỰNG CẤU HÌNH PC
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">Công cụ lắp ráp PC chuyên nghiệp, tự động kiểm tra tương thích phần cứng.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        
        {/* Lỗi Tương Thích Box */}
        {loiCauHinh.length > 0 && (
            <div className="bg-slate-50 border-l-4 border-red-600 p-5 rounded-r-xl mb-8 shadow-sm flex items-start gap-4 animate-pulse">
                <AlertTriangle className="text-red-600 flex-shrink-0" size={28}/>
                <div>
                    <h3 className="font-bold text-red-800 text-lg mb-2">Phát hiện lỗi tương thích phần cứng!</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {loiCauHinh.map((err, idx) => (
                            <li key={idx} className="text-red-700 font-medium text-sm">{err}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )}

        {/* THÂN BUILD PC (SLOTS) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {buildSlots.map((slot, index) => {
                const selected = selectedItems[slot.id];
                
                return (
                    <div key={slot.id} className={`flex flex-col md:flex-row items-center p-4 md:p-6 transition-colors ${index !== buildSlots.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 group`}>
                        
                        {/* Cột trái: Tên Slot */}
                        <div className="w-full md:w-56 flex items-center gap-4 mb-4 md:mb-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-inner ${selected ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                {slot.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">{slot.name}</h3>
                                {slot.required && <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Bắt buộc</span>}
                            </div>
                        </div>

                        {/* Cột giữa: Nội dung sản phẩm */}
                        <div className="flex-1 w-full pl-0 md:pl-6">
                            {selected ? (
                                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border-2 border-blue-500 shadow-sm relative">
                                    <img src={selected.anh} alt={selected.ten} className="w-16 h-16 object-contain bg-slate-50 rounded-lg p-1"/>
                                    <div className="flex-1 pr-6">
                                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug">{selected.ten}</h4>
                                        <div className="text-blue-600 font-black mt-1">{selected.gia?.toLocaleString()} ₫</div>
                                    </div>
                                    <button 
                                        className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-slate-500 hover:text-white transition-colors shadow-sm"
                                        onClick={() => handleRemoveProduct(slot.id)}
                                        title="Xóa linh kiện này"
                                    >
                                        <X size={16}/>
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 flex items-center justify-center min-h-[90px]">
                                    <p className="text-slate-400 text-sm font-medium">Vui lòng chọn linh kiện</p>
                                </div>
                            )}
                        </div>

                        {/* Cột phải: Button Chọn */}
                        <div className="w-full md:w-40 flex justify-end mt-4 md:mt-0 pl-0 md:pl-6">
                            {selected ? (
                                <button 
                                    className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 transition-colors w-full md:w-auto flex items-center justify-center gap-2"
                                    onClick={() => setActiveModalSlot(slot.id)}
                                >
                                    Đổi lại
                                </button>
                            ) : (
                                <button 
                                    className="px-6 py-3 font-bold text-white bg-slate-900 border border-red-600 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-slate-800 hover:scale-105 transition-all w-full md:w-auto flex items-center justify-center gap-2 group-hover:animate-pulse"
                                    onClick={() => setActiveModalSlot(slot.id)}
                                >
                                    <Plus size={18}/> Chọn
                                </button>
                            )}
                        </div>

                    </div>
                )
            })}
        </div>
      </div>

      {/* BOTTOM STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-6 w-full md:w-auto">
                <div>
                    <div className="text-slate-500 text-sm font-medium mb-1">Cấu hình đã chọn</div>
                    <div className="font-black text-slate-800"><span className="text-blue-600">{selectedCount}</span>/{buildSlots.length} linh kiện</div>
                </div>
                <div className="h-10 w-px bg-slate-200"></div>
                <div>
                    <div className="text-slate-500 text-sm font-medium mb-1">Tổng chi phí dự kiến</div>
                    <div className="font-black text-blue-600 text-2xl">{tongTien.toLocaleString()} ₫</div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <button 
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    onClick={handlePrint}
                >
                    <Printer size={20}/> In Báo Giá (PDF)
                </button>
                <button 
                    className={`flex-1 md:flex-none px-8 py-3 font-black rounded-xl text-white shadow-xl transition-all flex items-center justify-center gap-2 ${loiCauHinh.length > 0 || selectedCount === 0 ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-blue-500/40'}`}
                    disabled={loiCauHinh.length > 0 || selectedCount === 0}
                    onClick={handleAddAllToCart}
                >
                    <ShoppingCart size={20}/> THÊM VÀO GIỎ HÀNG
                </button>
            </div>

        </div>
      </div>

      {/* MODAL / POPUP CHỌN LINH KIỆN */}
      {activeModalSlot && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Chọn {buildSlots.find(s => s.id === activeModalSlot)?.name}
                    </h2>
                    <button 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-colors"
                        onClick={() => setActiveModalSlot(null)}
                    >
                        <X size={24}/>
                    </button>
                </div>

                {/* Modal Search Box */}
                <div className="p-4 border-b border-slate-100 relative">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên sản phẩm..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Modal Product List */}
                <div className="overflow-y-auto flex-1 p-4 bg-slate-100">
                    {modalProducts.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 flex flex-col items-center">
                            <Box size={48} className="mb-4 opacity-30"/>
                            <p>Không tìm thấy linh kiện nào phù hợp.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {modalProducts.map(sp => (
                                <div key={sp._id} className="bg-white border text-left border-slate-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col group relative">
                                    <div className="h-32 mb-4 flex justify-center items-center">
                                        <img src={sp.anh} alt={sp.ten} className="max-h-full object-contain group-hover:scale-110 transition-transform"/>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors h-10">{sp.ten}</h4>
                                    <div className="text-blue-600 font-black text-lg mt-auto mb-3">{sp.gia?.toLocaleString()} ₫</div>
                                    
                                    {/* Nút chọn */}
                                    {selectedItems[activeModalSlot]?._id === sp._id ? (
                                        <button className="w-full py-2 bg-slate-100 text-slate-400 font-bold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                                            <CheckCircle size={18}/> Đang chọn
                                        </button>
                                    ) : (
                                        <button 
                                            className="w-full py-2 border-2 border-blue-500 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                                            onClick={() => handleSelectProduct(sp)}
                                        >
                                            CHỌN
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
      )}

    </div>
  );
}

export default TrangBuildPC;