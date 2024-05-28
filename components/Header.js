import Link from "next/link";
import styled from "styled-components";
import { CartContext } from "@/components/CartContext";
import { AuthContext } from "@/pages/api/auth/auth";
import { useContext, useCallback, useEffect, useRef, useState } from "react";
import HelpIcon from "./icons/Help";
import BasketIcon from "./icons/Bakset";
import { background } from "@/lib/colors";

const COLORS = {
    primaryDark: "#1B422E",
    primaryLight: "#FEBA51",
};

const StyledHeader = styled.header`
    background-color: ${background};
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
`;

const Logo = styled.div`
    text-decoration:none;
    margin-left: 8px;
`;

const LogoImage = styled.img`
    padding-top: 13px;
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
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 768px) {
        justify-content: flex-start;
        column-gap: 40px;
    }
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
    background-color: ${background};
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
        padding-right: 5px;
    }
    height: 40px;
`;

const NavLink = styled(Link)`
    display: flex;
    ${props => props.inactive ? `
        color: grey;
    ` : `
        color:#FEBA51;
    `}
    text-decoration:none;
    @media screen and (min-width: 768px) {
        padding:0;
    }
    height: 25px;
    font-size: large;
`;

const ItemLink = styled(Link)`
  display: inline-block;
  font-size: 1rem;
  font-weight: 300;
  text-decoration: none;
  color: ${COLORS.primaryLight};
  padding: 1rem 2rem;
  background-image: linear-gradient(
    120deg,
    transparent 0%,
    transparent 50%,
    #fff 50%
  );
  background-size: 240%;
  transition: all 0.4s;
  cursor:pointer;
  &:hover,
  &:active {
    background-position: 100%;
    color: ${COLORS.primaryDark};
    transform: translateX(1rem);
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
    align-self: center;
    @media screen and (min-width: 769px) {
        width: 60%;
    }
    @media screen and (max-width: 768px) {
        width: 50%;
        color: green;
    }
`;

const StyledSearchText = styled.input`
    opacity: 80%;
    width: 100%;
    color: green;
    height: 30px;
`;

const MenuLabel = styled.label`
    @media screen and (min-width: 769px) {
        display: none;
    }
    @media screen and (max-width: 768px) {
        display: block;
    }
    background-color: ${background};
    position: fixed;
    top: 0.5rem;
    right: 0.5rem;
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 1rem 3rem rgba(182, 237, 200, 0.3);
    text-align: center;
`;

const NavBackground = styled.div`
  position: fixed;
  top: 6.5rem;
  right: 6.5rem;
  background-image: radial-gradient(
    ${COLORS.primaryDark},
    ${COLORS.primaryLight}
  );
  height: 6rem;
  width: 6rem;
  border-radius: 50%;
  z-index: 600;
  transform: ${(props) => (props.clicked ? "scale(80)" : "scale(0)")};
  transition: transform 0.8s;
`;

const Icon = styled.span`
  position: relative;
  background-color: ${(props) => (props.clicked ? "transparent" : "#FEBA51")};
  width: 1.4rem;
  height: 2px;
  display: inline-block;
  margin-top: 1.4rem;
  transition: all 0.3s;
  &::before,
  &::after {
    content: "";
    background-color: #FEBA51;
    width: 1.4rem;
    height: 2px;
    display: inline-block;
    position: absolute;
    left: 0;
    transition: all 0.3s;
  }
  &::before {
    top: ${(props) => (props.clicked ? "0" : "-0.8rem")};
    transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
  }
  &::after {
    top: ${(props) => (props.clicked ? "0" : "0.8rem")};
    transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
  }
  ${MenuLabel}:hover &::before {
    top: ${(props) => (props.clicked ? "0" : "-0.7rem")};
  }
  ${MenuLabel}:hover &::after {
    top: ${(props) => (props.clicked ? "0" : "0.7rem")};
  }
`;

const Navigation = styled.nav`
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 600;
  width: ${(props) => (props.clicked ? "100%" : "0")};
  opacity: ${(props) => (props.clicked ? "1" : "0")};
  transition: width 0.8s, opacity 0.8s;
`;

const List = styled.ul`
  position: absolute;
  list-style: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  padding-left: 0;
`;

export default function Header({ childToParent }) {
    const { cartProducts } = useContext(CartContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const handleClick = () => setMobileNavActive(!mobileNavActive);

    const signoutClick = (e) => {
        e.preventDefault();
        setMobileNavActive(!mobileNavActive);
        handleLogin();
    }


    const { signed, signout } = useContext(AuthContext);

    const handleLogin = () => {
        signout();
    }

    const ref = useRef(null);

    const updateSearch = (value) => {
        childToParent(value);
    }

    const handleKeyPress = useCallback((event) => {
        const truefalse = event.key == '/';
        const escKey = event.key == 'Escape';

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
            <Wrapper>
                <Logo>
                    <LogoImage
                        src='/logo.png'
                        alt='Verde Musgo Natural'
                    />
                </Logo>

                <StyledSearchGrid>
                    <form>
                        <StyledSearchText type="text"
                            ref={ref}
                            onChange={(e) => updateSearch(e.target.value)}
                            placeholder="Procurar itens... pressione /"
                        >
                        </StyledSearchText>
                    </form>
                </StyledSearchGrid>

                <StyledNav style={{ paddingTop: "25px" }}>
                    <NavLink href={'/cart'}>
                        <BasketIcon />
                        ({cartProducts.length})
                    </NavLink>
                    <NavLink href={'/help'}>
                        <HelpIcon />
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

                <MenuLabel htmlFor="navi-toggle" onClick={handleClick}>
                    <Icon clicked={mobileNavActive}>&nbsp;</Icon>
                </MenuLabel>

                <NavBackground clicked={mobileNavActive}>&nbsp;</NavBackground>
                <Navigation clicked={mobileNavActive}>
                    <List>
                        <li>
                            <ItemLink onClick={handleClick} href="/products">
                                Todos os produtos
                            </ItemLink>
                        </li>
                        <li>
                            <ItemLink href={'/cart'}>
                                Cesta ({cartProducts.length} iten(s))
                            </ItemLink>
                        </li>
                        <li>
                            {signed && (
                                <ItemLink onClick={handleClick} href="/myaccount">
                                    Conta
                                </ItemLink>
                            )}
                        </li>
                        <li>
                            {!signed && (
                                <ItemLink onClick={handleClick} href="/signin">
                                    Sign in
                                </ItemLink>
                            )}
                            {signed && (
                                <ItemLink onClick={(e) => signoutClick(e)} href="">
                                    Sign out
                                </ItemLink>
                            )}
                        </li>
                    </List>
                </Navigation>
            </Wrapper>

            <Wrapper style={{ justifyContent: "center" }}>
                <StyledNav>
                    <NavLink href={'/products'} inactive={false}>Todos os produtos</NavLink>
                    <NavLink href={''} inactive={true}>Categorias</NavLink>
                    {signed && (<NavLink href={'/myaccount'} >Conta</NavLink>)}
                </StyledNav>
            </Wrapper>
        </StyledHeader>
    );
}