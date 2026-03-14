import Link from "next/link";
import { notFound } from "next/navigation";
import { BuilderResponseForm } from "../../../components/builder-response-form";
import { DemandResponseReview } from "../../../components/demand-response-review";
import { MediaCard } from "../../../components/media-card";
import {
  getAccessRole,
  getAccessRoleRedirectPath
} from "../../../lib/access-role";
import { getProviderCatalog, getTaskRequest } from "../../../lib/api";
import { localizeAgent, localizeProvider } from "../../../lib/catalog-copy";
import { getCopy } from "../../../lib/copy";
import { getTaskRequestVisuals } from "../../../lib/industry-visuals";
import { getLocale } from "../../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../../lib/presenters";

type TaskRequestPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskRequestPage({ params }: TaskRequestPageProps) {
  const locale = await getLocale();
  const accessRole = await getAccessRole();
  const copy = getCopy(locale);
  const { id } = await params;
  const taskRequest = await getTaskRequest(id);

  if (!taskRequest) {
    notFound();
  }

  const localizedAgent = localizeAgent(taskRequest.agent, locale);
  const localizedProviders = (await getProviderCatalog()).map((provider) =>
    localizeProvider(provider, locale)
  );
  const localizedRequest = {
    ...taskRequest,
    responses: taskRequest.responses.map((response) => ({
      ...response,
      provider: localizeProvider(response.provider, locale)
    })),
    engagement: taskRequest.engagement
      ? {
          ...taskRequest.engagement,
          provider: localizeProvider(taskRequest.engagement.provider, locale)
        }
      : null
  };
  const requestVisuals = getTaskRequestVisuals(localizedRequest, locale);
  const backHref = getAccessRoleRedirectPath(accessRole);
  const roleCopy =
    locale === "zh"
      ? accessRole === "customer"
        ? {
            lane: "客户视图",
            title: "客户关心的是有没有响应、谁最合适、项目是否真正推进。",
            detail: "你现在看到的是需求在平台上的公开承接情况，而不是后台字段。",
            back: "返回客户侧",
            primaryEyebrow: "开发者响应",
            primaryTitle: "谁正在响应这条需求",
            primaryEmpty: "当前还没有开发者响应这条需求。",
            primaryAction: "查看正式承接",
            latest: "最新响应",
            nextStep: "下一步",
            nextStepText: localizedRequest.engagement
              ? "这条需求已经进入正式承接，可以直接查看交付推进。"
              : "等待更多开发者响应，或由平台运营者推进承接决策。"
          }
        : accessRole === "builder"
          ? {
              lane: "供给方视图",
              title: "供给方关心的是需求是否值得追、自己如何响应、平台上当前竞争态势如何。",
              detail: "这里应该帮助开发者决定是否承接，而不是强迫他们先理解平台后台结构。",
              back: "返回供给侧",
              primaryEyebrow: "提交响应",
              primaryTitle: "向这条需求提交你的承接方案",
              primaryEmpty: "",
              primaryAction: "查看正式承接",
              latest: "市场上下文",
              nextStep: "下一步",
              nextStepText: localizedRequest.engagement
                ? "这条需求已经被承接，当前更重要的是观察项目推进和交付要求。"
                : "明确交付方式、试点范围和时间窗口，再决定是否响应。"
            }
          : {
              lane: "运营视图",
              title: "运营者关心的是平台是否该接受某条响应，以及接受后是否进入了可推进的交付对象。",
              detail: "这里应该优先暴露决策、风险和流转状态，而不是只做需求浏览。",
              back: "返回运营台",
              primaryEyebrow: "响应决策",
              primaryTitle: "筛选并推进平台承接决策",
              primaryEmpty: "当前没有可决策的开发者响应。",
              primaryAction: "查看正式承接",
              latest: "决策焦点",
              nextStep: "下一步",
              nextStepText: localizedRequest.engagement
                ? "这条需求已经进入正式承接，下一步应转向交付推进和审核节奏。"
                : "比较开发者响应质量、可信性和交付边界，再决定是否接受。"
            }
      : accessRole === "customer"
        ? {
            lane: "Customer view",
            title: "Customers care whether responses are arriving, who looks strongest, and whether delivery is actually moving.",
            detail: "This page should expose demand movement in the market, not just internal platform fields.",
            back: "Back to customer side",
            primaryEyebrow: "Builder responses",
            primaryTitle: "Who is responding to this demand",
            primaryEmpty: "No builder has responded to this demand yet.",
            primaryAction: "Open formal engagement",
            latest: "Latest response",
            nextStep: "Next step",
            nextStepText: localizedRequest.engagement
              ? "This demand is already in formal engagement, so the main question is delivery progress."
              : "Wait for more builders to respond or let platform ops move the engagement decision forward."
          }
        : accessRole === "builder"
          ? {
              lane: "Builder view",
              title: "Builders care whether the demand is worth pursuing, how to respond, and what the current market posture looks like.",
              detail: "This page should help a builder decide whether to engage, not force them through internal platform abstractions first.",
              back: "Back to builder side",
              primaryEyebrow: "Submit response",
              primaryTitle: "Respond to this demand from the supply side",
              primaryEmpty: "",
              primaryAction: "Open formal engagement",
              latest: "Market context",
              nextStep: "Next step",
              nextStepText: localizedRequest.engagement
                ? "This demand has already moved into engagement, so delivery expectations matter more than response posture."
                : "Clarify scope, delivery method, and timing before deciding whether to respond."
            }
          : {
              lane: "Ops view",
              title: "Operators care whether the platform should accept a response and whether that decision becomes a usable delivery object.",
              detail: "This page should foreground decisions, risk, and flow control rather than static demand reading.",
              back: "Back to ops side",
              primaryEyebrow: "Response decisions",
              primaryTitle: "Filter and move engagement decisions forward",
              primaryEmpty: "No builder responses are available for decision yet.",
              primaryAction: "Open formal engagement",
              latest: "Decision focus",
              nextStep: "Next step",
              nextStepText: localizedRequest.engagement
                ? "This demand is already in engagement, so the next move is delivery control and review."
                : "Compare response quality, credibility, and delivery boundary before accepting one."
            };
  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.requestPage.eyebrow}</p>
          <h1>{taskRequest.title}</h1>
          <p className="lede">{taskRequest.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(taskRequest.status)}`}>
              {humanizeToken(taskRequest.status, locale)}
            </span>
            <span className="statuspill tone-neutral">agent / {localizedAgent.name}</span>
            <span className="statuspill tone-neutral">
              {copy.queue.builderBy} / {localizedAgent.provider.name}
            </span>
            <span className="statuspill tone-neutral">{roleCopy.lane}</span>
            <span className="datachip">{formatTimestamp(taskRequest.createdAt, locale)}</span>
          </div>
          <p className="small">{roleCopy.title}</p>
          <div className="buttonrow">
            <Link href={backHref} className="actionlink actionlink-primary">
              {roleCopy.back}
            </Link>
            <Link
              href={`/providers/${localizedAgent.provider.slug}`}
              className="actionlink"
            >
              {copy.requestPage.inspectBuilder}
            </Link>
            <Link href={`/agents/${localizedAgent.slug}`} className="actionlink">
              {copy.requestPage.backToAgent}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{roleCopy.lane}</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>{roleCopy.latest}</span>
              <strong>
                {localizedRequest.responses[0]?.provider.name ??
                  (locale === "zh" ? "暂无响应" : "No response yet")}
              </strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "响应数量" : "Response count"}</span>
              <strong>{localizedRequest.responses.length}</strong>
            </article>
            <article className="signalitem">
              <span>{roleCopy.nextStep}</span>
              <strong>{localizedRequest.engagement ? humanizeToken(localizedRequest.engagement.status, locale) : (locale === "zh" ? "等待承接" : "Awaiting engagement")}</strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "推荐供给方向" : "Recommended supply"}</span>
              <strong>{localizedAgent.name}</strong>
            </article>
          </div>
          <p className="small">{roleCopy.detail}</p>
          <p className="small">{roleCopy.nextStepText}</p>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.requestPage.visual.eyebrow}</p>
          <h2>{copy.requestPage.visual.title}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src={requestVisuals.primary.src}
            alt={requestVisuals.primary.alt}
            kicker={requestVisuals.primary.kicker}
            title={requestVisuals.primary.title}
            caption={requestVisuals.primary.caption}
            mode={requestVisuals.primary.mode}
          />
          <MediaCard
            src={requestVisuals.secondary.src}
            alt={requestVisuals.secondary.alt}
            kicker={requestVisuals.secondary.kicker}
            title={requestVisuals.secondary.title}
            caption={requestVisuals.secondary.caption}
            mode={requestVisuals.secondary.mode}
          />
        </div>
      </section>

      <div className="surface-grid surface-grid-two">
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{copy.requestPage.builder.eyebrow}</p>
            <h2>{copy.requestPage.builder.title}</h2>
          </div>
          <p className="tagline">{localizedAgent.provider.name}</p>
          <p>{localizedAgent.provider.summary}</p>
          <Link href={`/providers/${localizedAgent.provider.slug}`} className="cardlink">
            {copy.requestPage.builder.open}
          </Link>
        </section>

        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{copy.requestPage.context.eyebrow}</p>
            <h2>{copy.requestPage.context.title}</h2>
          </div>
          <p>{taskRequest.contextNote || copy.requestPage.context.empty}</p>
        </section>

        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{copy.requestPage.provenancePanel.eyebrow}</p>
            <h2>{copy.requestPage.provenancePanel.title}</h2>
          </div>
          <p className="tagline">{humanizeToken(localizedAgent.provenanceStatus, locale)}</p>
          <p>{localizedAgent.provenanceSummary}</p>
        </section>
      </div>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.requestPage.execution.eyebrow}</p>
          <h2>{copy.requestPage.execution.title}</h2>
        </div>
        <div className="timeline">
          {taskRequest.runs.length === 0 ? (
            <article className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">
                  {locale === "zh" ? "execution 未开始" : "Execution has not started"}
                </p>
                <span className="statuspill tone-neutral">
                  {locale === "zh" ? "等待承接" : "Awaiting engagement"}
                </span>
              </div>
              <p>
                {locale === "zh"
                  ? "Agora 现在会在响应被接受后再创建 delivery run，而不是在需求刚提交时就自动创建。"
                  : "Agora now creates a delivery run only after a response is accepted, instead of auto-creating execution when the demand is first submitted."}
              </p>
            </article>
          ) : (
            taskRequest.runs.map((run) => (
              <article key={run.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">run / {run.id.slice(-6)}</p>
                  <span className={`statuspill ${toneClass(run.status)}`}>
                    {humanizeToken(run.status, locale)}
                  </span>
                </div>
                <p className="tagline">
                  {copy.requestPage.execution.builderBy} / {localizedAgent.provider.name}
                </p>
                <p>{run.latestMessage || copy.requestPage.execution.noMessage}</p>
                <p className="timestamp">{formatTimestamp(run.createdAt, locale)}</p>
                <Link href={`/runs/${run.id}`} className="cardlink">
                  {copy.requestPage.execution.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      {accessRole === "builder" ? (
        <BuilderResponseForm
          initialRequest={localizedRequest}
          providers={localizedProviders}
          locale={locale}
        />
      ) : null}

      {accessRole === "ops" ? (
        <DemandResponseReview initialRequest={localizedRequest} locale={locale} />
      ) : null}

      {accessRole === "customer" ? (
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{roleCopy.primaryEyebrow}</p>
            <h2>{roleCopy.primaryTitle}</h2>
          </div>
          <div className="timeline">
            {localizedRequest.responses.length === 0 ? (
              <p>{roleCopy.primaryEmpty}</p>
            ) : (
              localizedRequest.responses.map((response) => (
                <article key={response.id} className="timelineitem">
                  <div className="timelinehead">
                    <p className="tagline">{response.provider.name}</p>
                    <span className={`statuspill ${toneClass(response.status)}`}>
                      {humanizeToken(response.status, locale)}
                    </span>
                  </div>
                  <p>{response.headline}</p>
                  <p>{response.proposalSummary}</p>
                  <p className="tagline">
                    ETA / {response.etaLabel || "-"} / {humanizeToken(response.confidence, locale)}
                  </p>
                  <p className="timestamp">
                    {formatTimestamp(response.updatedAt, locale)}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      ) : null}

      {localizedRequest.engagement ? (
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{locale === "zh" ? "正式承接" : "Engagement"}</p>
            <h2>
              {locale === "zh"
                ? "这条需求已进入正式承接流程"
                : "This demand has moved into a formal engagement"}
            </h2>
          </div>
          <div className="timelineitem">
            <div className="timelinehead">
              <p className="tagline">{localizedRequest.engagement.provider.name}</p>
              <span className={`statuspill ${toneClass(localizedRequest.engagement.status)}`}>
                {humanizeToken(localizedRequest.engagement.status, locale)}
              </span>
            </div>
            <p>{localizedRequest.engagement.title}</p>
            <p>{localizedRequest.engagement.summary}</p>
            <Link
              href={`/engagements/${localizedRequest.engagement.id}`}
              className="cardlink"
            >
              {roleCopy.primaryAction}
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
