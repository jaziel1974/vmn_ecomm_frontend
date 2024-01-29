import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET' && req.query?.email && req.query?.hash) {
        //mongoose find customer and get the hash for link validation
        var customer = await Customer.findOne({ email: req.query.email });
        if (customer.emailValidationHash === req.query.hash){
            res.json(true)
        }
        else{
            res.json(false)
        }
    }
    else {
        res.json(false);
    }
}