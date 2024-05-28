import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.email) {
            User.findOne({ email: req.query.email })
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    res.json(error);
                });
        }
        else {
            res.json(false);
        }
    }
    else if(method === 'PATCH') {
        const {
            email,
            password
        } = req.body;

        if (email) {
            User.updateOne({ email: email }, { password: password })
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    res.json(error);
                });
        }
        else {
            res.json("E-mail não informado");
        }
    }
}
