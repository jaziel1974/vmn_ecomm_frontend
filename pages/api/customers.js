import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.email) {
            var data = await Customer.findOne({ email: req.query.email });
            res.json(data);
        }
        else{
            res.json(false);
        }
    }
}
