import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { useContext, useState } from "react";
import { AuthContext } from "./api/auth/auth";

export default function ProductsPage({ products }) {
    
    const [data, setData] = useState('');
    const childToParent = (childData) => {
        setData(childData);
    }
    
    return (
        <>
            <Header childToParent={childToParent}></Header>
            <Center>
                <Title>Todos os produtos</Title>
                {data}
                <ProductsGrid products={products} search={data}></ProductsGrid>
            </Center>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    const products = await Product.find({}, null, { sort: { 'title': 1 } });
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
            if (zonedPrice > 0) {
                return zonedPrice[0].values;
            }
            return product.price;
        }
        return product.price;
    }
    console.log(product);
    return product.price;
}