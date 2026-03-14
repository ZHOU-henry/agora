import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaCard } from "../../../components/media-card";
import { ReviewDecisionForm } from "../../../components/review-decision-form";
import { ResultPayloadView } from "../../../components/result-payload-view";
import { RunStatusControls } from "../../../components/run-status-controls";
import { getTaskRun } from "../../../lib/api";
import { localizeAgent } from "../../../lib/catalog-copy";
import { getCopy } from "../../../lib/copy";
import { getLocale } from "../../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../../lib/presenters";

type RunDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const { id } = await params;
  const run = await getTaskRun(id);

  if (!run) {
    notFound();
  }

  const localizedAgent = localizeAgent(run.agent, locale);

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.runPage.eyebrow}</p>
          <h1>{run.taskRequest.title}</h1>
          <p className="lede">{run.taskRequest.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(run.status)}`}>
              {humanizeToken(run.status, locale)}
            </span>
            <span className="statuspill tone-neutral">agent / {localizedAgent.name}</span>
            <span className="statuspill tone-neutral">
              {copy.queue.builderBy} / {localizedAgent.provider.name}
            </span>
            <span className="datachip">events / {run.events.length}</span>
          </div>
          <div className="buttonrow">
            <Link href={`/requests/${run.taskRequest.id}`} className="actionlink">
              {copy.runPage.backToRequest}
            </Link>
            <Link href={`/providers/${localizedAgent.provider.slug}`} className="actionlink">
              {copy.runPage.inspectBuilder}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.runPage.telemetry}</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>{copy.runPage.created}</span>
              <strong>{formatTimestamp(run.createdAt, locale)}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.runPage.lastUpdate}</span>
              <strong>{formatTimestamp(run.updatedAt, locale)}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.runPage.reviewState}</span>
              <strong>
                {run.reviewDecision
                  ? humanizeToken(run.reviewDecision.verdict, locale)
                  : copy.runPage.reviewPending}
              </strong>
            </article>
            <article className="signalitem">
              <span>{copy.runPage.builderType}</span>
              <strong>{humanizeToken(localizedAgent.provider.type, locale)}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.runPage.visual.eyebrow}</p>
          <h2>{copy.runPage.visual.title}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/execution-reel-loop.svg"
            alt="Animated execution reel."
            kicker={copy.runPage.visual.reel.kicker}
            title={copy.runPage.visual.reel.title}
            caption={copy.runPage.visual.reel.caption}
          />
          <MediaCard
            src="/media/agent-constellation-loop.svg"
            alt="Animated agent constellation."
            kicker={copy.runPage.visual.lane.kicker}
            title={copy.runPage.visual.lane.title}
            caption={copy.runPage.visual.lane.caption}
          />
        </div>
      </section>

      <div className="surface-grid surface-grid-two">
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{copy.runPage.builder.eyebrow}</p>
            <h2>{copy.runPage.builder.title}</h2>
          </div>
          <p className="tagline">{localizedAgent.provider.name}</p>
          <p>{localizedAgent.provider.summary}</p>
          <Link href={`/providers/${localizedAgent.provider.slug}`} className="cardlink">
            {copy.runPage.builder.open}
          </Link>
        </section>

        <RunStatusControls initialRun={run} locale={locale} copy={copy.runControls} />
        <ReviewDecisionForm initialRun={run} locale={locale} copy={copy.reviewForm} />
      </div>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.runPage.outcome.eyebrow}</p>
          <h2>{copy.runPage.outcome.title}</h2>
        </div>
        <p>{run.resultSummary || copy.runPage.outcome.empty}</p>
        <ResultPayloadView
          payload={run.resultPayload}
          locale={locale}
          emptyLabel={copy.runPage.outcome.empty}
        />
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.runPage.trace.eyebrow}</p>
          <h2>{copy.runPage.trace.title}</h2>
        </div>
        <div className="timeline">
          {run.events.map((event) => (
            <article key={event.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{humanizeToken(event.eventType, locale)}</p>
                <span className="statuspill tone-neutral">
                  {humanizeToken("event", locale)}
                </span>
              </div>
              <p>{event.message}</p>
              <p className="timestamp">{formatTimestamp(event.createdAt, locale)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.runPage.provenance.eyebrow}</p>
          <h2>{copy.runPage.provenance.title}</h2>
        </div>
        <p className="tagline">{humanizeToken(localizedAgent.provenanceStatus, locale)}</p>
        <p>{localizedAgent.provenanceSummary}</p>
      </section>
    </main>
  );
}
