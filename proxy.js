import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow built-in assets
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
  ) {
    return NextResponse.next();
  }

  // Redirect users who are already logged in
  if (
    token &&
    (pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register"))
  ) {
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Block unauthenticated access to protected routes
  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register") &&
    pathname !== "/" &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply proxy to these routes
export const config = {
  matcher: ["/((?!_next|_next/static|_next/image|static|favicon.ico|api).*)"],
};
