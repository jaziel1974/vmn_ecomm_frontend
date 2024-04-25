import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { CartContext } from "@/components/CartContext";
import { useSession } from "next-auth/react";
import { AuthContext } from "@/pages/api/auth/auth";
import Image from 'next/image'
import { useContext, useCallback, useEffect, useRef, useState } from "react";
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import HelpIcon from "./icons/Help";
import BasketIcon from "./icons/Bakset";

const StyledHeader = styled.header`
    background-color: #1B422E;  
    width: 100%;
`;

const Logo = styled.div`
    color:#fff;
    text-decoration:none;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledNav = styled.nav`
    ${props => props.mobileNavActive ? `
        display: block;
    ` : `
        display: none;
    `}
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #1B422E;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
    }
    height: 40px;
`;

const NavLink = styled(Link)`
    display: flex;
    color:#FEBA51;
    text-decoration:none;
    @media screen and (min-width: 768px) {
        padding:0;
    }
    height: 25px;
    font-size: large;
`;

const NavButton = styled.button`
    background-color: transparent;
    width: 50px;
    height: 30px;
    border:0;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 3;
    top: 10px;

    @media screen and (min-width: 768px) {
        display: none;
    }
`;


const StyledSearchGrid = styled.div`
    @media screen and (min-width: 769px) {
        width: 60%;
    }
    @media screen and (max-width: 768px) {
        color: green;
    }
`;

const StyledSearchText = styled.input`
    opacity: 80%;
    width: 100%;
    color: green;
    height: 30px;
`;

export default function Header() {
    const { cartProducts } = useContext(CartContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const { signed, signout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);

    const handleLogin = () => {
        signout();
    }

    const ref = useRef(null);
    const [search, setSearch] = useState('');

    const handleKeyPress = useCallback((event) => {
        const truefalse = event.key == '/';
        const escKey = event.key == 'Escape';
        console.log(event.key);
        if (truefalse) {
            ref.current.focus()
            event.preventDefault();
        }
        else if (escKey) {
            setSearch('');
        }
    }, []);

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo>
                        <Image
                            src='/logo.png'
                            alt='Verde Musgo Natural'
                            height='72'
                            width='76'
                            style={{ paddingTop: "13px" }}
                        />
                    </Logo>

                    <StyledSearchGrid style={{ paddingTop: "20px" }}>
                        <form>
                            <StyledSearchText type="text"
                                ref={ref}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Procurar itens... pressione /"
                                value={search}
                            >
                            </StyledSearchText>
                        </form>
                    </StyledSearchGrid>

                    <StyledNav style={{ paddingTop: "25px" }}>
                        <NavLink href={'/cart'}>
                            <BasketIcon/>
                            ({cartProducts.length})
                        </NavLink>
                        <NavLink href={'/help'}>
                            <HelpIcon/>
                        </NavLink>
                        {!signed && (
                            <NavLink href={'/signin'}>Sign in</NavLink>
                        )}
                        {signed && (
                            <NavLink href=''
                                onClick={e => {
                                    e.preventDefault();
                                    handleLogin();
                                }}>Sign out
                            </NavLink>
                        )}
                    </StyledNav>

                    <NavButton onClick={() => setMobileNavActive(prev => !prev)}>

                    </NavButton>
                </Wrapper>
                <Wrapper style={{ justifyContent: "center" }}>
                    <StyledNav>
                        <NavLink href={'/products'}>Todos os produtos</NavLink>
                        <NavLink href={'/categories'}>Categorias</NavLink>
                        <NavLink href={'/account'}>Conta</NavLink>
                    </StyledNav>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}