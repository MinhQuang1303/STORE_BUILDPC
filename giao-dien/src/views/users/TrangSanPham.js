import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { Search, Filter, ShoppingCart, LayoutGrid, List, ChevronRight } from "lucide-react";

const TrangSanPham = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);

  const [sanPhams, setSanPhams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy Category từ query param nếu có (ví dụ: ?cat=vga)
  const searchParams = new URLSearchParams(location.search);
  const queryCat = searchParams.get("cat");
  const querySearch = searchParams.get("q");

  const [danhMucChon, setDanhMucChon] = useState("Tất cả");
  const [khoangGiaChon, setKhoangGiaChon] = useState("Tất cả");
  const [sapXepGia, setSapXepGia] = useState("mac-dinh");
  const [searchQuery, setSearchQuery] = useState(querySearch || "");
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const categories = [
    { id: "Tất cả", name: "Tất cả linh kiện" },
    { id: "CPU", name: "Vi xử lý (CPU)" },
    { id: "VGA", name: "Card màn hình (VGA)" },
    { id: "Mainboard", name: "Bo mạch chủ (Main)" },
    { id: "RAM", name: "Bộ nhớ trong (RAM)" },
    { id: "Ổ Cứng", name: "Ổ cứng (SSD/HDD)" },
    { id: "Nguồn", name: "Nguồn (PSU)" },
    { id: "Case", name: "Vỏ Case" },
    { id: "Tản Nhiệt", name: "Tản nhiệt CPU" },
  ];

  const priceRanges = [
    { id: "Tất cả", name: "Tất cả mức giá" },
    { id: "duoi-2", name: "Dưới 2 triệu", min: 0, max: 2000000 },
    { id: "2-5", name: "Từ 2 - 5 triệu", min: 2000000, max: 5000000 },
    { id: "5-10", name: "Từ 5 - 10 triệu", min: 5000000, max: 10000000 },
    { id: "tren-10", name: "Trên 10 triệu", min: 10000000, max: 1000000000 },
  ];

  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/san-pham");
        setSanPhams(res.data);
        setIsLoading(false);
      } catch (err) {
        setError("Không thể kết nối máy chủ. Vui lòng kiểm tra lại Backend.");
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Xử lý query param ban đầu
  useEffect(() => {
    if (queryCat) {
      const match = categories.find(c => c.id.toLowerCase() === queryCat.toLowerCase());
      if (match) setDanhMucChon(match.id);
    }
    if (querySearch) {
      setSearchQuery(querySearch);
    }
  }, [queryCat, querySearch]);

  let filteredProducts = sanPhams.filter((sp) => {
    const matchCategory = danhMucChon === "Tất cả" || sp.loai === danhMucChon;
    const matchSearch = sp.ten.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchPrice = true;
    if (khoangGiaChon !== "Tất cả") {
        const range = priceRanges.find(r => r.id === khoangGiaChon);
        if (range) {
            matchPrice = sp.gia >= range.min && sp.gia <= range.max;
        }
    }

    return matchCategory && matchSearch && matchPrice;
  });

  if (sapXepGia === "tang-dan") {
    filteredProducts.sort((a, b) => a.gia - b.gia);
  } else if (sapXepGia === "giam-dan") {
    filteredProducts.sort((a, b) => b.gia - a.gia);
  } else if (sapXepGia === "a-z") {
    filteredProducts.sort((a, b) => a.ten.localeCompare(b.ten));
  }

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    if (addToCart) addToCart(item, 1);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Trang chủ</span>
            <ChevronRight size={14}/>
            <span className="font-bold text-slate-800">Linh Kiện PC</span>
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-800">
                    <span className="text-blue-600">Tất cả</span> Linh Kiện
                </h1>
                <p className="text-slate-500 text-sm mt-1">Cập nhật linh kiện PC chính hãng, đa dạng mẫu mã</p>
            </div>
            
            <div className="relative w-full md:w-96 group">
                <input
                    type="text"
                    placeholder="Tìm theo tên linh kiện, mã sản phẩm..."
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-red-100 transition-all text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" />
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR BỘ LỌC */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 sticky top-24">
                <div className="flex items-center gap-2 font-bold text-lg mb-5 border-b border-slate-100 pb-4">
                    <Filter size={20} className="text-blue-600"/> <span>Bộ lọc sản phẩm</span>
                </div>

                {/* Filter Danh mục */}
                <div className="mb-8">
                    <h3 className="font-bold text-[15px] mb-3 text-slate-800">Danh mục</h3>
                    <div className="flex flex-col gap-2">
                        {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio" 
                                name="category" 
                                className="w-4 h-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                checked={danhMucChon === cat.id}
                                onChange={() => setDanhMucChon(cat.id)}
                            />
                            <span className={`text-sm font-medium transition-colors ${danhMucChon === cat.id ? "text-blue-600" : "text-slate-600 group-hover:text-blue-600"}`}>
                                {cat.name}
                            </span>
                        </label>
                        ))}
                    </div>
                </div>

                {/* Filter Giá */}
                <div className="mb-4">
                    <h3 className="font-bold text-[15px] mb-3 text-slate-800">Khoảng giá</h3>
                    <div className="flex flex-col gap-2">
                        {priceRanges.map((range) => (
                        <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio" 
                                name="price" 
                                className="w-4 h-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                checked={khoangGiaChon === range.id}
                                onChange={() => setKhoangGiaChon(range.id)}
                            />
                            <span className={`text-sm font-medium transition-colors ${khoangGiaChon === range.id ? "text-blue-600" : "text-slate-600 group-hover:text-blue-600"}`}>
                                {range.name}
                            </span>
                        </label>
                        ))}
                    </div>
                </div>
            </div>
          </aside>

          {/* MAIN LIST */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center mb-6 gap-4">
                <span className="text-sm font-medium text-slate-600">
                    Tìm thấy <b className="text-blue-600 text-lg">{filteredProducts.length}</b> sản phẩm
                </span>

                <div className="flex items-center gap-4">
                    {/* View mode toggle */}
                    <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg">
                        <button 
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                            onClick={() => setViewMode('grid')}
                        ><LayoutGrid size={18}/></button>
                        <button 
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                            onClick={() => setViewMode('list')}
                        ><List size={18}/></button>
                    </div>

                    {/* Sắp xếp */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 hidden sm:inline">Sắp xếp:</span>
                        <select
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-600 font-medium"
                            value={sapXepGia}
                            onChange={(e) => setSapXepGia(e.target.value)}
                        >
                            <option value="mac-dinh">Mới cập nhật</option>
                            <option value="tang-dan">Giá: Thấp đến Cao</option>
                            <option value="giam-dan">Giá: Cao đến Thấp</option>
                            <option value="a-z">Tên: A-Z</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ERROR / LOADING */}
            {error && (
                <div className="bg-slate-50 text-red-600 p-4 rounded-xl border border-red-200 text-center font-bold">{error}</div>
            )}
            
            {isLoading ? (
              <div className="py-20 text-center text-slate-500">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Đang tải dữ liệu...
              </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white py-20 px-4 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty" className="w-48 opacity-50 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Không tìm thấy linh kiện!</h3>
                    <p className="text-slate-500 text-sm">Vui lòng thử bỏ bớt bộ lọc hoặc tìm kiếm bằng từ khoá khác.</p>
                </div>
            ) : (
              <div className={`grid gap-5 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'}`}>
                {filteredProducts.map((sp) => (
                  <div
                    key={sp._id}
                    className={`bg-white rounded-2xl border border-slate-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex relative ${viewMode === 'list' ? 'flex-row p-4 items-center gap-6' : 'flex-col p-4'}`}
                    onClick={() => navigate(`/san-pham/${sp._id}`)}
                  >
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 uppercase">
                        {sp.loai}
                    </div>

                    <div className={`${viewMode === 'list' ? 'w-40 h-40 flex-shrink-0' : 'h-48 w-full mb-4'} flex justify-center items-center`}>
                      <img 
                        src={sp.anh} 
                        alt={sp.ten} 
                        className={`max-w-full max-h-full object-contain group-hover:-translate-y-2 transition-transform duration-300`} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200' }}
                      />
                    </div>

                    <div className="flex flex-col flex-1 h-full">
                      <h4 className={`font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-tight ${viewMode === 'list' ? 'text-lg' : 'text-[14px] h-[40px] line-clamp-2'}`}>
                        {sp.ten}
                      </h4>

                      {/* Thông số kỹ thuật rút gọn */}
                      <div className={`text-[11px] text-slate-500 bg-slate-50 rounded border border-slate-100 p-2 ${viewMode === 'list' ? 'mb-4 text-xs' : 'mb-4 flex-1 line-clamp-3'}`}>
                        {sp.thongSo || "Đang cập nhật chi tiết."}
                      </div>

                      <div className={`flex mt-auto ${viewMode === 'list' ? 'flex-row items-center justify-between' : 'flex-col'}`}>
                        <div>
                            <div className="text-slate-400 text-xs line-through mb-0.5">{(sp.gia * 1.05).toLocaleString()} đ</div>
                            <div className={`font-black text-blue-600 ${viewMode === 'list' ? 'text-2xl' : 'text-xl mb-3'}`}>
                                {sp.gia?.toLocaleString()} ₫
                            </div>
                        </div>

                        <button
                          type="button"
                          className={`${viewMode === 'list' ? 'px-6 h-12' : 'w-full h-10'} flex items-center justify-center gap-2 bg-slate-50 text-blue-600 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 hover:shadow-lg shadow-blue-500/30 group-hover:scale-[1.02]`}
                          onClick={(e) => handleQuickAdd(e, sp)}
                        >
                          <ShoppingCart size={18}/> {viewMode === 'list' ? 'Thêm vào giỏ' : 'Mua ngay'}
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

export default TrangSanPham;
