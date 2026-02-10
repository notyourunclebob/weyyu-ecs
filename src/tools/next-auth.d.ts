import NextAuth from "next-auth";

// this extends nextauth's types to include the ecs user data
declare module "next-auth" {
    interface User {
        admin?: boolean;
        employeeId?: string;
    }
    interface Session {
        user: {
            id: string;
            employeeId: string;
            firstName: string;
            lastName: string;
            admin: boolean;
        }
    }
}

// this is the authentication token data
declare module "next-auth/jwt" {
    interface JWT {
        andmin?: boolean;
        id?: string;
        employeeId?: string;
    }
}