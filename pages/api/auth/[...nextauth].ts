import { verifiyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        // database connection
        const client = await connectToDatabase();
        const db = client.db();

        // check if user exist
        const existingUser = await db
          .collection("users")
          .findOne({ username: username });
        if (!existingUser) {
          client.close();
          throw new Error("No user found!");
          return null;
        }

        // check if password is match
        const isValid = await verifiyPassword(password, existingUser.password);
        if (!isValid) {
          client.close();
          throw new Error("Invalid password!");
          return null;
        }

        client.close();
        return {
          id: existingUser._id.toString(),
          name: existingUser.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
};

export default NextAuth(authOptions);
