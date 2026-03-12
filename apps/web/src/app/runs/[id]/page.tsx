import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewDecisionForm } from "../../../components/review-decision-form";
import { RunStatusControls } from "../../../components/run-status-controls";
import { getTaskRun } from "../../../lib/api";

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
      <section className="hero">
        <p className="eyebrow">Run Record</p>
        <h1>{run.taskRequest.title}</h1>
        <p className="lede">{run.taskRequest.description}</p>
        <p className="tagline">
          Agent: {run.agent.name} · Status: {run.status}
        </p>
        <Link href={`/requests/${run.taskRequest.id}`} className="backlink">
          Back to task request
        </Link>
      </section>

      <RunStatusControls initialRun={run} />
      <ReviewDecisionForm initialRun={run} />

      <section className="panel">
        <h2>Execution Timeline</h2>
        <div className="timeline">
          {run.events.map((event) => (
            <article key={event.id} className="timelineitem">
              <p className="tagline">{event.eventType}</p>
              <p>{event.message}</p>
              <p className="timestamp">{event.createdAt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Agent Provenance</h2>
        <p className="tagline">
          {run.agent.provenanceStatus.replaceAll("_", " ")}
        </p>
        <p>{run.agent.provenanceSummary}</p>
      </section>
    </main>
  );
}
