import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connect } from "@/dbConfig/db"; // Ensure you have a DB connection
import User from "@/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Session expires in 24 hours (in seconds)
  },
  jwt: {
    maxAge: 24 * 60 * 60, // JWT expires in 24 hours (same as session)
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connect(); // Ensure DB connection

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user if they don't exist
            const newUser = new User({
              username: user.name,
              email: user.email,
              provider: "google",
              isVerified:true
            });

            await newUser.save();
          }
        } catch (error) {
          console.error("Error saving user:", error);
          return false;
        }
      }
      return true;
    },
     // Ensure this is set
}
}

const handler = NextAuth(authOptions);

// ✅ Export both GET and POST handlers
export { handler as GET, handler as POST };
