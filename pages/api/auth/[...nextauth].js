import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import credentials from "next-auth/providers/credentials";
import { decrypt, encrypt } from "../../../shared/crypto";

export const authOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!user) throw new Error("Wrong Email");

        const encrPass = encrypt(password);
        const passwordMatch = user.data?.password === encrPass;

        if (!passwordMatch) throw new Error("Wrong Password");
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  }
};