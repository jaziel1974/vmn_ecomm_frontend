import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { sendEmail } from "../shared/mail";
import { AuthContext } from "./api/auth/auth";
import { generateCartItem, getPrice } from "./products";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr .8fr;
    }
    gap: 40px;
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
    height: 70px;
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

const InputOrderDetail = styled(Input)`
    padding: 10px;
`;

export default function CartPage() {
    const { signed, user } = useContext(AuthContext);
    const { cartProducts, setCartProducts, removeProduct, clearCart, cartProductsSize, setCartProductsSize, cartTotalValue, setCartTotalValue } = useContext(CartContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email);
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [shippingType, setShippingType] = useState('none');

    useEffect(() => {
        if (cartProducts?.size > 0) {
            axios.post('/api/cart', { ids: cartProducts.keys() })
                .then(response => {
                    if (signed) {
                        axios.get('/api/customers?email=' + user.email)
                            .then(response => {
                                setName(response.name);
                                setStreetAddress(response.address);
                                setShippingType(response.shippingType);
                            })
                    }
                })
        } else {
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

    function lessOfThisProduct(product) {
        removeProduct(product);
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
            adminNotes,
            customerNotes
        });
        if (response.data.url) {
            window.location = response.data.url;
        }
        alternativePayment();
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
                    <Box style={{ position: 'relative' }}>
                        <h2>Carrinho</h2>
                        {cartProductsSize == 0 && (
                            <div>Carrinho vazio</div>
                        )}
                        {cartProductsSize > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Quantidade</th>
                                        <th>Preço</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartProducts.map(cart => (
                                        <tr>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={cart.product.images[0]} alt=""></img>
                                                </ProductImageBox>
                                                {cart.product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button onClick={() => lessOfThisProduct(cart.product)}>
                                                    -
                                                </Button>
                                                <QuantityLabel>
                                                    {cart.quantity}
                                                </QuantityLabel>
                                                <Button onClick={
                                                    () => {setCartProducts(generateCartItem(cart.product, 1, signed, user, cartProducts)); 
                                                        setCartProductsSize(cartProductsSize + 1); 
                                                        setCartTotalValue(cartTotalValue + parseFloat(cart.unitPrice))}}
                                                >+</Button>
                                            </td>
                                            <td>{cart.unitPrice * cart.quantity}</td>
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
                        <div style={{ position: 'absolute', bottom: '0', display: 'none'}}><span>Frete</span></div>
                    </Box>
                    {!!cartProducts.length && (
                        <Box>
                            <h2>Detalhes do Pedido</h2>
                            <span style={{ display: 'block', marginBottom: '10px'}}>Frete: </span>{name}
                            <span style={{ display: 'block', marginBottom: '10px' }}>Valor total do Pedido: <b>${cartTotalValue}</b></span>

                            <InputOrderDetail type="text" placeholder="Nome" value={name} name="name" onChange={ev => setName(ev.target.value)} />
                            <InputOrderDetail type="text" placeholder="Email"
                                value={email}
                                name="email" onChange={ev => setEmail(ev.target.value)} />
                            <InputOrderDetail type="text" placeholder="Cidade" value={city} name="city" onChange={ev => setCity(ev.target.value)} />
                            <InputOrderDetail type="text" placeholder="CEP" value={postalCode} name="postalCode" onChange={ev => setPostalCode(ev.target.value)} />
                            <InputOrderDetail type="text" placeholder="Rua, número" value={streetAddress} name="streetAddress" onChange={ev => setStreetAddress(ev.target.value)} />
                            <InputOrderDetail type="text" placeholder="Complemento" value={country} name="country" onChange={ev => setCountry(ev.target.value)} />
                            <textarea rows={4} style={{ width: "99%" }} placeholder="Comentários sobre o pedido." value={customerNotes} name="customerNotes" onChange={ev => setCustomerNotes(ev.target.value)} />
                            <Button black block marginBottom style={{ marginBotton: "10px" }} onClick={goToPayment}>Finalizar compra</Button>
                            <Button black block onClick={clearCart}>Limpar carrinho</Button>
                        </Box>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    )
}