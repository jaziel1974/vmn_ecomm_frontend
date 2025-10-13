import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.email) {
            const email = req.query.email;
            const qLimit = parseInt(req.query.limit || '4');
            const limit = isNaN(qLimit) ? 4 : Math.max(1, Math.min(100, qLimit));
            const data = await Order.find({ email })
                .sort({ createdAt: -1 })
                .limit(limit);
            res.json(data);
        }
        else {
            res.json(false);
        }
    }
}
