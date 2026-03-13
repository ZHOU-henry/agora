"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccessGate() {
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
        throw new Error(payload.error ?? "Access denied");
      }

      router.push("/");
      router.refresh();
    } catch (accessError) {
      setError(accessError instanceof Error ? accessError.message : "Access denied");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Preview Access</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter preview password"
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Unlocking..." : "Unlock preview"}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
