import Link from "next/link";
import { DemandIntakeForm } from "../../components/demand-intake-form";
import { MediaCard } from "../../components/media-card";
import { getAccessRole } from "../../lib/access-role";
import { getAgentCatalog, getDemandBoard } from "../../lib/api";
import { localizeAgent } from "../../lib/catalog-copy";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function DemandPage() {
  const locale = await getLocale();
  const accessRole = await getAccessRole();
  const agents = (await getAgentCatalog()).map((agent) =>
    localizeAgent(agent, locale)
  );
  const board = (await getDemandBoard()).map((item) => ({
    ...item,
    agent: localizeAgent(item.agent, locale)
  }));

  const copy =
    locale === "zh"
      ? accessRole === "customer"
        ? {
            eyebrow: "需求板",
            title: "把客户真实需求暴露给开发者侧，而不是只展示已有 Agent。",
            lede:
              "这是 Agora 从“目录平台”走向“交易与承接平台”的关键一层。客户需求在这里被看见，开发者从这里决定是否响应。",
            primary: "发布新需求",
            back: "返回客户侧",
            backHref: "/customer",
            showPublish: true,
            panelTitle: "需求发布与公开展示"
          }
        : accessRole === "builder"
          ? {
              eyebrow: "机会板",
              title: "这里是供给侧判断是否值得响应的公开需求面。",
              lede:
                "Builder 在这里应该先看到真实需求、行业场景和当前竞争态势，而不是需求发布表单。",
              primary: "查看我的供给侧",
              back: "返回供给侧",
              backHref: "/builders",
              showPublish: false,
              panelTitle: "公开需求机会"
            }
          : {
              eyebrow: "需求监控",
              title: "运营侧在这里看公开需求流，而不是以客户身份发需求。",
              lede:
                "运营者需要追踪需求是否进入市场、是否收到响应，以及是否需要推进决策。",
              primary: "返回运营台",
              back: "查看运营台",
              backHref: "/ops",
              showPublish: false,
              panelTitle: "需求与响应监控"
            }
      : accessRole === "customer"
        ? {
            eyebrow: "Demand Board",
            title: "Expose real customer demand to the builder side, not just the current agent catalog.",
            lede:
              "This is the layer that moves Agora from a directory product toward a hiring and response platform. Customer demand becomes visible, and builders decide whether to engage.",
            primary: "Publish demand",
            back: "Back to customer side",
            backHref: "/customer",
            showPublish: true,
            panelTitle: "Demand publishing and public visibility"
          }
        : accessRole === "builder"
          ? {
              eyebrow: "Opportunity Board",
              title: "This is the public demand surface where builders decide what is worth pursuing.",
              lede:
                "Builders should see real demand, industry context, and response competition here, not a customer publishing workflow.",
              primary: "Back to builder side",
              back: "Back to builder side",
              backHref: "/builders",
              showPublish: false,
              panelTitle: "Open demand opportunities"
            }
          : {
              eyebrow: "Demand Monitoring",
              title: "Ops uses this surface to monitor demand flow, not to act as a customer publisher.",
              lede:
                "Operators need to track whether demand enters the market, whether responses arrive, and whether a decision is needed.",
              primary: "Back to ops",
              back: "Back to ops",
              backHref: "/ops",
              showPublish: false,
              panelTitle: "Demand and response monitoring"
            };
  const sharedCopy =
    locale === "zh"
      ? {
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
            {copy.showPublish ? (
              <a href="#publish-demand" className="actionlink actionlink-primary">
                {copy.primary}
              </a>
            ) : null}
            <Link href={copy.backHref} className={`actionlink ${copy.showPublish ? "" : "actionlink-primary"}`}>
              {copy.back}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.panelTitle}</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{board.length}</strong>
              <span>{sharedCopy.listEyebrow}</span>
            </div>
            <div className="stat">
              <strong>
                {board.reduce((sum, item) => sum + item.responseCount, 0)}
              </strong>
              <span>{sharedCopy.responses}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{sharedCopy.visualEyebrow}</p>
          <h2>{sharedCopy.visualTitle}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/control-theater-loop.svg"
            alt="Animated demand flow and builder response visual."
            kicker={sharedCopy.demandCard.kicker}
            title={sharedCopy.demandCard.title}
            caption={sharedCopy.demandCard.caption}
          />
          <MediaCard
            src="/media/factory-command-loop.svg"
            alt="Animated manufacturing customer scene."
            kicker={sharedCopy.industryCard.kicker}
            title={sharedCopy.industryCard.title}
            caption={sharedCopy.industryCard.caption}
          />
        </div>
      </section>

      {copy.showPublish ? <DemandIntakeForm agents={agents} locale={locale} /> : null}

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{sharedCopy.listEyebrow}</p>
          <h2>{sharedCopy.listTitle}</h2>
        </div>
        <div className="timeline">
          {board.length === 0 ? (
            <p>{sharedCopy.empty}</p>
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
                  {sharedCopy.requester} / {item.requesterOrg || "-"} / {sharedCopy.industry} /{" "}
                  {item.industry || "-"}
                </p>
                <p className="tagline">
                  {sharedCopy.recommended} / {item.agent.name} / {sharedCopy.responses} /{" "}
                  {item.responseCount}
                </p>
                <p className="timestamp">{formatTimestamp(item.createdAt, locale)}</p>
                <Link href={`/requests/${item.id}`} className="cardlink">
                  {sharedCopy.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
