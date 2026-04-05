import { ButtonLink } from './ButtonLink';
import type { HeroHighlight } from '../types/content';

type HeroSectionProps = {
  logoSrc: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: {
    href: string;
    label: string;
  };
  secondaryCta: {
    href: string;
    label: string;
  };
  highlights: HeroHighlight[];
};

export function HeroSection({
  logoSrc,
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  highlights
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="shell hero-section__grid">
        <div className="hero-copy">
          <img className="hero-copy__logo" src={logoSrc} alt="The Guild Hall" />
          <p className="section-overline">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero-copy__description">{description}</p>

          <div className="hero-copy__actions">
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            <ButtonLink href={secondaryCta.href} tone="secondary">
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Guild Hall highlights">
          <div className="hero-panel__cap">Collector Bench</div>
          <p className="hero-panel__lead">
            The fast path from checklist to comp to shipped package.
          </p>

          <dl className="hero-panel__stats">
            {highlights.map((highlight) => (
              <div key={highlight.label} className="hero-panel__stat">
                <dt>{highlight.label}</dt>
                <dd>{highlight.value}</dd>
              </div>
            ))}
          </dl>

          <div className="hero-panel__note">
            Built for the collector who would rather verify the card than listen to the pitch.
          </div>
        </aside>
      </div>
    </section>
  );
}
