import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getProviderCatalog } from "../../lib/api";
import { localizeProvider } from "../../lib/catalog-copy";
import { getCopy } from "../../lib/copy";
import { getLocale } from "../../lib/locale";
import { humanizeToken, toneClass } from "../../lib/presenters";

export default async function ProvidersPage() {
  const locale = await getLocale();
  const copy = getCopy(locale);
  const providers = (await getProviderCatalog()).map((provider) =>
    localizeProvider(provider, locale)
  );
  const activeBuilders = providers.filter((provider) => provider.status === "active");

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{copy.providersIndex.eyebrow}</p>
          <h1>{copy.providersIndex.title}</h1>
          <p className="lede">{copy.providersIndex.lede}</p>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              {copy.providersIndex.back}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.providersIndex.eyebrow}</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{providers.length}</strong>
              <span>{copy.providersIndex.stats.profiles}</span>
            </div>
            <div className="stat">
              <strong>{activeBuilders.length}</strong>
              <span>{copy.providersIndex.stats.activeBuilders}</span>
            </div>
            <div className="stat">
              <strong>{copy.providersIndex.stats.open}</strong>
              <span>{copy.providersIndex.stats.supplyModel}</span>
            </div>
            <div className="stat">
              <strong>{copy.providersIndex.stats.seeded}</strong>
              <span>{copy.providersIndex.stats.launchMode}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.providersIndex.visual.eyebrow}</p>
          <h2>{copy.providersIndex.visual.title}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/builder-network-loop.svg"
            alt="Animated builder network showing many agent developers around a demand board."
            kicker={copy.providersIndex.visual.cards.network.kicker}
            title={copy.providersIndex.visual.cards.network.title}
            caption={copy.providersIndex.visual.cards.network.caption}
          />
          <MediaCard
            src="/media/factory-command-loop.svg"
            alt="Animated manufacturing industry command scene with agent overlays."
            kicker={copy.providersIndex.visual.cards.industry.kicker}
            title={copy.providersIndex.visual.cards.industry.title}
            caption={copy.providersIndex.visual.cards.industry.caption}
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.providersIndex.list.eyebrow}</p>
          <h2>{copy.providersIndex.list.title}</h2>
          <p className="lede small">{copy.providersIndex.list.lede}</p>
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
                {copy.providersIndex.list.typeLabel}: {humanizeToken(provider.type, locale)}
              </p>
              <div className="chiprow">
                {provider.tags.map((tag) => (
                  <span key={tag} className="datachip">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/providers/${provider.slug}`} className="cardlink">
                {copy.providersIndex.list.action}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
