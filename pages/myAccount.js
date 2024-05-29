import Header from "@/components/Header";
import Link from "next/link";
import styled, { css } from "styled-components";
import { background } from "@/lib/colors";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "./api/auth/auth";
import { format } from 'date-fns';
import Table from "@/components/Table";

const COLORS = {
    primaryDark: "#1B422E",
    primaryLight: "#FEBA51",
};

const Center = styled.div`
    margin: 0 auto;
    top: 90px;
    position: relative;
    @media screen and (min-width: 769px) {
        top: 120px;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Wrapper = styled.div`
    width: 100vw;
    flex-wrap: wrap;
    position: relative;
    display: flex;
    @media screen and (max-width: 768px) {
        justify-content: flex-start;
        column-gap: 40px;
    }
`;

const Menu = styled.div`
    width: 100vw;
    background-color: ${COLORS.primaryLight};
`;

const Side = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    height: 100vh;
    gap: 50px;
    position: relative;
    width: 100vw;
`;

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
    flex-direction: column;
    justify-content: center;
`;

export const OrderTitle = styled.span`
    padding: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    color: ${COLORS.primaryDark};
`;

export const OrderDetailText = styled.span`
    text-align: left;
    font-weight: bold;
    font-size: 12px;
    color: ${COLORS.primaryDark};
`;

const StyledNav = styled.nav`
    display: block;
    gap: 15px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px;
    display: flex;
    padding: 0;
    padding-right: 5px;
    height: 40px;
`;

const NavLink = styled(Link)`
    display: flex;
    ${props => props.color === 'grey' && css`
        color:grey;
    `}
    ${props => props.color === 'normal' && css`
        color:#FEBA51;
    `}
    ${props => props.color === 'dark' && css`
        color:${COLORS.primaryDark};
    `}
    padding-top:10px;
    height: 25px;
    padding-left: 20px;
    padding-right: 20px;
    font-weight: bold;
`;

export default function MyAccount({ childToParent }) {

    const [error, setError] = useState('');
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState();
    const [orderTotal, setOrderTotal] = useState(0);
    const { user } = useContext(AuthContext);

    const refreshOrders = (e) => {
        e.preventDefault();
        if (user?.email) {
            axios.get('/api/orders?email=' + user.email)
                .then(response => {
                    setOrders(response.data);
                })
        }
        else {
            setOrders([]);
            setError('Por favor, faça o login');
        }
    }

    const selectOrder = (orderId) => {
        var filtered = orders.filter((order) => order._id === orderId);
        if (filtered.length === 0) {
            return;
        }
        setOrder(filtered[0]);
        let orderSumup = 0;
        filtered[0].line_items.map((product) => {
            orderSumup += product.unit_amount;
        })
        setOrderTotal(orderSumup);
    }

    return (
        <>
            <Header childToParent={childToParent} />
            <Center>
                {error &&
                    <ErrorContent><LabelError>{error}</LabelError></ErrorContent>
                }
                <Wrapper >
                    <Menu>
                        <StyledNav>
                            <NavLink color={"dark"} href={'#'} onClick={(e) => refreshOrders(e)}>
                                Meus pedidos
                            </NavLink>
                        </StyledNav>
                    </Menu>
                    <Side>
                        <OrderTitleDiv>
                            {orders.length > 0 && (
                                <OrderTitle>Lista de pedidos</OrderTitle>
                            )}
                            <Table>
                                <tbody>
                                    {orders && orders.map((order) => (
                                        <tr style={{ listStyleType: 'none' }} key={order._id}>
                                            <td><NavLink color={"grey"} href={'#'} onClick={(e) => selectOrder(order._id)}>Pedido de {format(order.createdAt, 'dd/MM/yyyy')}</NavLink></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <ul>
                            </ul>
                        </OrderTitleDiv>
                        <OrderTitleDiv style={{ flexGrow: 1 }}>
                            {order && (
                                <>
                                    <OrderTitle>Detalhes do pedido</OrderTitle>
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
                                            <tr>-----------------------</tr>
                                            <tr colspan="3">Total: {orderTotal}</tr>
                                        </tbody>
                                    </Table>
                                    <br />
                                    <OrderDetailText>Data: {format(order.createdAt, 'dd/MM/yyyy')}</OrderDetailText>
                                    <OrderDetailText>Pago: {order.paid ? 'Sim' : 'Não'}</OrderDetailText>
                                    <OrderDetailText>Status: entregue</OrderDetailText>
                                </>
                            )}
                        </OrderTitleDiv>
                    </Side>
                </Wrapper >
            </Center >
        </>
    )
}