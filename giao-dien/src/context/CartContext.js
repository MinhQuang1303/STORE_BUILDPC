import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // 1. Tải giỏ hàng từ localStorage khi ứng dụng khởi chạy
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
    }, []);

    // 2. Tự động lưu vào localStorage mỗi khi giỏ hàng có thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Hàm thêm sản phẩm vào giỏ (Xử lý cộng dồn nếu sản phẩm đã tồn tại)
    const addToCart = (product, quantity) => {
        const exist = cartItems.find((item) => item._id === product._id);
        if (exist) {
            setCartItems(cartItems.map((item) =>
                item._id === product._id ? { ...exist, qty: exist.qty + quantity } : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, qty: quantity }]);
        }
        alert("Đã thêm sản phẩm vào giỏ hàng!");
    };

    // 4. Hàm cập nhật số lượng (Dùng cho nút + / - trong giỏ hàng)
    const updateQty = (id, newQty) => {
        if (newQty < 1) return; // Không cho phép giảm xuống dưới 1
        setCartItems(cartItems.map((item) =>
            item._id === id ? { ...item, qty: newQty } : item
        ));
    };

    // 5. Hàm xóa 1 sản phẩm khỏi giỏ
    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((item) => item._id !== id));
    };

    // 6. Hàm xóa sạch giỏ hàng
    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            updateQty // QUAN TRỌNG: Phải có dòng này để TrangGioHang gọi được hàm
        }}>
            {children}
        </CartContext.Provider>
    );
};