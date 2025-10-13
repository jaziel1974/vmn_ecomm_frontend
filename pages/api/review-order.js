import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';
import { Review } from '@/models/Review';

export default async function handler(req, res) {
    const { method } = req;
    if (method === 'GET') {
        const { orderId } = req.query;
        if (!orderId) {
            res.status(400).json({ message: 'orderId is required' });
            return;
        }
        await mongooseConnect();
        const review = await Review.findOne({ orderId }).lean();
        res.status(200).json({ ok: !!review, review });
        return;
    }

    if (method === 'POST') {
        const body = req.body;
        if (!body || !body.orderId) {
            res.status(400).json({ message: 'orderId is required' });
            return;
        }

        await mongooseConnect();

        // verify order exists and belongs to the provided userEmail
        const order = await Order.findById(body.orderId);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (!body.userEmail || body.userEmail !== order.email) {
            res.status(403).json({ message: 'You are not allowed to review this order' });
            return;
        }

        // create or update review (allow resubmission)
        const values = {
            orderId: order._id,
            userEmail: body.userEmail,
            orderRating: body.orderRating,
            orderComment: body.orderComment,
            itemRatings: body.itemRatings,
            itemComments: body.itemComments
        };
        const existing = await Review.findOne({ orderId: order._id, userEmail: body.userEmail });
        let review;
        if (existing) {
            Object.assign(existing, values);
            review = await existing.save();
        } else {
            review = await Review.create(values);
        }

        res.status(200).json({ ok: true, reviewId: review._id });
        return;
    }

    res.status(405).json({ message: 'Method not allowed' });
}
