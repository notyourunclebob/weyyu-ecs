import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { nextAuthLogin } from "@/tools/EmployeeManager";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                try {
                    const result = await nextAuthLogin(credentials);
                    return result;
                } catch (error) {
                    return null;
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.admin = user.admin;
                token.id = user.id;
                token.employeeId = user.employeeId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.admin = token.admin as boolean;
                session.user.id = token.id as string;
                session.user.employeeId = token.employeeId as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};