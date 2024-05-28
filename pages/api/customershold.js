import { mongooseConnect } from "@/lib/mongoose";
import { CustomerHold } from "@/models/CustomerHold";
import { encrypt } from "../../shared/crypto";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'POST') {
        const {
            name,
            email,
            phoneNumber,
            password,
        } = req.body;

        if (email) {
            res.json(await CustomerHold.create({
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                password: encrypt(password)
            }
            ));
        }
        else {
            res.json(false);
        }
    }
    else if (method === 'GET') {
        if (req.query?.email) {
            res.json(await CustomerHold.findOne({ email: req.query.email }));
        }
        else{
            res.json(false);
        }
    }
}