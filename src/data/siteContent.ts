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
  eyebrow: 'A cleaner desk for GPK collectors',
  heroTitle: 'Keep the right tabs open.',
  heroDescription:
    'The Guild Hall keeps the useful part of the hobby within reach: GeePeeKay.com for set work, GPKNews for the hobby pulse, PriceCharting and 130Point for comps, plus Whatnot and Pirate Ship when it is time to make the deal move.'
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
      'Put the missing card, set, or reference on the radar when the trail goes cold.',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLScVFoit_V1vJvJwFbnbNaSuuChJcNO2ukPNXXIfB-WGyIOS7A/viewform?usp=sharing&ouid=114588655259468960497',
    status: 'Need help?',
    tags: ['Requests', 'Wish list', 'Collector help'],
    ctaLabel: 'Send a request',
    featured: true
  },
  {
    id: 'seller-invite',
    title: 'Sell on Whatnot',
    category: 'Seller Tools',
    description:
      'A direct seller invite through Curators Guild for people ready to start listing on Whatnot.',
    href: 'https://whatnot.com/invite/seller/curatorsguild',
    status: 'Seller ramp',
    tags: ['Seller invite', 'Whatnot', 'Referral'],
    ctaLabel: 'Invite a seller'
  },
  {
    id: 'buyer-invite',
    title: 'Shop on Whatnot',
    category: 'Buyer Links',
    description:
      'A buyer invite that gives new shoppers a credit and an easy first step into the room.',
    href: 'https://whatnot.com/invite/curatorsguild',
    status: 'Buyer ramp',
    tags: ['Buyer invite', 'Whatnot', 'Credit'],
    ctaLabel: 'Invite a buyer'
  },
  {
    id: 'geepeekay-com',
    title: 'GeePeeKay.com',
    category: 'Checklists',
    description:
      'The checklist desk for set structure, parallels, and naming that actually lines up.',
    href: 'https://geepeekay.com',
    status: 'Set desk',
    tags: ['Checklists', 'Set tracking', 'Reference'],
    ctaLabel: 'Visit GeePeeKay.com'
  },
  {
    id: 'gpknews',
    title: 'GPKNews',
    category: 'News',
    description:
      'The hobby wire for product shots, release chatter, and the updates collectors pass around fast.',
    href: 'https://gpknews.com',
    status: 'Hobby wire',
    tags: ['News', 'Products', 'Updates'],
    ctaLabel: 'Read GPKNews'
  },
  {
    id: 'pricecharting',
    title: 'PriceCharting',
    category: 'Pricing',
    description:
      'A quick temperature check on value before you buy, list, or start arguing with a comp.',
    href: 'https://www.pricecharting.com',
    status: 'Value check',
    tags: ['Pricing', 'Comps', 'Market value'],
    ctaLabel: 'Open PriceCharting'
  },
  {
    id: '130point',
    title: '130Point',
    category: 'Sales Comps',
    description:
      'The receipts. Sold listings matter more than hopeful asking prices.',
    href: 'https://130point.com',
    status: 'Receipt check',
    tags: ['Comps', 'Sold listings', 'Pricing'],
    ctaLabel: 'Open 130Point'
  },
  {
    id: 'pirate-ship',
    title: 'Pirate Ship',
    category: 'Shipping Savings',
    description:
      'The part after the sale: cheaper labels, cleaner fulfillment, fewer excuses.',
    href: 'https://www.pirateship.com',
    status: 'Ship it',
    tags: ['Shipping', 'Labels', 'Savings'],
    ctaLabel: 'Open Pirate Ship'
  }
];

export const heroHighlights: HeroHighlight[] = [
  { label: 'Track the set', value: 'GeePeeKay.com + GPKNews' },
  { label: 'Check the comp', value: 'PriceCharting + 130Point' },
  { label: 'Move the card', value: 'Whatnot + Pirate Ship' }
];

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'market-intel',
    name: 'Comp Bench',
    description:
      'Pricing references, sold comps, and marketplace links for making cleaner buying and selling decisions.',
    itemCountLabel: '4 tabs'
  },
  {
    id: 'checklists-and-news',
    name: 'Set Desk',
    description:
      'Checklist work, set tracking, product coverage, and hobby updates without the clutter.',
    itemCountLabel: '2 tabs'
  },
  {
    id: 'shipping-and-logistics',
    name: 'Shipping Desk',
    description:
      'The practical side of the hobby once the deal is done and the label still needs to get made.',
    itemCountLabel: '1 tab'
  },
  {
    id: 'collector-help',
    name: 'Help Wanted',
    description:
      'A direct way to raise your hand when a card, set, or reference is still missing from the stack.',
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
