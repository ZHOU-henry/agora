import Link from "next/link";
import { getEngagements } from "../../lib/api";
import { localizeProvider } from "../../lib/catalog-copy";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function EngagementsPage() {
  const locale = await getLocale();
  const engagements = (await getEngagements()).map((engagement) => ({
    ...engagement,
    provider: localizeProvider(engagement.provider, locale)
  }));

  const t =
    locale === "zh"
      ? {
          eyebrow: "承接项目",
          title: "从被接受响应开始，平台进入正式交付阶段。",
          lede: "这里不是浏览层，而是已经进入正式承接的工作对象列表。",
          back: "返回平台",
          empty: "当前还没有正式承接项目。",
          action: "查看承接详情"
        }
      : {
          eyebrow: "Engagements",
          title: "Once a response is accepted, the platform enters formal delivery.",
          lede: "This is not a browsing surface. It is the list of work objects that have already entered engagement.",
          back: "Back to platform",
          empty: "No formal engagements exist yet.",
          action: "Open engagement"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lede">{t.lede}</p>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              {t.back}
            </Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="timeline">
          {engagements.length === 0 ? (
            <p>{t.empty}</p>
          ) : (
            engagements.map((engagement) => (
              <article key={engagement.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{engagement.provider.name}</p>
                  <span className={`statuspill ${toneClass(engagement.status)}`}>
                    {humanizeToken(engagement.status, locale)}
                  </span>
                </div>
                <p>{engagement.title}</p>
                <p>{engagement.summary}</p>
                <p className="timestamp">{formatTimestamp(engagement.createdAt, locale)}</p>
                <Link href={`/engagements/${engagement.id}`} className="cardlink">
                  {t.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
