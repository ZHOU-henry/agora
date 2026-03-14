import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaCard } from "../../../components/media-card";
import { TaskIntakeForm } from "../../../components/task-intake-form";
import { getAgentDetail } from "../../../lib/api";
import { getAgentIntelligence } from "../../../lib/agent-intelligence";
import { localizeAgent } from "../../../lib/catalog-copy";
import { getCopy } from "../../../lib/copy";
import { getLocale } from "../../../lib/locale";
import { humanizeToken, toneClass } from "../../../lib/presenters";

type AgentDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const { slug } = await params;
  const agent = await getAgentDetail(slug);

  if (!agent) {
    notFound();
  }

  const localizedAgent = localizeAgent(agent, locale);
  const intelligence = getAgentIntelligence(slug, locale);

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.agentPage.eyebrow}</p>
          <h1>{localizedAgent.name}</h1>
          <p className="lede">{localizedAgent.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(localizedAgent.status)}`}>
              {humanizeToken(localizedAgent.status, locale)}
            </span>
            <span className="statuspill tone-neutral">
              {copy.agentPage.provenance.statusLabel} /{" "}
              {humanizeToken(localizedAgent.provenanceStatus, locale)}
            </span>
            {localizedAgent.tags.map((tag) => (
              <span key={tag} className="datachip">
                {tag}
              </span>
            ))}
          </div>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              {copy.agentPage.back}
            </Link>
            <Link
              href={`/providers/${localizedAgent.provider.slug}`}
              className="actionlink"
            >
              {copy.agentPage.inspectBuilder}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.agentPage.frame}</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>{copy.agentPage.trustSignals}</span>
              <strong>{localizedAgent.trustSignals.length}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.agentPage.constraints}</span>
              <strong>{localizedAgent.constraints.length}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.agentPage.tags}</span>
              <strong>{localizedAgent.tags.join(" / ")}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.agentPage.bestMove}</span>
              <strong>{intelligence?.exampleTasks[0] ?? localizedAgent.summary}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.agentPage.concept.eyebrow}</p>
          <h2>{copy.agentPage.concept.title}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/agent-constellation-loop.svg"
            alt="Animated agent constellation."
            kicker={copy.agentPage.concept.role.kicker}
            title={copy.agentPage.concept.role.title}
            caption={copy.agentPage.concept.role.caption}
          />
          <MediaCard
            src="/media/execution-reel-loop.svg"
            alt="Animated execution reel."
            kicker={copy.agentPage.concept.loop.kicker}
            title={copy.agentPage.concept.loop.title}
            caption={copy.agentPage.concept.loop.caption}
          />
        </div>
      </section>

      <div className="surface-grid surface-grid-two">
        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{copy.agentPage.builder.eyebrow}</p>
            <h2>{copy.agentPage.builder.title}</h2>
          </div>
          <p className="tagline">
            {humanizeToken(localizedAgent.provider.type, locale)} /{" "}
            {localizedAgent.provider.name}
          </p>
          <p>{localizedAgent.provider.summary}</p>
          <img
            className="card-inline-media"
            src="/media/builder-network-loop.svg"
            alt=""
            aria-hidden="true"
          />
          {localizedAgent.provider.website ? (
            <p>
              <a className="cardlink" href={localizedAgent.provider.website}>
                {copy.agentPage.builder.visitSite}
              </a>
            </p>
          ) : null}
          <p>
            <Link className="cardlink" href={`/providers/${localizedAgent.provider.slug}`}>
              {copy.agentPage.builder.openProfile}
            </Link>
          </p>
        </section>

        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{copy.agentPage.assurance.eyebrow}</p>
            <h2>{copy.agentPage.assurance.title}</h2>
          </div>
          <ul>
            {localizedAgent.trustSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="sectionhead">
            <p className="eyebrow">{copy.agentPage.boundaries.eyebrow}</p>
            <h2>{copy.agentPage.boundaries.title}</h2>
          </div>
          <ul>
            {localizedAgent.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </section>
      </div>

      {intelligence ? (
        <div className="surface-grid surface-grid-two">
          <section className="panel">
            <div className="sectionhead">
              <p className="eyebrow">{copy.agentPage.fit.eyebrow}</p>
              <h2>{copy.agentPage.fit.title}</h2>
            </div>
            <ul>
              {intelligence.idealFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="sectionhead">
              <p className="eyebrow">{copy.agentPage.avoid.eyebrow}</p>
              <h2>{copy.agentPage.avoid.title}</h2>
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
            <p className="eyebrow">{copy.agentPage.capability.eyebrow}</p>
            <h2>{copy.agentPage.capability.title}</h2>
          </div>
          <div className="scoregrid">
            {intelligence.capabilityScores.map((item) => (
              <article key={item.label} className="scorecard">
                <div className="timelinehead">
                  <p className="tagline">{humanizeToken(item.label, locale)}</p>
                  <strong>{item.score}</strong>
                </div>
                <div className="scorebar">
                  <span style={{ width: `${item.score}%` }} />
                </div>
              </article>
            ))}
          </div>
          <div className="microstack">
            <p className="microeyebrow">{copy.agentPage.capability.prompts}</p>
            <div className="chiprow">
              {intelligence.exampleTasks.map((item) => (
                <span key={item} className="datachip">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <img
            className="panel-inline-visual"
            src="/media/control-theater-loop.svg"
            alt=""
            aria-hidden="true"
          />
        </section>
      ) : null}

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.agentPage.provenance.eyebrow}</p>
          <h2>{copy.agentPage.provenance.title}</h2>
        </div>
        <p className="tagline">
          {copy.agentPage.provenance.statusLabel}:{" "}
          {humanizeToken(localizedAgent.provenanceStatus, locale)}
        </p>
        <p>{localizedAgent.provenanceSummary}</p>
      </section>

      <TaskIntakeForm
        agentId={localizedAgent.id}
        agentName={localizedAgent.name}
        locale={locale}
        copy={copy.intakeForm}
        exampleTasks={intelligence?.exampleTasks}
      />
    </main>
  );
}
