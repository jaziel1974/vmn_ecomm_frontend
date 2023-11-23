import { styled } from "styled-components";
import Center from "./Center";
import ProductsGrid from "./ProductsGrid";

const Title = styled.h2`
    font-size: 2rem;
    font-weight: normal;
    margin: 30px 0 20px;
`;

export default function NewProducts({ products }) {
    return (
        <Center>
            <Title>Produtos recentes</Title>
            <ProductsGrid products={products}></ProductsGrid>
        </Center>
    )
}