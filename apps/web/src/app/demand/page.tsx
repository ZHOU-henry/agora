import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getDemandBoard } from "../../lib/api";
import { localizeAgent } from "../../lib/catalog-copy";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function DemandPage() {
  const locale = await getLocale();
  const board = (await getDemandBoard()).map((item) => ({
    ...item,
    agent: localizeAgent(item.agent, locale)
  }));

  const copy =
    locale === "zh"
      ? {
          eyebrow: "需求板",
          title: "把客户真实需求暴露给开发者侧，而不是只展示已有 Agent。",
          lede:
            "这是 Agora 从“目录平台”走向“交易与承接平台”的关键一层。客户需求在这里被看见，开发者从这里决定是否响应。",
          back: "返回平台",
          visualEyebrow: "需求场景",
          visualTitle: "需求不是静态表单，而是可被承接的机会流",
          demandCard: {
            kicker: "需求流",
            title: "客户需求进入后，开发者应该能看到、理解并响应",
            caption: "如果没有需求板，平台就更像产品展厅；有了需求板，平台才开始像市场。"
          },
          industryCard: {
            kicker: "制造场景",
            title: "传统行业客户要先看到自己的工作场景",
            caption: "制造、仓储、质检、运维这些真实问题，会比抽象 AI 价值更快激发需求。"
          },
          listEyebrow: "当前需求",
          listTitle: "开发者可承接的需求",
          empty: "当前没有公开展示的需求。",
          responses: "响应数",
          requester: "客户",
          industry: "行业",
          recommended: "推荐 Agent",
          action: "查看需求"
        }
      : {
          eyebrow: "Demand Board",
          title: "Expose real customer demand to the builder side, not just the current agent catalog.",
          lede:
            "This is the layer that moves Agora from a directory product toward a hiring and response platform. Customer demand becomes visible, and builders decide whether to engage.",
          back: "Back to platform",
          visualEyebrow: "Demand Visuals",
          visualTitle: "Demand should feel like an opportunity stream, not a static form",
          demandCard: {
            kicker: "Demand flow",
            title: "Builders should see, understand, and respond once demand enters the platform",
            caption: "Without a demand board, the platform behaves like a showroom. With one, it starts behaving like a market."
          },
          industryCard: {
            kicker: "Industrial scene",
            title: "Traditional-industry buyers need to see their world first",
            caption: "Manufacturing, warehousing, inspection, and maintenance realities trigger demand faster than abstract AI language."
          },
          listEyebrow: "Live Demand",
          listTitle: "Opportunities builders can respond to",
          empty: "No public demand items are visible right now.",
          responses: "responses",
          requester: "customer",
          industry: "industry",
          recommended: "recommended agent",
          action: "Inspect demand"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="lede">{copy.lede}</p>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              {copy.back}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.eyebrow}</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{board.length}</strong>
              <span>{copy.listEyebrow}</span>
            </div>
            <div className="stat">
              <strong>
                {board.reduce((sum, item) => sum + item.responseCount, 0)}
              </strong>
              <span>{copy.responses}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.visualEyebrow}</p>
          <h2>{copy.visualTitle}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/control-theater-loop.svg"
            alt="Animated demand flow and builder response visual."
            kicker={copy.demandCard.kicker}
            title={copy.demandCard.title}
            caption={copy.demandCard.caption}
          />
          <MediaCard
            src="/media/factory-command-loop.svg"
            alt="Animated manufacturing customer scene."
            kicker={copy.industryCard.kicker}
            title={copy.industryCard.title}
            caption={copy.industryCard.caption}
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.listEyebrow}</p>
          <h2>{copy.listTitle}</h2>
        </div>
        <div className="timeline">
          {board.length === 0 ? (
            <p>{copy.empty}</p>
          ) : (
            board.map((item) => (
              <article key={item.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{item.title}</p>
                  <span className={`statuspill ${toneClass(item.status)}`}>
                    {humanizeToken(item.status, locale)}
                  </span>
                </div>
                <p>{item.description}</p>
                <p className="tagline">
                  {copy.requester} / {item.requesterOrg || "-"} / {copy.industry} /{" "}
                  {item.industry || "-"}
                </p>
                <p className="tagline">
                  {copy.recommended} / {item.agent.name} / {copy.responses} /{" "}
                  {item.responseCount}
                </p>
                <p className="timestamp">{formatTimestamp(item.createdAt, locale)}</p>
                <Link href={`/requests/${item.id}`} className="cardlink">
                  {copy.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
