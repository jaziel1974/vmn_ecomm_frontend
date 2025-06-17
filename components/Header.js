import { background } from "@/lib/colors";
import { AuthContext } from "@/pages/api/auth/auth";
import { useRouter } from 'next/navigation';
import { useContext } from "react";
import styled from "styled-components";
import Link from "next/link";
import BasketIcon from "./icons/Bakset";
import { CartContext } from "./CartContext";

const StyledHeader = styled.header`
    position: fixed;
    background-color: ${background};
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    @media screen and (max-width: 768px) {
        display: inline-block;
        height: 90px;
    }
    @media screen and (min-width: 768px) {
        height: 130px;
    }
`;

const Logo = styled.div`
    text-decoration: none;
`;

const LogoImage = styled.img`
    padding-top: 13px;
    margin-left: 8px;
    cursor: pointer;
    @media screen and (max-width: 768px) {
        height: 42px;
        width: 42px;
    }
    @media screen and (min-width: 769px) {
        height: 62px;
        width: 62px;
    }
`;

const Wrapper = styled.div`
    justify-content: space-between;
    @media screen and (max-width: 768px) {
        column-gap: 40px;
    }
`;

const DivNav = styled.div`
    @media screen and (min-width: 768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const StyledNavDiv = styled.div`
    display: flex;
    gap: 15px;
    width: 100%;
`;

const StyledNav = styled.nav`
    display: flex;
    gap: 15px;
    padding-right: 5px;
    height: 40px;
    font-size: 0.8rem;
    @media screen and (max-width: 768px) {
        display: none; /* Hide auth nav on mobile for simplicity */
    }
`;

const NavLink = styled(Link)`
    display: flex;
    color: #FEBA51;
    text-decoration: none;
    @media screen and (max-width: 768px) {
        font-size: 0.7rem;
    }
    @media screen and (min-width: 768px) {
        font-size: 1.3rem;
        margin-bottom: 20px;
    }
    height: 25px;
`;

const NavCartLink = styled.nav`
    position: fixed;
    top: 10px;
    right: 47%;
    z-index: 2000;
`;

const CartLink = styled(Link)`
    display: flex;
    color: #FEBA51;
    text-decoration: none;
    @media screen and (max-width: 768px) {
        font-size: 0.8rem;
    }
    @media screen and (min-width: 768px) {
        font-size: 1.2rem;
        margin-bottom: 20px;
    }
    height: 25px;
`;

export default function Header() {
    const router = useRouter();
    const { cartProductsSize } = useContext(CartContext);
    const { signed, signout } = useContext(AuthContext);

    const handleLogin = () => {
        signout();
    }

    return (
        <StyledHeader>
            <NavCartLink>
                <CartLink href={'/cart'}>
                    <BasketIcon style={{ width: "40px" }} />
                    {cartProductsSize > 0 && (cartProductsSize)}
                </CartLink>
            </NavCartLink>

            <Wrapper>
                <DivNav>
                    <Logo>
                        <LogoImage
                            src='/logo.png'
                            alt='Verde Musgo Natural'
                            onClick={() => router.push('/')}
                        />
                    </Logo>

                    <StyledNav style={{ paddingTop: "25px" }}>
                        {!signed && (
                            <NavLink href={'/signin'}>Entrar</NavLink>
                        )}
                        {signed && (
                            <NavLink href=''
                                onClick={e => {
                                    e.preventDefault();
                                    handleLogin();
                                }}>Sair
                            </NavLink>
                        )}
                    </StyledNav>
                </DivNav>
            </Wrapper>            
            
            <StyledNavDiv style={{ justifyContent: "center" }}>
                <NavLink href={'/'}>Principal</NavLink>
                <NavLink href={'/products'}>Todos os produtos</NavLink>
                <NavLink href={'/categories'}>Categorias</NavLink>
                <NavLink href={'/subscribe'}>🔔 Notificações</NavLink>
                <NavLink href={'/test-notifications'}>🧪 Test Push</NavLink>
                {signed && (<NavLink href={'/myAccount'}>Conta</NavLink>)}
            </StyledNavDiv>
        </StyledHeader>
    )
}