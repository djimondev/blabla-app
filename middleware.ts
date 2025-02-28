import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes accessibles sans authentification
const publicRoutes = ["/login", "/register"];
// Routes spécifiques à l'authentification (inclut publicRoutes)
const authRoutes = [...publicRoutes, "/verify-email"];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("__session")?.value;
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Si pas de session et route protégée, rediriger vers login
  if (!sessionCookie && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si session et route publique (login/register), rediriger vers accueil
  // Mais pas /verify-email qui est pour les utilisateurs authentifiés avec email non vérifié
  if (sessionCookie && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
