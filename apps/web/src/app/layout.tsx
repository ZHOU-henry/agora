import type { Metadata } from "next";
import { getCopy } from "../lib/copy";
import { getLocale } from "../lib/locale";
import { PreviewNotice } from "../components/preview-notice";
import { SiteHeader } from "../components/site-header";
import { isReadOnlyPreviewMode } from "../lib/runtime";
import { getAccessRole, getAccessRoleNavItems } from "../lib/access-role";
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
  const accessProtected = Boolean(process.env.AGORA_ACCESS_PASSWORD);
  const copy = getCopy(locale);
  const accessRole = accessProtected ? await getAccessRole() : "customer";
  const navItems = accessProtected
    ? getAccessRoleNavItems(accessRole, locale)
    : copy.header.navItems;

  const modeReadOnly =
    accessProtected && locale === "zh"
      ? "公网 / 只读"
      : accessProtected
        ? "public / read-only"
        : copy.header.modeReadOnly;
  const modeInteractive =
    accessProtected && locale === "zh"
      ? "公网 / 可交互"
      : accessProtected
        ? "public / interactive"
        : copy.header.modeInteractive;

  const previewTitle =
    accessProtected && !readOnlyPreview
      ? locale === "zh"
        ? "受保护的交互模式"
        : "Protected interactive mode"
      : copy.previewNotice.title;
  const previewBody =
    accessProtected && !readOnlyPreview
      ? locale === "zh"
        ? "已通过密码门保护。写操作当前生效，会写入正在运行的本地开发数据。"
        : "Protected by the password gate. Write actions are live and will mutate the running local development data."
      : copy.previewNotice.body;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      style={{ backgroundColor: "#040814", color: "#ecf6ff" }}
    >
      <body style={{ backgroundColor: "#040814", color: "#ecf6ff" }}>
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
              navItems={navItems}
              modeReadOnly={modeReadOnly}
              modeInteractive={modeInteractive}
              localeLabel={copy.header.localeLabel}
              localeOptions={copy.header.localeOptions}
              accessProtected={accessProtected}
              currentRole={accessRole}
              roleLabel={copy.accessGate.roleLabel}
              roleOptions={copy.accessGate.roleOptions}
            />
            <PreviewNotice
              readOnlyPreview={readOnlyPreview}
              title={previewTitle}
              body={previewBody}
            />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
