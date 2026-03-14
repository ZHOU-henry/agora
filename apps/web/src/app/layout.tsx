import type { Metadata } from "next";
import { PreviewNotice } from "../components/preview-notice";
import { SiteHeader } from "../components/site-header";
import { isReadOnlyPreviewMode } from "../lib/runtime";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agora",
  description: "AI Agent Platform MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const readOnlyPreview = isReadOnlyPreviewMode();

  return (
    <html lang="en">
      <body>
        <div className="appshell">
          <div className="ambient ambient-orbit ambient-orbit-a" aria-hidden="true" />
          <div className="ambient ambient-orbit ambient-orbit-b" aria-hidden="true" />
          <div className="ambient ambient-orbit ambient-orbit-c" aria-hidden="true" />
          <div className="ambient ambient-grid" aria-hidden="true" />
          <div className="ambient ambient-scan" aria-hidden="true" />
          <div className="appframe">
            <SiteHeader readOnlyPreview={readOnlyPreview} />
            <PreviewNotice readOnlyPreview={readOnlyPreview} />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
