import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";


function isPublic(pathname: string) {
  const open = ["/","/login", "/api/auth"];
  if (open.some((p) => pathname.startsWith(p))) return true;
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(png|jpe?g|gif|svg|webp|ico)$/.test(pathname)
  );
}


export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  // Only protect /dashboard route
  if (pathname === "/dashboard") {
    if (!isAuth) {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
  }

  // Prevent access to /login if already authenticated
  if (isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login"],
};
