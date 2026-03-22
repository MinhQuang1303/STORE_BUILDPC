import React, { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [wishlistItems, setWishlistItems] = useState(() => JSON.parse(localStorage.getItem("wishlist")) || []);
  
  // State quản lý Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlistItems)); }, [wishlistItems]);

  // Hàm hiển thị Toast - Đã được đưa vào value bên dưới
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    // Hỗ trợ cả mảng (từ Build PC) và object đơn lẻ
    const productsToAdd = Array.isArray(product) ? product : [product];
    
    setCartItems((prev) => {
      let newCart = [...prev];
      productsToAdd.forEach((p) => {
        const exist = newCart.find((item) => item._id === p._id);
        if (exist) {
          newCart = newCart.map((item) => item._id === p._id ? { ...item, qty: item.qty + quantity } : item);
        } else {
          newCart.push({ ...p, qty: quantity });
        }
      });
      return newCart;
    });
    
    const msg = productsToAdd.length > 1 
      ? `Đã thêm cấu hình máy vào giỏ! 🚀` 
      : `Đã thêm "${productsToAdd[0].ten}" vào giỏ!`;
    showToast(msg, "success");
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter((item) => item._id !== id));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng", "error");
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return removeFromCart(id);
    setCartItems(prev => prev.map((item) => item._id === id ? { ...item, qty: newQty } : item));
  };

  const clearCart = () => {
    setCartItems([]);
    showToast("Đã dọn dẹp giỏ hàng sạch sẽ", "success");
  };

  const luuMuaSau = (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (item) {
      if (!wishlistItems.find((x) => x._id === id)) setWishlistItems([...wishlistItems, item]);
      removeFromCart(id);
      showToast("Đã lưu để mua sau ❤️", "success");
    }
  };

  const moveBackToCart = (product) => {
    addToCart(product, 1);
    setWishlistItems(prev => prev.filter((x) => x._id !== product._id));
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter((item) => item._id !== id));
    showToast("Đã xóa khỏi yêu thích 💔", "error");
  };

  return (
    <CartContext.Provider value={{ 
        cartItems, wishlistItems, addToCart, removeFromCart, 
        updateQty, clearCart, luuMuaSau, moveBackToCart, 
        removeFromWishlist,
        showToast // <--- QUAN TRỌNG: Phải có dòng này thì TrangGioHang mới dùng được!
    }}>
      {children}

      {/* GIAO DIỆN TOAST TRÊN CAO BÊN PHẢI */}
      {toast.show && (
        <div style={{
          ...styles.toastContainer,
          borderLeft: `6px solid ${toast.type === "success" ? "#10b981" : "#ef4444"}`
        }}>
          <div style={styles.toastContent}>
            <div style={{
                ...styles.iconCircle, 
                backgroundColor: toast.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: toast.type === "success" ? "#10b981" : "#ef4444"
            }}>
              {toast.type === "success" ? "✓" : "✕"}
            </div>
            <div style={styles.textWrapper}>
              <b style={{ color: "#1e293b", fontSize: "14px" }}>Thông báo</b>
              <p style={styles.toastMessage}>{toast.message}</p>
            </div>
            <button onClick={() => setToast({ ...toast, show: false })} style={styles.closeBtn}>×</button>
          </div>
          <div style={{
              ...styles.progressBar, 
              backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444"
          }} />
        </div>
      )}

      <style>
        {`
          @keyframes toastSlideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes progressLoad {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </CartContext.Provider>
  );
};

// Hook để dùng nhanh ở các trang
export const useCart = () => useContext(CartContext);

const styles = {
  toastContainer: {
    position: "fixed",
    top: "30px",
    right: "30px",
    width: "350px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
    zIndex: 99999,
    overflow: "hidden",
    animation: "toastSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
    display: "flex",
    flexDirection: "column"
  },
  toastContent: {
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    position: "relative"
  },
  iconCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px"
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  toastMessage: {
    margin: "4px 0 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.4",
    fontWeight: "500"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "22px",
    cursor: "pointer",
    padding: "0 5px",
    transition: "color 0.2s"
  },
  progressBar: {
    height: "4px",
    width: "100%",
    animation: "progressLoad 3s linear forwards"
  }
};