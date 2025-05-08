import ProductBox from "@/components/ProductBox";
import { useContext } from "react";
import styled from "styled-components";
import { getPrice } from "@/lib/products";
import { AuthContext } from "../pages/api/auth/auth";

const StyledProductsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
`;

export default function ProductsGrid({ products, search }) {
    const { signed, user } = useContext(AuthContext);

    return (
        <div>
            <StyledProductsGrid>
                {products?.length > 0 && products.filter((pr) => {
                    return search?.toLowerCase() === '' ? pr : pr.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(search?.toLowerCase());
                }).map(product => (
                    product.price = getPrice(product, signed, user),
                    <ProductBox key={product._id} product={product}>{product.title}</ProductBox>
                ))}
            </StyledProductsGrid>
        </div>
    );
}