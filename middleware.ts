import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Decoded JWT:", decoded); 
   // const profile = decoded.profile ? parseInt(decoded.profile) : null;
    const pathname = request.nextUrl.pathname;

    const rawProfile = decoded.profile || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/profile"];
   const profile = rawProfile ? parseInt(rawProfile) : null;

    // Aluno
    if (pathname.startsWith("/dashboard") && profile !== 1) {
      if (profile === 2) {
        return NextResponse.redirect(new URL("/dashboard-teacher", request.url));
      }
      if (profile === 3) {
        return NextResponse.redirect(new URL("/dashboard-coordinator", request.url));
      }
    }

    // Professor
    if (pathname.startsWith("/dashboard-teacher") && profile !== 2) {
      if (profile === 1) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (profile === 3) {
        return NextResponse.redirect(new URL("/dashboard-coordinator", request.url));
      }
    }

    // Coordenador
    if (pathname.startsWith("/dashboard-coordinator") && profile !== 3) {
      if (profile === 1) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (profile === 2) {
        return NextResponse.redirect(new URL("/dashboard-teacher", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard-teacher/:path*",
    "/dashboard-coordinator/:path*",
    "/profile/:path*",
    "/my-courses/:path*",
  ],
};
