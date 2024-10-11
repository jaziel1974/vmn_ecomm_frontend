import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "./api/auth/auth";
import { useRef } from "react";

const StyledParagraph = styled.p`
    color: chocolate;
    font-weight: 700;
`;

const StyledSearchGrid = styled.div`
    align-items: center;
`;

const StyledSearchText = styled.input`
    opacity: 80%;
    width: 99%;
    color: green;
    height: 30px;
    margin-left: 2px;
    margin-bottom: 2px;
`;

export default function ProductsPage({ products, latestProducts }) {
    const [searchSelected, setSearchSelected] = useState(false);

    const { signed, user } = useContext(AuthContext);
    const [data, setData] = useState('');

    const ref = useRef(null);

    const childToParent = (childData) => {
        setData(childData);
    }

    const filterProducts = (value) => {
        if (childToParent) {
            updateSearch(value);
        }
    }

    const updateSearch = (value) => {
        childToParent(value);
    }

    return (
        <>
            <Header childToParent={childToParent}></Header>

            <StyledSearchGrid>
                <form>
                    <StyledSearchText type="text"
                        ref={ref}
                        onChange={(e) => filterProducts(e.target.value)}
                        onFocus={() => setSearchSelected(true)}
                        onBlur={() => setSearchSelected(false)}
                        placeholder="Procurar itens... pressione /"
                    >
                    </StyledSearchText>
                </form>
            </StyledSearchGrid>

            <Center style={{ minWidth: '75%' }}>
                <Title>Todos os produtos</Title>
                {!signed &&
                    <StyledParagraph>Registre-se para ver o preço e adicionar itens à sacola.</StyledParagraph>
                }
                <ProductsGrid products={products} search={data}></ProductsGrid>
            </Center>
        </>
    );
}

export async function getServerSideProps(params) {
    let search = params?.query?.search;
    await mongooseConnect();
    let products = [];
    if (!search) {
        products = await Product.find({}, null, { sort: { 'stockAvailable': -1, 'title': 1 } });
    }
    else {
        products = await Product.find({ title: { $regex: search, $options: 'i' } }, null, { sort: { 'stockAvailable': -1, 'title': 1 } });
    }
    const latestProducts = await Product.find({}, null, { sort: { 'createdAt': -1 }, limit: 10 });

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            latestProducts: JSON.parse(JSON.stringify(latestProducts))
        }
    };
}

export function getPrice(product) {
    const { signed, user } = useContext(AuthContext);
    console.log("user getting product price", user);

    if (!product) {
        return 0;
    }
    if (signed) {
        if (product.pricePerZone) {
            var zonedPrice = product.pricePerZone.filter(
                price => {
                    return price.name == user.user.data.priceId;
                })
            if (zonedPrice.length > 0) {
                return zonedPrice[0].values;
            }
            return product.price;
        }
        return product.price;
    }
    return product.price;
}