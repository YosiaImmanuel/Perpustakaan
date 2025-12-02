import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = req.nextUrl.pathname;

  const isAuthPage =
    path.startsWith("/login") ||
    path.startsWith("/register");

  // USER Protected pages
  const userProtected =
    path.startsWith("/home") ||
    path.startsWith("/books") ||
    path.startsWith("/borrow") ||
    path.startsWith("/notifications") ||
    path.startsWith("/profile") ||
    path.startsWith("/wishlist") ||
    path.startsWith("/peminjaman");

  // ADMIN Protected pages
  const adminProtected = path.startsWith("/admin");

  // ⭐ NEW RULE: Jika buka root "/" dan sudah login → auto redirect
  if (path === "/" && token) {
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  // ⛔ Not logged in → redirect login
  if ((userProtected || adminProtected) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔥 ADMIN tries to access USER pages → redirect
  if (userProtected && token?.role === "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔥 USER tries to access ADMIN pages → redirect
  if (adminProtected && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ⛔ Already logged in → block login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/books/:path*",
    "/borrow/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/wishlist/:path*",
    "/peminjaman/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};