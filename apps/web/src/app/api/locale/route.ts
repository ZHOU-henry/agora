import { NextRequest, NextResponse } from "next/server";
import { localeCookieName, normalizeLocale } from "../../../lib/locale";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { locale?: string };
  const locale = normalizeLocale(body.locale);

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(localeCookieName, locale, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180
  });

  return response;
}
