"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import type { Locale } from "../lib/locale";
import { toneClass } from "../lib/presenters";

type SiteHeaderProps = {
  readOnlyPreview: boolean;
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
};

export function SiteHeader({
  readOnlyPreview,
  locale,
  brandMeta,
  navItems,
  modeReadOnly,
  modeInteractive,
  localeLabel,
  localeOptions
}: SiteHeaderProps) {
  const pathname = usePathname();

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
      </div>
    </header>
  );
}
