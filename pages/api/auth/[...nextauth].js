// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const allowedIPs = ["176.150.41.253", "82.66.241.186"];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials, req) => {
        const userIP =
          req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        if (allowedIPs.includes(userIP)) {
          return {
            id: "1",
            name: "Jocelyn",
            email: "jocelyn.marcilloux@gmail.com",
          };
        }

        if (
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "2", name: "Admin", email: "admin@gmail.com" };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || null;
        token.email = user.email || null;
        token.name = user.name || null;
      }
      return token;
    },
    async session({ session, token }) {
      // Fix: Toujours retourner null au lieu de undefined pour éviter serialization error
      session.user = {
        id: token.id || null,
        email: token.email || null,
        name: token.name || null,
        image: null,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
