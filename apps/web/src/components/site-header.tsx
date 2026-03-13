import Link from "next/link";

type SiteHeaderProps = {
  readOnlyPreview: boolean;
};

export function SiteHeader({ readOnlyPreview }: SiteHeaderProps) {
  return (
    <header className="siteheader">
      <div className="sitebrand">
        <Link href="/" className="brandlink">
          Agora
        </Link>
        <span className="modechip">
          {readOnlyPreview ? "preview · read-only" : "local · interactive"}
        </span>
      </div>
      <nav className="sitenav">
        <Link href="/" className="navlink">
          Catalog
        </Link>
        <Link href="/queue" className="navlink">
          Queue
        </Link>
      </nav>
    </header>
  );
}
