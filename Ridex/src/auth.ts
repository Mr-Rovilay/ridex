import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "./lib/db";
import User from "./models/userModel";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    // ✅ runs on login
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        const dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            role: "user",
          });

          user.id = newUser._id.toString();
          user.role = newUser.role;
        } else {
          user.id = dbUser._id.toString();
          user.role = dbUser.role;
        }
      }

      return true;
    },

    // ✅ FIXED: always sync role from DB
    async jwt({ token, user }) {
      // First login
      if (user) {
        token.id = user.id;
      }

      // 🔥 ALWAYS refresh from DB (fixes your bug)
      if (token.id) {
        await connectDB();

        const dbUser = await User.findById(token.id).lean();

        if (dbUser) {
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.email = dbUser.email;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  secret: process.env.AUTH_SECRET,
});