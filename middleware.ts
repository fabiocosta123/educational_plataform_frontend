import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    let decoded: jwt.JwtPayload | string | null = null;
    try {
      decoded = process.env.JWT_SECRET
        ? jwt.verify(token, process.env.JWT_SECRET)
        : jwt.decode(token);
    } catch {
      decoded = jwt.decode(token);
    }

    if (!decoded || typeof decoded === "string") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const pathname = request.nextUrl.pathname;
    const rawProfile =
      decoded.profile ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/profile"];
    const rawRole =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const profile = rawProfile
      ? parseInt(String(rawProfile), 10)
      : String(rawRole).toLowerCase() === "coordinator"
        ? 3
        : String(rawRole).toLowerCase() === "teacher"
          ? 2
          : String(rawRole).toLowerCase() === "student"
            ? 1
            : null;

    if (pathname.startsWith("/dashboard-student") && profile !== 1) {
      if (profile === 2) return NextResponse.redirect(new URL("/dashboard-teacher", request.url));
      if (profile === 3) return NextResponse.redirect(new URL("/dashboard-coordinator", request.url));
    }

    if (pathname.startsWith("/dashboard-teacher") && profile !== 2) {
      if (profile === 1) return NextResponse.redirect(new URL("/dashboard-student", request.url));
      if (profile === 3) return NextResponse.redirect(new URL("/dashboard-coordinator", request.url));
    }

    if (pathname.startsWith("/dashboard-coordinator") && profile !== 3) {
      if (profile === 1) return NextResponse.redirect(new URL("/dashboard-student", request.url));
      if (profile === 2) return NextResponse.redirect(new URL("/dashboard-teacher", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard-student/:path*",
    "/dashboard-teacher/:path*",
    "/dashboard-coordinator/:path*",
    "/profile/:path*",
    "/my-courses/:path*",
  ],
};
