import Link from "next/link";
import {
  getAgentCatalog,
  getProviderCatalog,
  getTaskRequests,
  getTaskRuns
} from "../lib/api";
import { getAgentIntelligence } from "../lib/agent-intelligence";
import { formatTimestamp, humanizeToken, titleizeToken, toneClass } from "../lib/presenters";

type HomePageProps = {
  searchParams?: Promise<{
    q?: string;
    focus?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim().toLowerCase() ?? "";
  const focus = params.focus?.trim().toLowerCase() ?? "all";
  const agents = await getAgentCatalog();
  const providers = await getProviderCatalog();
  const requests = await getTaskRequests();
  const runs = await getTaskRuns();
  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  );
  const activeRuns = runs.filter(
    (run) => run.status === "submitted" || run.status === "running"
  );
  const launchSurfaces = [
    {
      title: "Catalog intelligence",
      description: "Expose agent boundaries, trust signals, provenance posture, and routing intent."
    },
    {
      title: "Task routing",
      description: "Capture task demand with operator context and turn it into persistent execution records."
    },
    {
      title: "Run telemetry",
      description: "Track transitions, payloads, summaries, and execution state in a single control plane."
    },
    {
      title: "Human review",
      description: "Keep approval, rejection, and rework decisions inside the same operational surface."
    }
  ];
  const pulse = [
    { label: "builder profiles", value: String(providers.length).padStart(2, "0") },
    { label: "catalog nodes", value: String(agents.length).padStart(2, "0") },
    { label: "task requests", value: String(requests.length).padStart(2, "0") },
    { label: "active runs", value: String(activeRuns.length).padStart(2, "0") },
    { label: "awaiting review", value: String(reviewQueue.length).padStart(2, "0") }
  ];
  const focusFilters = [
    { value: "all", label: "all lanes" },
    { value: "strategy", label: "strategy" },
    { value: "research", label: "research" },
    { value: "code", label: "implementation" },
    { value: "sources", label: "source rigor" },
    { value: "review", label: "review" },
    { value: "governance", label: "governance" }
  ];
  const enrichedAgents = agents.map((agent) => ({
    ...agent,
    intelligence: getAgentIntelligence(agent.slug)
  }));
  const filteredAgents = enrichedAgents.filter((agent) => {
    const searchable = [
      agent.name,
      agent.summary,
      agent.description,
      agent.tags.join(" "),
      agent.intelligence?.idealFor.join(" ") ?? "",
      agent.intelligence?.exampleTasks.join(" ") ?? ""
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = query.length === 0 || searchable.includes(query);
    const matchesFocus =
      focus === "all" ||
      agent.tags.some((tag) => tag.toLowerCase() === focus) ||
      agent.intelligence?.capabilityScores.some((score) => score.label === focus);

    return matchesQuery && matchesFocus;
  });
  const comparisonRows = enrichedAgents.map((agent) => ({
    agent,
    primaryCapability:
      agent.intelligence?.capabilityScores
        .slice()
        .sort((a, b) => b.score - a.score)[0] ?? null
  }));

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Agora // Operator Deck</p>
          <h1>Run an AI agent marketplace from a cinematic control surface.</h1>
          <p className="lede">
            Agora is a narrow operator-facing MVP for cataloging agent capabilities,
            routing work, and reviewing execution traces without losing provenance or
            operational clarity. The current demo starts with a seeded first-party
            cohort, but the platform direction is open to outside AI agent developers
            building specialized agents for real customer demand.
          </p>
          <div className="buttonrow">
            <Link href="/queue" className="actionlink actionlink-primary">
              Open command queue
            </Link>
            <Link href="/agents/athena" className="actionlink">
              Inspect Athena
            </Link>
          </div>
          <div className="chiprow">
            <span className="datachip">phase-1 control model</span>
            <span className="datachip">persistent task lifecycle</span>
            <span className="datachip">operator review in-loop</span>
            <span className="datachip">seeded now, open developer-side later</span>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">System pulse</p>
          <div className="stats stats-grid">
            {pulse.map((item) => (
              <div key={item.label} className="stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="signalstack">
            <article className="signalitem">
              <span>review lane</span>
              <strong>
                {reviewQueue.length > 0
                  ? `${reviewQueue.length} run${
                      reviewQueue.length > 1 ? "s" : ""
                    } need operator attention`
                  : "No runs blocked on review"}
              </strong>
            </article>
            <article className="signalitem">
              <span>routing posture</span>
              <strong>
                {activeRuns.length > 0
                  ? `${activeRuns.length} active execution threads`
                  : "Idle and ready for new intake"}
              </strong>
            </article>
            <article className="signalitem">
              <span>catalog status</span>
              <strong>{agents.every((agent) => agent.status === "active") ? "Live" : "Mixed"}</strong>
            </article>
            <article className="signalitem">
              <span>supply model</span>
              <strong>first-party seeded, multi-developer by design</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Launch Surfaces</p>
          <h2>Phase-1 product surfaces</h2>
          <p className="lede small">
            The current ship target stays intentionally narrow, but every surface is
            designed to support a larger future operating model.
          </p>
        </div>
        <div className="grid">
          {launchSurfaces.map((surface) => (
            <article key={surface.title} className="card">
              <p className="tagline">surface</p>
              <h3>{surface.title}</h3>
              <p>{surface.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Routing</p>
          <h2>Find the right operator lane fast</h2>
          <p className="lede small">
            Search by intent, filter by strength, and route work using explicit fit
            signals instead of guesswork.
          </p>
        </div>
        <form className="controlform" action="/" method="get">
          <label className="stack">
            <span>Search catalog</span>
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search by use case, tag, or example task"
            />
          </label>
          <label className="stack">
            <span>Focus lane</span>
            <select name="focus" defaultValue={focus}>
              {focusFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Apply routing filter</button>
        </form>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Supply Side</p>
          <h2>Builder profiles behind the launch cohort</h2>
          <p className="lede small">
            Agora starts with seeded first-party supply, but the platform model is built
            around multiple outside builders publishing specialized agents over time.
          </p>
        </div>
        <div className="grid">
          {providers.map((provider) => (
            <article key={provider.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">builder</span>
                <span className={`statuspill ${toneClass(provider.status)}`}>
                  {provider.status}
                </span>
              </div>
              <h3>{provider.name}</h3>
              <p>{provider.summary}</p>
              <p className="provenance">Type: {humanizeToken(provider.type)}</p>
              <div className="chiprow">
                {provider.tags.map((tag) => (
                  <span key={tag} className="datachip">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/providers/${provider.slug}`} className="cardlink">
                Inspect builder profile
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Agent Catalog</p>
          <h2>Seeded first-party operators with explicit role boundaries</h2>
          <p className="lede small">
            Every card exposes the role, provenance posture, and trust framing required
            before an operator routes work. This launch cohort is the first supply-side
            layer, not the final limit of who can build on the platform.
          </p>
        </div>
        {filteredAgents.length === 0 ? (
          <p>No agents match the current routing filter.</p>
        ) : null}
        <div className="grid">
          {filteredAgents.map((agent, index) => (
            <article key={agent.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">{String(index + 1).padStart(2, "0")}</span>
                <span className={`statuspill ${toneClass(agent.status)}`}>{agent.status}</span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <p className="tagline">Built by {agent.provider.name}</p>
              <p className="provenance">Provenance: {humanizeToken(agent.provenanceStatus)}</p>
              <div className="chiprow">
                {agent.tags.map((tag) => (
                  <span key={tag} className="datachip">
                    {tag}
                  </span>
                ))}
              </div>
              {agent.intelligence ? (
                <div className="microstack">
                  <p className="microeyebrow">Best fit</p>
                  <p>{agent.intelligence.idealFor[0]}</p>
                </div>
              ) : null}
              <Link href={`/providers/${agent.provider.slug}`} className="cardlink">
                View builder
              </Link>
              <Link href={`/agents/${agent.slug}`} className="cardlink">
                Inspect and submit task
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Decision Layer</p>
          <h2>Operator comparison matrix</h2>
          <p className="lede small">
            Use the matrix to decide whether the task needs direction, evidence, or code
            before you route it.
          </p>
        </div>
        <div className="comparisonlist">
          {comparisonRows.map(({ agent, primaryCapability }) => (
            <article key={agent.id} className="comparisonrow">
              <div className="comparison-main">
                <h3>{agent.name}</h3>
                <p>{agent.intelligence?.differentiators[0] ?? agent.summary}</p>
              </div>
              <div className="comparison-metric">
                <span className="microeyebrow">primary edge</span>
                <strong>
                  {primaryCapability
                    ? `${primaryCapability.label} / ${primaryCapability.score}`
                    : "n/a"}
                </strong>
              </div>
              <div className="comparison-metric">
                <span className="microeyebrow">ideal first move</span>
                <strong>{agent.intelligence?.exampleTasks[0] ?? "Inspect profile"}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Live Workstream</p>
          <h2>Recent intake and review traffic</h2>
          <p className="lede small">
            The operator queue is the live bridge between demand intake, execution, and
            post-run judgment.
          </p>
        </div>
        <div className="surface-grid surface-grid-two">
          <section className="stackpanel">
            <div className="stackpanel-head">
              <h3>Recent task requests</h3>
              <Link href="/queue" className="cardlink">
                Open queue
              </Link>
            </div>
            <div className="timeline">
              {requests.length === 0 ? (
                <p>No task requests have been submitted yet.</p>
              ) : (
                requests.slice(0, 4).map((request) => (
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
                      View task request
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="stackpanel">
            <div className="stackpanel-head">
              <h3>Review-ready runs</h3>
              <span className="microeyebrow">priority lane</span>
            </div>
            <div className="timeline">
              {reviewQueue.length === 0 ? (
                <p>No runs are waiting for review.</p>
              ) : (
                reviewQueue.slice(0, 4).map((run) => (
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
        </div>
      </section>
    </main>
  );
}
