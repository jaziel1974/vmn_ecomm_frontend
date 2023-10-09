import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const { email, password } = req.body;

  if (!password){
    return null;
  }

  const customer = await Customer.findOne({ email: email })
  if(!customer){
    return null;
  }
    
  const user = {name: customer.name, email: customer.email};

  res.status(200).json(user);
}