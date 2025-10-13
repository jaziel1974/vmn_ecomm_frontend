import Link from 'next/link';
import styled, { css } from 'styled-components';
import { useEffect } from 'react';
import axios from 'axios';

const COLORS = {
    primaryDark: "#1B422E",
    primaryLight: "#FEBA51",
};

const Menu = styled.div`
    width: 100%;
    display: block;
    background-color: ${COLORS.primaryLight};
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

export default function OrdersMenu({ onRefresh, href = '#', userEmail, limit = 3, onOrders }) {
    async function fetchOrders() {
        if (!userEmail || !onOrders) return;
        try {
            const res = await axios.get('/api/orders?email=' + encodeURIComponent(userEmail) + '&limit=' + encodeURIComponent(limit));
            onOrders(res.data || []);
        } catch (e) {
            console.error('orders fetch error', e);
            onOrders([]);
        }
    }

    useEffect(() => {
        // auto load when mounted if possible
        if (userEmail && onOrders) fetchOrders();
    }, [userEmail]);

    function handleClick(e) {
        if (href === '#') {
            if (e && e.preventDefault) e.preventDefault();
            // refresh via component
            fetchOrders();
            if (onRefresh) onRefresh(e);
        }
        // otherwise let the link navigate
    }

    return (
        <Menu>
            <StyledNav>
                <NavLink color={"dark"} href={href} onClick={handleClick}>
                    Meus pedidos
                </NavLink>
            </StyledNav>
        </Menu>
    );
}