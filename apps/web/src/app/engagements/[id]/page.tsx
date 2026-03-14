import Link from "next/link";
import { notFound } from "next/navigation";
import { BuilderEngagementControls } from "../../../components/builder-engagement-controls";
import { CustomerEngagementControls } from "../../../components/customer-engagement-controls";
import { EngagementOpsControls } from "../../../components/engagement-ops-controls";
import { MediaCard } from "../../../components/media-card";
import { getEngagement } from "../../../lib/api";
import { getAccessRole } from "../../../lib/access-role";
import { localizeAgent, localizeProvider } from "../../../lib/catalog-copy";
import { getEngagementDetailOperatingMetrics } from "../../../lib/engagement-intelligence";
import { getEngagementVisuals } from "../../../lib/industry-visuals";
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
  const accessRole = await getAccessRole();
  const { id } = await params;
  const engagement = await getEngagement(id);

  if (!engagement) {
    notFound();
  }

  const provider = localizeProvider(engagement.provider, locale);
  const agent = localizeAgent(engagement.agent, locale);
  const operatingMetrics = getEngagementDetailOperatingMetrics(engagement);
  const engagementVisuals = getEngagementVisuals(
    {
      ...engagement,
      taskRequest: {
        ...engagement.taskRequest,
        industry: engagement.taskRequest.industry ?? ""
      },
      agent
    },
    locale
  );
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
          workText: "这一步让平台第一次拥有了从“需求 → 响应 → 正式承接”的真实闭环。",
          noMilestones: "这个承接对象还没有里程碑骨架。",
          noDeliverables: "这个承接对象还没有交付物骨架。",
          noAgreementTitle: "商务骨架待确认",
          noAgreementText: "这条承接已经成立，但商务条款还没有进入明确确认。",
          noReviews: "当前还没有审核记录。",
          noRuns: "这条承接还没有 delivery run。现在 delivery run 会在响应被接受时创建，而不是在需求刚提交时抢跑。",
          confirmationTitle: "客户确认",
          confirmationEmptyTitle: "客户确认还没开始",
          confirmationEmptyText: "这条交付对象已经存在，但客户还没有给出正式确认、问题回传或扩展意愿。",
          feedbackTitle: "现场反馈",
          feedbackEmpty: "当前还没有现场反馈记录。",
          incidentTitle: "问题工单",
          incidentEmpty: "当前还没有问题工单。",
          runTitle: "交付 run"
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
          workText: "This is the first real bridge from demand and response into a formal delivery object.",
          noMilestones: "This engagement does not have milestone scaffolding yet.",
          noDeliverables: "This engagement does not have deliverable scaffolding yet.",
          noAgreementTitle: "Commercial frame pending",
          noAgreementText: "The engagement exists, but the commercial frame still needs explicit confirmation.",
          noReviews: "No review records exist yet.",
          noRuns: "This engagement does not have a delivery run yet. Delivery runs are now created only after a response is accepted, not when a demand is first submitted.",
          confirmationTitle: "Customer confirmation",
          confirmationEmptyTitle: "Customer confirmation has not started",
          confirmationEmptyText: "The delivery object exists, but the customer has not yet filed a formal confirmation, issue report, or expansion signal.",
          feedbackTitle: "Field feedback",
          feedbackEmpty: "No field feedback exists yet.",
          incidentTitle: "Incident tickets",
          incidentEmpty: "No incident tickets exist yet.",
          runTitle: "Delivery runs"
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
            <span className="statuspill tone-neutral">
              {accessRole === "customer"
                ? locale === "zh"
                  ? "客户视角"
                  : "customer view"
                : accessRole === "builder"
                  ? locale === "zh"
                    ? "Builder 视角"
                    : "builder view"
                  : locale === "zh"
                    ? "运营视角"
                    : "ops view"}
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
            <article className="signalitem">
              <span>{t.confirmationTitle}</span>
              <strong>
                {engagement.customerConfirmation
                  ? humanizeToken(engagement.customerConfirmation.status, locale)
                  : locale === "zh"
                    ? "未开始"
                    : "Not started"}
              </strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "开放 incident" : "Open incidents"}</span>
              <strong>{operatingMetrics.openIncidentCount}</strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "未闭合反馈" : "Unresolved feedback"}</span>
              <strong>{operatingMetrics.unresolvedFeedbackCount}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "Engagement Operating Posture" : "Engagement Operating Posture"}
          </p>
          <h2>
            {locale === "zh"
              ? "2.0 版本把交付对象提升成可观察、可判断、可扩展的运营单元"
              : "2.0 upgrades the engagement into an observable, governable, and expandable operating unit"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "交付健康" : "Delivery health"}</h3>
            <p>
              {locale === "zh"
                ? `当前健康态为 ${humanizeToken(operatingMetrics.health, locale)}。`
                : `Current health state is ${humanizeToken(operatingMetrics.health, locale)}.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "执行连接" : "Execution linkage"}</h3>
            <p>
              {locale === "zh"
                ? `当前已经连接 ${engagement.taskRuns.length} 条 delivery run。`
                : `${engagement.taskRuns.length} delivery runs are now attached to this engagement.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "问题压力" : "Issue pressure"}</h3>
            <p>
              {locale === "zh"
                ? `${operatingMetrics.openIncidentCount} 个开放 incident，${operatingMetrics.unresolvedFeedbackCount} 条未闭合反馈。`
                : `${operatingMetrics.openIncidentCount} incidents remain open and ${operatingMetrics.unresolvedFeedbackCount} feedback threads are still unresolved.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "完成度" : "Completion"}</h3>
            <p>
              {locale === "zh"
                ? `${operatingMetrics.completedDeliverables} / ${engagement.deliverables.length} 个交付物已通过。`
                : `${operatingMetrics.completedDeliverables} of ${engagement.deliverables.length} deliverables are already approved.`}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.proposal}</p>
          <h2>{t.proposalTitle}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src={engagementVisuals.primary.src}
            alt={engagementVisuals.primary.alt}
            kicker={t.proposal}
            title={engagement.demandResponse.headline}
            caption={engagement.demandResponse.proposalSummary}
            mode={engagementVisuals.primary.mode}
          />
          <MediaCard
            src={engagementVisuals.secondary.src}
            alt={engagementVisuals.secondary.alt}
            kicker={engagementVisuals.secondary.kicker}
            title={engagementVisuals.secondary.title}
            caption={engagementVisuals.secondary.caption}
            mode={engagementVisuals.secondary.mode}
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.runTitle}</p>
          <h2>
            {locale === "zh"
              ? "把承接对象真正接到 delivery execution 上"
              : "Attach the engagement to real delivery execution"}
          </h2>
        </div>
        <div className="timeline">
          {engagement.taskRuns.length === 0 ? (
            <p>{t.noRuns}</p>
          ) : (
            engagement.taskRuns.map((run) => (
              <article key={run.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">run / {run.id.slice(-6)}</p>
                  <span className={`statuspill ${toneClass(run.status)}`}>
                    {humanizeToken(run.status, locale)}
                  </span>
                </div>
                <p>{run.latestMessage || "-"}</p>
                <p className="timestamp">{formatTimestamp(run.updatedAt, locale)}</p>
                <Link href={`/runs/${run.id}`} className="cardlink">
                  {locale === "zh" ? "查看 run" : "Open run"}
                </Link>
              </article>
            ))
          )}
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
          {engagement.milestones.length === 0 ? (
            <p>{t.noMilestones}</p>
          ) : (
            engagement.milestones.map((milestone) => (
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
            ))
          )}
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
          {engagement.deliverables.length === 0 ? (
            <p>{t.noDeliverables}</p>
          ) : (
            engagement.deliverables.map((deliverable) => (
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
            ))
          )}
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
      ) : (
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{locale === "zh" ? "商务确认" : "Commercial frame"}</p>
            <h2>{t.noAgreementTitle}</h2>
          </div>
          <p>{t.noAgreementText}</p>
        </section>
      )}

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.confirmationTitle}</p>
          <h2>
            {locale === "zh"
              ? "把“客户确认 / 问题回传 / 扩展意愿”变成正式对象"
              : "Turn customer confirmation, issue return, and expansion signal into first-class objects"}
          </h2>
        </div>
        {engagement.customerConfirmation ? (
          <div className="timelineitem">
            <div className="timelinehead">
              <p className="tagline">{t.confirmationTitle}</p>
              <span
                className={`statuspill ${toneClass(
                  engagement.customerConfirmation.status
                )}`}
              >
                {humanizeToken(engagement.customerConfirmation.status, locale)}
              </span>
            </div>
            <p>{engagement.customerConfirmation.summary}</p>
            <p>{engagement.customerConfirmation.notes}</p>
            {engagement.customerConfirmation.nextStep ? (
              <p className="tagline">
                {locale === "zh" ? "下一步" : "Next step"} /{" "}
                {engagement.customerConfirmation.nextStep}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="timelineitem">
            <div className="timelinehead">
              <p className="tagline">{t.confirmationEmptyTitle}</p>
              <span className="statuspill tone-neutral">
                {locale === "zh" ? "未开始" : "Not started"}
              </span>
            </div>
            <p>{t.confirmationEmptyText}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.feedbackTitle}</p>
          <h2>
            {locale === "zh"
              ? "把部署后的反馈继续挂回原 engagement"
              : "Keep post-deployment feedback attached to the original engagement"}
          </h2>
        </div>
        <div className="timeline">
          {engagement.feedbackItems.length === 0 ? (
            <p>{t.feedbackEmpty}</p>
          ) : (
            engagement.feedbackItems.map((item) => (
              <article key={item.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{item.title}</p>
                  <span className={`statuspill ${toneClass(item.status)}`}>
                    {humanizeToken(item.status, locale)}
                  </span>
                </div>
                <p>{item.details}</p>
                <p className="tagline">
                  {humanizeToken(item.category, locale)} /{" "}
                  {formatTimestamp(item.createdAt, locale)}
                </p>
                {item.responseNote ? <p>{item.responseNote}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.incidentTitle}</p>
          <h2>
            {locale === "zh"
              ? "把现场问题变成可推进的 incident ticket"
              : "Turn field issues into actionable incident tickets"}
          </h2>
        </div>
        <div className="timeline">
          {engagement.incidents.length === 0 ? (
            <p>{t.incidentEmpty}</p>
          ) : (
            engagement.incidents.map((item) => (
              <article key={item.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{item.title}</p>
                  <span className={`statuspill ${toneClass(item.status)}`}>
                    {humanizeToken(item.status, locale)}
                  </span>
                </div>
                <p>{item.summary}</p>
                <p className="tagline">
                  {humanizeToken(item.severity, locale)} /{" "}
                  {formatTimestamp(item.openedAt, locale)}
                </p>
                {item.responseNote ? <p>{item.responseNote}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>

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
          {engagement.reviews.length === 0 ? (
            <p>{t.noReviews}</p>
          ) : (
            engagement.reviews.map((review) => (
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
            ))
          )}
        </div>
      </section>

      {accessRole === "customer" ? (
        <CustomerEngagementControls initialEngagement={engagement} locale={locale} />
      ) : accessRole === "builder" ? (
        <BuilderEngagementControls initialEngagement={engagement} locale={locale} />
      ) : (
        <EngagementOpsControls initialEngagement={engagement} locale={locale} />
      )}

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
