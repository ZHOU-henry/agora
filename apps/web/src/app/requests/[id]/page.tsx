import Link from "next/link";
import { notFound } from "next/navigation";
import { getTaskRequest } from "../../../lib/api";

type TaskRequestPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskRequestPage({ params }: TaskRequestPageProps) {
  const { id } = await params;
  const taskRequest = await getTaskRequest(id);

  if (!taskRequest) {
    notFound();
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Task Request</p>
        <h1>{taskRequest.title}</h1>
        <p className="lede">{taskRequest.description}</p>
        <p className="tagline">
          Assigned agent: {taskRequest.agent.name} · Status: {taskRequest.status}
        </p>
        <Link href={`/agents/${taskRequest.agent.slug}`} className="backlink">
          Back to agent
        </Link>
      </section>

      <section className="panel">
        <h2>Task Context</h2>
        <p>{taskRequest.contextNote || "No extra context provided."}</p>
      </section>

      <section className="panel">
        <h2>Runs</h2>
        <div className="timeline">
          {taskRequest.runs.map((run) => (
            <article key={run.id} className="timelineitem">
              <p className="tagline">{run.status}</p>
              <p>{run.latestMessage || "No message recorded yet."}</p>
              <p className="timestamp">{run.createdAt}</p>
              <Link href={`/runs/${run.id}`} className="cardlink">
                Open run record
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Agent Provenance</h2>
        <p className="tagline">
          {taskRequest.agent.provenanceStatus.replaceAll("_", " ")}
        </p>
        <p>{taskRequest.agent.provenanceSummary}</p>
      </section>
    </main>
  );
}
