import { AccessGate } from "../../components/access-gate";
import { MediaCard } from "../../components/media-card";

export default function AccessPage() {
  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Protected Preview</p>
          <h1>Enter the access key to open the read-only deck.</h1>
          <p className="lede">
            This Agora preview is protected. Enter the password to continue into the
            read-only demo surface.
          </p>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">Preview posture</p>
          <div className="signalstack">
            <article className="signalitem">
              <span>mode</span>
              <strong>read-only</strong>
            </article>
            <article className="signalitem">
              <span>writes</span>
              <strong>blocked at API and UI layers</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">Preview Visual</p>
          <h2>A protected deck should still spark imagination</h2>
        </div>
        <MediaCard
          src="/media/control-theater-loop.svg"
          alt="Animated AI control theater used as a protected preview visual."
          kicker="Protected reel"
          title="Customers and builders should see the world before they read the system"
          caption="The preview gate keeps the deck safe, but the visual layer still needs to communicate platform ambition instantly."
        />
      </section>

      <AccessGate />
    </main>
  );
}
