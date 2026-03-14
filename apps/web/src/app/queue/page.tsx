import Link from "next/link";
import { getTaskRequests, getTaskRuns } from "../../lib/api";
import { formatTimestamp, titleizeToken, toneClass } from "../../lib/presenters";

type QueuePageProps = {
  searchParams?: Promise<{
    status?: "submitted" | "running" | "completed" | "failed";
    reviewState?: "pending" | "reviewed";
    agentSlug?: string;
    sort?: "newest" | "oldest" | "review-priority";
  }>;
};

export default async function QueuePage({ searchParams }: QueuePageProps) {
  const filters = (await searchParams) ?? {};
  const requests = await getTaskRequests();
  const runs = await getTaskRuns(filters);
  const filterItems = [
    {
      href: "/queue",
      label: "all",
      active:
        !filters.status && !filters.reviewState && !filters.agentSlug && !filters.sort
    },
    {
      href: "/queue?status=running",
      label: "running",
      active: filters.status === "running"
    },
    {
      href: "/queue?status=completed",
      label: "completed",
      active: filters.status === "completed"
    },
    {
      href: "/queue?reviewState=pending",
      label: "awaiting review",
      active: filters.reviewState === "pending"
    },
    {
      href: "/queue?agentSlug=athena",
      label: "athena",
      active: filters.agentSlug === "athena"
    },
    {
      href: "/queue?sort=review-priority",
      label: "review priority",
      active: filters.sort === "review-priority"
    }
  ];

  const activeRuns = runs.filter(
    (run) => run.status === "submitted" || run.status === "running"
  );
  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  );

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Operator Queue</p>
          <h1>Execution visibility with live routing pressure.</h1>
          <p className="lede">
            A single operator-facing surface for active requests, execution traces, and
            review-ready work.
          </p>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              Back to catalog
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">Queue telemetry</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{activeRuns.length}</strong>
              <span>active runs</span>
            </div>
            <div className="stat">
              <strong>{reviewQueue.length}</strong>
              <span>awaiting review</span>
            </div>
            <div className="stat">
              <strong>{requests.length}</strong>
              <span>requests tracked</span>
            </div>
            <div className="stat">
              <strong>{runs.length}</strong>
              <span>visible runs</span>
            </div>
          </div>
          <article className="signalitem">
            <span>active filter</span>
            <strong>
              {filterItems.find((item) => item.active)?.label ?? "all"}
            </strong>
          </article>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Views</p>
          <h2>Queue filters</h2>
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
          <p className="eyebrow">Priority Lane</p>
          <h2>Review queue</h2>
        </div>
        <div className="timeline">
          {reviewQueue.length === 0 ? (
            <p>No runs are currently waiting for review.</p>
          ) : (
            reviewQueue.map((run) => (
              <article key={run.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{run.agent.name}</p>
                  <span className={`statuspill ${toneClass(run.status)}`}>
                    {titleizeToken(run.status)}
                  </span>
                </div>
                <p>{run.taskTitle}</p>
                <p>{run.resultSummary || "No result summary yet."}</p>
                <p className="timestamp">{formatTimestamp(run.updatedAt)}</p>
                <Link href={`/runs/${run.id}`} className="cardlink">
                  Review run
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Live Threads</p>
          <h2>Active runs</h2>
        </div>
        <div className="timeline">
          {activeRuns.length === 0 ? (
            <p>No active runs right now.</p>
          ) : (
            activeRuns.map((run) => (
              <article key={run.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{run.agent.name}</p>
                  <span className={`statuspill ${toneClass(run.status)}`}>
                    {titleizeToken(run.status)}
                  </span>
                </div>
                <p>{run.taskTitle}</p>
                <p>{run.latestMessage || "No latest message yet."}</p>
                <p className="timestamp">{formatTimestamp(run.updatedAt)}</p>
                <Link href={`/runs/${run.id}`} className="cardlink">
                  Open run record
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Demand</p>
          <h2>Recent requests</h2>
        </div>
        <div className="timeline">
          {requests.length === 0 ? (
            <p>No requests have been captured yet.</p>
          ) : (
            requests.slice(0, 10).map((request) => (
              <article key={request.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{request.agent.name}</p>
                  <span className={`statuspill ${toneClass(request.status)}`}>
                    {titleizeToken(request.status)}
                  </span>
                </div>
                <p>{request.title}</p>
                <p className="timestamp">{formatTimestamp(request.createdAt)}</p>
                <Link href={`/requests/${request.id}`} className="cardlink">
                  Open task request
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
