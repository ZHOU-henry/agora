import { AccessGate } from "../../components/access-gate";

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

      <AccessGate />
    </main>
  );
}
