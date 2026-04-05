import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import type { NavigationLink } from '../types/content';

type SiteHeaderProps = {
  brandName: string;
  emblemSrc: string;
  navigationLinks: NavigationLink[];
};

export function SiteHeader({ brandName, emblemSrc, navigationLinks }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <a className="brand-lockup" href="#top" aria-label={`${brandName} home`}>
          <img className="brand-lockup__emblem" src={emblemSrc} alt="" aria-hidden="true" />
          <span className="brand-lockup__text">
            <span className="brand-lockup__eyebrow">Curator Network</span>
            <span className="brand-lockup__name">{brandName}</span>
          </span>
        </a>

        <NavigationMenu.Root aria-label="Primary">
          <NavigationMenu.List className="site-nav__list">
            {navigationLinks.map((link) => (
              <NavigationMenu.Item key={link.href}>
                <NavigationMenu.Link asChild>
                  <a className="site-nav__link" href={link.href}>
                    {link.label}
                  </a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </header>
  );
}
