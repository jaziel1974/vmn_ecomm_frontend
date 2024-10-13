import { background } from "@/lib/colors";
import { AuthContext } from "@/pages/api/auth/auth";
import { useRouter } from 'next/navigation';
import { useContext, useState } from "react";
import styled from "styled-components";
import Link from "next/link";

const COLORS = {
    primaryDark: "#1B422E",
    primaryLight: "#FEBA51",
};

const StyledHeader = styled.header`
    background-color: ${background};
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    @media screen and (max-width: 768px) {
        display: inline-block;
    }
`;

const Logo = styled.div`
    text-decoration:none;
`;

const LogoImage = styled.img`
    padding-top: 13px;
    margin-left: 8px;
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
    @media screen and (max-width: 768px) {
        gap: 5px;
    }
    @media screen and (min-width: 768px) {
        gap: 15px;
    }   
    width: 100%;
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
    font-size: 0.8rem;
`;

const NavLink = styled(Link)`
    display: flex;
    ${props => props.inactive ? `
        color: grey;
    ` : `
        color:#FEBA51;
    `}
    text-decoration:none;
    @media screen and (max-width: 768px) {
      font-size: 0.8rem;
    }
    @media screen and (min-width: 768px) {
        font-size: 1.6rem;
        margin-bottom: 20px;
    }
    height: 25px;
`;

const ItemLink = styled(Link)`
  display: inline-block;
  font-size: 1rem;
  font-weight: 300;
  text-decoration: none;
  color: ${COLORS.primaryLight};
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
  right: 0;
  background-image: radial-gradient(
    ${COLORS.primaryDark},
    ${COLORS.primaryDark},
    ${COLORS.primaryLight}
  );
  height: .5rem;
  width: .3rem;
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
  height: 40vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 600;
  width: ${(props) => (props.clicked ? "50%" : "0")};
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

export default function Header() {
    const router = useRouter();

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

    return (
        <StyledHeader>
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
                </DivNav>

                <MenuLabel htmlFor="navi-toggle" onClick={handleClick}>
                    <Icon clicked={mobileNavActive}>&nbsp;</Icon>
                </MenuLabel>

                <NavBackground clicked={mobileNavActive}>&nbsp;</NavBackground>
                <Navigation clicked={mobileNavActive}>
                    <List>
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

            <StyledNavDiv style={{ justifyContent: "center" }}>
                <NavLink href={'/products'} inactive={false}>Todos os produtos</NavLink>
                <NavLink href={''} inactive={true}>Categorias</NavLink>
                {signed && (<NavLink href={'/myAccount'} >Conta</NavLink>)}
            </StyledNavDiv>
        </StyledHeader>
    )
}