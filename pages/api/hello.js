import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";
import { User } from "@/models/User";
import { encrypt } from "@/shared/crypto";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET' && req.query?.type === 'migrateEmails') {
    const data = await Customer.find({}, { name: 1, email: 1, _id: 0 });

    data.map((data) => {
      User.create({ email: data.email, name: data.name });
    });
    res.json('done');
  }

  if (method === 'GET' && req.query?.type === 'updatePassword') {
    const data = await Customer.find({}, { name: 1, email: 1, _id: 0 });
    
    data.map((data) => {
      console.log('updatePassword');
      User.updateOne({ email: data.email }, { password: encrypt('1234')})
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    res.json('done');
  }
}