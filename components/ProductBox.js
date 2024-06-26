import styled from "styled-components";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import { useSession } from "next-auth/react";
import { AuthContext } from "@/pages/api/auth/auth";

const ProductWrapper = styled.div`
    width: 200px;
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
    background-color: #fff;
    padding: 20px;
    height: 150px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 100%;
        max-height: 80px;
    }
    `;

const Title = styled(Link)`
    font-weight: normal;
    font-size:.9rem;
    color:inherit;
    text-decoration:none;
margin:0;
`;

const ProductInfoBox = styled.div`
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
    font-size: 1rem;
    font-weight:400;
    text-align: right;
    @media screen and (min-width: 768px) {
        font-size: 1.2rem;
        font-weight:600;
        text-align: left;
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
                    <div><img src={images?.[0]} alt="" /></div>
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
                            ${price}
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