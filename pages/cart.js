import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { AuthContext } from "./api/auth/auth";
import { getPrice } from "./products";
import {sendEmail} from "../shared/mail";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr .8fr;
    }
    gap: 40px;
    margin-top: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;    
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);  
    display:flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px) {
        padding: 10px;
        width: 100px;
        height: 100px;    
                img{
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 15px; 
    display: block; 
    @media screen and (min-width: 768px) {
        display: inline-block;
        padding: 0 10px;
    }
`;

const CityHolder = styled.div`
    display:flex;
    gap: 5px;
`;

export default function CartPage() {
    const { signed, user } = useContext(AuthContext);

    const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email);
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [priceId, setPriceId] = useState(user?.user.data.priceId);
    const [adminNotes, setAdminNotes] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');


    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', { ids: cartProducts })
                .then(response => {
                    setProducts(response.data);
                    if (signed) {
                        axios.get('/api/customers?email=' + user.email)
                            .then(response => {
                                setName(response.name);
                                setStreetAddress(response.address);
                            })
                    }
                })
        } else {
            setProducts([]);
            setName("");
            setStreetAddress("");
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window !== "undefined" && window.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
    }, []);

    function alternativePayment() {
        clearCart();
        setIsSuccess(true);
        sendEmail(user.email, "template_akp3tfc");
    }

    function moreOfThisProduct(productId) {
        addProduct(productId);
    }

    function lessOfThisProduct(productId) {
        removeProduct(productId);
    }

    async function goToPayment() {
        if (!signed) {
            alert('Faça login para continuar');
            return;
        }

        const response = await axios.post('/api/checkout', {
            name,
            email,
            city,
            postalCode,
            streetAddress,
            country,
            cartProducts,
            priceId,
            adminNotes,
            customerNotes
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
        alternativePayment();
    }

    let total = 0;
    if (products.length > 0) {
        for (const productId of cartProducts) {
            const price = getPrice(products.find(p => p._id === productId));
            total += price;
        }
    }

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnsWrapper>
                        <Box>
                            <h1>Thank you for shopping with us!</h1>
                            <p>Go to home page</p>
                        </Box>
                    </ColumnsWrapper>
                </Center>
            </>
        )
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <h2>Carrinho</h2>
                        {!cartProducts?.length && (
                            <div>Carrinho vazio</div>
                        )}
                        {products.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Quantidade</th>
                                        <th>Preço</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.images[0]} alt=""></img>
                                                </ProductImageBox>
                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button onClick={() => lessOfThisProduct(product._id)}>
                                                    -
                                                </Button>
                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id === product._id).length}
                                                </QuantityLabel>
                                                <Button onClick={() => moreOfThisProduct(product._id)}>
                                                    +
                                                </Button>
                                            </td>
                                            <td>
                                                {
                                                    cartProducts.filter(id => id === product._id).length * getPrice(product)
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </Table>
                        )}
                    </Box>
                    {!!cartProducts.length && (
                        <Box>
                            <h2>Order information</h2>
                            <Input type="text" placeholder="Nome" value={name} name="name" onChange={ev => setName(ev.target.value)} />
                            <Input type="text" placeholder="Email"
                                value={email}
                                name="email" onChange={ev => setEmail(ev.target.value)} />
                            <Input type="text" placeholder="Cidade" value={city} name="city" onChange={ev => setCity(ev.target.value)} />
                            <Input type="text" placeholder="CEP" value={postalCode} name="postalCode" onChange={ev => setPostalCode(ev.target.value)} />
                            <Input type="text" placeholder="Rua, número" value={streetAddress} name="streetAddress" onChange={ev => setStreetAddress(ev.target.value)} />
                            <Input type="text" placeholder="Complemento" value={country} name="country" onChange={ev => setCountry(ev.target.value)} />
                            <textarea rows={4} placeholder="Notas internas" value={adminNotes} name="adminNotes" onChange={ev => setAdminNotes(ev.target.value)}/>
                            <textarea rows={4} placeholder="Notas do cliente" value={customerNotes} name="customerNotes" onChange={ev => setCustomerNotes(ev.target.value)}/>
                            <Button black block onClick={goToPayment}>Finalizar compra</Button>
                            <Button black block onClick={clearCart}>Limpar carrinho</Button>
                        </Box>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    );
}