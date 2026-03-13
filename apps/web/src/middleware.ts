import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "agora-preview-access";

export function middleware(request: NextRequest) {
  const password = process.env.AGORA_ACCESS_PASSWORD;

  if (!password) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname === "/access" ||
    pathname.startsWith("/api/access") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get(COOKIE_NAME)?.value === "granted";

  if (hasAccess) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const loginUrl = new URL("/access", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
