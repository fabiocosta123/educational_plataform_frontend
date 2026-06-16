import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest){
    const token = request.cookies.get("token")?.value;

    const protectedRoutes = ["/dashboard", "/profile", "/my-courses"]

    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))){
        if (!token){
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET!);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/my-courses/:path*"]
}