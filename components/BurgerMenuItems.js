import React, { useContext } from "react";
import styled from "styled-components";
import Link from "next/link";
import { CartContext } from "./CartContext";
import { AuthContext } from "@/pages/api/auth/auth";

const StyledMenu = styled.nav`
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  background: #effffa;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-150%)")};
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 360%;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 576px) {
    width: 190px;
  }

  a {
    font-family: Poppins;
    font-size: 1.2rem;
    padding: 1rem 0;
    color: #1B422E;
    text-decoration: none;
    transition: color 0.3s linear;
    }

    &:hover {
      color: #343078;
    }
  }
`;

const NavLink = styled(Link)`
    display: block;
    color:#FEBA51;
    text-decoration:none;
    padding:0;
`;

export default function BurgerMenuItems({ open, setOpen }) {
    const { cartProducts } = useContext(CartContext);
    const { signed, signout } = useContext(AuthContext);

    return (
        <StyledMenu id="styledMenu" open={open}>
            <NavLink href={'/products'}>Products</NavLink>
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
        </StyledMenu>
    );
}