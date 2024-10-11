import Button from "@/components/Button";
import { AuthContext } from "@/pages/api/auth/auth";
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

export default function ProductBox({ _id, title, description, price, images, stockAvailable }) {
    const { signed } = useContext(AuthContext);

    const { addProduct, removeProduct } = useContext(CartContext);

    function lessOfThisProduct(productId) {
        removeProduct(productId);
    }

    const url = '/product/' + _id;

    return (
        <ProductWrapper>
            <div>
                <WhiteBox href={url}>
                    <div style = {{ maxHeight: "100%" }}><img style = {{ maxHeight: "100%", width: "auto" }} src={images?.[0]} alt=""/></div>
                </WhiteBox>
                {signed && stockAvailable && (
                <AddToCartDiv>
                    <Button block="true" onClick={() => lessOfThisProduct(_id)} addToCart={1}>
                        -
                    </Button>
                    <Button block="true" onClick={() => addProduct(_id)} addToCart={1}>
                        +
                    </Button>
                </AddToCartDiv>
                )}
            </div>
            <ProductInfoBox>
                <Title href={url}>{title}</Title>
                <PriceRow>
                    {signed && stockAvailable && (
                        <Price>
                            R${price} - Unidade
                        </Price>
                    )}
                    {signed && !stockAvailable && (
                        <Price>
                            Indisponível
                        </Price>
                    )}
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    );
}