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
                    throw new Error("Invalid credentials");
                }

                return nextAuthLogin(credentials);
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.andmin = user.admin;
                token.id = user.id;
                token.employeeId = user.employeeId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.admin = token.andmin as boolean;
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/app/login"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handeler = NextAuth(authOptions);
export { handeler as GET, handeler as POST };