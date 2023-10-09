import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.email) {
            res.json(await Customer.findOne({ email: req.query.email }));
        }
        else{
            res.json(false);
        }
    }
}
