import { RequestForm } from './components/RequestForm';
import { pageContent } from './data/siteContent';

function App() {
  return (
    <div className="app-shell">
      <main className="request-canvas">
        <div className="shell">
          <header className="topbar">
            <div className="brand-pill">
              <img
                className="brand-pill__logo"
                src={pageContent.brand.logoSrc}
                alt="Curator's Guild logo"
              />

              <div>
                <p className="brand-pill__eyebrow">{pageContent.brand.eyebrow}</p>
                <p className="brand-pill__name">{pageContent.brand.name}</p>
              </div>
            </div>

            <p className="topbar__note">{pageContent.brand.note}</p>
          </header>

          <section className="hero-grid" aria-labelledby="hero-heading">
            <div className="hero-copy">
              <p className="hero-copy__eyebrow">{pageContent.hero.eyebrow}</p>
              <h1 id="hero-heading">{pageContent.hero.title}</h1>
              <p className="hero-copy__description">{pageContent.hero.description}</p>

              <ul className="tag-row" aria-label="Request categories">
                {pageContent.hero.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <div className="stat-grid">
                {pageContent.hero.stats.map((stat) => (
                  <article key={stat.label} className="stat-card">
                    <span className="stat-card__value">{stat.value}</span>
                    <span className="stat-card__label">{stat.label}</span>
                  </article>
                ))}
              </div>
            </div>

            <aside className="logo-stage" aria-label="Request process overview">
              <div className="logo-stage__frame">
                <div className="logo-stage__halo" />
                <img
                  className="logo-stage__logo"
                  src={pageContent.brand.logoSrc}
                  alt="Curator's Guild logo"
                />
              </div>

              <div className="process-stack">
                {pageContent.process.map((step) => (
                  <article key={step.step} className="process-card">
                    <span className="process-card__step">{step.step}</span>
                    <div>
                      <h2>{step.title}</h2>
                      <p>{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </section>

          <section className="desk-grid">
            <section className="form-card" aria-labelledby="request-form-heading">
              <div className="section-head">
                <div>
                  <p className="section-head__eyebrow">{pageContent.form.eyebrow}</p>
                  <h2 id="request-form-heading">{pageContent.form.title}</h2>
                </div>

                <p className="section-head__description">{pageContent.form.description}</p>
              </div>

              <RequestForm />
            </section>

            <aside className="briefing-panel" aria-labelledby="briefing-heading">
              <div className="section-head section-head--stacked">
                <div>
                  <p className="section-head__eyebrow">{pageContent.briefing.eyebrow}</p>
                  <h2 id="briefing-heading">{pageContent.briefing.title}</h2>
                </div>

                <p className="section-head__description">{pageContent.briefing.description}</p>
              </div>

              <div className="briefing-list">
                {pageContent.briefing.items.map((item) => (
                  <article key={item.title} className="briefing-item">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
