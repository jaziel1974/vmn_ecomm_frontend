import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { buffer } from 'micro';
const stripe = require('stripe')(process.env.STRIPE_SK);
const endpointSecret = 'whsec_19c7a914fbbf51a240dc25e586136c36fb8adcc939f6f633ff954a1cb1681700';

export default async function handler(req, res) {
    await mongooseConnect();
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook error: ${err.message}`);
        return;
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;
            const orderId = data.metadata.orderId;
            const paid = data.payment_status === 'paid';
            if (paid) {
                await Order.findByIdAndUpdate(orderId,{
                    paid: true,
                })
            }
            break;
        default:
           res.status(200).send('ok');
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}

//whoa-mighty-polite-nicer
//acct_1NfUWkKKCsRQphcR