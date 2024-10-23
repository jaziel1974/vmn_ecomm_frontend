import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.json('should be a POST request');
        return;
    }
    const {
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        cartProducts,
        customerNotes,
        adminNotes,
    } = req.body;

    await mongooseConnect();

    let line_items = [];
    for (const cartItem of cartProducts) {
        line_items.push({
            quantity: cartItem.quantity,
            currency: 'USD',
            name: cartItem.product.title,
            unit_amount: parseFloat(cartItem.unitPrice * cartItem.quantity),
        });
    }

    const orderDoc = await Order.create({
        line_items,
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        paid: false,
        adminNotes,
        customerNotes
    });


    /*
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.PUBLIC_URL + '/cart?success=1',
        cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
        metadata: {
            orderId: orderDoc._id.toString(),
        },
    });
    */

    res.json({
        //url: session.url,
    });
}