import Link from "next/link";
import { getTaskRequests, getTaskRuns } from "../../lib/api";

export default async function QueuePage() {
  const requests = await getTaskRequests();
  const runs = await getTaskRuns();

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
      <section className="hero">
        <p className="eyebrow">Operator Queue</p>
        <h1>Execution visibility</h1>
        <p className="lede">
          A single operator-facing view for active requests, runs, and review-ready work.
        </p>
        <Link href="/" className="backlink">
          Back to catalog
        </Link>
      </section>

      <section className="panel">
        <h2>Review Queue</h2>
        <div className="timeline">
          {reviewQueue.length === 0 ? (
            <p>No runs are currently waiting for review.</p>
          ) : (
            reviewQueue.map((run) => (
              <article key={run.id} className="timelineitem">
                <p className="tagline">
                  {run.agent.name} · {run.status}
                </p>
                <p>{run.taskTitle}</p>
                <Link href={`/runs/${run.id}`} className="cardlink">
                  Review run
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Active Runs</h2>
        <div className="timeline">
          {activeRuns.length === 0 ? (
            <p>No active runs right now.</p>
          ) : (
            activeRuns.map((run) => (
              <article key={run.id} className="timelineitem">
                <p className="tagline">
                  {run.agent.name} · {run.status}
                </p>
                <p>{run.taskTitle}</p>
                <p>{run.latestMessage || "No latest message yet."}</p>
                <Link href={`/runs/${run.id}`} className="cardlink">
                  Open run record
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Recent Requests</h2>
        <div className="timeline">
          {requests.slice(0, 10).map((request) => (
            <article key={request.id} className="timelineitem">
              <p className="tagline">
                {request.agent.name} · {request.status}
              </p>
              <p>{request.title}</p>
              <Link href={`/requests/${request.id}`} className="cardlink">
                Open task request
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
