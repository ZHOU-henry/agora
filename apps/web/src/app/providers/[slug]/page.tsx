import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviderDetail } from "../../../lib/api";
import { humanizeToken, toneClass } from "../../../lib/presenters";

type ProviderDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProviderDetailPage({
  params
}: ProviderDetailPageProps) {
  const { slug } = await params;
  const provider = await getProviderDetail(slug);

  if (!provider) {
    notFound();
  }

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Builder Profile</p>
          <h1>{provider.name}</h1>
          <p className="lede">{provider.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(provider.status)}`}>
              {provider.status}
            </span>
            <span className="statuspill tone-neutral">
              builder type / {humanizeToken(provider.type)}
            </span>
            {provider.tags.map((tag) => (
              <span key={tag} className="datachip">
                {tag}
              </span>
            ))}
          </div>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              Back to catalog
            </Link>
            {provider.website ? (
              <a href={provider.website} className="actionlink">
                Visit builder site
              </a>
            ) : null}
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">Supply posture</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>published agents</span>
              <strong>{provider.agents.length}</strong>
            </article>
            <article className="signalitem">
              <span>builder type</span>
              <strong>{humanizeToken(provider.type)}</strong>
            </article>
            <article className="signalitem">
              <span>platform role</span>
              <strong>Supply-side participant</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Published Agents</p>
          <h2>Current catalog output</h2>
          <p className="lede small">
            This profile shows the agents currently associated with this builder.
          </p>
        </div>
        <div className="grid">
          {provider.agents.map((agent) => (
            <article key={agent.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">agent</span>
                <span className={`statuspill ${toneClass(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <Link href={`/agents/${agent.slug}`} className="cardlink">
                Inspect agent
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
