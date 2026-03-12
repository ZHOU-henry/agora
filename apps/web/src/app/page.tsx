import Link from "next/link";
import { getAgentCatalog, getTaskRequests, getTaskRuns } from "../lib/api";

export default async function HomePage() {
  const agents = await getAgentCatalog();
  const requests = await getTaskRequests();
  const runs = await getTaskRuns();
  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  );

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Agora v0</p>
        <h1>AI Agent Platform</h1>
        <p className="lede">
          A narrow, operator-facing MVP for cataloging agent capabilities,
          routing tasks, and reviewing execution records.
        </p>
      </section>

      <section className="panel">
        <h2>Phase-1 Product Surfaces</h2>
        <ul>
          <li>Agent catalog</li>
          <li>Task intake and routing</li>
          <li>Execution record</li>
          <li>Operator review</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Seed Agent Catalog</h2>
        <div className="grid">
          {agents.map((agent) => (
            <article key={agent.id} className="card">
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <p className="provenance">
                Provenance: {agent.provenanceStatus.replaceAll("_", " ")}
              </p>
              <p className="tagline">{agent.tags.join(" · ")}</p>
              <Link href={`/agents/${agent.slug}`} className="cardlink">
                Inspect and submit task
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Recent Task Requests</h2>
        <div className="timeline">
          {requests.length === 0 ? (
            <p>No task requests have been submitted yet.</p>
          ) : (
            requests.slice(0, 5).map((request) => (
              <article key={request.id} className="timelineitem">
                <p className="tagline">
                  {request.agent.name} · {request.status}
                </p>
                <p>{request.title}</p>
                <Link href={`/requests/${request.id}`} className="cardlink">
                  View task request
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Operator Queue</h2>
        <p className="lede small">
          Track active runs, recent requests, and review-ready work from one operator view.
        </p>
        <Link href="/queue" className="cardlink">
          Open queue
        </Link>
        <div className="stats">
          <div className="stat">
            <strong>{requests.length}</strong>
            <span>task requests</span>
          </div>
          <div className="stat">
            <strong>{runs.length}</strong>
            <span>runs</span>
          </div>
          <div className="stat">
            <strong>{reviewQueue.length}</strong>
            <span>awaiting review</span>
          </div>
        </div>
      </section>
    </main>
  );
}
