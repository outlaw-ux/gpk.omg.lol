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

export type ResourceCategory = {
  id: string;
  name: string;
  description: string;
  itemCountLabel: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type HeroHighlight = {
  label: string;
  value: string;
};
