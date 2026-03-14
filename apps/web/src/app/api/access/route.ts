import { NextRequest, NextResponse } from "next/server";
import {
  accessRoleCookieName,
  getAccessRoleRedirectPath,
  normalizeAccessRole
} from "../../../lib/access-role";

const COOKIE_NAME = "agora-preview-access";

export async function POST(request: NextRequest) {
  const password = process.env.AGORA_ACCESS_PASSWORD;

  if (!password) {
    return NextResponse.json(
      { ok: false, error: "Access password is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as { password?: string; role?: string };
  const role = normalizeAccessRole(body.role);

  if (!body.password || body.password !== password) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo: getAccessRoleRedirectPath(role)
  });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.cookies.set(COOKIE_NAME, "granted", {
    httpOnly: true,
    sameSite: "strict",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  response.cookies.set(accessRoleCookieName, role, {
    httpOnly: true,
    sameSite: "strict",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0
  });
  response.cookies.set(accessRoleCookieName, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0
  });
  return response;
}
