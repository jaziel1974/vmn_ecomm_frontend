import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const adminEmails = ['jaziel1974@gmail.com'];

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "E-mail" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials, req) {
        const { email, password } = credentials

        const res = await fetch("http://localhost:3001/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        
        const user = res.json();

        if (user && res.ok) {
          return user;
        }
        return null;
      }
    })
  ]
}

export default NextAuth(authOptions)