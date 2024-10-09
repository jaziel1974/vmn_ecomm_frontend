import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import { getPrice } from "../pages/products";

const StyledProductsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
`;

export default function ProductsGrid({ products, search }) {
    return (
        <div>
            <StyledProductsGrid>
                {products?.length > 0 && products.filter((pr) => {
                    return search?.toLowerCase() === '' ? pr : pr.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(search?.toLowerCase());
                }).map(product => (
                    product.price = getPrice(product),
                    <ProductBox key={product._id} {...product}>{product.title}</ProductBox>
                ))}
            </StyledProductsGrid>
        </div>
    );
}