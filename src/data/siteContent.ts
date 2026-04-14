const guildLogoSrc = `${import.meta.env.BASE_URL}brand/curators-guild-logo.png`;
const gpkLogoSrc = `${import.meta.env.BASE_URL}brand/garbage-pail-kids-logo.png`;
const explosionSrc = `${import.meta.env.BASE_URL}art/gpk-explosion.png`;
const collageSrc = `${import.meta.env.BASE_URL}art/gpk-collage.jpg`;
const whatnotInviteUrl = 'https://whatnot.com/invite/curatorsguild';

export const pageContent = {
  brand: {
    name: 'The Guild Hall',
    subhead: 'GPK Bounty Board',
    guildLogoSrc,
    gpkLogoSrc
  },
  headerPromo: {
    eyebrow: 'Whatnot follow',
    title: "Follow Curator's Guild on Whatnot",
    description: 'Use the invite link to follow along and claim $15 in free credits.',
    href: whatnotInviteUrl,
    ctaLabel: 'Get $15'
  },
  art: {
    explosionSrc,
    collageSrc,
    noteEyebrow: 'Bounties live here',
    noteBody:
      'Use the form to post the missing piece and let the hunt start. Coming soon: a live bounty board with active collection hunts.'
  },
  hero: {
    eyebrow: 'Curate the collection. Post the bounty.',
    title: 'Request GPK cards, sketches, and weird collectibles.',
    description:
      'The Guild Hall is where you post the missing pieces: singles, sketch cards, wrappers, promos, sealed oddities, and other gross grails.',
    tags: ['Singles', 'Sketches', 'Promos', 'Oddball pieces'],
    quickCallouts: [
      {
        title: 'Curate the pile',
        body: 'Track what the collection still needs.'
      },
      {
        title: 'Guild Hall',
        body: 'A central board for active GPK hunts.'
      },
      {
        title: 'Bounties',
        body: 'Post the weird one and let people chase it.'
      }
    ]
  },
  form: {
    eyebrow: 'Post a request',
    title: 'Start the hunt',
    description: 'Keep it short, specific, and collectible-focused.',
    callouts: [
      {
        title: 'Cards',
        body: 'Singles, parallels, autos, and set gaps.'
      },
      {
        title: 'Sketches',
        body: 'Artist pieces, themes, and one-off weirdness.'
      },
      {
        title: 'Collectibles',
        body: 'Wrappers, promos, sealed packs, and oddball extras.'
      }
    ]
  },
  sidebar: {
    eyebrow: 'Callouts',
    title: 'What belongs on the board',
    description: 'If it helps finish or upgrade the collection, it belongs here.',
    targets: [
      {
        icon: '1',
        title: 'Exact singles',
        body: 'Card numbers, names, parallels, or one stubborn gap.'
      },
      {
        icon: '2',
        title: 'Sketch and artist hunts',
        body: 'Themes, characters, artists, and gross custom asks.'
      },
      {
        icon: '3',
        title: 'Oddball extras',
        body: 'Promos, wrappers, proofs, sealed material, and weird stuff.'
      }
    ],
    notes: [
      {
        eyebrow: 'Curating',
        title: 'Build the collection with intent.',
        body: 'Use the request board to focus on the pieces that actually matter instead of chasing random filler.'
      },
      {
        eyebrow: 'Guild Hall',
        title: 'One place for the active hunts.',
        body: 'The Guild Hall is the shared board for what is missing, what is wanted, and what is worth tracking down.'
      },
      {
        eyebrow: 'Bounties',
        title: 'Post the gross grail.',
        body: 'If the piece is hard to find, strange to describe, or just plain disgusting in the best way, put a bounty on it.'
      }
    ]
  },
  footer: {
    copyright: '© Riverbend Vintage Trading Company LLC',
    websiteLabel: 'www.curatorsguild.com',
    websiteUrl: 'https://www.curatorsguild.com'
  }
};

export const requestFormContent = {
  submittingMessage: 'Dropping your request into the slime pile...',
  successMessage: 'Request received. The gross hunt is live.',
  errorMessage: 'The request did not stick. Please try again.',
  verificationMessage: 'Please complete the verification check before sending the request.',
  submitLabels: {
    idle: 'Launch Request',
    submitting: 'Launching...'
  },
  labels: {
    collectorName: 'Collector name',
    email: 'Email',
    whatnotHandle: 'Whatnot handle',
    requestType: 'What are you hunting?',
    setName: 'Series / set / release',
    cardNumber: 'Card number',
    cardName: 'Card or collectible name',
    variation: 'Parallel / sketch / collectible details',
    conditionPreference: 'Condition target',
    budgetNotes: 'Budget / trade notes',
    requestDetails: 'What exactly are you after?'
  },
  requestTypeOptions: [
    { value: 'single-card', label: 'Single card' },
    { value: 'sketch-card', label: 'Sketch or artist piece' },
    { value: 'oddball-collectible', label: 'Oddball collectible' },
    { value: 'want-list', label: 'Short want list' },
    { value: 'set-help', label: 'Need help identifying it' }
  ],
  conditionOptions: [
    { value: 'any-displayable', label: 'Any displayable copy' },
    { value: 'clean-raw', label: 'Clean raw copy' },
    { value: 'high-end', label: 'High-end / premium example' },
    { value: 'sealed-preferred', label: 'Sealed if that applies' }
  ]
};
