import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { connect } from "@/dbConfig/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

import type { User as NextAuthUser } from "next-auth";
import type { Account, Profile } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found with this email");

        const isPasswordValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isPasswordValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: NextAuthUser;
      account: Account | null;
    }) {
      if (account?.provider === "google" || account?.provider === "github") {
        await connect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            username: user.name,
            email: user.email,
            provider: account.provider,
            isVerified: true,
          });
          await newUser.save();
          user.id = newUser._id.toString();
        } else {
          user.id = existingUser._id.toString();
        }
      }
      return true;
    },

    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: NextAuthUser;
    }): Promise<JWT> {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (token?.id && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },

    async redirect() {
      return "/dashboard";
    },
  },

  pages: {
    signIn: "/login", // Optional: custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
