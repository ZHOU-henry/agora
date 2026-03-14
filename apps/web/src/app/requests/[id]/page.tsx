import Link from "next/link";
import { notFound } from "next/navigation";
import { BuilderResponseForm } from "../../../components/builder-response-form";
import { MediaCard } from "../../../components/media-card";
import { getProviderCatalog, getTaskRequest } from "../../../lib/api";
import { localizeAgent, localizeProvider } from "../../../lib/catalog-copy";
import { getCopy } from "../../../lib/copy";
import { getLocale } from "../../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../../lib/presenters";

type TaskRequestPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskRequestPage({ params }: TaskRequestPageProps) {
  const locale = await getLocale();
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
    }))
  };
  const responseCopy =
    locale === "zh"
      ? {
          eyebrow: "开发者响应",
          title: "对这条需求给出承接方案",
          empty: "目前还没有开发者对这条需求做出公开响应。",
          industry: "行业",
          requester: "客户"
        }
      : {
          eyebrow: "Builder Responses",
          title: "How builders are responding to this demand",
          empty: "No visible builder responses for this demand yet.",
          industry: "Industry",
          requester: "Customer"
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
            <span className="datachip">{formatTimestamp(taskRequest.createdAt, locale)}</span>
          </div>
          <div className="buttonrow">
            <Link href={`/agents/${localizedAgent.slug}`} className="actionlink">
              {copy.requestPage.backToAgent}
            </Link>
            <Link
              href={`/providers/${localizedAgent.provider.slug}`}
              className="actionlink"
            >
              {copy.requestPage.inspectBuilder}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.requestPage.state}</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>{copy.requestPage.runRecords}</span>
              <strong>{taskRequest.runs.length}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.requestPage.lastUpdate}</span>
              <strong>{formatTimestamp(taskRequest.updatedAt, locale)}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.requestPage.provenance}</span>
              <strong>{humanizeToken(localizedAgent.provenanceStatus, locale)}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.requestPage.builderType}</span>
              <strong>{humanizeToken(localizedAgent.provider.type, locale)}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.requestPage.visual.eyebrow}</p>
          <h2>{copy.requestPage.visual.title}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/control-theater-loop.svg"
            alt="Animated control theater for request flow."
            kicker={copy.requestPage.visual.request.kicker}
            title={copy.requestPage.visual.request.title}
            caption={copy.requestPage.visual.request.caption}
          />
          <MediaCard
            src="/media/builder-network-loop.svg"
            alt="Animated builder network for demand-to-supply context."
            kicker={copy.requestPage.visual.market.kicker}
            title={copy.requestPage.visual.market.title}
            caption={copy.requestPage.visual.market.caption}
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
          {taskRequest.runs.map((run) => (
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
          ))}
        </div>
      </section>

      <div className="surface-grid surface-grid-two">
        <BuilderResponseForm
          initialRequest={localizedRequest}
          providers={localizedProviders}
          locale={locale}
        />

        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{responseCopy.eyebrow}</p>
            <h2>{responseCopy.title}</h2>
          </div>
          <div className="timeline">
            {localizedRequest.responses.length === 0 ? (
              <p>{responseCopy.empty}</p>
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
                    {responseCopy.industry} / {taskRequest.industry || "-"} /{" "}
                    {responseCopy.requester} / {taskRequest.requesterOrg || "-"}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
