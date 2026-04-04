import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PromoBanner from "../../components/PromoBanner";
import FlashSale from "../../components/FlashSale";

import { CartContext } from "../../context/CartContext"; 
import { ShoppingCart, CheckCircle, ChevronRight, Monitor, Cpu, HardDrive, LayoutGrid, Zap, Box, Wind, MemoryStick } from 'lucide-react';

const TrangChu = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); 
  const [sanPhams, setSanPhams] = useState({ hot: [], new: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const categoryCards = [
    { id: "CPU", icon: <Cpu size={32}/>, name: "Vi xử lý (CPU)", img: "https://nguyencongpc.vn/media/category/cat_d1d184081c70e3edcaab.jpg" },
    { id: "VGA", icon: <Monitor size={32}/>, name: "Card màn hình", img: "https://nguyencongpc.vn/media/category/cat_7c3a0778c7eb49a8badf.jpg" },
    { id: "Mainboard", icon: <LayoutGrid size={32}/>, name: "Bo mạch chủ", img: "https://nguyencongpc.vn/media/category/cat_9b3e107f9754f9a71f00.jpg" },
    { id: "RAM", icon: <MemoryStick size={32}/>, name: "RAM", img: "https://nguyencongpc.vn/media/category/cat_32fe9f8ee18cc85d85d7.jpg" },
    { id: "Ổ Cứng", icon: <HardDrive size={32}/>, name: "Ổ cứng", img: "https://nguyencongpc.vn/media/category/cat_006a8f1ddde2cf42ceb3.jpg" },
    { id: "Nguồn", icon: <Zap size={32}/>, name: "Nguồn (PSU)", img: "https://nguyencongpc.vn/media/category/cat_34cf81cd5eff423c1032.jpg" },
    { id: "Case", icon: <Box size={32}/>, name: "Vỏ máy (Case)", img: "https://nguyencongpc.vn/media/category/cat_ac8f8be22fbfa919c4d9.jpg" },
    { id: "Tản Nhiệt", icon: <Wind size={32}/>, name: "Tản nhiệt", img: "https://nguyencongpc.vn/media/category/cat_6fc917e79397f25e985b.png" },
  ];

  useEffect(() => {
    const fetchSanPhams = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/san-pham`);
        setSanPhams({
            hot: res.data.slice(0, 10),
            new: res.data.slice(10, 20)
        });
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchSanPhams();
  }, []);

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) addToCart(item, 1); 
  };

  const currentProducts = activeTab === "all" ? sanPhams.hot : sanPhams.hot.filter(p => p.loai === activeTab);

  return (
    <div className="bg-[#f1f5f9] min-h-screen pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        
        {/* Banner Section */}
        <div className="mb-10">
            <PromoBanner />
        </div>

        {/* Flash Sale Section */}
        <div className="mb-14">
            <FlashSale />
        </div>

        {/* Category Features */}
        <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
                    <LayoutGrid size={28} className="text-blue-600"/> Danh Mục Nổi Bật
                </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categoryCards.map((cat) => (
                    <div 
                        key={cat.id} 
                        onClick={() => navigate(`/san-pham?cat=${cat.id.toLowerCase()}`)}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-600 transition-all"
                    >
                        <div className="h-32 flex items-center justify-center p-4">
                            <img src={cat.img} alt={cat.name} className="h-full object-contain group-hover:scale-110 transition-transform duration-300" onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}/>
                        </div>
                        <div className="bg-slate-50 border-t border-slate-100 p-3 text-center transition-colors group-hover:bg-slate-900">
                            <h3 className="font-bold text-[15px] text-slate-800 group-hover:text-white transition-colors">{cat.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* HOT PRODUCTS TABS */}
        <div className="mb-8 border-b-2 border-blue-600 flex gap-2 overflow-x-auto pb-0">
            <button 
                className={`px-6 py-3 font-bold uppercase text-sm rounded-t-lg transition-colors ${activeTab === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:text-blue-600"}`}
                onClick={() => setActiveTab("all")}
            >Top Bán Chạy</button>
            <button 
                className={`px-6 py-3 font-bold uppercase text-sm rounded-t-lg transition-colors ${activeTab === "CPU" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:text-blue-600"}`}
                onClick={() => setActiveTab("CPU")}
            >Vi xử lý (CPU)</button>
            <button 
                className={`px-6 py-3 font-bold uppercase text-sm rounded-t-lg transition-colors ${activeTab === "VGA" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:text-blue-600"}`}
                onClick={() => setActiveTab("VGA")}
            >Card màn hình (VGA)</button>
            <button 
                className={`px-6 py-3 font-bold uppercase text-sm rounded-t-lg transition-colors ${activeTab === "Mainboard" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:text-blue-600"}`}
                onClick={() => setActiveTab("Mainboard")}
            >Bo mạch chủ</button>
        </div>

        {/* PRODUCT GRID */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Đang tải dữ liệu sản phẩm...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-20">
            {currentProducts.map((item) => (
                <div 
                    key={item._id} 
                    className="bg-white rounded-xl p-4 flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 hover:border-blue-500 transition-all cursor-pointer relative"
                    onClick={() => navigate(`/san-pham/${item._id}`)}
                >
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-slate-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                        {item.loai}
                    </div>

                    {/* Image */}
                    <div className="h-44 w-full flex items-center justify-center mb-4">
                        <img 
                            src={item.anh || item.hinhAnh} 
                            alt={item.ten} 
                            className="max-h-full max-w-full object-contain group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300" 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/200' }} 
                        />
                    </div>
                    
                    {/* Info */}
                    <h3 className="font-bold text-slate-800 text-[14px] leading-tight h-10 overflow-hidden mb-2 group-hover:text-blue-600 line-clamp-2">
                        {item.ten}
                    </h3>
                    
                    <div className="text-[11px] text-slate-500 mb-4 bg-slate-50 p-2 rounded border border-slate-100 flex-1 line-clamp-2">
                        {item.thongSo || "Đang cập nhật thông số kĩ thuật chi tiết."}
                    </div>
                    
                    <div className="flex flex-col mt-auto">
                        <div className="text-slate-400 text-xs line-through mb-0.5">{(item.gia * 1.05).toLocaleString()}đ</div>
                        <div className="text-blue-600 text-[18px] font-black mb-3">{item.gia?.toLocaleString()}đ</div>
                        
                        <div className="flex gap-2">
                            <button 
                                className="flex-1 border-2 border-slate-200 text-slate-700 font-bold text-sm py-2 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
                            >
                                Chi tiết
                            </button>
                            <button 
                                className="w-11 h-10 flex items-center justify-center bg-slate-50 text-blue-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors border border-slate-200 group/btn"
                                onClick={(e) => handleAddToCart(e, item)}
                            >
                                <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}

        {/* BUILD PC BANNER (Gaming Style) */}
        <div 
            className="rounded-3xl overflow-hidden relative shadow-2xl"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
            
            <div className="relative z-10 p-12 md:p-20 md:w-2/3">
                <div className="inline-block bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    Công cụ chuyên nghiệp
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                    TỰ TIN <span className="text-blue-400">BUILD PC</span><br/>THEO CÁCH CỦA BẠN
                </h2>
                <ul className="space-y-4 mb-10 text-slate-300 font-medium">
                    <li className="flex items-center gap-3"><CheckCircle className="text-green-400" size={20}/> Tự động kiểm tra xung đột phần cứng</li>
                    <li className="flex items-center gap-3"><CheckCircle className="text-green-400" size={20}/> Đề xuất cấu hình chuẩn theo ngân sách</li>
                    <li className="flex items-center gap-3"><CheckCircle className="text-green-400" size={20}/> Xuất file báo giá, ảnh cấu hình nhanh chóng</li>
                </ul>
                <button 
                    onClick={() => navigate("/build")}
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-black hover:bg-yellow-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                >
                    TRẢI NGHIỆM NGAY <ChevronRight size={24}/>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TrangChu;