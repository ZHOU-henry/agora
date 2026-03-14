import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getDemandBoard, getEngagements, getTaskRequests } from "../../lib/api";
import { localizeAgent, localizeProvider } from "../../lib/catalog-copy";
import {
  getEngagementHealth,
  summarizeCustomerPortfolio
} from "../../lib/engagement-intelligence";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function CustomerPage() {
  const locale = await getLocale();
  const demand = (await getDemandBoard()).map((item) => ({
    ...item,
    agent: localizeAgent(item.agent, locale)
  }));
  const requests = (await getTaskRequests()).map((item) => ({
    ...item,
    agent: localizeAgent(item.agent, locale),
    responses: item.responses.map((response) => ({
      ...response,
      provider: localizeProvider(response.provider, locale)
    }))
  }));
  const engagements = (await getEngagements()).map((item) => ({
    ...item,
    provider: localizeProvider(item.provider, locale)
  }));
  const portfolio = summarizeCustomerPortfolio(engagements);
  const openDemand = demand.filter((item) => item.responseCount === 0);
  const deliveredEngagements = engagements.filter(
    (item) => item.status === "delivered"
  );
  const expansionReady = engagements.filter(
    (item) => getEngagementHealth(item) === "expansion"
  );
  const attentionNeeded = engagements.filter(
    (item) => getEngagementHealth(item) === "blocked"
  );
  const responseActivity = requests
    .filter((item) => item.responses.length > 0)
    .sort((a, b) => {
      const aLatest = a.responses[0]?.updatedAt ?? a.updatedAt;
      const bLatest = b.responses[0]?.updatedAt ?? b.updatedAt;
      return new Date(bLatest).getTime() - new Date(aLatest).getTime();
    });

  const t =
    locale === "zh"
      ? {
          eyebrow: "客户侧",
          title: "面向客户的 Agent 需求与交付入口。",
          lede: "客户最关心三件事：能不能发需求、有没有开发者响应、交付有没有真正推进。",
          primary: "发布需求",
          secondary: "查看已承接项目",
          focusEyebrow: "客户工作流",
          focusTitle: "客户先要看到真实的现场部署效果，而不是平台内部结构",
          demandTitle: "可发布 / 可浏览的需求",
          responseTitle: "开发者响应回流",
          demandEmpty: "当前没有公开需求。",
          responseEmpty: "当前还没有需求收到开发者响应。",
          engagementTitle: "已进入正式承接的项目",
          engagementEmpty: "当前还没有正式承接项目。",
          actionDemand: "查看需求",
          actionResponse: "查看响应",
          actionEngagement: "查看承接"
        }
      : {
          eyebrow: "Customer Side",
          title: "The demand and delivery entry point for customers.",
          lede: "Customers care about three things first: can they publish demand, are builders responding, and is delivery actually advancing?",
          primary: "Open demand board",
          secondary: "See engagements",
          focusEyebrow: "Customer workflow",
          focusTitle: "Customers should see real deployment scenes before they see internal platform structure",
          demandTitle: "Visible demand opportunities",
          responseTitle: "Builder response activity",
          demandEmpty: "No public demand items are visible right now.",
          responseEmpty: "No demand has received builder responses yet.",
          engagementTitle: "Projects already in formal engagement",
          engagementEmpty: "No formal engagements exist yet.",
          actionDemand: "Inspect demand",
          actionResponse: "Inspect responses",
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
            <Link href="/demand#publish-demand" className="actionlink actionlink-primary">
              {t.primary}
            </Link>
            <Link href="/engagements" className="actionlink">
              {t.secondary}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">
            {locale === "zh" ? "客户优先级" : "Customer priorities"}
          </p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{demand.length}</strong>
              <span>{locale === "zh" ? "公开需求" : "demand"}</span>
            </div>
            <div className="stat">
              <strong>{responseActivity.length}</strong>
              <span>{locale === "zh" ? "有响应需求" : "with responses"}</span>
            </div>
            <div className="stat">
              <strong>{engagements.length}</strong>
              <span>{locale === "zh" ? "正式承接" : "engagements"}</span>
            </div>
            <div className="stat">
              <strong>{deliveredEngagements.length}</strong>
              <span>{locale === "zh" ? "已交付" : "delivered"}</span>
            </div>
          </div>
          <div className="signalstack">
            <article className="signalitem">
              <span>{locale === "zh" ? "待响应需求" : "Waiting for response"}</span>
              <strong>{openDemand.length}</strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "最新进展" : "Latest movement"}</span>
              <strong>
                {responseActivity[0]?.responses[0]?.provider.name ??
                  (locale === "zh" ? "暂无动态" : "No activity")}
              </strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "待确认交付" : "Pending confirmation"}</span>
              <strong>{portfolio.confirmationPending}</strong>
            </article>
            <article className="signalitem">
              <span>{locale === "zh" ? "现场问题" : "Field issues"}</span>
              <strong>{portfolio.openIncidents}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "Customer Operating System" : "Customer Operating System"}
          </p>
          <h2>
            {locale === "zh"
              ? "2.0 版本把客户侧从“看响应”升级成“管部署结果”"
              : "2.0 moves the customer side from watching responses to operating deployment outcomes"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "确认队列" : "Confirmation queue"}</h3>
            <p>
              {locale === "zh"
                ? `当前有 ${portfolio.confirmationPending} 个交付对象等待客户正式确认。`
                : `${portfolio.confirmationPending} delivery objects are waiting for formal customer confirmation.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "问题回传" : "Issue return"}</h3>
            <p>
              {locale === "zh"
                ? `当前共有 ${portfolio.openIncidents} 个现场 incident 仍在处理中。`
                : `${portfolio.openIncidents} field incidents are still open across the customer portfolio.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "扩展信号" : "Expansion signals"}</h3>
            <p>
              {locale === "zh"
                ? `${portfolio.expansionSignals} 个 engagement 已经从试点走向潜在扩展。`
                : `${portfolio.expansionSignals} engagements already show a credible path from pilot to expansion.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "已接受交付" : "Accepted delivery"}</h3>
            <p>
              {locale === "zh"
                ? `${portfolio.accepted} 个 engagement 已经获得客户确认。`
                : `${portfolio.accepted} engagements have already been formally accepted by the customer.`}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "客户行动框架" : "Customer operating frame"}
          </p>
          <h2>
            {locale === "zh"
              ? "客户在 Agora 里主要做三件事"
              : "Customers do three main things in Agora"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "发布需求" : "Publish demand"}</h3>
            <p>
              {locale === "zh"
                ? "把问题、行业、试点边界写清楚，让供给侧知道这是不是值得响应的机会。"
                : "State the problem, industry, and pilot boundary clearly so builders can judge whether the opportunity is worth pursuing."}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "观察响应" : "Watch responses"}</h3>
            <p>
              {locale === "zh"
                ? "比较哪些开发者真正理解你的场景，并给出可信的交付方式。"
                : "Compare which builders actually understand the scene and offer a credible delivery approach."}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "跟踪交付" : "Track delivery"}</h3>
            <p>
              {locale === "zh"
                ? "一旦进入正式承接，就盯里程碑、交付物和审核记录，而不是只看口头承诺。"
                : "Once work enters engagement, follow milestones, deliverables, and review records instead of relying on verbal promises."}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.focusEyebrow}</p>
          <h2>{t.focusTitle}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/industrial-quality-cell-flow.gif"
            alt="Animated industrial quality-inspection cell with robot arm, camera input, defect scoring, and rejection flow."
            kicker={locale === "zh" ? "客户主场景" : "Customer hero"}
            title={
              locale === "zh"
                ? "客户看到的是一条真实的工厂质检闭环"
                : "The customer sees a real factory inspection loop"
            }
            caption={
              locale === "zh"
                ? "相机抓取来料图像，Vision Agent 判断缺陷，机械臂完成分拣，QA 控制台留下可追溯记录。这才是客户真正要买的东西。"
                : "Camera input, defect scoring, robot rejection, and QA traceability are the concrete deployment loop a customer is actually buying."
            }
            mode="gif"
          />
          <MediaCard
            src="/media/industrial-quality-cell-still.png"
            alt="Static still of the industrial quality cell showing camera, conveyor, robot arm, and ok/reject bins."
            kicker={locale === "zh" ? "行业场景" : "Industry scene"}
            title={
              locale === "zh"
                ? "传统行业客户先看自己的工位、产线和质检节拍"
                : "Traditional industry buyers need to see their own station, line, and inspection cadence first"
            }
            caption={
              locale === "zh"
                ? "客户不会先被“Agent Marketplace”打动，而会先被“这能不能真部署到我产线里”打动。"
                : "A buyer is moved less by the phrase 'agent marketplace' and more by whether the system can really be deployed into their line."
            }
            mode="still"
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "更多行业现场" : "More field deployments"}</p>
          <h2>
            {locale === "zh"
              ? "客户还应该看到更多可落地的传统行业部署方式"
              : "Customers should also see more deployable traditional-industry scenarios"}
          </h2>
        </div>
        <div className="grid media-grid-showcase">
          <MediaCard
            src="/media/warehouse-autopicker-flow.gif"
            alt="Animated warehouse autopicker robot retrieving totes in an aisle and routing them to a pack station."
            kicker={locale === "zh" ? "仓储履约" : "Warehouse fulfillment"}
            title={
              locale === "zh"
                ? "自主拣选机器人在仓库巷道里完成取箱与履约"
                : "Autonomous picking robots retrieve totes directly in the aisle"
            }
            caption={
              locale === "zh"
                ? "这类部署适合展示 Agent 如何把 WMS 任务、机器人动作和打包站闭环连接起来。"
                : "This deployment shows how an agent can connect WMS missions, robot motion, and pack-station closure."
            }
            mode="gif"
            compact
          />
          <MediaCard
            src="/media/maintenance-patrol-flow.gif"
            alt="Animated inspection robot patrol with thermal scan, anomaly detection, and maintenance work-order creation."
            kicker={locale === "zh" ? "巡检维护" : "Inspection and maintenance"}
            title={
              locale === "zh"
                ? "巡检机器人与维护 Agent 联动推进预测性维护"
                : "Inspection robots and maintenance agents drive predictive maintenance"
            }
            caption={
              locale === "zh"
                ? "传统工业客户能更容易理解这种“巡检 -> 异常发现 -> 工单推进”的现场闭环。"
                : "Industrial buyers can grasp this patrol-to-anomaly-to-work-order loop much faster than abstract AI framing."
            }
            mode="gif"
            compact
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "响应" : "Responses"}</p>
          <h2>{t.responseTitle}</h2>
        </div>
        <div className="timeline">
          {responseActivity.length === 0 ? (
            <p>{t.responseEmpty}</p>
          ) : (
            responseActivity.slice(0, 6).map((item) => (
              <article key={item.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{item.title}</p>
                  <span className={`statuspill ${toneClass(item.status)}`}>
                    {humanizeToken(item.status, locale)}
                  </span>
                </div>
                <p>
                  {locale === "zh"
                    ? `当前已收到 ${item.responses.length} 条开发者响应。`
                    : `${item.responses.length} builder responses have arrived.`}
                </p>
                <p className="tagline">
                  {locale === "zh" ? "最新响应方" : "Latest builder"} /{" "}
                  {item.responses[0]?.provider.name ?? "-"}
                </p>
                <p className="timestamp">
                  {formatTimestamp(item.responses[0]?.updatedAt ?? item.updatedAt, locale)}
                </p>
                <Link href={`/requests/${item.id}`} className="cardlink">
                  {t.actionResponse}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "需求" : "Demand"}</p>
          <h2>{t.demandTitle}</h2>
        </div>
        <div className="timeline">
          {demand.length === 0 ? (
            <p>{t.demandEmpty}</p>
          ) : (
            demand.slice(0, 6).map((item) => (
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
                <p className="timestamp">{formatTimestamp(item.createdAt, locale)}</p>
                <Link href={`/requests/${item.id}`} className="cardlink">
                  {t.actionDemand}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "交付" : "Delivery"}</p>
          <h2>{t.engagementTitle}</h2>
        </div>
        <div className="timeline">
          {engagements.length === 0 ? (
            <p>{t.engagementEmpty}</p>
          ) : (
            engagements.slice(0, 6).map((engagement) => (
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
                  {locale === "zh" ? "现场问题" : "Open incidents"} /{" "}
                  {engagement.openIncidentCount}
                </p>
                <Link href={`/engagements/${engagement.id}`} className="cardlink">
                  {t.actionEngagement}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "部署经营信号" : "Deployment operating signals"}</p>
          <h2>
            {locale === "zh"
              ? "客户现在可以直接看见哪些项目稳定、哪些项目需要介入、哪些项目值得扩展"
              : "Customers can now see which projects are stable, which need intervention, and which are ready to expand"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "需要介入" : "Needs intervention"}</h3>
            <p>
              {locale === "zh"
                ? `${attentionNeeded.length} 个 engagement 目前处于阻塞或问题状态。`
                : `${attentionNeeded.length} engagements are currently blocked by field issues or unresolved confirmation.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "值得扩展" : "Ready to expand"}</h3>
            <p>
              {locale === "zh"
                ? `${expansionReady.length} 个 engagement 已经开始显露扩展价值。`
                : `${expansionReady.length} engagements already show evidence that the pilot can expand.`}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
