import Header from "@/components/Header";
import Table from "@/components/Table";
import axios from "axios";
import { format } from 'date-fns';
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import styled, { css } from "styled-components";
import { AuthContext } from "./api/auth/auth";
import Center from "@/components/Center";
import OrdersMenu from '@/components/OrdersMenu';
import Wrapper from '@/components/Wrapper';

const COLORS = {
    primaryDark: "#1B422E",
    primaryLight: "#FEBA51",
};

// Menu moved to shared component `OrdersMenu`

export const ErrorContent = styled.div`
    width: 100%;
    box-shadow: 0 1px 2px #0003;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    border: 20px;
    height: 30px;
    padding: 0;
    padding-top: 5px;
    padding-left: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
`;

export const LabelError = styled.label`
    font-size: 14px;
    color: red;
`;

export const OrderTitleDiv = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    padding: 10px 0;
`;

export const OrderDetailDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const OrderTitle = styled.span`
    margin-top: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2rem;
    color: ${COLORS.primaryDark};
    @media screen and (max-width: 768px) {
      font-size: 0.8rem;
    }
    @media screen and (min-width: 769px) {
        font-size: 1rem;
        margin-bottom: 20px;
    }

`;

export const OrderTitleInner = styled.div`
    position: relative;
    border-style: solid;
    border-radius: 10px;
    height: 400px;
    margin: 10px;
    padding: 5px;
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

export const OrderDetailText = styled.div`
    font-weight: bold;
    font-size: 0.8rem;
    color: ${COLORS.primaryDark};
`;

export const ButtonRow = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// StyledNav and NavLink moved to `OrdersMenu` shared component

export default function MyAccount({ childToParent }) {

    const [error, setError] = useState('');
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState();
    const [orderTotal, setOrderTotal] = useState(0);
    const { user } = useContext(AuthContext);
    const router = useRouter();

    const refreshOrders = (e) => {
        // kept for compatibility: the OrdersMenu will call its own fetch; this handler can be empty
        if (e && e.preventDefault) e.preventDefault();
    }

    function handleOrdersLoaded(list) {
        if (!list || list.length === 0) {
            // if user not logged, show message
            if (!user?.email) setError('Por favor, faça o login');
            setOrders([]);
            return;
        }
        setOrders(list);
    }

    const getOrderTotal = (line_items) => {
        let total = 0;
        line_items.forEach((item) => {
            total += parseFloat(item.unit_amount);
        })
        return total;
    }

    return (
        <>
            <Header childToParent={childToParent} />
            <Center>
                {error &&
                    <ErrorContent><LabelError>{error}</LabelError></ErrorContent>
                }
                <Wrapper>
                    <OrdersMenu onRefresh={refreshOrders} userEmail={user?.email} onOrders={handleOrdersLoaded} limit={3} />
                    <OrderTitleDiv>
                        {orders && orders.map((order) => (
                            <OrderTitleInner>
                                {order && (
                                    <>
                                        <OrderTitle>Detalhes do pedido de {format(order.createdAt, 'dd/MM/yyyy')}</OrderTitle>
                                        <div style={{ overflow: "auto", maxHeight: "60%" }}>
                                            <Table>
                                                <thead style={{ height: 30 }}>
                                                    <tr >
                                                        <th style={{ width: "60%" }}>Produto</th>
                                                        <th>Quantidade</th>
                                                        <th>Preço</th>
                                                    </tr>
                                                </thead>
                                                < tbody >
                                                    {order.line_items.map((product) => (
                                                        <tr>
                                                            <td>
                                                                {product.name}
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {product.quantity}
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {product.unit_amount}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                        <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, borderTopStyle: "dashed", borderTopWidth: "1px", }}>
                                            <OrderDetailText>Total: R$ {getOrderTotal(order.line_items)}</OrderDetailText>
                                            <OrderDetailText style={{ paddingTop: 6 }}>
                                                Data: {format(order.createdAt, 'dd/MM/yyyy')} | Pago: {order.paid ? 'Sim' : 'Não'} | Status: {order?.status === 'delivered' ? 'Entregue' : 'Pendente'}
                                            </OrderDetailText>
                                        </div>
                                        <ButtonRow>
                                            <Button black onClick={() => router.push('/review-order?orderId=' + order._id)}>
                                                Avaliar pedido
                                            </Button>
                                        </ButtonRow>
                                    </>
                                )}
                            </OrderTitleInner>
                        ))}
                    </OrderTitleDiv>
                </Wrapper >
            </Center >
        </>
    )
}