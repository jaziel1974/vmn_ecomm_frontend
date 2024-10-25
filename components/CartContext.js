import { createContext, useEffect, useState } from "react";
import { calculateShipping } from "./ShippingEngine";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);
    const [cartProductsSize, setCartProductsSize] = useState(0);
    const [cartTotalValue, setCartTotalValue] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [promotionCost, setPromotionCost] = useState(0);
    const [donationCost, setDonationCost] = useState(0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartProducts));
    }, [cartProducts]);

    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    }, []);

    function clearCart() {
        setCartProducts([]);
        setCartProductsSize(0);
        setCartTotalValue(0);
        localStorage.setItem('cart', JSON.stringify([]));
    }

    return (
        <CartContext.Provider value={{ cartProducts, setCartProducts, clearCart, 
            cartProductsSize, setCartProductsSize, 
            cartTotalValue, setCartTotalValue, 
            shippingCost, setShippingCost, 
            promotionCost, setPromotionCost,
            donationCost, setDonationCost
            }}>
            {children}
        </CartContext.Provider>
    );
}