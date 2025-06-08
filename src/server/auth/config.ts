import { type DefaultSession, type SessionStrategy } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connect } from "@/dbConfig/db";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          await connect();

          const email = credentials?.email;
          const password = credentials?.password;

          if (!email || !password) return null;

          const user = await User.findOne({ email });
          if (!user) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) return null;

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: any }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }: { session: any; token: JWT }) => {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};