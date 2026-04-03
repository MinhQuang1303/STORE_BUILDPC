import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Search, Filter, ShoppingCart, LayoutGrid, List, ChevronRight } from "lucide-react";
import { CartContext } from "../../context/CartContext";

const TrangSanPham = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { addToCart } = useContext(CartContext);

    // Lấy các tham số từ URL
    const queryCat = searchParams.get("cat") || "";
    const querySearch = searchParams.get("q") || "";

    const [sanPhams, setSanPhams] = useState([]);
    const [danhMucs, setDanhMucs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho bộ lọc và hiển thị
    const [danhMucChon, setDanhMucChon] = useState(queryCat || "Tất cả");
    const [sapXepGia, setSapXepGia] = useState("mac-dinh");
    const [searchQuery, setSearchQuery] = useState(querySearch);
    const [khoangGiaChon, setKhoangGiaChon] = useState("tat-ca");
    const [viewMode, setViewMode] = useState("grid"); // grid hoặc list

    const categories = [
        "Tất cả", "CPU", "Mainboard", "RAM", "VGA", "SSD", "PSU", "Case", "Tản nhiệt"
    ];

    const priceRanges = [
        { id: "tat-ca", name: "Tất cả mức giá" },
        { id: "duoi-5tr", name: "Dưới 5 triệu" },
        { id: "5-10tr", name: "5 - 10 triệu" },
        { id: "10-20tr", name: "10 - 20 triệu" },
        { id: "tren-20tr", name: "Trên 20 triệu" },
    ];

    const handleViewDetail = (e, id) => {
        e.stopPropagation();
        navigate(`/san-pham/${id}`);
    };

    useEffect(() => {
        setSearchQuery(querySearch);
        if (queryCat) setDanhMucChon(queryCat);
    }, [querySearch, queryCat]);

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
                setError("Không thể tải danh sách sản phẩm.");
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Xử lý lọc và sắp xếp
    let filteredProducts = sanPhams.filter(sp => {
        const matchCat = danhMucChon === "Tất cả" || sp.loai === danhMucChon || (sp.idDanhMuc?.ten === danhMucChon);
        const matchSearch = sp.ten.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchPrice = true;
        if (khoangGiaChon === "duoi-5tr") matchPrice = sp.gia < 5000000;
        else if (khoangGiaChon === "5-10tr") matchPrice = sp.gia >= 5000000 && sp.gia <= 10000000;
        else if (khoangGiaChon === "10-20tr") matchPrice = sp.gia >= 10000000 && sp.gia <= 20000000;
        else if (khoangGiaChon === "tren-20tr") matchPrice = sp.gia > 20000000;

        return matchCat && matchSearch && matchPrice;
    });

    if (sapXepGia === "tang-dan") filteredProducts.sort((a, b) => a.gia - b.gia);
    else if (sapXepGia === "giam-dan") filteredProducts.sort((a, b) => b.gia - a.gia);

    const handleQuickAdd = (e, item) => {
        e.stopPropagation();
        if (addToCart) addToCart(item, 1);
    };

    return (
        <div style={styles.pageBackground}>
            <style>{`
                .product-card:hover { transform: translateY(-5px); border-color: #2563eb !important; box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
                .price-radio:checked + span { color: #2563eb; font-weight: 700; }
            `}</style>

            <div style={styles.container}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">Linh Kiện Máy Tính</h1>
                        <p className="text-slate-500 mt-1">Khám phá và xây dựng cấu hình PC mơ ước của bạn</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Bạn tìm linh kiện gì..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                            <button 
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Filter size={18} className="text-blue-600" /> Danh mục
                            </h3>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setDanhMucChon(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${danhMucChon === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-blue-50'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">Khoảng giá</h3>
                            <div className="space-y-3">
                                {priceRanges.map(range => (
                                    <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="priceRange" 
                                            checked={khoangGiaChon === range.id}
                                            onChange={() => setKhoangGiaChon(range.id)}
                                            className="price-radio hidden"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${khoangGiaChon === range.id ? 'border-blue-600' : 'border-slate-300'}`}>
                                            {khoangGiaChon === range.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">{range.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">Sắp xếp theo</h3>
                            <select 
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={sapXepGia}
                                onChange={(e) => setSapXepGia(e.target.value)}
                            >
                                <option value="mac-dinh">Mới nhất</option>
                                <option value="tang-dan">Giá thấp nhất</option>
                                <option value="giam-dan">Giá cao nhất</option>
                            </select>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-slate-500">
                                Tìm thấy <b className="text-slate-900">{filteredProducts.length}</b> sản phẩm phù hợp
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="py-20 text-center">
                                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-slate-500 font-bold">Đang tải sản phẩm...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
                                <Search size={64} className="mx-auto text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy linh kiện</h3>
                                <p className="text-slate-500">Vui lòng thử lại với bộ lọc hoặc từ khóa khác</p>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                                {filteredProducts.map(sp => (
                                    <div 
                                        key={sp._id}
                                        className={`product-card bg-white border border-slate-100 shadow-sm transition-all cursor-pointer flex ${viewMode === 'grid' ? 'flex-col rounded-2xl p-4' : 'flex-row rounded-xl p-3 items-center gap-6'}`}
                                        onClick={() => navigate(`/san-pham/${sp._id}`)}
                                    >
                                        <div className={`${viewMode === 'grid' ? 'h-48 w-full mb-4' : 'h-24 w-24'} shrink-0 flex items-center justify-center bg-white p-2`}>
                                            <img src={sp.anh || sp.hinhAnh} alt={sp.ten} className="max-h-full max-w-full object-contain" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-black uppercase text-blue-600 mb-1 tracking-wider">{sp.loai}</div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">{sp.ten}</h4>
                                            
                                            <div className="flex items-center justify-between mt-auto gap-4">
                                                <div className="text-red-500 font-black text-lg">{sp.gia?.toLocaleString()}đ</div>
                                                <button 
                                                    className={`bg-slate-900 text-white p-2.5 rounded-xl hover:bg-blue-600 transition-colors shadow-lg ${viewMode === 'list' ? 'px-6' : ''}`}
                                                    onClick={(e) => handleQuickAdd(e, sp)}
                                                >
                                                    <ShoppingCart size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageBackground: { backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 0" },
    container: { maxWidth: "1400px", margin: "0 auto", padding: "0 20px" },
};

export default TrangSanPham;