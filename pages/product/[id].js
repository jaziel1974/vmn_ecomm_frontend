import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import CartIcon from "@/components/icons/CartIcon";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { styled } from "styled-components";

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: .8fr 1.2fr;
    }
    gap: 40px;
    margin: 40px 0;
`;
const PriceRow = styled.div`
    gap: 20px;
    display: flex;
    align-items: center;
`;
const Price = styled.span`
    font-size: 1.4rem;
`;

export default function ProductPage({ product }) {
    const session = useSession();
    const { addProduct } = useContext(CartContext);

    return (
        <>
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images}></ProductImages>
                    </WhiteBox>
                    <div>
                        <Title>{product.title}</Title>
                        <p>{product.description}</p>
                        <PriceRow>
                            <div>
                                {session && session.status.toString() === "authenticated" && (
                                    <Price>${product.price}</Price>
                                )}
                            </div>
                            <div>
                                <Button primary={1} onClick={() => addProduct(product._id)}><CartIcon></CartIcon>Adicionar ao carrinho</Button>
                            </div>
                        </PriceRow>
                    </div>
                </ColWrapper>
            </Center>
        </>
    )
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const product = await Product.findById(id)
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        }
    }
}