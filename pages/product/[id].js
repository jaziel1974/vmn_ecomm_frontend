import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import CartIcon from "@/components/icons/CartIcon";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../api/auth/auth";
import { generateCartItem, getPrice } from "@/pages/products";
import { CartContext } from "@/components/CartContext";
import axios from "axios";

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
        display: flex;
gap: 20px;
    align-items: center;
`;
const Price = styled.span`
    font-size: 1.4rem;
`;

export default function ProductPage({ product }) {
    const { signed, user } = useContext(AuthContext);
    const { cartProducts, setCartProducts, cartProductsSize, setCartProductsSize, cartTotalValue, setCartTotalValue } = useContext(CartContext);

    const handleAddItem = async (product) => {
        let storeOpenedData = await axios.get('/api/store-settings?id=store.opened');
        console.log("storeOpenedData", storeOpenedData.data[0]);
        if (storeOpenedData.data && !storeOpenedData.data[0].value) {
            alert('Loja fechada, aguarde para realizar a compra');
            return;
        }

        setCartProducts(generateCartItem(product, 1, signed, user, cartProducts));
        setCartProductsSize(cartProductsSize + 1);
        setCartTotalValue(cartTotalValue + getPrice(product, signed, user))
    }

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
                        <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
                        <PriceRow>
                            <div>
                                {signed && (
                                    <Price>${product.price}</Price>
                                )}
                            </div>
                            <div>
                            {signed && product.stockAvailable && (
                                <Button primary={1} onClick={() => handleAddItem(product)}>
                                    <CartIcon></CartIcon>Adicionar ao carrinho
                                </Button>
                            )}
                            </div>
                        </PriceRow>
                    </div>
                </ColWrapper>
            </Center>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const product = await Product.findById(id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        }
    }
}