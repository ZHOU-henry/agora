"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "../lib/locale";

type AccessGateProps = {
  locale: Locale;
  copy: {
    eyebrow: string;
    title: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    unlockIdle: string;
    unlockBusy: string;
    accessDenied: string;
  };
};

export function AccessGate({ locale, copy }: AccessGateProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? copy.accessDenied);
      }

      router.push("/");
      router.refresh();
    } catch (accessError) {
      setError(
        accessError instanceof Error ? accessError.message : copy.accessDenied
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>{copy.passwordLabel}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.passwordPlaceholder}
            autoFocus
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? copy.unlockBusy : copy.unlockIdle}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
