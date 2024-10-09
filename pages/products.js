import Center from "@/components/Center";
import Featured from "@/components/Featured";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "./api/auth/auth";

const StyledParagraph = styled.p`
    color: chocolate;
    font-weight: 700;
`;

export default function ProductsPage({ products, latestProducts }) {
    const { signed, user } = useContext(AuthContext);
    const [data, setData] = useState('');

    const childToParent = (childData) => {
        setData(childData);
    }

    return (
        <>
            <Header childToParent={childToParent}></Header>
            <Center style={{ minWidth: '75%' }}>
                <Title>Todos os produtos</Title>
                {!signed &&
                    <StyledParagraph>Registre-se para ver o preço e adicionar itens à sacola.</StyledParagraph>
                }
                <ProductsGrid products={products} search={data}></ProductsGrid>
            </Center>
            <Featured products={latestProducts}></Featured>
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