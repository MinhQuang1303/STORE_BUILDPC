import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Thêm tham số silent để không hiện alert khi thêm cả bộ máy
    const addToCart = (product, quantity, silent = false) => {
        setCartItems((prevItems) => {
            const exist = prevItems.find((item) => item._id === product._id);
            if (exist) {
                return prevItems.map((item) =>
                    item._id === product._id ? { ...item, qty: item.qty + quantity } : item
                );
            } else {
                return [...prevItems, { ...product, qty: quantity }];
            }
        });

        if (!silent) {
            alert(`Đã thêm ${product.ten} vào giỏ hàng!`);
        }
    };

    const updateQty = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems(cartItems.map((item) =>
            item._id === id ? { ...item, qty: newQty } : item
        ));
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((item) => item._id !== id));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, clearCart, updateQty 
        }}>
            {children}
        </CartContext.Provider>
    );
};