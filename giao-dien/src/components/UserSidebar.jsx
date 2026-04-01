import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Package, Heart, MapPin, Bell, Camera } from "lucide-react";

const getAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/uploads')) {
    return `${process.env.REACT_APP_API_URL?.replace('/api', '') || "http://localhost:5000"}${url}`;
  }
  return url;
};

const UserSidebar = ({ user, activePage = "ho-so", onAvatarClick, fileInputRef, onFileChange, avatarPreview, customAvatar }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath.includes(path);

  return (
    <div className="md:w-1/4 flex flex-col gap-6">
      {/* User Profile Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
        <div 
          className={`w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative group ${onAvatarClick ? 'cursor-pointer' : ''}`}
          onClick={onAvatarClick}
          title={onAvatarClick ? "Thay đổi ảnh đại diện" : ""}
        >
          {avatarPreview || customAvatar || user?.avatar ? (
            <img src={avatarPreview || getAvatarUrl(customAvatar || user?.avatar)} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          {onAvatarClick && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={16} />
            </div>
          )}
        </div>
        {onAvatarClick && fileInputRef && (
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium">Tài khoản của</p>
          <h2 className="text-base font-bold text-slate-800 truncate">{user?.fullName || user?.username}</h2>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <nav className="space-y-1">
          <Link 
            to="/ho-so" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/ho-so') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <User size={20} />
            <span>Thông tin tài khoản</span>
          </Link>
          <Link 
            to="/don-hang-cua-toi" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/don-hang-cua-toi') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Package size={20} />
            <span>Quản lý đơn hàng</span>
          </Link>
          <Link 
            to="/san-pham-yeu-thich" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/san-pham-yeu-thich') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Heart size={20} />
            <span>Sản phẩm yêu thích</span>
          </Link>
          <Link 
            to="/so-dia-chi" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/so-dia-chi') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <MapPin size={20} />
            <span>Sổ địa chỉ</span>
          </Link>
          <Link 
            to="/thong-bao" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/thong-bao') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Bell size={20} />
            <span>Thông báo</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default UserSidebar;
