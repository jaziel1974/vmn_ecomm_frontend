import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        var data = await Product.find({}, null, { sort: { '_id': -1 }, limit: 10 })
        res.json(data);
    }
}
