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
        <SiteHeader readOnlyPreview={readOnlyPreview} />
        <PreviewNotice readOnlyPreview={readOnlyPreview} />
        {children}
      </body>
    </html>
  );
}
