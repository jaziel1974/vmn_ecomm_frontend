import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);
    const [cartProductsSize, setCartProductsSize] = useState(0);
    const [cartTotalValue, setCartTotalValue] = useState(0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartProducts));
    }, [cartProducts]);

    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    }, []);

    function removeProduct(cartItem) {
        let cartData = cartProducts.find((cartItemData) => cartItemData.product._id == cartItem._id);
        if (cartData){
            if(cartData.quantity > 1) {
                cartData.quantity = cartData.quantity - 1;
            }
            else{
                setCartProducts(cartProducts.filter((cartItemData) => cartItemData.product._id != cartItem._id));
            }
            setCartTotalValue(cartTotalValue - cartData.unitPrice);
            setCartProductsSize(cartProductsSize - 1);
        }
    }

    function clearCart() {
        setCartProducts([]);
        setCartProductsSize(0);
        setCartTotalValue(0);
        localStorage.setItem('cart', JSON.stringify([]));
    }

    return (
        <CartContext.Provider value={{ cartProducts, setCartProducts, removeProduct, clearCart, cartProductsSize, setCartProductsSize, cartTotalValue, setCartTotalValue }}>
            {children}
        </CartContext.Provider>
    );
}