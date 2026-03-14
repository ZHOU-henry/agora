import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskIntakeForm } from "../../../components/task-intake-form";
import { getAgentDetail } from "../../../lib/api";
import { getAgentIntelligence } from "../../../lib/agent-intelligence";
import { humanizeToken, toneClass } from "../../../lib/presenters";

type AgentDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { slug } = await params;
  const agent = await getAgentDetail(slug);
  const intelligence = getAgentIntelligence(slug);

  if (!agent) {
    notFound();
  }

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Agent Profile</p>
          <h1>{agent.name}</h1>
          <p className="lede">{agent.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(agent.status)}`}>{agent.status}</span>
            <span className="statuspill tone-neutral">
              provenance / {humanizeToken(agent.provenanceStatus)}
            </span>
            {agent.tags.map((tag) => (
              <span key={tag} className="datachip">
                {tag}
              </span>
            ))}
          </div>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              Back to catalog
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">Agent frame</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>trust signals</span>
              <strong>{agent.trustSignals.length}</strong>
            </article>
            <article className="signalitem">
              <span>constraints</span>
              <strong>{agent.constraints.length}</strong>
            </article>
            <article className="signalitem">
              <span>catalog tags</span>
              <strong>{agent.tags.join(" / ")}</strong>
            </article>
            <article className="signalitem">
              <span>best first move</span>
              <strong>{intelligence?.exampleTasks[0] ?? "Submit a scoped task"}</strong>
            </article>
          </div>
        </aside>
      </section>

      <div className="surface-grid surface-grid-two">
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">Assurance</p>
            <h2>Trust signals</h2>
          </div>
          <ul>
            {agent.trustSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">Boundaries</p>
            <h2>Constraints</h2>
          </div>
          <ul>
            {agent.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </section>
      </div>

      {intelligence ? (
        <div className="surface-grid surface-grid-two">
          <section className="panel">
            <div className="sectionhead">
              <p className="eyebrow">Best Fit</p>
              <h2>Where this agent is strongest</h2>
            </div>
            <ul>
              {intelligence.idealFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="sectionhead">
              <p className="eyebrow">Avoid Misrouting</p>
              <h2>Where another agent should lead</h2>
            </div>
            <ul>
              {intelligence.avoidFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {intelligence ? (
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">Capability Profile</p>
            <h2>Decision support</h2>
          </div>
          <div className="scoregrid">
            {intelligence.capabilityScores.map((item) => (
              <article key={item.label} className="scorecard">
                <div className="timelinehead">
                  <p className="tagline">{item.label}</p>
                  <strong>{item.score}</strong>
                </div>
                <div className="scorebar">
                  <span style={{ width: `${item.score}%` }} />
                </div>
              </article>
            ))}
          </div>
          <div className="microstack">
            <p className="microeyebrow">Example task prompts</p>
            <div className="chiprow">
              {intelligence.exampleTasks.map((item) => (
                <span key={item} className="datachip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Provenance</p>
          <h2>Source posture</h2>
        </div>
        <p className="tagline">Status: {humanizeToken(agent.provenanceStatus)}</p>
        <p>{agent.provenanceSummary}</p>
      </section>

      <TaskIntakeForm
        agentId={agent.id}
        agentName={agent.name}
        exampleTasks={intelligence?.exampleTasks}
      />
    </main>
  );
}
