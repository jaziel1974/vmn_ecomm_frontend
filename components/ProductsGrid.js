import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import { useCallback, useEffect, useRef, useState } from "react";

const StyledProductsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    
    }
`;

const StyledSearchGrid = styled.div`
    position: absolute;
    right: 55%;
    top: 0;
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
            <StyledSearchGrid >
                <form>
                    <input type="text"
                        ref={ref}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Procurar itens... pressione /"
                        value={search}>
                    </input>
                </form>
            </StyledSearchGrid>

            <StyledProductsGrid>
                {products?.length > 0 && products.filter((pr) => {
                    return search.toLowerCase() === '' ? pr : pr.title.toLowerCase().includes(search.toLowerCase());
                }).map(product => (
                    <ProductBox key={product._id} {...product}>{product.title}</ProductBox>
                ))}
            </StyledProductsGrid>
        </div>
    );
}