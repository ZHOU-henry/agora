import Link from "next/link";
import { MediaCard } from "../components/media-card";
import {
  getAgentCatalog,
  getProviderCatalog,
  getTaskRequests,
  getTaskRuns
} from "../lib/api";
import { getAgentIntelligence } from "../lib/agent-intelligence";
import { localizeAgent, localizeProvider } from "../lib/catalog-copy";
import { getCopy } from "../lib/copy";
import { getLocale } from "../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../lib/presenters";

type HomePageProps = {
  searchParams?: Promise<{
    q?: string;
    focus?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const params = (await searchParams) ?? {};
  const query = params.q?.trim().toLowerCase() ?? "";
  const focus = params.focus?.trim().toLowerCase() ?? "all";
  const agents = (await getAgentCatalog()).map((agent) => localizeAgent(agent, locale));
  const providers = (await getProviderCatalog()).map((provider) =>
    localizeProvider(provider, locale)
  );
  const requests = (await getTaskRequests()).map((request) => ({
    ...request,
    agent: localizeAgent(request.agent, locale)
  }));
  const runs = (await getTaskRuns()).map((run) => ({
    ...run,
    agent: localizeAgent(run.agent, locale)
  }));

  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  );
  const activeRuns = runs.filter(
    (run) => run.status === "submitted" || run.status === "running"
  );

  const enrichedAgents = agents.map((agent) => ({
    ...agent,
    intelligence: getAgentIntelligence(agent.slug, locale)
  }));

  const filteredAgents = enrichedAgents.filter((agent) => {
    const searchable = [
      agent.name,
      agent.summary,
      agent.description,
      agent.provider.name,
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
      agent.intelligence?.capabilityScores.some(
        (score) => score.label.toLowerCase() === focus
      );

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
      <section className="hero hero-grid hero-grid-wide">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h1>{copy.home.title}</h1>
          <p className="lede">{copy.home.lede}</p>
          <div className="buttonrow">
            <Link href="/queue" className="actionlink actionlink-primary">
              {copy.home.primaryAction}
            </Link>
            <Link href="/providers" className="actionlink">
              {copy.home.secondaryAction}
            </Link>
          </div>
          <div className="chiprow">
            {copy.home.heroChips.map((chip) => (
              <span key={chip} className="datachip">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">System Pulse</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{providers.length}</strong>
              <span>builders</span>
            </div>
            <div className="stat">
              <strong>{agents.length}</strong>
              <span>agents</span>
            </div>
            <div className="stat">
              <strong>{activeRuns.length}</strong>
              <span>active</span>
            </div>
            <div className="stat">
              <strong>{reviewQueue.length}</strong>
              <span>review</span>
            </div>
          </div>
          <div className="signalstack">
            <article className="signalitem">
              <span>{copy.home.pulse.reviewLane}</span>
              <strong>
                {reviewQueue.length > 0
                  ? copy.home.pulse.reviewQueue(reviewQueue.length)
                  : copy.home.pulse.idle}
              </strong>
            </article>
            <article className="signalitem">
              <span>{copy.home.pulse.catalogStatus}</span>
              <strong>
                {agents.every((agent) => agent.status === "active")
                  ? copy.home.pulse.live
                  : humanizeToken("draft", locale)}
              </strong>
            </article>
            <article className="signalitem">
              <span>routing posture</span>
              <strong>
                {activeRuns.length > 0
                  ? copy.home.pulse.activeThreads(activeRuns.length)
                  : copy.home.pulse.idle}
              </strong>
            </article>
            <article className="signalitem">
              <span>supply model</span>
              <strong>{copy.home.pulse.supplyModel}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.visual.eyebrow}</p>
          <h2>{copy.home.visual.title}</h2>
          <p className="lede small">{copy.home.visual.lede}</p>
        </div>
        <div className="media-stage media-stage-spread">
          <MediaCard
            src="/media/control-theater-loop.svg"
            alt="Animated control theater showing demand, builders, routing, and review."
            kicker={copy.home.visual.cards.hero.kicker}
            title={copy.home.visual.cards.hero.title}
            caption={copy.home.visual.cards.hero.caption}
          />
          <div className="media-grid-compact">
            <MediaCard
              src="/media/builder-network-loop.svg"
              alt="Animated builder network."
              kicker={copy.home.visual.cards.supply.kicker}
              title={copy.home.visual.cards.supply.title}
              caption={copy.home.visual.cards.supply.caption}
              compact
            />
            <MediaCard
              src="/media/agent-constellation-loop.svg"
              alt="Animated agent constellation."
              kicker={copy.home.visual.cards.cohort.kicker}
              title={copy.home.visual.cards.cohort.title}
              caption={copy.home.visual.cards.cohort.caption}
              compact
            />
            <MediaCard
              src="/media/execution-reel-loop.svg"
              alt="Animated execution reel."
              kicker={copy.home.visual.cards.execution.kicker}
              title={copy.home.visual.cards.execution.title}
              caption={copy.home.visual.cards.execution.caption}
              compact
            />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.industries.eyebrow}</p>
          <h2>{copy.home.industries.title}</h2>
          <p className="lede small">{copy.home.industries.lede}</p>
        </div>
        <div className="grid media-grid-showcase">
          {copy.home.industries.cards.map((item) => (
            <MediaCard
              key={item.src}
              src={item.src}
              alt={item.title}
              kicker={item.kicker}
              title={item.title}
              caption={item.caption}
              compact
            />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.routing.eyebrow}</p>
          <h2>{copy.home.routing.title}</h2>
          <p className="lede small">{copy.home.routing.lede}</p>
        </div>
        <form className="controlform" action="/" method="get">
          <label className="stack">
            <span>{copy.home.routing.searchLabel}</span>
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder={copy.home.routing.searchPlaceholder}
            />
          </label>
          <label className="stack">
            <span>{copy.home.routing.focusLabel}</span>
            <select name="focus" defaultValue={focus}>
              {copy.home.routing.focusFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">{copy.home.routing.apply}</button>
        </form>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.providers.eyebrow}</p>
          <h2>{copy.home.providers.title}</h2>
          <p className="lede small">{copy.home.providers.lede}</p>
        </div>
        <div className="grid">
          {providers.map((provider) => (
            <article key={provider.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">builder</span>
                <span className={`statuspill ${toneClass(provider.status)}`}>
                  {humanizeToken(provider.status, locale)}
                </span>
              </div>
              <h3>{provider.name}</h3>
              <p>{provider.summary}</p>
              <p className="provenance">
                {copy.home.providers.typeLabel}: {humanizeToken(provider.type, locale)}
              </p>
              <img
                className="card-inline-media"
                src="/media/builder-network-loop.svg"
                alt=""
                aria-hidden="true"
              />
              <Link href={`/providers/${provider.slug}`} className="cardlink">
                {copy.home.providers.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.agents.eyebrow}</p>
          <h2>{copy.home.agents.title}</h2>
          <p className="lede small">{copy.home.agents.lede}</p>
        </div>
        {filteredAgents.length === 0 ? <p>{copy.home.agents.empty}</p> : null}
        <div className="grid">
          {filteredAgents.map((agent) => (
            <article key={agent.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">agent</span>
                <span className={`statuspill ${toneClass(agent.status)}`}>
                  {humanizeToken(agent.status, locale)}
                </span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <p className="tagline">
                {copy.home.agents.builtBy} / {agent.provider.name}
              </p>
              <img
                className="card-inline-media"
                src="/media/agent-constellation-loop.svg"
                alt=""
                aria-hidden="true"
              />
              <div className="chiprow">
                {agent.tags.map((tag) => (
                  <span key={tag} className="datachip">
                    {tag}
                  </span>
                ))}
              </div>
              {agent.intelligence ? (
                <p className="small">
                  {copy.home.agents.bestFit}: {agent.intelligence.idealFor[0]}
                </p>
              ) : null}
              <Link href={`/providers/${agent.provider.slug}`} className="cardlink">
                {copy.home.agents.providerAction}
              </Link>
              <Link href={`/agents/${agent.slug}`} className="cardlink">
                {copy.home.agents.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.comparison.eyebrow}</p>
          <h2>{copy.home.comparison.title}</h2>
          <p className="lede small">{copy.home.comparison.lede}</p>
        </div>
        <div className="comparisonlist">
          {comparisonRows.map(({ agent, primaryCapability }) => (
            <article key={agent.id} className="comparisonrow">
              <div className="comparison-main">
                <h3>{agent.name}</h3>
                <p>{agent.intelligence?.differentiators[0] ?? agent.summary}</p>
              </div>
              <div className="comparison-metric">
                <span className="microeyebrow">{copy.home.comparison.primaryEdge}</span>
                <strong>
                  {primaryCapability
                    ? `${humanizeToken(primaryCapability.label, locale)} / ${primaryCapability.score}`
                    : copy.home.comparison.fallback}
                </strong>
              </div>
              <div className="comparison-metric">
                <span className="microeyebrow">{copy.home.comparison.firstMove}</span>
                <strong>{agent.intelligence?.exampleTasks[0] ?? copy.home.comparison.fallback}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.home.workstream.eyebrow}</p>
          <h2>{copy.home.workstream.title}</h2>
          <p className="lede small">{copy.home.workstream.lede}</p>
        </div>
        <div className="surface-grid surface-grid-two">
          <section className="stackpanel">
            <div className="stackpanel-head">
              <h3>{copy.home.workstream.requestsTitle}</h3>
              <Link href="/queue" className="cardlink">
                {copy.home.workstream.requestsAction}
              </Link>
            </div>
            <div className="timeline">
              {requests.length === 0 ? (
                <p>{copy.home.workstream.noRequests}</p>
              ) : (
                requests.slice(0, 4).map((request) => (
                  <article key={request.id} className="timelineitem">
                    <div className="timelinehead">
                      <p className="tagline">{request.agent.name}</p>
                      <span className={`statuspill ${toneClass(request.status)}`}>
                        {humanizeToken(request.status, locale)}
                      </span>
                    </div>
                    <p className="tagline">
                      {copy.queue.builderBy} / {request.agent.provider.name}
                    </p>
                    <p>{request.title}</p>
                    <p className="timestamp">{formatTimestamp(request.createdAt, locale)}</p>
                    <Link href={`/requests/${request.id}`} className="cardlink">
                      {copy.home.workstream.requestAction}
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="stackpanel">
            <div className="stackpanel-head">
              <h3>{copy.home.workstream.reviewTitle}</h3>
              <span className="microeyebrow">{copy.home.workstream.reviewLane}</span>
            </div>
            <div className="timeline">
              {reviewQueue.length === 0 ? (
                <p>{copy.home.workstream.noReview}</p>
              ) : (
                reviewQueue.slice(0, 4).map((run) => (
                  <article key={run.id} className="timelineitem">
                    <div className="timelinehead">
                      <p className="tagline">{run.agent.name}</p>
                      <span className={`statuspill ${toneClass(run.status)}`}>
                        {humanizeToken(run.status, locale)}
                      </span>
                    </div>
                    <p className="tagline">
                      {copy.queue.builderBy} / {run.agent.provider.name}
                    </p>
                    <p>{run.taskTitle}</p>
                    <p>{run.resultSummary || copy.home.workstream.noSummary}</p>
                    <p className="timestamp">{formatTimestamp(run.updatedAt, locale)}</p>
                    <Link href={`/runs/${run.id}`} className="cardlink">
                      {copy.home.workstream.reviewAction}
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
