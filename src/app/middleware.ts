import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // this prevents users from visiting restricted pages
    function middleware(request) {
        const token = request.nextauth.token;
        const isAdmin = token?.andmin === true;
        const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

        if(isAdminRoute && !isAdmin) {
            // sends unauthorized users to a warning page
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // requires user to be loged in
            authorized: ({ token }) => !!token 
        }
    }
);

export const config = {
    matcher: ["/admin/:path*", "/dashboard/path*"]
};