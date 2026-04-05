import { ButtonLink } from './ButtonLink';
import type { HeroAction } from '../types/content';

type HeroSectionProps = {
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
  actions: HeroAction[];
};

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  actions
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="shell hero-section__grid">
        <div className="hero-copy">
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

        <aside className="hero-panel" aria-label="Guild Hall quick links">
          <div className="hero-panel__cap">Quick Links</div>
          <p className="hero-panel__lead">
            Open the task you came for.
          </p>

          <div className="hero-panel__actions" role="list">
            {actions.map((action) => (
              <a
                key={action.title}
                className="hero-action-card"
                href={action.href}
                target="_blank"
                rel="noreferrer"
                role="listitem"
              >
                <p className="hero-action-card__label">{action.label}</p>
                <h2 className="hero-action-card__title">{action.title}</h2>
                <p className="hero-action-card__description">{action.description}</p>
                <span className="hero-action-card__cta">{action.ctaLabel}</span>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
