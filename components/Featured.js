import Center from "@/components/Center";
import styled from "styled-components";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import {background} from "@/lib/colors";

const Bg = styled.div`
    background-color: ${background};
    color:#fff;
    padding: 50px 0;
`;
const Title = styled.h1`
    margin:0;
    font-weight:normal;
    font-size:1.5rem;
    @media screen and (min-width: 768px) {
        font-size:3rem;
    }
`;
const Desc = styled.p`
    color:#FEBA51;
    font-size:.8rem;
`;
const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
        gap: 40px;
    img{
        max-width: 100%;
        max-height: 200px;
        display: block;
        margin: 0 auto;
    }
    div:nth-child(1) {
        order: 2;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.1fr 0.9fr;
        div:nth-child(1) {
            order: 0;
        }
        img{
            max-width: 100%;
        }
    }
`;
const Column = styled.div`
    display: flex;
    align-items: center;
`;
const ButtonsWrapper = styled.div`
    display: flex;
    gap:10px;
    margin-top:25px;
`;

export default function Featured({product}) {
    const {addProduct} = useContext(CartContext);
    function addFeaturedToCart() {
        addProduct(product._id);
    }
    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <Title>{product.title}</Title>
                            <Desc>{product.description}</Desc>
                            <ButtonsWrapper>
                                <ButtonLink href={'/product/' + product._id} outline={1} white={1}>Saiba mais</ButtonLink>
                                <Button white onClick={addFeaturedToCart}>
                                    <CartIcon></CartIcon>
                                    Adicionar ao carrinho
                                </Button>
                            </ButtonsWrapper>
                        </div>
                    </Column>
                    <Column>
                        <img src="https://firebasestorage.googleapis.com/v0/b/react-ecommerce-a479e.appspot.com/o/files%2Fproductimages%2F1700679722124.jpg?alt=media&token=e5180e8b-487c-487a-b994-3241908e7b75" alt="" />
                    </Column>
                </ColumnsWrapper>
            </Center>

        </Bg>
    );
}