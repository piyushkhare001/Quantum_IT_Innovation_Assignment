import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@/app/model/User";  
import dbConnect from "@/app/lib/dbConnect";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      email: string;
      name?: string;
      status?: string;
    };
  }

  interface JWT {
    id: string;
    type: string;
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "sign-in",
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("User password is not set");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password !!");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role, // Include the role property
          type: user.role, 
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
        token.type = user.role; 
      }
      return token; // Ensure token is always returned
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; 
        session.user.role = token.type as string; 
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 1
  },
  secret: process.env.NEXTAUTH_SECRET,
};
