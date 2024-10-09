import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import { CartContext } from "@/components/CartContext";
import CartIcon from "@/components/icons/CartIcon";
import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

const Banner = styled.div`
    background-color: #0D3029;
    margin: 10px;
    padding: 5px;
    gap: 20px;
    border-radius: 10px;
`;

const ProductData = styled.div`
    min-height: 200px;
    border-radius: 10px;
    border: 3px solid rgba(0, 0, 0, 0.1);
`;

const ProductTitle = styled.div`
    min-height: 200px;
    padding:10px;
    color: #1B422E;
    background-color: #f0f4bc;
    opacity: 70%;
`;

const Title = styled.h1`
    font-weight:normal;
    font-size:1rem;

`;
const Desc = styled.p`
    font-size:1rem;
    font-size:.8rem;
`;

const DivButton = styled.div`
    width: 100%;
    bottom: 0;
    position: absolute;
    padding: 10px;
    align-items: right;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap:10px;
`;

const ProductWrapper = styled.div`
    display: block;
    border-radius: 10px;
    min-height: 95%;
    border: 3px solid rgba(0, 0, 0, 0.1);
    margin: 2px;
    background-color: #ffedbc;
    height: 300px;
    background-size: cover;
    @media (max-width: 768px) {
        width: 340px;
    }
    @media (min-width: 769px) {
        width: 440px;
    }
`;

export default function Featured({ products }) {
    const { addProduct } = useContext(CartContext);

    const carousel = useRef();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);
    }, []);


    function addFeaturedToCart() {
        addProduct(products[0]._id);
    }

    return (
        <Banner>
            <div style={{ padding: '5px' }}><span style={{ color: '#FEBA51' }}>O que a gente tem de melhor</span></div>
            <motion.div ref={carousel} style={{ cursor: 'grab', overflow: 'hidden' }} whileTap={{ cursor: 'grabbing' }}>
                <motion.div style={{ display: 'flex' }} drag="x" dragConstraints={{ right: 0, left: -width }} initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 0.8 }}>
                    {products.map((product) =>
                        <motion.div key={product._id}>
                            <ProductWrapper style={{ backgroundImage: `url(${product.images[0]})` }}>
                                <ProductData>
                                    <ProductTitle>
                                        <Title>{product.title}</Title>
                                        <Desc>{product.description}</Desc>
                                        <ButtonLink href={'/product/' + product._id} primary={1} style={{ width: '140px', fontSize: '0.8rem' }}>Vá para o produto</ButtonLink>
                                    </ProductTitle>
                                </ProductData>
                                <DivButton>
                                    <ButtonsWrapper>
                                        <Button black={1} style={{ width: '140px' }} onClick={addFeaturedToCart}>
                                            <CartIcon></CartIcon>
                                            <span style={{ fontSize: '0.8rem' }}>Adicionar ao carrinho</span>
                                        </Button>
                                    </ButtonsWrapper>
                                </DivButton>
                            </ProductWrapper>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </Banner>
    );
}