'use client';

import React, { createContext, useEffect, useState, ReactNode } from "react";

export interface CartItems {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CartContextType {
    cartProducts: CartProduct[];
    cartItems: CartItems[];
    cartProductsSize: number;
    cartTotalValue: number;
    shippingCost: number;
    promotionCost: number;
    donationCost: number;
    setCartProducts: (products: CartProduct[]) => void;
    setCartProductsSize: (size: number) => void;
    setCartTotalValue: (value: number) => void;
    setShippingCost: (cost: number) => void;
    setPromotionCost: (cost: number) => void;
    setDonationCost: (cost: number) => void;
    clearCart: () => void;
    setCartItems: (cartItens: CartItems[]) => void;
}

export const CartContext = createContext<CartContextType>({
    cartProducts: [],
    cartItems: [],
    cartProductsSize: 0,
    cartTotalValue: 0,
    shippingCost: 0,
    promotionCost: 0,
    donationCost: 0,
    setCartProducts: () => {},
    setCartProductsSize: () => {},
    setCartTotalValue: () => {},
    setShippingCost: () => {},
    setPromotionCost: () => {},
    setDonationCost: () => {},
    setCartItems: () => {},
    clearCart: () => {}
});

interface CartContextProviderProps {
    children: ReactNode;
}

export const CartContextProvider: React.FC<CartContextProviderProps> = ({ children }) => {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
    const [cartItems, setCartItems] = useState<CartItems[]>([]);
    const [cartProductsSize, setCartProductsSize] = useState<number>(0);
    const [cartTotalValue, setCartTotalValue] = useState<number>(0);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [promotionCost, setPromotionCost] = useState<number>(0);
    const [donationCost, setDonationCost] = useState<number>(0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartProducts));
    }, [cartProducts]);

    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart') || '[]'));
        }
    }, [ls]);

    const clearCart = () => {
        setCartProducts([]);
        setCartProductsSize(0);
        setCartTotalValue(0);
        localStorage.setItem('cart', JSON.stringify([]));
    };

    return (
        <CartContext.Provider value={{
            cartProducts,
            cartItems,
            cartProductsSize,
            cartTotalValue,
            shippingCost,
            promotionCost,
            donationCost,
            setCartProducts,
            setCartProductsSize,
            setCartTotalValue,
            setShippingCost,
            setPromotionCost,
            setDonationCost,
            setCartItems,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};