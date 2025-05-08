"use client"

import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import { CartContext } from "@/components/CartContext";
import CartIcon from "@/components/icons/CartIcon";
import { generateCartItem, getPrice } from "@/lib/products";
import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { AuthContext } from "../pages/api/auth/auth";
import axios from "axios";

const Banner = styled.div`
    margin: 10px;
    padding: 5px;
    gap: 20px;
    border-radius: 10px;
`;

const ProductData = styled.div`
    min-height: 200px;
    border-radius: 10px;
`;

const ProductTitle = styled.div`
    min-height: 200px;
    padding:10px;
    color: #1B422E;
    background-color: #C5F0C2;
    opacity: 70%;
`;

const Title = styled.h1`
    font-size:1rem;

`;
const Desc = styled.p`
    font-size:.8rem;
`;

const DivButton = styled.div`
    width: 100%;
    bottom: 0;
    position: absolute;
    padding: 10px;
    align-items: right;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap:10px;
`;

const ProductWrapper = styled.div`
    box-shadow: inset 0 -3em 3em rgba(0,0,0,0.2),
             0 0  0 2px rgb(245,245,245),
             0.3em 0.3em 1em rgba(0,0,0,0.4);
    display: block;
    border-radius: 10px;
    min-height: 95%;
    margin: 10px;
    background-color: #1B422E;
    height: 200px;
    background-size: cover;
    width: 600px;
`;


export default function Featured({ products }) {
    const { signed, user } = useContext(AuthContext);
    const { cartProducts, setCartProducts, cartProductsSize, setCartProductsSize, cartTotalValue, setCartTotalValue } = useContext(CartContext);

    const carousel = useRef();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);
    }, []);

    let storeOpened = false;

    const addToCart = async (product) => {
        let storeOpenedData = await axios.get('/api/store-settings?id=store.opened');
        console.log("storeOpenedData", storeOpenedData.data[0]);
        if (storeOpenedData.data && !storeOpenedData.data[0].value) {
            alert('Loja fechada, aguarde para realizar a compra');
            return;
        }
        setCartProducts(generateCartItem(products[0], 1, signed, user, cartProducts));
        setCartProductsSize(cartProductsSize + 1);
        setCartTotalValue(cartTotalValue + getPrice(product, signed, user));
    }

    return (
        <Banner>
            <motion.div ref={carousel} style={{ cursor: 'grab', overflow: 'hidden' }} whileTap={{ cursor: 'grabbing' }}>
                <motion.div style={{ display: 'flex' }} drag="x" dragConstraints={{ right: 0, left: -width }} initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 0.8 }}>
                    {products.map((product) =>
                        <motion.div key={product._id}>
                            <ProductWrapper style={{ backgroundImage: `url(${product.images[0]})` }}>
                            </ProductWrapper>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </Banner>
    );
}