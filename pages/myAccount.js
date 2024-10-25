import Header from "@/components/Header";
import Table from "@/components/Table";
import axios from "axios";
import { format } from 'date-fns';
import Link from "next/link";
import { useContext, useState } from "react";
import styled, { css } from "styled-components";
import { AuthContext } from "./api/auth/auth";
import Center from "@/components/Center";

const COLORS = {
    primaryDark: "#1B422E",
    primaryLight: "#FEBA51",
};

const Wrapper = styled.div`
    width: 100%;
    position: relative;
    @media screen and (max-width: 768px) {
    
    }
`;

const Menu = styled.div`
    width: 100%;
    display: block;
    background-color: ${COLORS.primaryLight};
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
    flex-direction: row;
    flex-wrap: wrap;
    @media screen and (max-width: 768px) {
        justify-content: space-evenly;
    }
    @media screen and (min-width: 769px) {
        justify-content: space-between;
    }
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
`;

export const OrderDetailText = styled.div`
    font-weight: bold;
    font-size: 0.8rem;
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
    @media screen and (max-width: 768px) {
        height: 40px;
    }
    @media screen and (min-width: 769px) {
        height: 50px;
    }
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
    @media screen and (max-width: 768px) {
        font-size: 0.8rem;
    }
    @media screen and (min-width: 769px) {
        font-size: 1.2rem;
        margin-bottom: 20px;
    }
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

    const getOrderTotal = (line_items) => {
        let total = 0;
        line_items.forEach((item) => {
            total += parseInt(item.quantity) * parseFloat(item.unit_amount);
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
                    <Menu>
                        <StyledNav>
                            <NavLink color={"dark"} href={'#'} onClick={(e) => refreshOrders(e)}>
                                Meus pedidos
                            </NavLink>
                        </StyledNav>
                    </Menu>
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
                                        <div style={{ position: "absolute", bottom: 0, borderTopStyle: "dashed", borderTopWidth: "1px", }}>
                                            <OrderDetailText>Total: R$ {getOrderTotal(order.line_items)}</OrderDetailText>
                                            <OrderDetailText style={{ paddingBottom: "30px" }}>Data: {format(order.createdAt, 'dd/MM/yyyy')} | Pago: {order.paid ? 'Sim' : 'Não'} | Status: entregue</OrderDetailText>
                                        </div>
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