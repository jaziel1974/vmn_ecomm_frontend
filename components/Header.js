import { background } from "@/lib/colors";
import { AuthContext } from "@/pages/api/auth/auth";
import { useRouter } from 'next/navigation';
import { useContext, useState } from "react";
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
    padding: 0 15px;
    @media screen and (max-width: 768px) {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    @media screen and (min-width: 769px) {
        /* Removed fixed height to allow content to define header height */
        display: block;
    }
`;

const TopBar = styled.div`
    @media screen and (min-width: 769px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
    }
    @media screen and (max-width: 768px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
`;

const Logo = styled.div`
    text-decoration: none;
    display: flex;
    align-items: center;
`;

const LogoImage = styled.img`
    cursor: pointer;
    @media screen and (max-width: 768px) {
        height: 40px;
        width: 40px;
    }
    @media screen and (min-width: 769px) {
        height: 62px;
        width: 62px;
    }
`;

// Hamburger Menu Button
const HamburgerButton = styled.button`
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    z-index: 1001;
    
    @media screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

const HamburgerLine = styled.span`
    width: 25px;
    height: 3px;
    background-color: #FEBA51;
    margin: 3px 0;
    transition: 0.3s;
    transform-origin: center;
    
    ${props => props.isOpen && `
        &:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }
        &:nth-child(2) {
            opacity: 0;
        }
        &:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }
    `}
`;

// Mobile Menu Overlay
const MobileMenuOverlay = styled.div`
    display: none;
    
    @media screen and (max-width: 768px) {
        display: ${props => props.isOpen ? 'block' : 'none'};
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
`;

const MobileMenu = styled.nav`
    display: none;
    
    @media screen and (max-width: 768px) {
        display: ${props => props.isOpen ? 'flex' : 'none'};
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background-color: ${background};
        flex-direction: column;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: calc(100vh - 70px);
        overflow-y: auto;
    }
`;

// Desktop Navigation
const DesktopNav = styled.nav`
    @media screen and (max-width: 768px) {
        display: none;
    }
    @media screen and (min-width: 769px) {
        display: flex;
        justify-content: center;
        gap: 30px;
        padding: 10px 0;
        border-top: 1px solid rgba(254, 186, 81, 0.3);
    }
`;

// Auth Navigation (Desktop only)
const AuthNav = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    color: #FEBA51;
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 5px;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: rgba(254, 186, 81, 0.1);
        transform: translateY(-2px);
    }
    
    @media screen and (max-width: 768px) {
        font-size: 1rem;
        padding: 15px 10px;
        border-bottom: 1px solid rgba(254, 186, 81, 0.2);
        justify-content: flex-start;
        
        &:last-child {
            border-bottom: none;
        }
    }
    @media screen and (min-width: 769px) {
        font-size: 1.1rem;
    }
`;

const CartContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

const CartLink = styled(Link)`
    display: flex;
    align-items: center;
    color: #FEBA51;
    text-decoration: none;
    position: relative;
    padding: 5px;
    
    &:hover {
        transform: scale(1.1);
    }
`;

const CartBadge = styled.span`
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ff4757;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
`;

export default function Header() {
    const router = useRouter();
    const { cartProductsSize } = useContext(CartContext);
    const { signed, signout } = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogin = () => {
        signout();
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const navigation = [
        { href: '/', label: 'Principal' },
        { href: '/products', label: 'Todos os produtos' },
        { href: '/categories', label: 'Categorias' },
        { href: '/subscribe', label: '🔔 Notificações' },
    ];

    return (
        <StyledHeader>
            <TopBar>
                <Logo>
                    <LogoImage
                        src='/logo.png'
                        alt='Verde Musgo Natural'
                        onClick={() => router.push('/')}
                    />
                </Logo>

                {/* Cart (always visible) */}
                <CartContainer>
                    <CartLink href={'/cart'}>
                        <BasketIcon style={{ width: "35px", height: "35px" }} />
                        {cartProductsSize > 0 && (
                            <CartBadge>{cartProductsSize}</CartBadge>
                        )}
                    </CartLink>
                </CartContainer>

                {/* Desktop Auth Navigation */}
                <AuthNav>
                    {!signed && (
                        <NavLink href={'/signin'}>Entrar</NavLink>
                    )}
                    {signed && (
                        <>
                            <NavLink href={'/myAccount'}>Minha Conta</NavLink>
                            <NavLink href='' onClick={e => {
                                e.preventDefault();
                                handleLogin();
                            }}>Sair</NavLink>
                        </>
                    )}
                </AuthNav>

                {/* Mobile Hamburger Button */}
                <HamburgerButton onClick={toggleMobileMenu} aria-label="Toggle menu">
                    <HamburgerLine isOpen={mobileMenuOpen} />
                    <HamburgerLine isOpen={mobileMenuOpen} />
                    <HamburgerLine isOpen={mobileMenuOpen} />
                </HamburgerButton>
            </TopBar>

            {/* Desktop Navigation */}
            <DesktopNav>
                {navigation.map((item) => (
                    <NavLink key={item.href} href={item.href}>
                        {item.label}
                    </NavLink>
                ))}
                {signed && (
                    <NavLink href={'/myAccount'}>Conta</NavLink>
                )}
            </DesktopNav>

            {/* Mobile Menu Overlay */}
            <MobileMenuOverlay isOpen={mobileMenuOpen} onClick={closeMobileMenu} />

            {/* Mobile Navigation */}
            <MobileMenu isOpen={mobileMenuOpen}>
                {navigation.map((item) => (
                    <NavLink key={item.href} href={item.href} onClick={closeMobileMenu}>
                        {item.label}
                    </NavLink>
                ))}
                
                {/* Mobile Auth Links */}
                {!signed && (
                    <NavLink href={'/signin'} onClick={closeMobileMenu}>
                        Entrar
                    </NavLink>
                )}
                {signed && (
                    <>
                        <NavLink href={'/myAccount'} onClick={closeMobileMenu}>
                            Minha Conta
                        </NavLink>
                        <NavLink href='' onClick={e => {
                            e.preventDefault();
                            handleLogin();
                            closeMobileMenu();
                        }}>
                            Sair
                        </NavLink>
                    </>
                )}
            </MobileMenu>
        </StyledHeader>
    )
}