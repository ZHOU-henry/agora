"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toneClass } from "../lib/presenters";

type SiteHeaderProps = {
  readOnlyPreview: boolean;
};

export function SiteHeader({ readOnlyPreview }: SiteHeaderProps) {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Catalog" },
    { href: "/queue", label: "Queue" }
  ];

  return (
    <header className="siteheader">
      <div className="sitebrand">
        <span className="brandmark">A</span>
        <div className="brandcopy">
          <Link href="/" className="brandlink">
            Agora
          </Link>
          <span className="brandmeta">Operator control surface</span>
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
      <span
        className={`modechip ${toneClass(
          readOnlyPreview ? "readonly" : "interactive"
        )}`}
      >
        {readOnlyPreview ? "preview / read-only" : "local / interactive"}
      </span>
    </header>
  );
}
