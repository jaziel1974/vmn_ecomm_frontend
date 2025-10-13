import Header from '@/components/Header';
import Center from '@/components/Center';
import Button from '@/components/Button';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './api/auth/auth';
import StarRating from '@/components/StarRating';

export default function ReviewOrderPage() {
    const { signed, user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [orderRating, setOrderRating] = useState(0);
    const [orderComment, setOrderComment] = useState('');
    const [itemRatings, setItemRatings] = useState({});
    const [itemComments, setItemComments] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!signed) return;
        // fetch user's orders by email
        const email = user?.email;
        if (!email) return;
        axios.get('/api/orders?email=' + encodeURIComponent(email)).then(res => {
            setOrders(res.data || []);
            console.log(res.data);
        }).catch(() => setOrders([]));
    }, [signed, user?.email]);

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
                <div style={{ maxWidth: 900, width: '100%' }}>
                    <h1>Avaliar Pedido</h1>

                    {!signed && (
                        <div>Faça login para ver seus pedidos e enviar avaliações.</div>
                    )}

                    {signed && (
                        <div>
                            <label>Escolha um pedido</label>
                            <select value={selectedOrderId} onChange={e => setSelectedOrderId(e.target.value)} style={{ width: '100%', padding: 10, margin: '10px 0' }}>
                                <option value="">-- selecione --</option>
                                {orders.map(o => (
                                    <option key={o._id} value={o._id}>Pedido {o._id} — {o.status || ''}</option>
                                ))}
                            </select>

                            {selectedOrder && (
                                <div style={{ marginTop: 20 }}>
                                    <h3>Avaliação do Pedido</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <StarRating value={orderRating} onChange={setOrderRating} />
                                        <span>{orderRating} / 5</span>
                                    </div>
                                    <textarea rows={4} style={{ width: '100%', marginTop: 10 }} placeholder="Comentários sobre o pedido" value={orderComment} onChange={e => setOrderComment(e.target.value)} />

                                    <h3 style={{ marginTop: 20 }}>Avaliação dos Itens</h3>
                                    {selectedOrder.line_items.map((it, id) => {
                                        return (
                                            <div key={id} style={{ border: '1px solid #eee', padding: 10, marginBottom: 10 }}>
                                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                    <img src={it?.image || it.product?.images?.[0]} alt="" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 'bold' }}>{it.name}</div>
                                                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <StarRating value={itemRatings[id] || 0} onChange={(v) => setItemRatings(prev => ({ ...prev, [id]: v }))} />
                                                            <span>{itemRatings[id] || 0} / 5</span>
                                                        </div>
                                                        <textarea rows={2} placeholder="Comentário sobre o item" style={{ width: '100%', marginTop: 8 }} value={itemComments[id] || ''} onChange={e => setItemComments(prev => ({ ...prev, [id]: e.target.value }))} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                        <Button black onClick={submitReview} disabled={isSubmitting}>Enviar Avaliação</Button>
                                        <Button onClick={() => { setSelectedOrderId(''); }}>Cancelar</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Center>
        </>
    );
}
