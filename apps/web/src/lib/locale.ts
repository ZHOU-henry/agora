import { cookies } from "next/headers";

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";
export const localeCookieName = "agora-locale";

export function normalizeLocale(value: string | null | undefined): Locale {
  return value === "en" ? "en" : "zh";
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(localeCookieName)?.value);
}
