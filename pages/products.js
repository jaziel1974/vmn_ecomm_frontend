import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";

export default function ProductsPage({ products }) {
    return (
        <>
            <Header></Header>
            <Center>
                <Title>Todos os produtos</Title>
                <ProductsGrid products={products}></ProductsGrid>
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