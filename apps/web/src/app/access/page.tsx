import { AccessGate } from "../../components/access-gate";
import { MediaCard } from "../../components/media-card";
import { getCopy } from "../../lib/copy";
import { getLocale } from "../../lib/locale";

export default async function AccessPage() {
  const locale = await getLocale();
  const copy = getCopy(locale);

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{copy.accessPage.eyebrow}</p>
          <h1>{copy.accessPage.title}</h1>
          <p className="lede">{copy.accessPage.lede}</p>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{copy.accessPage.panelKicker}</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>{copy.accessPage.modeLabel}</span>
              <strong>{copy.accessPage.modeValue}</strong>
            </article>
            <article className="signalitem">
              <span>{copy.accessPage.writesLabel}</span>
              <strong>{copy.accessPage.writesValue}</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{copy.accessPage.mediaEyebrow}</p>
          <h2>{copy.accessPage.mediaTitle}</h2>
        </div>
        <MediaCard
          src="/media/control-theater-loop.svg"
          alt="Animated protected preview visual."
          kicker={copy.accessPage.mediaKicker}
          title={copy.accessPage.mediaCardTitle}
          caption={copy.accessPage.mediaCaption}
        />
      </section>

      <AccessGate locale={locale} copy={copy.accessGate} />
    </main>
  );
}
