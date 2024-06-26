import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { useContext, useState } from "react";
import { AuthContext } from "./api/auth/auth";

const StyledParagraph = styled.p`
    color: chocolate;
    font-weight: 700;
`;


export default function ProductsPage({ products }) {
    const { signed, user } = useContext(AuthContext);
    const [data, setData] = useState('');
    const childToParent = (childData) => {
        setData(childData);
    }
    
    return (
        <>
            <Header childToParent={childToParent}></Header>
            <Center>
                <Title>Todos os produtos</Title>
                {!signed &&
                    <StyledParagraph>Registre-se para ver o preço e adicionar itens à sacola.</StyledParagraph>
                }
                <ProductsGrid products={products} search={data}></ProductsGrid>
            </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { 'stockAvailable': -1, 'title': 1 } });
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        }
    };
}

export function getPrice(product) {
    const { signed, user } = useContext(AuthContext);

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