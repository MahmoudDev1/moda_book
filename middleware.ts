import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { user } = await verifyAuth();

  if (pathname == "/login" || pathname == "/register") {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (
    pathname.startsWith("/create-post") ||
    pathname.startsWith("/friends") ||
    pathname.startsWith("/saved-posts") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/user")
  ) {
    if (user == null) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}