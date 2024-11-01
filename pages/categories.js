import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import styled from "styled-components";
import { useRouter } from 'next/navigation';

const CategoryWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const CategoryData = styled.button`
    box-shadow: inset 0 -3em 3em rgba(0,0,0,0.2),
             0 0  0 2px rgb(245,245,245),
             0.3em 0.3em 1em rgba(0,0,0,0.4);
    display: block;
    border-radius: 10px;
    margin: 10px;
    background-color: #1B422E;
    height: 100px;
    background-size: cover;
    @media screen and (max-width: 767px) {
        width: 150px;
    }
    @media screen and (min-width: 768px) {
        width: 300px;
    }
    text-align: center;
    align-content: center;
    color: #FEBA51;
`;

export default function CategoriesPage({ categories }) {
    const router = useRouter();

    return (
        <>
            <Header></Header>
            <Center style={{ minWidth: '75%' }}>
                <Title>Todos as categorias</Title>
                <CategoryWrapper>
                {
                    categories && categories.map((category) => (
                        <CategoryData key={category._id} onClick={() => router.push('/products?category=' + category.name)}>{category.name}</CategoryData>
                    ))
                }
                </CategoryWrapper>
            </Center>
        </>
    );
}


export async function getServerSideProps() {
    await mongooseConnect();
    let categories = [];
    categories = await Category.find({
        "properties.name": "sales", "properties.values": "true"
    }, null, { sort: { 'name': 1 } });

    return {
        props: {
            categories: JSON.parse(JSON.stringify(categories)),
        }
    }
}