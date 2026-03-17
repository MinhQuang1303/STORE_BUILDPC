import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [wishlistItems, setWishlistItems] = useState(() => JSON.parse(localStorage.getItem("wishlist")) || []);

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlistItems)); }, [wishlistItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item._id === product._id);
      if (exist) return prev.map((item) => item._id === product._id ? { ...item, qty: item.qty + quantity } : item);
      return [...prev, { ...product, qty: quantity }];
    });
    alert(`Đã thêm ${product.ten} vào giỏ hàng!`);
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return removeFromCart(id);
    setCartItems(prev => prev.map((item) => item._id === id ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter((item) => item._id !== id));
  const clearCart = () => setCartItems([]);

  const luuMuaSau = (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (item) {
      if (!wishlistItems.find((x) => x._id === id)) setWishlistItems([...wishlistItems, item]);
      removeFromCart(id);
    }
  };

  const moveBackToCart = (product) => {
    addToCart(product, 1);
    setWishlistItems(prev => prev.filter((x) => x._id !== product._id));
  };

  // ĐỊNH NGHĨA HÀM NÀY ĐỂ HẾT LỖI
  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider value={{ 
        cartItems, wishlistItems, addToCart, removeFromCart, 
        updateQty, clearCart, luuMuaSau, moveBackToCart, 
        removeFromWishlist // QUAN TRỌNG: PHẢI CÓ DÒNG NÀY
    }}>
      {children}
    </CartContext.Provider>
  );
};