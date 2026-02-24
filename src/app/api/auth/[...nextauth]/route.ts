// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";

// console.log("route.ts loaded");
// console.log("authOptions:", authOptions);

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

console.log("route.ts loaded");

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("authorize called");
                return null;
            }
        })
    ],
    secret: "test-secret"
});

export { handler as GET, handler as POST };