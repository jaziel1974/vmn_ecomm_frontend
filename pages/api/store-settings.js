import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { StoreSetting } from "@/models/StoreSetting";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        var data = await StoreSetting.find({ id: req.query.id });
        res.json(data);
    }
}
