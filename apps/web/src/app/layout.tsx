import type { Metadata } from "next";
import { getCopy } from "../lib/copy";
import { getLocale } from "../lib/locale";
import { PreviewNotice } from "../components/preview-notice";
import { SiteHeader } from "../components/site-header";
import { isReadOnlyPreviewMode } from "../lib/runtime";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agora",
  description: "AI Agent Platform MVP"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const readOnlyPreview = isReadOnlyPreviewMode();
  const copy = getCopy(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <div className="appshell">
          <div className="ambient ambient-orbit ambient-orbit-a" aria-hidden="true" />
          <div className="ambient ambient-orbit ambient-orbit-b" aria-hidden="true" />
          <div className="ambient ambient-orbit ambient-orbit-c" aria-hidden="true" />
          <div className="ambient ambient-grid" aria-hidden="true" />
          <div className="ambient ambient-scan" aria-hidden="true" />
          <div className="appframe">
            <SiteHeader
              readOnlyPreview={readOnlyPreview}
              locale={locale}
              brandMeta={copy.header.brandMeta}
              navItems={copy.header.navItems}
              modeReadOnly={copy.header.modeReadOnly}
              modeInteractive={copy.header.modeInteractive}
              localeLabel={copy.header.localeLabel}
              localeOptions={copy.header.localeOptions}
            />
            <PreviewNotice
              readOnlyPreview={readOnlyPreview}
              title={copy.previewNotice.title}
              body={copy.previewNotice.body}
            />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
