import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connect } from "@/dbConfig/db";
import User from "@/models/user";
import { useAuthStore } from "@/store/useAuthStore";
const authHandler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Session expires in 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // JWT expires in 24 hours
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await connect(); // Ensure DB connection

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user if they don't exist
            const newUser = new User({
              username: user.name,
              email: user.email,
              provider: account.provider,
              isVerified: true,
            });
            await newUser.save();
            user.id =newUser._id; 
          }
        } catch (error) {
          console.error("Error saving user:", error);
          return false;
        }
      }
      return true;
    },
    

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store MongoDB _id in JWT token
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return "/dashboard"; // Redirects user to dashboard after sign-in
    },
  },
});

export { authHandler as GET, authHandler as POST };
