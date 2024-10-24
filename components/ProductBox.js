import Button from "@/components/Button";
import { AuthContext } from "@/pages/api/auth/auth";
import { cartItemExists, generateCartItem, removeCartItem } from "@/pages/products";
import Link from "next/link";
import { useContext } from "react";
import styled from "styled-components";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div`
    @media screen and (max-width: 768px) {
        width: 150px;
        flex-grow: 1;
    }    
    @media screen and (min-width: 769px) {
       width: 200px;
    }
    border: 1px solid rgba(0, 0, 0, 0.1);
`;

const AddToCartDiv = styled.div`
    display: flex;
    gap: 5px;
    padding-left: 5px;
    padding-right: 5px;
    align-items: center;
    justify-content:space-between;
    margin-top: -34px;
    opacity: 80%
`;

const WhiteBox = styled(Link)`
    background-color: #e3ffe1;
    @media screen and (min-width: 768px) {
        height: 200px;
    }
    @media screen and (max-width: 767px) {
        height: 150px;
    }
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 80%;
    }
    `;

const Title = styled(Link)`
    font-weight: normal;
    font-size:.7rem;
    color:inherit;
    text-decoration:none;
    margin:0;
`;

const ProductInfoBox = styled.div`
    text-align: center;
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: block;
    @media screen and (min-width: 768px) {
        display: flex;
        gap: 5px;
    }
    align-items: center;
    justify-content:space-between;
    margin-top:2px;
`;

const Price = styled.div`
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
    font-weight:600;
    @media screen and (min-width: 768px) {
        font-size: 1.2rem;
        font-weight:600;
    }    
`;

export default function ProductBox(productV) {
    let product = productV.product;

    const { signed, user } = useContext(AuthContext);

    const { cartProducts, setCartProducts, cartProductsSize, setCartProductsSize, setCartTotalValue, cartTotalValue } = useContext(CartContext);

    const url = '/product/' + product._id;

    const handleRemoveItem = (product) => {
        if (cartItemExists(product, cartProducts)) {
            setCartProducts(removeCartItem(product, 1, cartProducts));
            setCartProductsSize(cartProductsSize - 1);
            setCartTotalValue(cartTotalValue - parseFloat(product.price))
        }
    }

    return (
        <ProductWrapper>
            <div>
                <WhiteBox href={url}>
                    <div style={{ maxHeight: "100%" }}><img style={{ maxHeight: "100%", width: "auto" }} src={product.images?.[0]} alt="" /></div>
                </WhiteBox>
                {signed && product.stockAvailable && (
                    <AddToCartDiv>
                        <Button block="true" onClick={() => handleRemoveItem(product)} addToCart={1}>
                            -
                        </Button>
                        <Button block="true" onClick={() => { setCartProducts(generateCartItem(product, 1, signed, user, cartProducts)); setCartProductsSize(cartProductsSize + 1); setCartTotalValue(cartTotalValue + parseFloat(product.price)) }} addToCart={1}>
                            +
                        </Button>
                    </AddToCartDiv>
                )}
            </div>
            <ProductInfoBox>
                <Title href={url}>{product.title}</Title>
                <PriceRow>
                    {signed && product.stockAvailable && (
                        <Price>
                            R${product.price} - Unidade
                        </Price>
                    )}
                    {signed && !product.stockAvailable && (
                        <Price>
                            Indisponível
                        </Price>
                    )}
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper >
    );
}