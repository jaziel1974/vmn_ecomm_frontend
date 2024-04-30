import styled from "styled-components";
import ProductBox from "@/components/ProductBox";

const StyledProductsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
`;

export default function ProductsGrid({ products, search }) {
    return (
        <div>
            <StyledProductsGrid>
                {products?.length > 0 && products.filter((pr) => {
                    return search?.toLowerCase() === '' ? pr : pr.title.toLowerCase().includes(search?.toLowerCase());
                }).map(product => (
                    <ProductBox key={product._id} {...product}>{product.title}</ProductBox>
                ))}
            </StyledProductsGrid>
        </div>
    );
}