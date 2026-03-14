import { NextRequest, NextResponse } from "next/server";
import {
  accessRoleCookieName,
  canAccessRoleVisitPath,
  getAccessRoleRedirectPath,
  normalizeAccessRole
} from "./lib/access-role";

const COOKIE_NAME = "agora-preview-access";

function applyProtectedHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "same-origin");
  return response;
}

export function proxy(request: NextRequest) {
  const password = process.env.AGORA_ACCESS_PASSWORD;

  if (!password) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname === "/access" ||
    pathname.startsWith("/api/access") ||
    pathname.startsWith("/media/") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return applyProtectedHeaders(NextResponse.next());
  }

  const hasAccess = request.cookies.get(COOKIE_NAME)?.value === "granted";
  const role = normalizeAccessRole(request.cookies.get(accessRoleCookieName)?.value);

  if (hasAccess) {
    if (pathname.startsWith("/api/")) {
      return applyProtectedHeaders(NextResponse.next());
    }

    if (pathname === "/") {
      const dashboardUrl = new URL(getAccessRoleRedirectPath(role), request.url);
      return applyProtectedHeaders(NextResponse.redirect(dashboardUrl));
    }

    if (!canAccessRoleVisitPath(role, pathname)) {
      const dashboardUrl = new URL(getAccessRoleRedirectPath(role), request.url);
      return applyProtectedHeaders(NextResponse.redirect(dashboardUrl));
    }

    return applyProtectedHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/api/")) {
    return applyProtectedHeaders(
      NextResponse.json({ error: "Authentication required." }, { status: 401 })
    );
  }

  const loginUrl = new URL("/access", request.url);
  return applyProtectedHeaders(NextResponse.redirect(loginUrl));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
