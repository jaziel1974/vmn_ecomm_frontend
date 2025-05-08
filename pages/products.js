import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "./api/auth/auth";

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
    const { signed, user } = useContext(AuthContext);

    const [searchSelected, setSearchSelected] = useState(false);
    const [data, setData] = useState('');

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
            <Header></Header>
            <Center style={{ minWidth: '75%' }}>
                <StyledSearchGrid style={{ zIndex: 100 }}>
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
    let category = params?.query?.category;

    await mongooseConnect();
    const advertisementCataegory = await Category.find({ name: "Advertisement" });
    let products = [];
    if (category) {
        let categoryData = await Category.findOne({ name: category });
        if (!categoryData) {
            products = [];
        }
        else {
            products = await Product.find({ category: categoryData._id }, null, { sort: { 'stockAvailable': -1, 'title': 1 } });
        }
    }
    else if (!search) {
        products = await Product.find({category: { $ne: advertisementCataegory[0]._id}}, null, { sort: { 'stockAvailable': -1, 'title': 1 } });
    }
    else {
        products = await Product.find({ title: { $regex: search, $options: 'i' } }, null, { sort: { 'stockAvailable': -1, 'title': 1 } });
    }
    const latestProducts = await Product.find({category: { $ne: advertisementCataegory[0]._id}, stockAvailable: true }, null, { sort: { 'createdAt': -1 }, limit: 10 });

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            latestProducts: JSON.parse(JSON.stringify(latestProducts))
        }
    };
}

export function getPrice(product, signed, user) {

    if (!product) {
        return 0;
    }
    if (signed) {
        if (product.pricePerZone) {
            var zonedPrice = product.pricePerZone.filter(
                price => {
                    return price.name == user.user.data.customer.priceId;
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

export const generateCartItem = (product, quantity, signed, user, cartProducts) => {
    let cartItem = {
        product: product,
        quantity: quantity,
        unitPrice: getPrice(product, signed, user),
    }

    let cartProductsData = [...cartProducts];
    let cartProductItem = cartProductsData.find((cartItemData) => cartItemData.product._id == cartItem.product._id);
    if (!cartProductItem) {
        cartProductItem = cartItem;
        cartProductsData.push(cartProductItem);
    }
    else {
        cartProductItem.quantity = cartProductItem.quantity + cartItem.quantity;
    }

    return cartProductsData;
}


export const removeCartItem = (product, quantity, cartProducts) => {
    let cartItem = {
        product: product,
    }
    let cartProductsData = [...cartProducts];

    let cartProductItem = cartProductsData.find((cartItemData) => cartItemData.product._id == cartItem.product._id);
    if (cartProductItem) {
        if (cartProductItem.quantity - quantity > 0) {
            cartProductItem.quantity = cartProductItem.quantity - quantity;
        }
        else {
            cartProductsData = cartProducts.filter((cartItemData) => cartItemData.product._id != cartItem.product._id);
        }
    }

    return cartProductsData;
}

export const cartItemExists = (product, cartProducts) => {
    let cartItem = {
        product: product,
    }
    if (cartProducts.find((cartItemData) => cartItemData.product._id == cartItem.product._id)) {
        return true;
    }
    return false;
}