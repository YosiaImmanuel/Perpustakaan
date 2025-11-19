import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 1. Allow Next.js internal files (_next/*) and public assets
  if (
    pathname.startsWith('/_next') || // Next.js build files
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') || // Public images folder
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i) // Any image extension
  ) {
    return NextResponse.next();
  }

  // 1️⃣ Jika sudah login, larang buka login/register/landing
  if (
    token &&
    (pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register"))
  ) {
    // arahkan ke halaman utama
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 2️⃣ Jika belum login, larang akses halaman selain login/register/landing
  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register") &&
    pathname !== "/" &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/static") &&
    pathname !== "/favicon.ico"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3️⃣ Selain kondisi di atas → izinkan
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|_next/static|_next/image|static|favicon.ico|api).*)"],
};
