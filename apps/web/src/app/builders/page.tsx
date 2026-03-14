import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getDemandBoard, getEngagements, getProviderCatalog } from "../../lib/api";
import { localizeAgent, localizeProvider } from "../../lib/catalog-copy";
import {
  getEngagementHealth,
  summarizeCustomerPortfolio
} from "../../lib/engagement-intelligence";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function BuildersPage() {
  const locale = await getLocale();
  const providers = (await getProviderCatalog()).map((provider) =>
    localizeProvider(provider, locale)
  );
  const demand = (await getDemandBoard()).map((item) => ({
    ...item,
    agent: localizeAgent(item.agent, locale)
  }));
  const engagements = (await getEngagements()).map((item) => ({
    ...item,
    provider: localizeProvider(item.provider, locale)
  }));
  const deliverySignals = summarizeCustomerPortfolio(engagements);
  const openOpportunities = demand.filter((item) => item.responseCount === 0);
  const engagedProviders = new Set(engagements.map((item) => item.provider.id)).size;
  const blockedEngagements = engagements.filter(
    (item) => getEngagementHealth(item) === "blocked"
  );
  const expansionSignals = engagements.filter(
    (item) => item.customerConfirmationStatus === "expansion_requested"
  );

  const t =
    locale === "zh"
      ? {
          eyebrow: "供给侧",
          title: "开发者侧的供给管理与机会入口。",
          lede: "供给侧最关心的是：有哪些需求值得追、我的供给如何展示、平台如何让客户看到我的价值。",
          primary: "查看开发者目录",
          secondary: "查看需求板",
          supplyTitle: "当前供给方",
          demandTitle: "值得响应的需求机会",
          engagementTitle: "已经进入正式承接的项目",
          actionProvider: "查看档案",
          actionDemand: "响应需求",
          actionEngagement: "查看承接",
          visualTitle: "供给方需要同时看见现场部署场景和交付结构"
        }
      : {
          eyebrow: "Builder Side",
          title: "The supply-management and opportunity entry point for builders.",
          lede: "Builders care about what demand is worth pursuing, how their supply is presented, and how the platform makes their value legible to customers.",
          primary: "Open builder directory",
          secondary: "Open demand board",
          supplyTitle: "Current builders",
          demandTitle: "Demand opportunities worth pursuing",
          engagementTitle: "Accepted work already in delivery",
          actionProvider: "Open profile",
          actionDemand: "Respond to demand",
          actionEngagement: "Open engagement",
          visualTitle: "Builders need to see both the on-site scene and the deployment stack"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lede">{t.lede}</p>
          <div className="buttonrow">
            <Link href="/providers" className="actionlink actionlink-primary">
              {t.primary}
            </Link>
            <Link href="/demand" className="actionlink">
              {t.secondary}
            </Link>
            <Link href="/builders/studio" className="actionlink">
              {locale === "zh" ? "进入 Builder Studio" : "Open Builder Studio"}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">
            {locale === "zh" ? "Builder 优先级" : "Builder priorities"}
          </p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{demand.length}</strong>
              <span>{locale === "zh" ? "公开机会" : "opportunities"}</span>
            </div>
            <div className="stat">
              <strong>{openOpportunities.length}</strong>
              <span>{locale === "zh" ? "待追需求" : "fresh demand"}</span>
            </div>
            <div className="stat">
              <strong>{engagements.length}</strong>
              <span>{locale === "zh" ? "已承接项目" : "engagements"}</span>
            </div>
            <div className="stat">
              <strong>{engagedProviders}</strong>
              <span>{locale === "zh" ? "在交付 Builder" : "active builders"}</span>
            </div>
          </div>
          <div className="signalstack">
            <article className="signalitem">
              <span>{locale === "zh" ? "首要动作" : "First move"}</span>
              <strong>
                {openOpportunities[0]?.title ??
                  (locale === "zh" ? "先完善供给档案" : "Strengthen supply profile first")}
              </strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "市场姿态" : "Market posture"}</span>
              <strong>
                {locale === "zh"
                  ? "机会评估 + 承接推进"
                  : "Opportunity evaluation + delivery follow-through"}
              </strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "交付阻塞" : "Delivery blockers"}</span>
              <strong>{blockedEngagements.length}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "Builder Operating System" : "Builder Operating System"}
          </p>
          <h2>
            {locale === "zh"
              ? "2.0 版本把 Builder 从“提交响应者”升级成“持续交付经营者”"
              : "2.0 moves the builder from a responder to an ongoing delivery operator"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "活跃交付" : "Active delivery"}</h3>
            <p>
              {locale === "zh"
                ? `${engagements.filter((item) => item.status !== "delivered").length} 个 engagement 仍在推进中。`
                : `${engagements.filter((item) => item.status !== "delivered").length} engagements are still moving through delivery.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "现场问题" : "Field issues"}</h3>
            <p>
              {locale === "zh"
                ? `平台当前有 ${deliverySignals.openIncidents} 个开放 incident 会影响 Builder 交付节奏。`
                : `${deliverySignals.openIncidents} open incidents currently shape builder delivery workload across the platform.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "扩展机会" : "Expansion opportunities"}</h3>
            <p>
              {locale === "zh"
                ? `${expansionSignals.length} 个交付对象已经显示出二期或扩线机会。`
                : `${expansionSignals.length} delivery objects already signal credible expansion or scale-out work.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "阻塞关注" : "Attention required"}</h3>
            <p>
              {locale === "zh"
                ? `${blockedEngagements.length} 个 engagement 需要 Builder 主动处理反馈或 incident。`
                : `${blockedEngagements.length} engagements currently need the builder to resolve field feedback or incident pressure.`}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "Builder 行动框架" : "Builder operating frame"}
          </p>
          <h2>
            {locale === "zh"
              ? "供给侧在 Agora 里主要做三件事"
              : "Builders do three main things in Agora"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "展示供给" : "Present supply"}</h3>
            <p>
              {locale === "zh"
                ? "把 Builder 档案、Agent 供给和行业定位放到客户能读懂的形态里。"
                : "Turn the builder profile, agent supply, and industry posture into something buyers can actually read."}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "选择机会" : "Choose opportunities"}</h3>
            <p>
              {locale === "zh"
                ? "看哪些需求值得追，哪些需求已经过热，哪些需求更适合你当前供给。"
                : "Judge which demand is worth chasing, which is overheated, and which best matches your current supply."}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "推进承接" : "Advance engagements"}</h3>
            <p>
              {locale === "zh"
                ? "一旦承接成立，就把它推进成真实项目空间，而不是停在 proposal 阶段。"
                : "Once work is accepted, move it into a real project workspace instead of leaving it as a proposal artifact."}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "部署场景" : "Deployment scenes"}</p>
          <h2>{t.visualTitle}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/industrial-quality-cell-flow.gif"
            alt="Animated industrial quality-inspection deployment with camera input and robot-arm reject handling."
            kicker={locale === "zh" ? "供给侧" : "Supply side"}
            title={
              locale === "zh"
                ? "Builder 交付的是部署到现场的系统，而不只是一个 Agent 页面"
                : "A builder ships a field deployment system, not just an agent profile"
            }
            caption={
              locale === "zh"
                ? "这张 GIF 让开发者看到自己最终要部署的是相机、机械臂、边缘推理和质检闭环，不是单独的聊天能力。"
                : "This GIF keeps the builder focused on what actually gets deployed: camera input, robot action, edge inference, and inspection traceability."
            }
            mode="gif"
          />
          <MediaCard
            src="/media/industrial-quality-builder-stack.png"
            alt="Static builder-side deployment stack showing site inputs, agent core, factory outputs, and buyer value."
            kicker={locale === "zh" ? "行业供给" : "Industry supply"}
            title={
              locale === "zh"
                ? "垂直场景 Builder 真正售卖的是一整套部署栈"
                : "Vertical builders actually sell a deployment stack"
            }
            caption={
              locale === "zh"
                ? "输入源、策略层、执行输出和客户 ROI 叙事，才是 Builder 面向工业客户要交付的完整对象。"
                : "Inputs, policy, execution outputs, and ROI narrative are the full object an industrial builder delivers to a buyer."
            }
            mode="still"
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "更多垂直场景" : "More vertical scenes"}</p>
          <h2>
            {locale === "zh"
              ? "Builder 需要看清不同行业部署对象的真实结构"
              : "Builders need to see the real structure of different deployment targets"}
          </h2>
        </div>
        <div className="grid media-grid-showcase">
          <MediaCard
            src="/media/warehouse-autopicker-map.png"
            alt="Static map of a warehouse autopicker deployment with WMS missioning, aisle robot, and pack station."
            kicker={locale === "zh" ? "仓储部署图" : "Warehouse deployment"}
            title={
              locale === "zh"
                ? "仓储 Builder 面向客户交付的是任务系统、巷道机器人和履约闭环"
                : "Warehouse builders ship missioning, aisle robotics, and fulfillment closure"
            }
            caption={
              locale === "zh"
                ? "这类图帮助 Builder 把“仓储 Agent”讲成一套真实部署对象，而不是一个抽象能力点。"
                : "This helps a builder explain a warehouse agent as a real deployment object instead of an abstract capability bullet."
            }
            mode="still"
            compact
          />
          <MediaCard
            src="/media/maintenance-agent-stack.png"
            alt="Static maintenance agent deployment stack showing inspection robot inputs, maintenance reasoning, and plant actions."
            kicker={locale === "zh" ? "维护部署栈" : "Maintenance deployment"}
            title={
              locale === "zh"
                ? "维护类 Builder 真正售卖的是巡检、异常判断和工单闭环能力"
                : "Maintenance builders actually sell patrol, anomaly reasoning, and work-order closure"
            }
            caption={
              locale === "zh"
                ? "输入、判断、现场动作和买方价值被放在一起，Builder 才更像在交付工业系统。"
                : "Once inputs, reasoning, plant actions, and buyer value sit in one frame, the builder looks like a real industrial-system supplier."
            }
            mode="still"
            compact
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "机会板" : "Opportunity board"}</p>
          <h2>{t.demandTitle}</h2>
        </div>
        <div className="timeline">
          {demand.slice(0, 6).map((item) => (
            <article key={item.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{item.title}</p>
                <span className={`statuspill ${toneClass(item.status)}`}>
                  {humanizeToken(item.status, locale)}
                </span>
              </div>
              <p>{item.description}</p>
              <p className="tagline">
                {locale === "zh" ? "推荐 Agent" : "Recommended agent"} / {item.agent.name}
              </p>
              <p className="tagline">
                {locale === "zh" ? "响应数" : "Responses"} / {item.responseCount}
              </p>
              <p className="timestamp">{formatTimestamp(item.createdAt, locale)}</p>
              <Link href={`/requests/${item.id}`} className="cardlink">
                {t.actionDemand}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "已承接" : "In delivery"}</p>
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
              <Link href={`/engagements/${engagement.id}`} className="cardlink">
                {t.actionEngagement}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "开发者档案" : "Builder profiles"}</p>
          <h2>{t.supplyTitle}</h2>
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
              <Link href={`/providers/${provider.slug}`} className="cardlink">
                {t.actionProvider}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
