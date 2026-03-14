import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaCard } from "../../../components/media-card";
import { getProviderDetail } from "../../../lib/api";
import { localizeProvider } from "../../../lib/catalog-copy";
import { getCopy } from "../../../lib/copy";
import { summarizeProviderOperatingMetrics } from "../../../lib/engagement-intelligence";
import { getProviderVisuals } from "../../../lib/industry-visuals";
import { getLocale } from "../../../lib/locale";
import { humanizeToken, toneClass } from "../../../lib/presenters";

type ProviderDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProviderDetailPage({
  params
}: ProviderDetailPageProps) {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const { slug } = await params;
  const provider = await getProviderDetail(slug);

  if (!provider) {
    notFound();
  }

  const providerVisuals = getProviderVisuals(provider, locale);
  const localizedProvider = localizeProvider(provider, locale);
  const providerMetrics = summarizeProviderOperatingMetrics(provider);
  const responseCopy =
    locale === "zh"
      ? {
          engagementEyebrow: "已承接项目",
          engagementTitle: "这个开发者当前正在推进的正式承接项目",
          engagementEmpty: "这个开发者当前还没有正式承接项目。",
          engagementAction: "查看承接",
          eyebrow: "已响应需求",
          title: "这个开发者当前承接的需求机会",
          empty: "这个开发者当前还没有展示中的需求响应。",
          action: "查看需求",
          industry: "行业",
          requester: "客户"
        }
      : {
          engagementEyebrow: "Active Engagements",
          engagementTitle: "Formal engagements this builder is currently advancing",
          engagementEmpty: "No formal engagements are visible for this builder yet.",
          engagementAction: "Open engagement",
          eyebrow: "Demand Responses",
          title: "Current demand opportunities this builder is pursuing",
          empty: "No visible demand responses for this builder yet.",
          action: "Inspect demand",
          industry: "Industry",
          requester: "Customer"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.providerPage.eyebrow}</p>
          <h1>{localizedProvider.name}</h1>
          <p className="lede">{localizedProvider.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(localizedProvider.status)}`}>
              {humanizeToken(localizedProvider.status, locale)}
            </span>
            <span className="statuspill tone-neutral">
              {copy.providerPage.builderType} /{" "}
              {humanizeToken(localizedProvider.type, locale)}
            </span>
            {localizedProvider.tags.map((tag) => (
              <span key={tag} className="datachip">
                {tag}
              </span>
            ))}
          </div>
          <div className="buttonrow">
            <Link href="/providers" className="actionlink">
              {copy.providerPage.back}
            </Link>
            {localizedProvider.website ? (
              <a href={localizedProvider.website} className="actionlink">
                {copy.providerPage.visit}
              </a>
            ) : null}
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.providerPage.supplyPosture}</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>{copy.providerPage.publishedAgents}</span>
              <strong>{localizedProvider.agents.length}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.providerPage.builderType}</span>
              <strong>{humanizeToken(localizedProvider.type, locale)}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.providerPage.platformRole}</span>
              <strong>{copy.providerPage.platformRoleValue}</strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "开放 incident" : "Open incidents"}</span>
              <strong>{providerMetrics.openIncidents}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "Builder Operating Posture" : "Builder Operating Posture"}
          </p>
          <h2>
            {locale === "zh"
              ? "2.0 版本不只展示供给，还展示这个 Builder 是否能持续推进交付"
              : "2.0 shows not just supply, but whether this builder can sustain delivery operations"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "活跃承接" : "Active engagements"}</h3>
            <p>
              {locale === "zh"
                ? `${providerMetrics.activeEngagements} 个项目仍在推进中。`
                : `${providerMetrics.activeEngagements} engagements are still actively moving.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "已交付" : "Delivered"}</h3>
            <p>
              {locale === "zh"
                ? `${providerMetrics.deliveredEngagements} 个项目已经进入已交付状态。`
                : `${providerMetrics.deliveredEngagements} projects have already reached delivered state.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "阻塞项目" : "Blocked engagements"}</h3>
            <p>
              {locale === "zh"
                ? `${providerMetrics.blockedEngagements} 个 engagement 当前被问题或现场反馈压住。`
                : `${providerMetrics.blockedEngagements} engagements are currently blocked by incidents or unresolved field feedback.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "扩展信号" : "Expansion signals"}</h3>
            <p>
              {locale === "zh"
                ? `${providerMetrics.expansionSignals} 个 engagement 已经显示出扩大部署机会。`
                : `${providerMetrics.expansionSignals} engagements already show credible scale-out potential.`}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.providerPage.visual.eyebrow}</p>
          <h2>{copy.providerPage.visual.title}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src={providerVisuals.primary.src}
            alt={providerVisuals.primary.alt}
            kicker={providerVisuals.primary.kicker}
            title={providerVisuals.primary.title}
            caption={providerVisuals.primary.caption}
            mode={providerVisuals.primary.mode}
          />
          <MediaCard
            src={providerVisuals.secondary.src}
            alt={providerVisuals.secondary.alt}
            kicker={providerVisuals.secondary.kicker}
            title={providerVisuals.secondary.title}
            caption={providerVisuals.secondary.caption}
            mode={providerVisuals.secondary.mode}
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.providerPage.agents.eyebrow}</p>
          <h2>{copy.providerPage.agents.title}</h2>
          <p className="lede small">{copy.providerPage.agents.lede}</p>
        </div>
        <div className="grid">
          {localizedProvider.agents.map((agent) => (
            <article key={agent.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">agent</span>
                <span className={`statuspill ${toneClass(agent.status)}`}>
                  {humanizeToken(agent.status, locale)}
                </span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <img
                className="card-inline-media"
                src="/media/agent-constellation-loop.svg"
                alt=""
                aria-hidden="true"
              />
              <Link href={`/agents/${agent.slug}`} className="cardlink">
                {copy.providerPage.agents.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{responseCopy.engagementEyebrow}</p>
          <h2>{responseCopy.engagementTitle}</h2>
        </div>
        <div className="timeline">
          {localizedProvider.engagements.length === 0 ? (
            <p>{responseCopy.engagementEmpty}</p>
          ) : (
            localizedProvider.engagements.map((engagement) => (
              <article key={engagement.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{engagement.agent.name}</p>
                  <span className={`statuspill ${toneClass(engagement.status)}`}>
                    {humanizeToken(engagement.status, locale)}
                  </span>
                </div>
                <p>{engagement.title}</p>
                <p>{engagement.summary}</p>
                <p className="tagline">
                  {responseCopy.industry} / {engagement.industry || "-"} / {responseCopy.requester} /{" "}
                  {engagement.requesterOrg || "-"}
                </p>
                <p className="tagline">
                  {locale === "zh" ? "客户确认" : "Customer confirmation"} /{" "}
                  {engagement.customerConfirmationStatus
                    ? humanizeToken(engagement.customerConfirmationStatus, locale)
                    : locale === "zh"
                      ? "未开始"
                      : "Not started"}
                  {" / "}
                  {locale === "zh" ? "开放 incident" : "Open incidents"} /{" "}
                  {engagement.openIncidentCount}
                </p>
                <Link
                  href={`/engagements/${engagement.id}`}
                  className="cardlink"
                >
                  {responseCopy.engagementAction}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{responseCopy.eyebrow}</p>
          <h2>{responseCopy.title}</h2>
        </div>
        <div className="timeline">
          {localizedProvider.responses.length === 0 ? (
            <p>{responseCopy.empty}</p>
          ) : (
            localizedProvider.responses.map((response) => (
              <article key={response.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{response.headline}</p>
                  <span className={`statuspill ${toneClass(response.status)}`}>
                    {humanizeToken(response.status, locale)}
                  </span>
                </div>
                <p>{response.proposalSummary}</p>
                <p className="tagline">
                  {responseCopy.industry} / {response.industry || "-"} / {responseCopy.requester} /{" "}
                  {response.requesterOrg || "-"}
                </p>
                <Link
                  href={`/requests/${response.taskRequestId}`}
                  className="cardlink"
                >
                  {responseCopy.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
