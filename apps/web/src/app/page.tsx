import Link from "next/link";
import { MediaCard } from "../components/media-card";
import {
  getAgentCatalog,
  getEngagements,
  getProviderCatalog,
  getTaskRequests,
  getTaskRuns
} from "../lib/api";
import { getAgentIntelligence } from "../lib/agent-intelligence";
import { localizeAgent, localizeProvider } from "../lib/catalog-copy";
import { getCopy } from "../lib/copy";
import { summarizePlatformOperations } from "../lib/engagement-intelligence";
import { getLocale } from "../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../lib/presenters";

type HomePageProps = {
  searchParams?: Promise<{
    q?: string;
    focus?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const params = (await searchParams) ?? {};
  const query = params.q?.trim().toLowerCase() ?? "";
  const focus = params.focus?.trim().toLowerCase() ?? "all";
  const agents = (await getAgentCatalog()).map((agent) => localizeAgent(agent, locale));
  const providers = (await getProviderCatalog()).map((provider) =>
    localizeProvider(provider, locale)
  );
  const requests = (await getTaskRequests()).map((request) => ({
    ...request,
    agent: localizeAgent(request.agent, locale)
  }));
  const engagements = (await getEngagements()).map((engagement) => ({
    ...engagement,
    provider: localizeProvider(engagement.provider, locale)
  }));
  const runs = (await getTaskRuns()).map((run) => ({
    ...run,
    agent: localizeAgent(run.agent, locale)
  }));
  const platformOps = summarizePlatformOperations(requests, engagements, runs);

  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  );
  const activeRuns = runs.filter(
    (run) => run.status === "submitted" || run.status === "running"
  );

  const enrichedAgents = agents.map((agent) => ({
    ...agent,
    intelligence: getAgentIntelligence(agent.slug, locale)
  }));

  const filteredAgents = enrichedAgents.filter((agent) => {
    const searchable = [
      agent.name,
      agent.summary,
      agent.description,
      agent.provider.name,
      agent.tags.join(" "),
      agent.intelligence?.idealFor.join(" ") ?? "",
      agent.intelligence?.exampleTasks.join(" ") ?? ""
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = query.length === 0 || searchable.includes(query);
    const matchesFocus =
      focus === "all" ||
      agent.tags.some((tag) => tag.toLowerCase() === focus) ||
      agent.intelligence?.capabilityScores.some(
        (score) => score.label.toLowerCase() === focus
      );

    return matchesQuery && matchesFocus;
  });

  const comparisonRows = enrichedAgents.map((agent) => ({
    agent,
    primaryCapability:
      agent.intelligence?.capabilityScores
        .slice()
        .sort((a, b) => b.score - a.score)[0] ?? null
  }));

  const deploymentVisual =
    locale === "zh"
      ? {
          eyebrow: "真实部署场景",
          title: "把 AI Agent 放回传统行业现场，而不是只放在平台叙事里。",
          lede:
            "这一层展示的是更接近真实部署的画面：产线相机输入、视觉 Agent 判断、PLC 与机械臂执行、QA 控制台闭环。",
          hero: {
            kicker: "质检单元动图",
            title: "机器人机械臂 + 相机 + Vision Agent 的质检闭环",
            caption:
              "这张 GIF 不是抽象平台动效，而是一个更贴近制造业现场的自动质检流程示意：相机看料、Agent 判缺陷、机械臂分拣、控制台记录。"
          },
          map: {
            kicker: "部署静态图",
            title: "从现场相机到边缘推理盒再到 QA 控制台的部署地图",
            caption:
              "客户和开发者都需要看到系统是如何落地在工位、产线、边缘盒和审核台上的，而不是只看一个 Agent 卡片。"
          },
          stack: {
            kicker: "开发者视图",
            title: "Builder 真正在交付的是部署栈，而不是一句模型能力介绍",
            caption:
              "输入源、策略层、机器人执行、质检闭环、ROI 叙事，才是工业 Builder 面向客户交付的真实结构。"
          }
        }
      : {
          eyebrow: "Real Deployment Scenes",
          title: "Put the AI agent back onto the factory floor instead of leaving it in platform abstraction.",
          lede:
            "This layer shows something closer to a real deployment: camera input, vision-agent judgment, PLC and robot execution, and a QA console closing the loop.",
          hero: {
            kicker: "Quality-cell GIF",
            title: "Robot arm + camera + vision agent in one inspection loop",
            caption:
              "This GIF is not abstract platform motion. It is a closer depiction of a manufacturing inspection cell where the camera sees parts, the agent scores them, and the robot handles rejection."
          },
          map: {
            kicker: "Deployment still",
            title: "A plant-floor map from camera rail to edge inference box and QA console",
            caption:
              "Customers and builders both need to see how the system lands on stations, conveyors, edge hardware, and operator review surfaces."
          },
          stack: {
            kicker: "Builder frame",
            title: "Industrial builders ship deployment stacks, not just model claims",
            caption:
              "Inputs, policy, robot execution, traceability, and ROI story are the real supply-side object a builder brings to a buyer."
          }
        };

  const industrySceneCards =
    locale === "zh"
      ? [
          {
            src: "/media/industrial-quality-cell-flow.gif",
            kicker: "制造质检",
            title: "相机 + Vision Agent + 机械臂的自动质检单元",
            caption: "适合展示传统制造业里最容易理解的 Agent 部署闭环。",
            mode: "gif"
          },
          {
            src: "/media/warehouse-autopicker-flow.gif",
            kicker: "仓储履约",
            title: "仓储自主拣选机器人在货架巷道里直接取箱拣货",
            caption: "更接近真实仓内部署：WMS 下发任务、移动机器人进巷道、拣选后进入打包站。",
            mode: "gif"
          },
          {
            src: "/media/maintenance-patrol-flow.gif",
            kicker: "巡检维护",
            title: "巡检机器人 + 热成像 + 维护 Agent 的预测性维护回路",
            caption: "让客户看到 AI Agent 如何把巡检、异常识别和工单推进连起来。",
            mode: "gif"
          }
        ]
      : [
          {
            src: "/media/industrial-quality-cell-flow.gif",
            kicker: "Industrial quality",
            title: "Camera + vision agent + robot arm in one inspection cell",
            caption: "A concrete manufacturing loop that makes industrial agent deployment legible immediately.",
            mode: "gif"
          },
          {
            src: "/media/warehouse-autopicker-flow.gif",
            kicker: "Warehouse fulfillment",
            title: "An autonomous picking robot retrieving totes directly in the aisle",
            caption: "Closer to a real warehouse deployment: WMS missioning, aisle robot movement, tote retrieval, and pack-station closure.",
            mode: "gif"
          },
          {
            src: "/media/maintenance-patrol-flow.gif",
            kicker: "Inspection and maintenance",
            title: "Inspection robot + thermal scan + maintenance agent in one patrol loop",
            caption: "Shows how an AI agent can connect robotic inspection, anomaly detection, and work-order creation.",
            mode: "gif"
          }
        ];

  return (
    <main className="page">
      <section className="hero hero-grid hero-grid-wide">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h1>{copy.home.title}</h1>
          <p className="lede">{copy.home.lede}</p>
          <div className="buttonrow">
            <Link href="/queue" className="actionlink actionlink-primary">
              {copy.home.primaryAction}
            </Link>
            <Link href="/demand" className="actionlink">
              {copy.home.secondaryAction}
            </Link>
          </div>
          <div className="chiprow">
            {copy.home.heroChips.map((chip) => (
              <span key={chip} className="datachip">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">System Pulse</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{providers.length}</strong>
              <span>builders</span>
            </div>
            <div className="stat">
              <strong>{agents.length}</strong>
              <span>agents</span>
            </div>
            <div className="stat">
              <strong>{activeRuns.length}</strong>
              <span>active</span>
            </div>
            <div className="stat">
              <strong>{reviewQueue.length}</strong>
              <span>review</span>
            </div>
          </div>
          <div className="signalstack">
            <article className="signalitem">
              <span>{copy.home.pulse.reviewLane}</span>
              <strong>
                {reviewQueue.length > 0
                  ? copy.home.pulse.reviewQueue(reviewQueue.length)
                  : copy.home.pulse.idle}
              </strong>
            </article>
            <article className="signalitem">
              <span>{copy.home.pulse.catalogStatus}</span>
              <strong>
                {agents.every((agent) => agent.status === "active")
                  ? copy.home.pulse.live
                  : humanizeToken("draft", locale)}
              </strong>
            </article>
            <article className="signalitem">
              <span>routing posture</span>
              <strong>
                {activeRuns.length > 0
                  ? copy.home.pulse.activeThreads(activeRuns.length)
                  : copy.home.pulse.idle}
              </strong>
            </article>
            <article className="signalitem">
              <span>supply model</span>
              <strong>{copy.home.pulse.supplyModel}</strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "delivery risk" : "delivery risk"}</span>
              <strong>{platformOps.blockedEngagements}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "Platform Operating System" : "Platform Operating System"}
          </p>
          <h2>
            {locale === "zh"
              ? "Agora 2.0 把市场、执行、交付运营和扩展信号放进同一个控制面"
              : "Agora 2.0 puts market flow, execution, delivery operations, and expansion signals into one control surface"}
          </h2>
          <p className="lede small">
            {locale === "zh"
              ? "参考头部 AI / 科技公司官网的结构经验，真正的平台不是功能罗列，而是把上下文、执行、观测和治理组织成清晰的 operating planes。"
              : "Borrowing from the structural lessons on leading AI and technology company websites, a real platform is not a feature list. It organizes context, execution, observability, and governance into clear operating planes."}
          </p>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "市场平面" : "Market plane"}</h3>
            <p>
              {locale === "zh"
                ? `${platformOps.waitingForResponse} 条需求仍然没有 Builder 响应，${platformOps.awaitingDecision} 条需求已经进入平台决策门。`
                : `${platformOps.waitingForResponse} demands still have no builder response, and ${platformOps.awaitingDecision} already sit inside the platform decision gate.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "执行平面" : "Execution plane"}</h3>
            <p>
              {locale === "zh"
                ? `${platformOps.activeRuns} 条 run 正在推进，${platformOps.reviewQueue} 条结果还在等待审核。`
                : `${platformOps.activeRuns} runs are active and ${platformOps.reviewQueue} more results still need review.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "运营平面" : "Operations plane"}</h3>
            <p>
              {locale === "zh"
                ? `${platformOps.watchEngagements} 个 engagement 处于观察态，${platformOps.blockedEngagements} 个已经出现交付阻塞。`
                : `${platformOps.watchEngagements} engagements are in watch mode and ${platformOps.blockedEngagements} are already blocked.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "扩展平面" : "Expansion plane"}</h3>
            <p>
              {locale === "zh"
                ? `${platformOps.expansionSignals} 个 engagement 已经出现扩线或扩大部署信号。`
                : `${platformOps.expansionSignals} engagements already show a credible path toward expansion or scale-out.`}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{deploymentVisual.eyebrow}</p>
          <h2>{deploymentVisual.title}</h2>
          <p className="lede small">{deploymentVisual.lede}</p>
        </div>
        <div className="media-stage media-stage-spread">
          <MediaCard
            src="/media/industrial-quality-cell-flow.gif"
            alt="Animated factory quality-inspection cell with camera input, vision agent scoring, and robot-arm reject motion."
            kicker={deploymentVisual.hero.kicker}
            title={deploymentVisual.hero.title}
            caption={deploymentVisual.hero.caption}
            mode="gif"
          />
          <div className="media-grid-compact">
            <MediaCard
              src="/media/industrial-quality-deployment-map.png"
              alt="Static deployment map showing camera array, edge vision agent, PLC robot cell, and QA console."
              kicker={deploymentVisual.map.kicker}
              title={deploymentVisual.map.title}
              caption={deploymentVisual.map.caption}
              mode="still"
              compact
            />
            <MediaCard
              src="/media/industrial-quality-builder-stack.png"
              alt="Static builder-side stack showing industrial AI agent deployment layers and buyer value."
              kicker={deploymentVisual.stack.kicker}
              title={deploymentVisual.stack.title}
              caption={deploymentVisual.stack.caption}
              mode="still"
              compact
            />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.industries.eyebrow}</p>
          <h2>{copy.home.industries.title}</h2>
          <p className="lede small">{copy.home.industries.lede}</p>
        </div>
        <div className="grid media-grid-showcase">
          {industrySceneCards.map((item) => (
            <MediaCard
              key={item.src}
              src={item.src}
              alt={item.title}
              kicker={item.kicker}
              title={item.title}
              caption={item.caption}
              mode={item.mode}
              compact
            />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.routing.eyebrow}</p>
          <h2>{copy.home.routing.title}</h2>
          <p className="lede small">{copy.home.routing.lede}</p>
        </div>
        <form className="controlform" action="/" method="get">
          <label className="stack">
            <span>{copy.home.routing.searchLabel}</span>
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder={copy.home.routing.searchPlaceholder}
            />
          </label>
          <label className="stack">
            <span>{copy.home.routing.focusLabel}</span>
            <select name="focus" defaultValue={focus}>
              {copy.home.routing.focusFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">{copy.home.routing.apply}</button>
        </form>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.providers.eyebrow}</p>
          <h2>{copy.home.providers.title}</h2>
          <p className="lede small">{copy.home.providers.lede}</p>
        </div>
        <div className="grid">
          {providers.map((provider) => (
            <article key={provider.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">builder</span>
                <span className={`statuspill ${toneClass(provider.status)}`}>
                  {humanizeToken(provider.status, locale)}
                </span>
              </div>
              <h3>{provider.name}</h3>
              <p>{provider.summary}</p>
              <p className="provenance">
                {copy.home.providers.typeLabel}: {humanizeToken(provider.type, locale)}
              </p>
              <img
                className="card-inline-media"
                src="/media/builder-network-loop.svg"
                alt=""
                aria-hidden="true"
              />
              <Link href={`/providers/${provider.slug}`} className="cardlink">
                {copy.home.providers.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.agents.eyebrow}</p>
          <h2>{copy.home.agents.title}</h2>
          <p className="lede small">{copy.home.agents.lede}</p>
        </div>
        {filteredAgents.length === 0 ? <p>{copy.home.agents.empty}</p> : null}
        <div className="grid">
          {filteredAgents.map((agent) => (
            <article key={agent.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">agent</span>
                <span className={`statuspill ${toneClass(agent.status)}`}>
                  {humanizeToken(agent.status, locale)}
                </span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <p className="tagline">
                {copy.home.agents.builtBy} / {agent.provider.name}
              </p>
              <img
                className="card-inline-media"
                src="/media/agent-constellation-loop.svg"
                alt=""
                aria-hidden="true"
              />
              <div className="chiprow">
                {agent.tags.map((tag) => (
                  <span key={tag} className="datachip">
                    {tag}
                  </span>
                ))}
              </div>
              {agent.intelligence ? (
                <p className="small">
                  {copy.home.agents.bestFit}: {agent.intelligence.idealFor[0]}
                </p>
              ) : null}
              <Link href={`/providers/${agent.provider.slug}`} className="cardlink">
                {copy.home.agents.providerAction}
              </Link>
              <Link href={`/agents/${agent.slug}`} className="cardlink">
                {copy.home.agents.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.comparison.eyebrow}</p>
          <h2>{copy.home.comparison.title}</h2>
          <p className="lede small">{copy.home.comparison.lede}</p>
        </div>
        <div className="comparisonlist">
          {comparisonRows.map(({ agent, primaryCapability }) => (
            <article key={agent.id} className="comparisonrow">
              <div className="comparison-main">
                <h3>{agent.name}</h3>
                <p>{agent.intelligence?.differentiators[0] ?? agent.summary}</p>
              </div>
              <div className="comparison-metric">
                <span className="microeyebrow">{copy.home.comparison.primaryEdge}</span>
                <strong>
                  {primaryCapability
                    ? `${humanizeToken(primaryCapability.label, locale)} / ${primaryCapability.score}`
                    : copy.home.comparison.fallback}
                </strong>
              </div>
              <div className="comparison-metric">
                <span className="microeyebrow">{copy.home.comparison.firstMove}</span>
                <strong>{agent.intelligence?.exampleTasks[0] ?? copy.home.comparison.fallback}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.workstream.eyebrow}</p>
          <h2>{copy.home.workstream.title}</h2>
          <p className="lede small">{copy.home.workstream.lede}</p>
        </div>
        <div className="surface-grid surface-grid-two">
          <section className="stackpanel">
            <div className="stackpanel-head">
              <h3>{copy.home.workstream.requestsTitle}</h3>
              <Link href="/queue" className="cardlink">
                {copy.home.workstream.requestsAction}
              </Link>
            </div>
            <div className="timeline">
              {requests.length === 0 ? (
                <p>{copy.home.workstream.noRequests}</p>
              ) : (
                requests.slice(0, 4).map((request) => (
                  <article key={request.id} className="timelineitem">
                    <div className="timelinehead">
                      <p className="tagline">{request.agent.name}</p>
                      <span className={`statuspill ${toneClass(request.status)}`}>
                        {humanizeToken(request.status, locale)}
                      </span>
                    </div>
                    <p className="tagline">
                      {copy.queue.builderBy} / {request.agent.provider.name}
                    </p>
                    <p>{request.title}</p>
                    <p className="timestamp">{formatTimestamp(request.createdAt, locale)}</p>
                    <Link href={`/requests/${request.id}`} className="cardlink">
                      {copy.home.workstream.requestAction}
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="stackpanel">
            <div className="stackpanel-head">
              <h3>{copy.home.workstream.reviewTitle}</h3>
              <span className="microeyebrow">{copy.home.workstream.reviewLane}</span>
            </div>
            <div className="timeline">
              {reviewQueue.length === 0 ? (
                <p>{copy.home.workstream.noReview}</p>
              ) : (
                reviewQueue.slice(0, 4).map((run) => (
                  <article key={run.id} className="timelineitem">
                    <div className="timelinehead">
                      <p className="tagline">{run.agent.name}</p>
                      <span className={`statuspill ${toneClass(run.status)}`}>
                        {humanizeToken(run.status, locale)}
                      </span>
                    </div>
                    <p className="tagline">
                      {copy.queue.builderBy} / {run.agent.provider.name}
                    </p>
                    <p>{run.taskTitle}</p>
                    <p>{run.resultSummary || copy.home.workstream.noSummary}</p>
                    <p className="timestamp">{formatTimestamp(run.updatedAt, locale)}</p>
                    <Link href={`/runs/${run.id}`} className="cardlink">
                      {copy.home.workstream.reviewAction}
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
