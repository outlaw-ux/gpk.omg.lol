import type { CSSProperties } from 'react';
import { RequestForm } from './components/RequestForm';
import { pageContent } from './data/siteContent';

function App() {
  return (
    <div className="app-shell">
      <main className="request-canvas">
        <div className="shell">
          <header
            className="blast-banner"
            style={
              {
                '--blast-logo': `url(${pageContent.brand.gpkLogoSrc})`
              } as CSSProperties
            }
          >
            <div className="blast-banner__guild">
              <img
                className="blast-banner__guild-logo"
                src={pageContent.brand.guildLogoSrc}
                alt="Curator's Guild logo"
              />

              <div>
                <p className="blast-banner__eyebrow">{pageContent.brand.eyebrow}</p>
                <p className="blast-banner__title">{pageContent.brand.name}</p>
              </div>
            </div>
          </header>

          <section className="top-layout" aria-labelledby="hero-heading">
            <div className="intro-stack">
              <article className="intro-card">
                <p className="intro-card__eyebrow">{pageContent.hero.eyebrow}</p>
                <h1 id="hero-heading">{pageContent.hero.title}</h1>
                <p className="intro-card__description">{pageContent.hero.description}</p>

                <ul className="slime-tags" aria-label="Request targets">
                  {pageContent.hero.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <div className="quick-callouts">
                  {pageContent.hero.quickCallouts.map((item) => (
                    <article key={item.title} className="quick-callout">
                      <p>{item.title}</p>
                      <span>{item.body}</span>
                    </article>
                  ))}
                </div>
              </article>

              <aside
                className="hero-art"
                style={
                  {
                    '--chaos-collage': `url(${pageContent.art.collageSrc})`
                  } as CSSProperties
                }
                aria-label="Garbage Pail Kids visuals"
              >
                <div className="hero-art__burst">
                  <img
                    className="hero-art__explosion"
                    src={pageContent.art.explosionSrc}
                    alt="Adam Bomb style explosion art"
                  />
                  <img
                    className="hero-art__logo"
                    src={pageContent.brand.guildLogoSrc}
                    alt="Curator's Guild logo"
                  />
                </div>

                <div className="hero-art__note">
                  <p className="hero-art__kicker">{pageContent.art.noteEyebrow}</p>
                  <p>{pageContent.art.noteBody}</p>
                </div>
              </aside>
            </div>

            <section className="form-panel" aria-labelledby="request-form-heading">
              <div className="panel-head panel-head--stacked">
                <div>
                  <p className="panel-head__eyebrow">{pageContent.form.eyebrow}</p>
                  <h2 id="request-form-heading">{pageContent.form.title}</h2>
                </div>

                <p className="panel-head__description">{pageContent.form.description}</p>
              </div>

              <RequestForm />

              <div className="form-callouts">
                {pageContent.form.callouts.map((item) => (
                  <article key={item.title} className="form-callout">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <section className="support-grid">
            <aside className="junk-drawer" aria-labelledby="junk-drawer-heading">
              <div className="panel-head panel-head--stacked">
                <div>
                  <p className="panel-head__eyebrow">{pageContent.sidebar.eyebrow}</p>
                  <h2 id="junk-drawer-heading">{pageContent.sidebar.title}</h2>
                </div>

                <p className="panel-head__description">{pageContent.sidebar.description}</p>
              </div>

              <div className="target-stack">
                {pageContent.sidebar.targets.map((target) => (
                  <article key={target.title} className="target-card">
                    <span className="target-card__icon">{target.icon}</span>
                    <div>
                      <h3>{target.title}</h3>
                      <p>{target.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </aside>

            <div className="guild-grid">
              {pageContent.sidebar.notes.map((note) => (
                <article key={note.title} className="guild-card">
                  <p className="guild-card__eyebrow">{note.eyebrow}</p>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </article>
              ))}
            </div>
          </section>

          <footer className="site-footer">
            <p>{pageContent.footer.copyright}</p>
            <a
              href={pageContent.footer.websiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              {pageContent.footer.websiteLabel}
            </a>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
