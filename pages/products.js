import { CartContext } from "@/components/CartContext";
import Link from "next/link";
import BasketIcon from "./../components/icons/Bakset";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "./api/auth/auth";
import { useRef } from "react";

const NavCartLink = styled.nav`
    position: fixed;
    top: 10px;
    right: 47%;
    z-index: 2000;
`;

const CartLink = styled(Link)`
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
        font-size: 1.2rem;
        margin-bottom: 20px;
    }
    height: 25px;
`;

const StyledParagraph = styled.p`
    color: chocolate;
    font-weight: 700;
`;

const StyledSearchGrid = styled.div`
    align-items: center;
`;

const StyledSearchText = styled.input`
    opacity: 80%;
    @media screen and (max-width: 767px) {
        width: 97%;
    }
    @media screen and (min-width: 768px) {
        width: 99%;
    }
    color: green;
    height: 30px;
    margin-left: 2px;
    margin-bottom: 2px;
`;

export default function ProductsPage({ products, latestProducts }) {
    const [searchSelected, setSearchSelected] = useState(false);

    const { signed, user } = useContext(AuthContext);
    const [data, setData] = useState('');
    const { cartProducts } = useContext(CartContext);

    const ref = useRef(null);

    const childToParent = (childData) => {
        setData(childData);
    }

    const filterProducts = (value) => {
        if (childToParent) {
            updateSearch(value);
        }
    }

    const updateSearch = (value) => {
        childToParent(value);
    }

    const handleKeyPress = useCallback((event) => {
        const pressedSlash = event.key == '/';
        const escKey = event.key == 'Escape';

        if (pressedSlash) {
            ref.current.focus();
            ref.current.select();
            event.preventDefault();
        }
        else if (escKey) {
            setSearch('');
        }
        else if (event.key == 'Enter' && searchSelected) {
            redirect(event.target.value);
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
        <>
            <NavCartLink>
                <CartLink href={'/cart'}>
                    <BasketIcon style={{ width: "40px" }} />
                    ({cartProducts.length})
                </CartLink>
            </NavCartLink>
            <Header></Header>

            <StyledSearchGrid style={{zIndex: 100}}>
                <form>
                    <StyledSearchText type="text"
                        ref={ref}
                        onChange={(e) => filterProducts(e.target.value)}
                        onFocus={() => setSearchSelected(true)}
                        onBlur={() => setSearchSelected(false)}
                        placeholder="Procurar itens..."
                    >
                    </StyledSearchText>
                </form>
            </StyledSearchGrid>

            <Center style={{ minWidth: '75%' }}>
                <Title>Todos os produtos</Title>
                {!signed &&
                    <StyledParagraph>Registre-se para ver o preço e adicionar itens à sacola.</StyledParagraph>
                }
                <ProductsGrid products={products} search={data}></ProductsGrid>
            </Center>
        </>
    );
}

export async function getServerSideProps(params) {
    let search = params?.query?.search;
    await mongooseConnect();
    let products = [];
    if (!search) {
        products = await Product.find({}, null, { sort: { 'stockAvailable': -1, 'title': 1 } });
    }
    else {
        products = await Product.find({ title: { $regex: search, $options: 'i' } }, null, { sort: { 'stockAvailable': -1, 'title': 1 } });
    }
    const latestProducts = await Product.find({}, null, { sort: { 'createdAt': -1 }, limit: 10 });

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            latestProducts: JSON.parse(JSON.stringify(latestProducts))
        }
    };
}

export function getPrice(product) {
    const { signed, user } = useContext(AuthContext);
    console.log("user getting product price", user);

    if (!product) {
        return 0;
    }
    if (signed) {
        if (product.pricePerZone) {
            var zonedPrice = product.pricePerZone.filter(
                price => {
                    return price.name == user.user.data.priceId;
                })
            if (zonedPrice.length > 0) {
                return zonedPrice[0].values;
            }
            return product.price;
        }
        return product.price;
    }
    return product.price;
}