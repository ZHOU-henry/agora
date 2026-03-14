import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getTaskRequests, getTaskRuns } from "../../lib/api";
import { localizeAgent } from "../../lib/catalog-copy";
import { getCopy } from "../../lib/copy";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

type QueuePageProps = {
  searchParams?: Promise<{
    status?: "submitted" | "running" | "completed" | "failed";
    reviewState?: "pending" | "reviewed";
    agentSlug?: string;
    sort?: "newest" | "oldest" | "review-priority";
  }>;
};

export default async function QueuePage({ searchParams }: QueuePageProps) {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const filters = (await searchParams) ?? {};
  const requests = (await getTaskRequests()).map((request) => ({
    ...request,
    agent: localizeAgent(request.agent, locale)
  }));
  const runs = (await getTaskRuns(filters)).map((run) => ({
    ...run,
    agent: localizeAgent(run.agent, locale)
  }));

  const activeRuns = runs.filter(
    (run) => run.status === "submitted" || run.status === "running"
  );
  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  );

  const filterItems = copy.queue.filters.items.map((item) => ({
    href: item.href,
    label: item.label,
    active:
      item.match === "all"
        ? !filters.status && !filters.reviewState && !filters.agentSlug && !filters.sort
        : item.match === "pending"
          ? filters.reviewState === "pending"
          : item.match === "review-priority"
            ? filters.sort === "review-priority"
            : item.match === "athena"
              ? filters.agentSlug === "athena"
              : filters.status === item.match
  }));

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.queue.eyebrow}</p>
          <h1>{copy.queue.title}</h1>
          <p className="lede">{copy.queue.lede}</p>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              {copy.queue.back}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.queue.telemetry}</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{activeRuns.length}</strong>
              <span>{copy.queue.activeRuns}</span>
            </div>
            <div className="stat">
              <strong>{reviewQueue.length}</strong>
              <span>{copy.queue.pendingReview}</span>
            </div>
            <div className="stat">
              <strong>{requests.length}</strong>
              <span>{copy.queue.requestsTracked}</span>
            </div>
            <div className="stat">
              <strong>{runs.length}</strong>
              <span>{copy.queue.visibleRuns}</span>
            </div>
          </div>
          <article className="signalitem">
            <span>{copy.queue.activeFilter}</span>
            <strong>{filterItems.find((item) => item.active)?.label ?? filterItems[0].label}</strong>
          </article>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.queue.visual.eyebrow}</p>
          <h2>{copy.queue.visual.title}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/execution-reel-loop.svg"
            alt="Animated execution loop."
            kicker={copy.queue.visual.loop.kicker}
            title={copy.queue.visual.loop.title}
            caption={copy.queue.visual.loop.caption}
          />
          <MediaCard
            src="/media/factory-command-loop.svg"
            alt="Animated industrial operator scene."
            kicker={copy.queue.visual.deck.kicker}
            title={copy.queue.visual.deck.title}
            caption={copy.queue.visual.deck.caption}
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.queue.filters.eyebrow}</p>
          <h2>{copy.queue.filters.title}</h2>
        </div>
        <div className="filterrow">
          {filterItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`filterchip ${item.active ? "filterchip-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.queue.review.eyebrow}</p>
          <h2>{copy.queue.review.title}</h2>
        </div>
        <div className="timeline">
          {reviewQueue.length === 0 ? (
            <p>{copy.queue.review.empty}</p>
          ) : (
            reviewQueue.map((run) => (
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
                <p>{run.resultSummary || copy.queue.review.noSummary}</p>
                <p className="timestamp">{formatTimestamp(run.updatedAt, locale)}</p>
                <Link href={`/runs/${run.id}`} className="cardlink">
                  {copy.queue.review.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.queue.active.eyebrow}</p>
          <h2>{copy.queue.active.title}</h2>
        </div>
        <div className="timeline">
          {activeRuns.length === 0 ? (
            <p>{copy.queue.active.empty}</p>
          ) : (
            activeRuns.map((run) => (
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
                <p>{run.latestMessage || copy.queue.active.noMessage}</p>
                <p className="timestamp">{formatTimestamp(run.updatedAt, locale)}</p>
                <Link href={`/runs/${run.id}`} className="cardlink">
                  {copy.queue.active.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.queue.requests.eyebrow}</p>
          <h2>{copy.queue.requests.title}</h2>
        </div>
        <div className="timeline">
          {requests.length === 0 ? (
            <p>{copy.queue.requests.empty}</p>
          ) : (
            requests.slice(0, 10).map((request) => (
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
                  {copy.queue.requests.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
