import type {
  FooterLink,
  HeroHighlight,
  NavigationLink,
  ResourceCategory,
  ResourceEntry
} from '../types/content';

export const siteMeta = {
  name: 'The Guild Hall',
  domain: 'omg.gpk.lol',
  logoSrc: `${import.meta.env.BASE_URL}brand/the-guild-hall-logo.png`,
  emblemSrc: `${import.meta.env.BASE_URL}brand/the-guild-hall-emblem.png`,
  eyebrow: 'Curated archive for cardboard obsessives',
  heroTitle: 'A collector-first hub for trading card buyers, sellers, and traders.',
  heroDescription:
    'The Guild Hall brings together trusted links, market references, release intel, and hobby utilities in one calm, polished website. It starts as a curated resource index now and can grow into a full library later.'
};

export const navigationLinks: NavigationLink[] = [
  { href: '#resources', label: 'Resources' },
  { href: '#categories', label: 'Categories' },
  { href: '#submit', label: 'Contribute' }
];

export const heroHighlights: HeroHighlight[] = [
  { label: 'Links', value: '4 live resources' },
  { label: 'Focus', value: 'Buy, sell, trade' },
  { label: 'Next', value: 'Searchable library' }
];

// Keep the initial content data-driven so future search, tags, and featured logic
// can evolve without rewriting the layout components.
export const featuredResources: ResourceEntry[] = [
  {
    id: 'request-an-item',
    title: 'Request an Item',
    category: 'Collector Requests',
    description:
      'Tell us what you are hunting for and make that request the starting point. This is the clearest way to shape what gets sourced, listed, and prioritized next.',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLScVFoit_V1vJvJwFbnbNaSuuChJcNO2ukPNXXIfB-WGyIOS7A/viewform?usp=sharing&ouid=114588655259468960497',
    status: 'Highlighted now',
    tags: ['Requests', 'Wish list', 'Sourcing'],
    ctaLabel: 'Request an item',
    featured: true
  },
  {
    id: 'seller-invite',
    title: 'Sell on Whatnot',
    category: 'Seller Tools',
    description:
      'Invite other sellers to join through Curators Guild and earn a $150 bonus during their first week on the platform.',
    href: 'https://whatnot.com/invite/seller/curatorsguild',
    status: 'Launch link',
    tags: ['Seller invite', 'Whatnot', 'Referral'],
    ctaLabel: 'Invite a seller'
  },
  {
    id: 'buyer-invite',
    title: 'Shop on Whatnot',
    category: 'Buyer Links',
    description:
      'Send collectors to the Curators Guild shop and give them a $15 credit on Whatnot to get them through the door.',
    href: 'https://whatnot.com/invite/curatorsguild',
    status: 'Starter perk',
    tags: ['Buyer invite', 'Whatnot', 'Credit'],
    ctaLabel: 'Invite a buyer'
  },
  {
    id: 'geepeekay-checklists',
    title: 'GeePeekay Checklists',
    category: 'Checklists',
    description:
      'The checklist section starts with geepeekay.com, a practical reference for tracking sets, parallels, and collector targets.',
    href: 'https://geepeekay.com',
    status: 'Trusted reference',
    tags: ['Checklists', 'Set tracking', 'Reference'],
    ctaLabel: 'Open checklist resource'
  },
  {
    id: 'pirate-ship',
    title: 'Pirate Ship',
    category: 'Shipping Savings',
    description:
      'Use Pirate Ship to cut label costs, keep shipping lean, and make routine card fulfillment less painful.',
    href: 'https://www.pirateship.com',
    status: 'Money saver',
    tags: ['Shipping', 'Labels', 'Savings'],
    ctaLabel: 'Open Pirate Ship'
  },
  {
    id: 'community-links',
    title: 'Community Links',
    category: 'Community',
    description:
      'A short list of hobby spaces, helpful creators, and online channels where collector knowledge compounds.',
    href: 'https://example.com/resources/community-links',
    status: 'Curated list',
    tags: ['Communities', 'Creators', 'Learning'],
    ctaLabel: 'Open placeholder resource'
  },
  {
    id: 'release-trackers',
    title: 'Release Trackers',
    category: 'Product Watch',
    description:
      'Upcoming products, hobby dates, and release windows organized into a calmer view of the calendar.',
    href: 'https://example.com/resources/release-trackers',
    status: 'Always useful',
    tags: ['Releases', 'Calendar', 'Watchlist'],
    ctaLabel: 'Open placeholder resource'
  },
  {
    id: 'vintage-card-resources',
    title: 'Vintage Card Resources',
    category: 'Historic Cardboard',
    description:
      'References for older sets, grading context, archival checklists, and era-specific buying wisdom.',
    href: 'https://example.com/resources/vintage-card-resources',
    status: 'Deep archive',
    tags: ['Vintage', 'Archival', 'Condition'],
    ctaLabel: 'Open placeholder resource'
  },
  {
    id: 'non-sports-card-resources',
    title: 'Non-Sports Card Resources',
    category: 'Beyond Sports',
    description:
      'A home for entertainment, oddball, and cross-category resources that serious collectors still need.',
    href: 'https://example.com/resources/non-sports-card-resources',
    status: 'Growing lane',
    tags: ['Non-sports', 'Oddball', 'Cross-collecting'],
    ctaLabel: 'Open placeholder resource'
  }
];

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'market-intel',
    name: 'Market Intel',
    description:
      'Active links for buyer invites, seller invites, and practical tools that help hobby traffic keep moving.',
    itemCountLabel: '2 live entries',
    futureModules: ['Price history', 'Trending tags', 'Featured analysts']
  },
  {
    id: 'set-building',
    name: 'Set Building',
    description:
      'Checklists, release notes, and collector aids for turning scattered links into usable set knowledge.',
    itemCountLabel: '1 live entry',
    futureModules: ['Master checklists', 'Parallel filters', 'Want-list tools']
  },
  {
    id: 'shipping-and-logistics',
    name: 'Shipping and Logistics',
    description:
      'Packing standards, postage savings, and practical references for safer, cleaner transactions.',
    itemCountLabel: '1 live entry',
    futureModules: ['Packing guides', 'Supply tags', 'Rate calculators']
  },
  {
    id: 'community-and-learning',
    name: 'Community and Learning',
    description:
      'Trusted hobby spaces, guides, request flows, and voices that make the category more legible without the noise.',
    itemCountLabel: '1 featured action',
    futureModules: ['Creator spotlights', 'Beginner paths', 'Submission queue']
  }
];

export const footerLinks: FooterLink[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/curatorgpk/' },
  { label: 'Instagram', href: 'https://www.instagram.com/thecuratorsguild/' },
  { label: 'Whatnot Shop', href: 'https://whatnot.com/invite/curatorsguild' },
  { label: 'GeePeekay', href: 'https://geepeekay.com' }
];
