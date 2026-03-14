"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LocaleSwitcher } from "./locale-switcher";
import type { AccessRole } from "../lib/access-role";
import type { Locale } from "../lib/locale";
import { toneClass } from "../lib/presenters";

type SiteHeaderProps = {
  readOnlyPreview: boolean;
  accessProtected: boolean;
  locale: Locale;
  brandMeta: string;
  navItems: Array<{
    href: string;
    label: string;
  }>;
  modeReadOnly: string;
  modeInteractive: string;
  localeLabel: string;
  localeOptions: Record<Locale, string>;
  currentRole: AccessRole;
  roleLabel: string;
  roleOptions: Record<AccessRole, string>;
};

export function SiteHeader({
  readOnlyPreview,
  accessProtected,
  locale,
  brandMeta,
  navItems,
  modeReadOnly,
  modeInteractive,
  localeLabel,
  localeOptions,
  currentRole,
  roleLabel,
  roleOptions
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logoutLabel = locale === "zh" ? "退出" : "Logout";
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  async function logout() {
    await fetch("/api/access", {
      method: "DELETE"
    });
    window.location.href = "/access";
  }

  async function switchRole(role: AccessRole) {
    if (role === currentRole) {
      return;
    }

    setIsSwitchingRole(true);

    try {
      const response = await fetch("/api/access", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Role switch failed");
      }

      router.push(payload.redirectTo ?? "/");
      router.refresh();
    } finally {
      setIsSwitchingRole(false);
    }
  }

  return (
    <header className="siteheader">
      <div className="sitebrand">
        <span className="brandmark">A</span>
        <div className="brandcopy">
          <Link href="/" className="brandlink">
            Agora
          </Link>
          <span className="brandmeta">{brandMeta}</span>
        </div>
      </div>
      <nav className="sitenav">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`navlink ${isActive ? "navlink-active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="header-controls">
        {accessProtected ? (
          <label className="stack">
            <span className="sr-only">{roleLabel}</span>
            <select
              aria-label={roleLabel}
              value={currentRole}
              onChange={(event) => switchRole(event.target.value as AccessRole)}
              disabled={isSwitchingRole}
            >
              <option value="customer">{roleOptions.customer}</option>
              <option value="builder">{roleOptions.builder}</option>
              <option value="ops">{roleOptions.ops}</option>
            </select>
          </label>
        ) : null}
        <LocaleSwitcher
          locale={locale}
          label={localeLabel}
          options={localeOptions}
        />
        <span
          className={`modechip ${toneClass(
            readOnlyPreview ? "readonly" : "interactive"
          )}`}
        >
          {readOnlyPreview ? modeReadOnly : modeInteractive}
        </span>
        {accessProtected ? (
          <button type="button" className="navlink" onClick={logout}>
            {logoutLabel}
          </button>
        ) : null}
      </div>
    </header>
  );
}
