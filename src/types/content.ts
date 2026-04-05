export type NavigationLink = {
  href: string;
  label: string;
};

export type ResourceEntry = {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  status: string;
  tags: string[];
  ctaLabel: string;
  featured?: boolean;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type HeroAction = {
  label: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};
