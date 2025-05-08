import Button from "@/components/Button";
import { CartContext, CartContextType } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { calculateShipping } from "@/components/ShippingEngine";
import Table from "@/components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { sendEmail } from "../shared/mail";
import { AuthContext, AuthContextType } from "./api/auth/auth";
import { generateCartItem, removeCartItem } from "../src/app/products/page.tsx";
import { calculatePromotion } from "@/components/PromotionEngine";
import React from "react";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr .8fr;
    }
    gap: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const CartPage: React.FC = () => {
    const { cartItems, setCartItems } = useContext<CartContextType>(CartContext);
    const { user } = useContext<AuthContextType>(AuthContext);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [promotion, setPromotion] = useState<number>(0);

    useEffect(() => {
        const fetchShippingCost = async () => {
            const cost = await calculateShipping(cartItems);
            setShippingCost(cost);
        };

        const fetchPromotion = async () => {
            const promo = await calculatePromotion(cartItems);
            setPromotion(promo);
        };

        fetchShippingCost();
        fetchPromotion();
    }, [cartItems]);

    return (
        <Center>
            <Header />
            <ColumnsWrapper>
                <Box>
                    <Table cartItems={cartItems} />
                    <Button onClick={() => sendEmail(user.email)}>Checkout</Button>
                </Box>
                <Box>
                    <Input placeholder="Enter promo code" />
                    <p>Shipping Cost: {shippingCost}</p>
                    <p>Promotion: {promotion}</p>
                </Box>
            </ColumnsWrapper>
        </Center>
    );
};

export default CartPage;