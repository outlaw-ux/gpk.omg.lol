import * as Separator from '@radix-ui/react-separator';
import type { FooterLink } from '../types/content';

type SiteFooterProps = {
  domain: string;
  emblemSrc: string;
  links: FooterLink[];
};

export function SiteFooter({ domain, emblemSrc, links }: SiteFooterProps) {
  return (
    <footer className="site-footer" id="submit">
      <Separator.Root decorative className="section-divider shell-divider" />

      <div className="shell site-footer__inner">
        <div className="site-footer__summary" id="about">
          <img className="site-footer__emblem" src={emblemSrc} alt="" aria-hidden="true" />
          <p className="section-overline">The Guild Hall</p>
          <h2>Keep the good tabs. Lose the noise.</h2>
          <p>
            Hosted at <span>{domain}</span>, The Guild Hall keeps the practical side of the GPK
            hobby close: set work, hobby coverage, comps, marketplace links, and shipping.
          </p>
        </div>

        <nav className="site-footer__links" aria-label="Footer links">
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
