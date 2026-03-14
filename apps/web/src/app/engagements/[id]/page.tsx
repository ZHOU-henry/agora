import Link from "next/link";
import { notFound } from "next/navigation";
import { EngagementOpsControls } from "../../../components/engagement-ops-controls";
import { MediaCard } from "../../../components/media-card";
import { getEngagement } from "../../../lib/api";
import { localizeAgent, localizeProvider } from "../../../lib/catalog-copy";
import { getLocale } from "../../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../../lib/presenters";

type EngagementDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EngagementDetailPage({
  params
}: EngagementDetailPageProps) {
  const locale = await getLocale();
  const { id } = await params;
  const engagement = await getEngagement(id);

  if (!engagement) {
    notFound();
  }

  const provider = localizeProvider(engagement.provider, locale);
  const agent = localizeAgent(engagement.agent, locale);
  const t =
    locale === "zh"
      ? {
          eyebrow: "正式承接",
          backDemand: "返回需求",
          backBuilder: "返回开发者",
          state: "承接状态",
          created: "创建时间",
          provider: "开发者",
          recommended: "推荐 Agent",
          proposal: "承接方案",
          proposalTitle: "被接受的开发者响应",
          proposalText: "这条响应已经从公开响应区进入正式承接阶段，后续可以继续扩展为交付状态、工单与项目空间。",
          workTitle: "交付工作面雏形",
          workText: "这一步让平台第一次拥有了从“需求 → 响应 → 正式承接”的真实闭环。"
        }
      : {
          eyebrow: "Engagement",
          backDemand: "Back to demand",
          backBuilder: "Back to builder",
          state: "engagement status",
          created: "created",
          provider: "builder",
          recommended: "recommended agent",
          proposal: "accepted response",
          proposalTitle: "The accepted builder response",
          proposalText: "This response has moved out of the public response board and into a formal engagement stage. It can later grow into work orders, delivery states, and project-space structure.",
          workTitle: "The first work object beyond demand",
          workText: "This is the first real bridge from demand and response into a formal delivery object."
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{engagement.title}</h1>
          <p className="lede">{engagement.summary}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(engagement.status)}`}>
              {humanizeToken(engagement.status, locale)}
            </span>
            <span className="statuspill tone-neutral">
              {t.provider} / {provider.name}
            </span>
            <span className="statuspill tone-neutral">
              {t.recommended} / {agent.name}
            </span>
          </div>
          <div className="buttonrow">
            <Link href={`/requests/${engagement.taskRequestId}`} className="actionlink">
              {t.backDemand}
            </Link>
            <Link href={`/providers/${provider.slug}`} className="actionlink">
              {t.backBuilder}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{t.state}</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>{t.state}</span>
              <strong>{humanizeToken(engagement.status, locale)}</strong>
            </article>
            <article className="signalitem">
              <span>{t.created}</span>
              <strong>{formatTimestamp(engagement.createdAt, locale)}</strong>
            </article>
            <article className="signalitem">
              <span>{t.provider}</span>
              <strong>{provider.name}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.proposal}</p>
          <h2>{t.proposalTitle}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/control-theater-loop.svg"
            alt="Accepted response control theater."
            kicker={t.proposal}
            title={engagement.demandResponse.headline}
            caption={engagement.demandResponse.proposalSummary}
          />
          <MediaCard
            src="/media/factory-command-loop.svg"
            alt="Industry execution scene."
            kicker={t.eyebrow}
            title={t.workTitle}
            caption={t.workText}
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "交付里程碑" : "Delivery milestones"}</p>
          <h2>
            {locale === "zh"
              ? "把承接对象推进成真实交付空间"
              : "Move the engagement into a real delivery workspace"}
          </h2>
        </div>
        <div className="timeline">
          {engagement.milestones.map((milestone) => (
            <article key={milestone.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{milestone.title}</p>
                <span className={`statuspill ${toneClass(milestone.status)}`}>
                  {humanizeToken(milestone.status, locale)}
                </span>
              </div>
              <p>{milestone.summary}</p>
              <p className="tagline">
                {locale === "zh" ? "目标时间" : "Target window"} /{" "}
                {milestone.dueLabel || "-"}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "交付物" : "Deliverables"}</p>
          <h2>
            {locale === "zh"
              ? "把承接转化成可审阅的具体成果"
              : "Turn the engagement into concrete, reviewable outputs"}
          </h2>
        </div>
        <div className="timeline">
          {engagement.deliverables.map((deliverable) => (
            <article key={deliverable.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{deliverable.title}</p>
                <span className={`statuspill ${toneClass(deliverable.status)}`}>
                  {humanizeToken(deliverable.status, locale)}
                </span>
              </div>
              <p>{deliverable.summary}</p>
              <p className="tagline">
                {locale === "zh" ? "产物类型" : "Artifact type"} / {deliverable.artifactType}
              </p>
            </article>
          ))}
        </div>
      </section>

      {engagement.agreement ? (
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{locale === "zh" ? "商务确认" : "Commercial frame"}</p>
            <h2>
              {locale === "zh"
                ? "让承接对象具备最小的商业成立条件"
                : "Give the engagement a minimal commercial reality"}
            </h2>
          </div>
          <div className="surface-grid surface-grid-two">
            <article className="card">
              <h3>{locale === "zh" ? "合作方式" : "Engagement mode"}</h3>
              <p>{engagement.agreement.engagementMode}</p>
            </article>
            <article className="card">
              <h3>{locale === "zh" ? "计费方式" : "Billing model"}</h3>
              <p>{engagement.agreement.billingModel}</p>
            </article>
            <article className="card">
              <h3>{locale === "zh" ? "预算区间" : "Budget band"}</h3>
              <p>{engagement.agreement.budgetLabel}</p>
            </article>
            <article className="card">
              <h3>{locale === "zh" ? "启动窗口" : "Start window"}</h3>
              <p>{engagement.agreement.startWindow}</p>
            </article>
          </div>
          <p className="tagline">
            {locale === "zh" ? "商务状态" : "Commercial status"} /{" "}
            {humanizeToken(engagement.agreement.status, locale)}
          </p>
          <p>{engagement.agreement.notes}</p>
        </section>
      ) : null}

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "审核回路" : "Review loop"}</p>
          <h2>
            {locale === "zh"
              ? "交付物必须经过清晰的审核记录"
              : "Each deliverable needs a visible audit trail"}
          </h2>
        </div>
        <div className="timeline">
          {engagement.reviews.map((review) => (
            <article key={review.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">
                  {locale === "zh" ? "审核结论" : "Review verdict"}
                </p>
                <span className={`statuspill ${toneClass(review.verdict)}`}>
                  {humanizeToken(review.verdict, locale)}
                </span>
              </div>
              <p>{review.notes}</p>
              {review.deliverableId ? (
                <p className="tagline">
                  {locale === "zh" ? "对应交付物" : "Deliverable"} / {review.deliverableId}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <EngagementOpsControls initialEngagement={engagement} locale={locale} />

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.proposal}</p>
          <h2>{locale === "zh" ? "关联信息" : "Connected context"}</h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{provider.name}</h3>
            <p>{provider.summary}</p>
          </article>
          <article className="card">
            <h3>{agent.name}</h3>
            <p>{agent.summary}</p>
          </article>
          <article className="card">
            <h3>{engagement.taskRequest.title}</h3>
            <p>{engagement.taskRequest.description}</p>
          </article>
          <article className="card">
            <h3>{engagement.demandResponse.headline}</h3>
            <p>{t.proposalText}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
