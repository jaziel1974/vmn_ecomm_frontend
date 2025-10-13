import Header from '@/components/Header';
import Center from '@/components/Center';
import Button from '@/components/Button';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContext } from './api/auth/auth';
import StarRating from '@/components/StarRating';
import styled from 'styled-components';
import OrdersMenu from '@/components/OrdersMenu';

export default function ReviewOrderPage() {
    const { signed, user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [orderRating, setOrderRating] = useState(0);
    const [orderComment, setOrderComment] = useState('');
    const [itemRatings, setItemRatings] = useState({});
    const [itemComments, setItemComments] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const refreshOrders = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const email = user?.email;
        if (email) {
            axios.get('/api/orders?email=' + encodeURIComponent(email) + '&limit=3')
                .then(res => setOrders(res.data || []))
                .catch(() => setOrders([]));
        }
    }

    useEffect(() => {
        if (!signed) return;
        // fetch user's orders by email
        const email = user?.email;
        if (!email) return;
        axios.get('/api/orders?email=' + encodeURIComponent(email) + '&limit=3').then(res => {
            setOrders(res.data || []);
        }).catch(() => setOrders([]));
    }, [signed, user?.email]);

    // If the page was opened with ?orderId=..., preselect that order when orders are available
    useEffect(() => {
        const queryOrderId = router?.query?.orderId;
        if (!queryOrderId) return;
        if (orders && orders.length > 0) {
            const found = orders.find(o => o._id === queryOrderId);
            if (found) {
                setSelectedOrderId(queryOrderId);
                // remove query param to keep URL clean
                const { orderId, ...rest } = router.query;
                router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
            }
        }
    }, [router, orders]);

    useEffect(() => {
        // reset item ratings/comments when order changes and try load existing review
        async function loadReview() {
            if (!selectedOrderId) {
                setItemRatings({});
                setItemComments({});
                setOrderRating(0);
                setOrderComment('');
                return;
            }
            const order = orders.find(o => o._id === selectedOrderId);
            // initialize defaults based on order.line_items
            const ratings = {};
            const comments = {};
            const items = order?.line_items || order?.items || [];
            items.forEach((it, idx) => {
                ratings[idx] = 0;
                comments[idx] = '';
            });
            setItemRatings(ratings);
            setItemComments(comments);

            try {
                const resp = await axios.get('/api/review-order?orderId=' + selectedOrderId);
                if (resp.data && resp.data.ok && resp.data.review) {
                    const rev = resp.data.review;
                    setOrderRating(rev.orderRating || 0);
                    setOrderComment(rev.orderComment || '');
                    // map stored itemRatings (which may use product ids or indexes) to our index-based state
                    if (rev.itemRatings) {
                        const mappedRatings = { ...ratings };
                        const mappedComments = { ...comments };
                        // if itemRatings is keyed by index, use directly; otherwise try to match by product name or id
                        const keys = Object.keys(rev.itemRatings);
                        if (keys.length > 0) {
                            // attempt to detect whether keys look like numeric indexes
                            const numericKeys = keys.every(k => !isNaN(parseInt(k)));
                            if (numericKeys) {
                                keys.forEach(k => mappedRatings[parseInt(k)] = rev.itemRatings[k]);
                            } else {
                                // try to match by product name or id
                                items.forEach((it, idx) => {
                                    const id = it.productId || it._id || it.id || it.name;
                                    if (id && rev.itemRatings[id] !== undefined) {
                                        mappedRatings[idx] = rev.itemRatings[id];
                                    }
                                });
                            }
                        }
                        if (rev.itemComments) {
                            const ckeys = Object.keys(rev.itemComments);
                            const numericC = ckeys.every(k => !isNaN(parseInt(k)));
                            if (numericC) {
                                ckeys.forEach(k => mappedComments[parseInt(k)] = rev.itemComments[k]);
                            } else {
                                items.forEach((it, idx) => {
                                    const id = it.productId || it._id || it.id || it.name;
                                    if (id && rev.itemComments[id] !== undefined) {
                                        mappedComments[idx] = rev.itemComments[id];
                                    }
                                });
                            }
                        }

                        setItemRatings(mappedRatings);
                        setItemComments(mappedComments);
                    }
                }
            } catch (e) {
                // ignore: leave defaults
                console.error('error loading review', e);
            }
        }
        loadReview();
    }, [selectedOrderId, orders]);

    async function submitReview() {
        if (!signed) {
            alert('Faça login para enviar avaliações');
            return;
        }
        if (!selectedOrderId) {
            alert('Escolha um pedido');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = {
                orderId: selectedOrderId,
                orderRating,
                orderComment,
                itemRatings,
                itemComments,
                userEmail: user?.email
            };
            await axios.post('/api/review-order', payload);
            alert('Avaliação enviada. Obrigado!');
            // reset
            setSelectedOrderId('');
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar avaliação');
        }
        setIsSubmitting(false);
    }

    const selectedOrder = orders.find(o => o._id === selectedOrderId);

    return (
        <>
            <Header />
            <Center>
                <Container>
                    <Card>
                        <H1>Avaliar Pedido</H1>

                        {!signed && (
                            <Message>Faça login para ver seus pedidos e enviar avaliações.</Message>
                        )}

                        {signed && (
                            <div>
                                <Label>Escolha um pedido</Label>
                                <Select value={selectedOrderId} onChange={e => setSelectedOrderId(e.target.value)}>
                                    <option value="">-- selecione --</option>
                                    {orders.map(o => (
                                        <option key={o._id} value={o._id}>Pedido de {new Date(o.createdAt).toLocaleDateString()}</option>
                                    ))}
                                </Select>

                                {selectedOrder && (
                                    <div>
                                        <SectionTitle>Avaliação do Pedido</SectionTitle>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <StarRating value={orderRating} onChange={setOrderRating} />
                                            <span>{orderRating} / 5</span>
                                        </div>
                                        <TextArea rows={4} placeholder="Comentários sobre o pedido" value={orderComment} onChange={e => setOrderComment(e.target.value)} />

                                        <SectionTitle>Avaliação dos Itens</SectionTitle>
                                        {selectedOrder.line_items.map((it, id) => {
                                            return (
                                                <ItemCard key={id}>
                                                    <ItemRow>
                                                        <ProductImage src={it?.image || it.product?.images?.[0]} alt="" />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 'bold' }}>{it.name}</div>
                                                            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <StarRating value={itemRatings[id] || 0} onChange={(v) => setItemRatings(prev => ({ ...prev, [id]: v }))} />
                                                                <span>{itemRatings[id] || 0} / 5</span>
                                                            </div>
                                                            <TextArea rows={2} placeholder="Comentário sobre o item" value={itemComments[id] || ''} onChange={e => setItemComments(prev => ({ ...prev, [id]: e.target.value }))} />
                                                        </div>
                                                    </ItemRow>
                                                </ItemCard>
                                            );
                                        })}

                                        <Actions>
                                            <Button black onClick={submitReview} disabled={isSubmitting}>Enviar Avaliação</Button>
                                            <Button onClick={() => { setSelectedOrderId(''); }}>Cancelar</Button>
                                        </Actions>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </Container>
            </Center>
        </>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 20px;
`;

const Card = styled.div`
    max-width: 900px;
    width: 100%;
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    @media (max-width: 768px) {
        padding: 16px;
        margin: 0 12px;
    }
`;

const H1 = styled.h1`
    margin: 0 0 16px 0;
`;

const Label = styled.label`
    display:block;
    margin-bottom:8px;
    font-weight:600;
`;

const Select = styled.select`
    width:100%;
    padding:10px;
    margin-bottom:16px;
`;

const SectionTitle = styled.h3`
    margin-top:18px;
`;

const TextArea = styled.textarea`
    width:100%;
    margin-top:10px;
    padding:8px;
    border-radius:6px;
    border:1px solid #ddd;
`;

const ItemCard = styled.div`
    border:1px solid #eee;
    padding:10px;
    margin-bottom:10px;
    border-radius:8px;
`;

const ItemRow = styled.div`
    display:flex;
    gap:12px;
    align-items:center;
`;

const ProductImage = styled.img`
    width:60px;
    height:60px;
    object-fit:cover;
    border-radius:6px;
`;

const Actions = styled.div`
    display:flex;
    gap:10px;
    margin-top:12px;
    flex-wrap:wrap;
`;

const Message = styled.div`
    margin-bottom:12px;
`;
