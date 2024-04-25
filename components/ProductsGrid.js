import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import { useCallback, useEffect, useRef, useState } from "react";

const StyledProductsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
`;

const StyledSearchGrid = styled.div`
height: 30px;
@media screen and (min-width: 769px) {
        position: fixed;
        right: 2%;
        top: 50px;
        right: 2%;
        width: 40%;
    }
    @media screen and (max-width: 768px) {
        position: fixed;
        width: 88%;
        bottom: 0;
        color: green;
    }
`;

const StyledSearchText = styled.input`
    opacity: 80%;
    width: 100%;
    color: green;
`;

export default function ProductsGrid({ products }) {
    const ref = useRef(null);
    const [search, setSearch] = useState('');

    const handleKeyPress = useCallback((event) => {
        const truefalse = event.key == '/';
        const escKey = event.key == 'Escape';
        console.log(event.key);
        if (truefalse) {
            ref.current.focus()
            event.preventDefault();
        }
        else if (escKey) {
            setSearch('');
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
        <div>
            <StyledProductsGrid>
                {products?.length > 0 && products.filter((pr) => {
                    return search.toLowerCase() === '' ? pr : pr.title.toLowerCase().includes(search.toLowerCase());
                }).map(product => (
                    <ProductBox key={product._id} {...product}>{product.title}</ProductBox>
                ))}
            </StyledProductsGrid>
            <StyledSearchGrid id="search">
                <form>
                    <StyledSearchText type="text"
                        ref={ref}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Procurar itens... pressione /"
                        value={search}
                    >
                    </StyledSearchText>
                </form>
            </StyledSearchGrid>
        </div>
    );
}