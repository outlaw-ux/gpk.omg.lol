import type {
  FooterLink,
  HeroHighlight,
  NavigationLink,
  ResourceCategory,
  ResourceEntry
} from '../types/content';

export const siteMeta = {
  name: 'The Guild Hall',
  domain: 'gpk.omg.lol',
  logoSrc: `${import.meta.env.BASE_URL}brand/the-guild-hall-logo.png`,
  emblemSrc: `${import.meta.env.BASE_URL}brand/the-guild-hall-emblem.png`,
  eyebrow: 'Garbage Pail Kids resource hub',
  heroTitle: 'Live links for Garbage Pail Kids collectors, sellers, and traders.',
  heroDescription:
    'The Guild Hall brings together GeePeeKay.com, GPKNews, PriceCharting, 130Point, Whatnot links, and practical shipping tools for Garbage Pail Kids collectors.'
};

export const navigationLinks: NavigationLink[] = [
  { href: '#resources', label: 'Resources' },
  { href: '#categories', label: 'Categories' },
  { href: '#submit', label: 'Contribute' }
];

export const featuredResources: ResourceEntry[] = [
  {
    id: 'request-an-item',
    title: 'Request an Item',
    category: 'Collector Requests',
    description:
      'Use the request form to flag the GPK items, sets, or references you want help tracking down.',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLScVFoit_V1vJvJwFbnbNaSuuChJcNO2ukPNXXIfB-WGyIOS7A/viewform?usp=sharing&ouid=114588655259468960497',
    status: 'Open form',
    tags: ['Requests', 'Wish list', 'Collector help'],
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
    title: 'GeePeeKay.com',
    category: 'Checklists',
    description:
      'GeePeeKay.com is a practical reference for Garbage Pail Kids checklists, set tracking, and parallel chasing.',
    href: 'https://geepeekay.com',
    status: 'Trusted reference',
    tags: ['Checklists', 'Set tracking', 'Reference'],
    ctaLabel: 'Visit GeePeeKay.com'
  },
  {
    id: 'gpknews',
    title: 'GPKNews',
    category: 'News',
    description:
      'GPKNews covers Garbage Pail Kids news, product information, hobby updates, and reference posts collectors actually use.',
    href: 'https://gpknews.com',
    status: 'Live coverage',
    tags: ['News', 'Products', 'Updates'],
    ctaLabel: 'Read GPKNews'
  },
  {
    id: 'pricecharting',
    title: 'PriceCharting',
    category: 'Pricing',
    description:
      'PriceCharting gives collectors a quick way to check market values, recent price history, and category-wide pricing data.',
    href: 'https://www.pricecharting.com',
    status: 'Pricing guide',
    tags: ['Pricing', 'Comps', 'Market value'],
    ctaLabel: 'Open PriceCharting'
  },
  {
    id: '130point',
    title: '130Point',
    category: 'Sales Comps',
    description:
      '130Point is useful for checking sold listings and comparing actual sales data when you need better comp work.',
    href: 'https://130point.com',
    status: 'Sales comps',
    tags: ['Comps', 'Sold listings', 'Pricing'],
    ctaLabel: 'Open 130Point'
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
  }
];

const liveResourceCount = featuredResources.length;

export const heroHighlights: HeroHighlight[] = [
  { label: 'Links', value: `${liveResourceCount} resources` },
  { label: 'Focus', value: 'Checklists, news, comps' },
  { label: 'Includes', value: 'GeePeeKay.com + GPKNews' }
];

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'market-intel',
    name: 'Market Links',
    description:
      'Buyer and seller links, pricing references, and sales comp tools for making cleaner buying and selling decisions.',
    itemCountLabel: '4 resources'
  },
  {
    id: 'checklists-and-news',
    name: 'Checklists and News',
    description:
      'Current references for checklist research, set tracking, product coverage, and everyday hobby updates.',
    itemCountLabel: '2 resources'
  },
  {
    id: 'shipping-and-logistics',
    name: 'Shipping and Logistics',
    description:
      'A practical lane for saving money on labels and making routine order fulfillment easier.',
    itemCountLabel: '1 resource'
  },
  {
    id: 'collector-help',
    name: 'Collector Help',
    description:
      'A direct path for collectors who want to request help finding a specific item or resource.',
    itemCountLabel: '1 form'
  }
];

export const footerLinks: FooterLink[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/curatorgpk/' },
  { label: 'Instagram', href: 'https://www.instagram.com/thecuratorsguild/' },
  { label: 'Whatnot Shop', href: 'https://whatnot.com/invite/curatorsguild' },
  { label: 'GeePeeKay.com', href: 'https://geepeekay.com' },
  { label: 'GPKNews', href: 'https://gpknews.com' },
  { label: 'PriceCharting', href: 'https://www.pricecharting.com' },
  { label: '130Point', href: 'https://130point.com' }
];
