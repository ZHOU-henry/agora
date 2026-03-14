import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getEngagements, getTaskRequests, getTaskRuns } from "../../lib/api";
import { localizeAgent, localizeProvider } from "../../lib/catalog-copy";
import { summarizePlatformOperations } from "../../lib/engagement-intelligence";
import {
  getAgentVisuals,
  getProviderVisuals,
  getTaskRequestVisuals
} from "../../lib/industry-visuals";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function OpsPage() {
  const locale = await getLocale();
  const requests = (await getTaskRequests()).map((request) => ({
    ...request,
    agent: localizeAgent(request.agent, locale)
  }));
  const runs = (await getTaskRuns()).map((run) => ({
    ...run,
    agent: localizeAgent(run.agent, locale)
  }));
  const engagements = (await getEngagements()).map((engagement) => ({
    ...engagement,
    provider: localizeProvider(engagement.provider, locale)
  }));
  const platformOps = summarizePlatformOperations(requests, engagements, runs);

  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  );
  const responseDecisionQueue = requests.filter(
    (request) => request.responses.length > 0 && request.engagement === null
  );
  const activeRuns = runs.filter(
    (run) => run.status === "submitted" || run.status === "running"
  );
  const decisionVisuals = responseDecisionQueue[0]
    ? getTaskRequestVisuals(responseDecisionQueue[0], locale)
    : getAgentVisuals({ slug: activeRuns[0]?.agent.slug ?? "athena" }, locale);
  const deliveryVisuals = engagements[0]
    ? getProviderVisuals(engagements[0].provider, locale)
    : getAgentVisuals({ slug: activeRuns[0]?.agent.slug ?? "themis" }, locale);

  const t =
    locale === "zh"
      ? {
          eyebrow: "平台运营",
          title: "平台运营者需要一眼看清需求、运行、审核与承接全局。",
          lede: "运营侧不是做内容浏览，而是做平台流转、风险控制和交付推进。",
          primary: "查看执行台",
          secondary: "查看承接项目",
          active: "运行中",
          review: "待审核",
          requests: "需求总数",
          engagements: "承接项目",
          decision: "待决策",
          activeTitle: "实时运行",
          decisionTitle: "等待响应决策的需求",
          reviewTitle: "审核队列",
          engagementTitle: "正式承接对象",
          actionRequest: "查看需求",
          actionRun: "查看运行",
          actionEngagement: "查看承接"
        }
      : {
          eyebrow: "Platform Ops",
          title: "Operators need one surface for demand, runs, review, and engagements.",
          lede: "The ops role is not browsing content. It is controlling platform flow, risk, and delivery movement.",
          primary: "Open queue",
          secondary: "Open engagements",
          active: "active",
          review: "review",
          requests: "requests",
          engagements: "engagements",
          decision: "decisions",
          activeTitle: "Live runs",
          decisionTitle: "Demand waiting for response decisions",
          reviewTitle: "Review queue",
          engagementTitle: "Formal engagements",
          actionRequest: "Inspect demand",
          actionRun: "Inspect run",
          actionEngagement: "Open engagement"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lede">{t.lede}</p>
          <div className="buttonrow">
            <Link href="/queue" className="actionlink actionlink-primary">
              {t.primary}
            </Link>
            <Link href="/engagements" className="actionlink">
              {t.secondary}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{t.eyebrow}</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{activeRuns.length}</strong>
              <span>{t.active}</span>
            </div>
            <div className="stat">
              <strong>{reviewQueue.length}</strong>
              <span>{t.review}</span>
            </div>
            <div className="stat">
              <strong>{responseDecisionQueue.length}</strong>
              <span>{t.decision}</span>
            </div>
            <div className="stat">
              <strong>{requests.length}</strong>
              <span>{t.requests}</span>
            </div>
            <div className="stat">
              <strong>{engagements.length}</strong>
              <span>{t.engagements}</span>
            </div>
          </div>
          <div className="signalstack">
            <article className="signalitem">
              <span>{locale === "zh" ? "交付阻塞" : "Blocked delivery"}</span>
              <strong>{platformOps.blockedEngagements}</strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "关注队列" : "Watch queue"}</span>
              <strong>{platformOps.watchEngagements}</strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "扩展信号" : "Expansion signals"}</span>
              <strong>{platformOps.expansionSignals}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "Ops Control Tower 2.0" : "Ops Control Tower 2.0"}
          </p>
          <h2>
            {locale === "zh"
              ? "2.0 版本让运营台同时看市场转换、交付风险和扩展势能"
              : "2.0 lets ops see market conversion, delivery risk, and expansion energy on one surface"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "待响应需求" : "Demand waiting for response"}</h3>
            <p>
              {locale === "zh"
                ? `${platformOps.waitingForResponse} 条需求还没有获得任何 Builder 响应。`
                : `${platformOps.waitingForResponse} demands still have no builder response at all.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "待决策需求" : "Decision backlog"}</h3>
            <p>
              {locale === "zh"
                ? `${platformOps.awaitingDecision} 条需求已收到响应但还没被正式决策。`
                : `${platformOps.awaitingDecision} demands already have responses but still need an ops decision.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "活跃执行" : "Active execution"}</h3>
            <p>
              {locale === "zh"
                ? `${platformOps.activeRuns} 条 run 正在推进，${platformOps.reviewQueue} 条 run 还在等待审核。`
                : `${platformOps.activeRuns} runs are active and ${platformOps.reviewQueue} more are still waiting for review.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "交付风险" : "Delivery risk"}</h3>
            <p>
              {locale === "zh"
                ? `${platformOps.blockedEngagements} 个 engagement 已经被反馈或 incident 压住。`
                : `${platformOps.blockedEngagements} engagements are currently blocked by feedback or incident pressure.`}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "运营行动框架" : "Ops operating frame"}</p>
          <h2>
            {locale === "zh"
              ? "运营侧在 Agora 里主要做三件事"
              : "Ops does three main things in Agora"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "推进响应决策" : "Move response decisions"}</h3>
            <p>
              {locale === "zh"
                ? "先处理已经收到响应但还没正式承接的需求，这是平台最重要的流转闸门。"
                : "Handle demand with incoming responses but no formal engagement yet. This is the main market-control gate."}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "控制执行风险" : "Control execution risk"}</h3>
            <p>
              {locale === "zh"
                ? "盯运行状态、审核队列和结果质量，避免弱工作直接混进平台标准。"
                : "Watch run state, review queues, and result quality so weak work does not quietly enter the platform standard."}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "推进正式交付" : "Advance formal delivery"}</h3>
            <p>
              {locale === "zh"
                ? "一旦承接成立，就把它推进成有里程碑、交付物和审核记录的真实项目空间。"
                : "Once engagement exists, push it into a real workspace with milestones, deliverables, and review records."}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src={decisionVisuals.primary.src}
            alt={decisionVisuals.primary.alt}
            kicker={locale === "zh" ? "决策焦点" : "Decision focus"}
            title={
              locale === "zh"
                ? "运营侧先看需要被接受 / 拒绝的真实行业需求"
                : "Ops should first see the real industry demand awaiting accept / decline decisions"
            }
            caption={
              decisionVisuals.primary.caption
            }
            mode={decisionVisuals.primary.mode}
          />
          <MediaCard
            src={deliveryVisuals.secondary.src}
            alt={deliveryVisuals.secondary.alt}
            kicker={locale === "zh" ? "交付控制" : "Delivery control"}
            title={
              locale === "zh"
                ? "正式承接后要看清交付对象的落地结构"
                : "Once accepted, ops should see the real structure of the delivery object"
            }
            caption={
              deliveryVisuals.secondary.caption
            }
            mode={deliveryVisuals.secondary.mode}
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "响应决策" : "Response decisions"}</p>
          <h2>{t.decisionTitle}</h2>
        </div>
        <div className="timeline">
          {responseDecisionQueue.slice(0, 6).map((request) => (
            <article key={request.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{request.agent.name}</p>
                <span className={`statuspill ${toneClass(request.status)}`}>
                  {humanizeToken(request.status, locale)}
                </span>
              </div>
              <p>{request.title}</p>
              <p>
                {locale === "zh"
                  ? `当前已收到 ${request.responses.length} 条供给侧响应。`
                  : `${request.responses.length} builder responses have arrived.`}
              </p>
              <Link href={`/requests/${request.id}`} className="cardlink">
                {t.actionRequest}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "运行" : "Runs"}</p>
          <h2>{t.activeTitle}</h2>
        </div>
        <div className="timeline">
          {activeRuns.slice(0, 6).map((run) => (
            <article key={run.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{run.agent.name}</p>
                <span className={`statuspill ${toneClass(run.status)}`}>
                  {humanizeToken(run.status, locale)}
                </span>
              </div>
              <p>{run.taskTitle}</p>
              <p>{run.latestMessage || "-"}</p>
              <Link href={`/runs/${run.id}`} className="cardlink">
                {t.actionRun}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "审核" : "Review"}</p>
          <h2>{t.reviewTitle}</h2>
        </div>
        <div className="timeline">
          {reviewQueue.slice(0, 6).map((run) => (
            <article key={run.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{run.agent.name}</p>
                <span className={`statuspill ${toneClass(run.status)}`}>
                  {humanizeToken(run.status, locale)}
                </span>
              </div>
              <p>{run.taskTitle}</p>
              <p>{run.resultSummary || "-"}</p>
              <Link href={`/runs/${run.id}`} className="cardlink">
                {t.actionRun}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "承接" : "Engagements"}</p>
          <h2>{t.engagementTitle}</h2>
        </div>
        <div className="timeline">
          {engagements.slice(0, 6).map((engagement) => (
            <article key={engagement.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{engagement.provider.name}</p>
                <span className={`statuspill ${toneClass(engagement.status)}`}>
                  {humanizeToken(engagement.status, locale)}
                </span>
              </div>
              <p>{engagement.title}</p>
              <p>{engagement.summary}</p>
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
              <p className="timestamp">{formatTimestamp(engagement.createdAt, locale)}</p>
              <Link href={`/engagements/${engagement.id}`} className="cardlink">
                {t.actionEngagement}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
