"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "../lib/locale";

type LocaleSwitcherProps = {
  locale: Locale;
  label: string;
  options: Record<Locale, string>;
};

export function LocaleSwitcher({
  locale,
  label,
  options
}: LocaleSwitcherProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function applyLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }

    setIsPending(true);

    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ locale: nextLocale })
      });

      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="locale-switcher" aria-label={label}>
      <span className="locale-label">{label}</span>
      <div className="locale-options">
        {(["zh", "en"] as Locale[]).map((value) => (
          <button
            key={value}
            type="button"
            className={`locale-chip ${locale === value ? "locale-chip-active" : ""}`}
            onClick={() => applyLocale(value)}
            disabled={isPending}
          >
            {options[value]}
          </button>
        ))}
      </div>
    </div>
  );
}
