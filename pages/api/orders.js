import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.email) {
            var data = await Order.find({ email: req.query.email })
                .sort({ createdAt: -1 })
                .limit(4);
            res.json(data);
        }
        else {
            res.json(false);
        }
    }
}
