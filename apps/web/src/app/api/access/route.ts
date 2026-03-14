import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "agora-preview-access";

export async function POST(request: NextRequest) {
  const password = process.env.AGORA_ACCESS_PASSWORD;

  if (!password) {
    return NextResponse.json(
      { ok: false, error: "Access password is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as { password?: string };

  if (!body.password || body.password !== password) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "granted", {
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
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0
  });
  return response;
}
