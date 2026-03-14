export default function Loading() {
  return (
    <div className="appshell route-loading-shell">
      <div className="ambient ambient-orbit ambient-orbit-a" aria-hidden="true" />
      <div className="ambient ambient-orbit ambient-orbit-b" aria-hidden="true" />
      <div className="ambient ambient-orbit ambient-orbit-c" aria-hidden="true" />
      <div className="ambient ambient-grid" aria-hidden="true" />
      <div className="ambient ambient-scan" aria-hidden="true" />

      <div className="appframe route-loading-frame">
        <header className="siteheader route-loading-header" aria-hidden="true">
          <div className="sitebrand">
            <span className="brandmark">A</span>
            <div className="brandcopy">
              <span className="brandlink">Agora</span>
              <span className="brandmeta">Loading operating surface</span>
            </div>
          </div>
        </header>

        <main className="page route-loading-page" aria-label="Loading page">
          <section className="hero hero-grid">
            <div className="hero-copy hero-copy-tight route-loading-block">
              <div className="route-loading-line route-loading-line-short" />
              <div className="route-loading-line route-loading-line-title" />
              <div className="route-loading-line route-loading-line-wide" />
              <div className="route-loading-chiprow">
                <span className="datachip">loading</span>
                <span className="datachip">routing</span>
                <span className="datachip">workspace</span>
              </div>
            </div>
            <aside className="signalpanel route-loading-block">
              <div className="route-loading-line route-loading-line-short" />
              <div className="stats stats-grid">
                <div className="stat">
                  <strong>..</strong>
                  <span>sync</span>
                </div>
                <div className="stat">
                  <strong>..</strong>
                  <span>view</span>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
