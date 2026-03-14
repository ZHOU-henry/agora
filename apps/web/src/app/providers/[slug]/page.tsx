import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaCard } from "../../../components/media-card";
import { getProviderDetail } from "../../../lib/api";
import { localizeProvider } from "../../../lib/catalog-copy";
import { getCopy } from "../../../lib/copy";
import { getLocale } from "../../../lib/locale";
import { humanizeToken, toneClass } from "../../../lib/presenters";

type ProviderDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProviderDetailPage({
  params
}: ProviderDetailPageProps) {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const { slug } = await params;
  const provider = await getProviderDetail(slug);

  if (!provider) {
    notFound();
  }

  const localizedProvider = localizeProvider(provider, locale);

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.providerPage.eyebrow}</p>
          <h1>{localizedProvider.name}</h1>
          <p className="lede">{localizedProvider.description}</p>
          <div className="chiprow">
            <span className={`statuspill ${toneClass(localizedProvider.status)}`}>
              {humanizeToken(localizedProvider.status, locale)}
            </span>
            <span className="statuspill tone-neutral">
              {copy.providerPage.builderType} /{" "}
              {humanizeToken(localizedProvider.type, locale)}
            </span>
            {localizedProvider.tags.map((tag) => (
              <span key={tag} className="datachip">
                {tag}
              </span>
            ))}
          </div>
          <div className="buttonrow">
            <Link href="/providers" className="actionlink">
              {copy.providerPage.back}
            </Link>
            {localizedProvider.website ? (
              <a href={localizedProvider.website} className="actionlink">
                {copy.providerPage.visit}
              </a>
            ) : null}
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.providerPage.supplyPosture}</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>{copy.providerPage.publishedAgents}</span>
              <strong>{localizedProvider.agents.length}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.providerPage.builderType}</span>
              <strong>{humanizeToken(localizedProvider.type, locale)}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.providerPage.platformRole}</span>
              <strong>{copy.providerPage.platformRoleValue}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.providerPage.visual.eyebrow}</p>
          <h2>{copy.providerPage.visual.title}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/builder-network-loop.svg"
            alt="Animated builder network."
            kicker={copy.providerPage.visual.network.kicker}
            title={copy.providerPage.visual.network.title}
            caption={copy.providerPage.visual.network.caption}
          />
          <MediaCard
            src="/media/factory-command-loop.svg"
            alt="Animated manufacturing industry control scene."
            kicker={copy.providerPage.visual.execution.kicker}
            title={copy.providerPage.visual.execution.title}
            caption={copy.providerPage.visual.execution.caption}
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.providerPage.agents.eyebrow}</p>
          <h2>{copy.providerPage.agents.title}</h2>
          <p className="lede small">{copy.providerPage.agents.lede}</p>
        </div>
        <div className="grid">
          {localizedProvider.agents.map((agent) => (
            <article key={agent.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">agent</span>
                <span className={`statuspill ${toneClass(agent.status)}`}>
                  {humanizeToken(agent.status, locale)}
                </span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <img
                className="card-inline-media"
                src="/media/agent-constellation-loop.svg"
                alt=""
                aria-hidden="true"
              />
              <Link href={`/agents/${agent.slug}`} className="cardlink">
                {copy.providerPage.agents.action}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
