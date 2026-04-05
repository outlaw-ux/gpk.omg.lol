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
          <h2>Garbage Pail Kids links that are useful right now.</h2>
          <p>
            Hosted at <span>{domain}</span>, The Guild Hall is a straightforward hub for live
            Garbage Pail Kids resources, including GeePeeKay.com, GPKNews, Whatnot links, and
            shipping help.
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
