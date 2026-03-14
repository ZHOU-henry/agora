import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewDecisionForm } from "../../../components/review-decision-form";
import { ResultPayloadView } from "../../../components/result-payload-view";
import { RunStatusControls } from "../../../components/run-status-controls";
import { getTaskRun } from "../../../lib/api";
import { formatTimestamp, humanizeToken, titleizeToken, toneClass } from "../../../lib/presenters";

type RunDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const { id } = await params;
  const run = await getTaskRun(id);

  if (!run) {
    notFound();
  }

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Run Record</p>
          <h1>{run.taskRequest.title}</h1>
          <p className="lede">{run.taskRequest.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(run.status)}`}>
              {titleizeToken(run.status)}
            </span>
            <span className="statuspill tone-neutral">agent / {run.agent.name}</span>
            <span className="datachip">events / {run.events.length}</span>
          </div>
          <div className="buttonrow">
            <Link href={`/requests/${run.taskRequest.id}`} className="actionlink">
              Back to task request
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">Run telemetry</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>created</span>
              <strong>{formatTimestamp(run.createdAt)}</strong>
            </article>
            <article className="signalitem">
              <span>last update</span>
              <strong>{formatTimestamp(run.updatedAt)}</strong>
            </article>
            <article className="signalitem">
              <span>review state</span>
              <strong>
                {run.reviewDecision
                  ? titleizeToken(run.reviewDecision.verdict)
                  : "Pending"}
              </strong>
            </article>
          </div>
        </aside>
      </section>

      <div className="surface-grid surface-grid-two">
        <RunStatusControls initialRun={run} />
        <ReviewDecisionForm initialRun={run} />
      </div>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Outcome</p>
          <h2>Execution result</h2>
        </div>
        <p>{run.resultSummary || "No result summary recorded yet."}</p>
        <ResultPayloadView payload={run.resultPayload} />
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Trace</p>
          <h2>Execution timeline</h2>
        </div>
        <div className="timeline">
          {run.events.map((event) => (
            <article key={event.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{humanizeToken(event.eventType)}</p>
                <span className="statuspill tone-neutral">event</span>
              </div>
              <p>{event.message}</p>
              <p className="timestamp">{formatTimestamp(event.createdAt)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Provenance</p>
          <h2>Agent provenance</h2>
        </div>
        <p className="tagline">{humanizeToken(run.agent.provenanceStatus)}</p>
        <p>{run.agent.provenanceSummary}</p>
      </section>
    </main>
  );
}
