import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskIntakeForm } from "../../../components/task-intake-form";
import { getAgentDetail } from "../../../lib/api";

type AgentDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { slug } = await params;
  const agent = await getAgentDetail(slug);

  if (!agent) {
    notFound();
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Agent Profile</p>
        <h1>{agent.name}</h1>
        <p className="lede">{agent.description}</p>
        <Link href="/" className="backlink">
          Back to catalog
        </Link>
      </section>

      <section className="panel">
        <h2>Trust Signals</h2>
        <ul>
          {agent.trustSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Provenance</h2>
        <p className="tagline">
          Status: {agent.provenanceStatus.replaceAll("_", " ")}
        </p>
        <p>{agent.provenanceSummary}</p>
      </section>

      <section className="panel">
        <h2>Constraints</h2>
        <ul>
          {agent.constraints.map((constraint) => (
            <li key={constraint}>{constraint}</li>
          ))}
        </ul>
      </section>

      <TaskIntakeForm agentId={agent.id} agentName={agent.name} />
    </main>
  );
}
