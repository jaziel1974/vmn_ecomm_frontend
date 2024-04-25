import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "@/components/CartContext";
import { useSession } from "next-auth/react";
import { AuthContext } from "@/pages/api/auth/auth";
import Image from 'next/image'
import BurgerMenu from "./BurgerMenu";
import BurgerMenuItems from "./BurgerMenuItems";

const StyledHeader = styled.header`
    background-color: #1B422E;  
    position: fixed;
    width: 100%;
    top: 0;
    transition: height 0.5s
`;
const Logo = styled.div`
    color:#fff;
    text-decoration:none;
    position: relative;
    z-index: 3;
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
    display: block;
    color:#FEBA51;
    text-decoration:none;
    padding: 10px 0;
    @media screen and (min-width: 768px) {
        padding:0;
    }
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
    position: relative;
    top: 50px;
    height: 30px;
`;

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { cartProducts } = useContext(CartContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const { signed, signout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const node = useRef();

    const handleLogin = () => {
        signout();
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", () => {
                setScrolled(window.scrollY > 200)
            });
        }
    }, []);

    const useOnClickOutside = (ref, handler) => {
        useEffect(() => {
            const listener = event => {
                if (!ref.current || ref.current.contains(event.target)) return;
                handler(event);
            };
            document.addEventListener("mousedown", listener);

            return () => {
                document.removeEventListener("mousedown", listener);
            };
        }, [ref, handler]);
    };

    useOnClickOutside(node, () => setOpen(!open));

    return (
        <StyledHeader style={{ height: !scrolled ? "100px" : "80px" }}>
            <Center>
                <Wrapper>
                    <Logo>
                        {!scrolled ?
                            <Image
                                src='/logo.png'
                                alt='Verde Musgo Natural'
                                height='72'
                                width='76'
                                style={{ paddingTop: "13px" }}
                            />
                            :
                            <h2 className="fontFamily" style={{ border: "0px", color: "#FEBA51", marginTop: "10px" }}> Verde Musgo Natural</h2>
                        }
                    </Logo>
                    <StyledNav style={{ paddingTop: "20px" }}>
                        <NavLink href={'/products'}>Todos os produtos</NavLink>
                        <NavLink href={'/categories'}>Categorias</NavLink>
                        <NavLink href={'/account'}>Conta</NavLink>
                        <NavLink href={'/cart'}>Carrinho ({cartProducts.length})</NavLink>
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
                        <BurgerMenu open={open} setOpen={setOpen} />
                        <BurgerMenuItems open={open} setOpen={setOpen} />
                    </NavButton>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}