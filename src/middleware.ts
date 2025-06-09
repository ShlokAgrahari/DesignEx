import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;

  const protectedPaths = ["/dashboard"];
  const pathname = req.nextUrl.pathname;

  if (protectedPaths.includes(pathname) && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/login" && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login"],
};
