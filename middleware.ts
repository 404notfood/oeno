import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes protegees
  const protectedRoutes = ["/dashboard", "/enseignant"];
  const adminRoutes = ["/admin"];
  const authRoutes = ["/login", "/register", "/forgot-password"];

  // Verifier si la route est protegee
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Recuperer le cookie de session
  // En production avec HTTPS, Better Auth utilise le prefix __Secure-
  const sessionCookie =
    request.cookies.get("__Secure-oenoclass.session_token") ||
    request.cookies.get("oenoclass.session_token");

  // Si route protegee et pas de session, rediriger vers login
  if ((isProtectedRoute || isAdminRoute) && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si route auth et session active, rediriger vers dashboard
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/enseignant/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
