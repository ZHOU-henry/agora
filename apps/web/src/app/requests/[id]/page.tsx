import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaCard } from "../../../components/media-card";
import { getTaskRequest } from "../../../lib/api";
import { formatTimestamp, humanizeToken, titleizeToken, toneClass } from "../../../lib/presenters";

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
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Task Request</p>
          <h1>{taskRequest.title}</h1>
          <p className="lede">{taskRequest.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(taskRequest.status)}`}>
              {titleizeToken(taskRequest.status)}
            </span>
            <span className="statuspill tone-neutral">
              agent / {taskRequest.agent.name}
            </span>
            <span className="statuspill tone-neutral">
              builder / {taskRequest.agent.provider.name}
            </span>
            <span className="datachip">{formatTimestamp(taskRequest.createdAt)}</span>
          </div>
          <div className="buttonrow">
            <Link href={`/agents/${taskRequest.agent.slug}`} className="actionlink">
              Back to agent
            </Link>
            <Link
              href={`/providers/${taskRequest.agent.provider.slug}`}
              className="actionlink"
            >
              Inspect builder
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">Request state</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>run records</span>
              <strong>{taskRequest.runs.length}</strong>
            </article>
            <article className="signalitem">
              <span>last update</span>
              <strong>{formatTimestamp(taskRequest.updatedAt)}</strong>
            </article>
            <article className="signalitem">
              <span>provenance</span>
              <strong>{humanizeToken(taskRequest.agent.provenanceStatus)}</strong>
            </article>
            <article className="signalitem">
              <span>builder type</span>
              <strong>{humanizeToken(taskRequest.agent.provider.type)}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Request Visualization</p>
          <h2>Help the requester imagine what happens next</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/control-theater-loop.svg"
            alt="Animated control theater showing how a request enters the platform and reaches routing and review."
            kicker="Request path"
            title="A task request should suggest downstream motion"
            caption="The page should imply routing, execution, and review even before the user opens a specific run."
          />
          <MediaCard
            src="/media/builder-network-loop.svg"
            alt="Animated builder network showing supply-side developers around a demand board."
            kicker="Builder context"
            title="Demand belongs inside a bigger supply-side market"
            caption="This request is not just for one agent card; it belongs to a future marketplace of specialized builders."
            compact
          />
        </div>
      </section>

      <div className="surface-grid surface-grid-two">
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">Builder</p>
            <h2>Supply-side owner</h2>
          </div>
          <p className="tagline">{taskRequest.agent.provider.name}</p>
          <p>{taskRequest.agent.provider.summary}</p>
          <Link
            href={`/providers/${taskRequest.agent.provider.slug}`}
            className="cardlink"
          >
            Open builder profile
          </Link>
        </section>

        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">Context</p>
            <h2>Task context</h2>
          </div>
          <p>{taskRequest.contextNote || "No extra context provided."}</p>
        </section>

        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">Provenance</p>
            <h2>Agent provenance</h2>
          </div>
          <p className="tagline">{humanizeToken(taskRequest.agent.provenanceStatus)}</p>
          <p>{taskRequest.agent.provenanceSummary}</p>
        </section>
      </div>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Execution</p>
          <h2>Run records</h2>
        </div>
        <div className="timeline">
          {taskRequest.runs.map((run) => (
            <article key={run.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">run / {run.id.slice(-6)}</p>
                <span className={`statuspill ${toneClass(run.status)}`}>
                  {titleizeToken(run.status)}
                </span>
              </div>
              <p className="tagline">builder / {taskRequest.agent.provider.name}</p>
              <p>{run.latestMessage || "No message recorded yet."}</p>
              <p className="timestamp">{formatTimestamp(run.createdAt)}</p>
              <Link href={`/runs/${run.id}`} className="cardlink">
                Open run record
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
