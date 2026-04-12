const logoSrc = `${import.meta.env.BASE_URL}brand/curators-guild-logo.png`;

export const pageContent = {
  brand: {
    name: "Curator's Guild",
    eyebrow: 'GPK Request Desk',
    note: 'A local request form for collectors chasing missing cards, variations, and want-list gaps.',
    logoSrc
  },
  hero: {
    eyebrow: 'Fresh build, no off-site form',
    title: 'Put the missing card on the board.',
    description:
      "This request desk now lives inside the app. Send the card details here and the submission stores directly in Supabase so follow-up stays local to gpk.omg.lol.",
    tags: ['Single cards', 'Want lists', 'Parallels', 'Oddball variations'],
    stats: [
      { value: 'Local', label: 'Form lives in-app' },
      { value: 'Direct', label: 'Stored in Supabase' },
      { value: 'Collector-first', label: 'Built for GPK specifics' }
    ]
  },
  process: [
    {
      step: '01',
      title: 'Describe the exact card',
      description:
        'Set, number, name, parallel, or whatever piece of the trail you already have.'
    },
    {
      step: '02',
      title: 'Add your constraints',
      description: 'Condition targets, budget ceilings, trade notes, or how close is close enough.'
    },
    {
      step: '03',
      title: 'Leave a clean contact path',
      description: 'Email is required. Add your Whatnot handle too if that is where the hobby conversation already lives.'
    }
  ],
  form: {
    eyebrow: 'Request Intake',
    title: 'Submit a card request',
    description:
      'The more specific the details, the easier it is to separate a real lead from a bad match.'
  },
  briefing: {
    eyebrow: 'What this form is for',
    title: 'Keep the ask tight.',
    description:
      'This page is built for card hunts, not a general contact inbox. A sharp request saves time on both sides.',
    items: [
      {
        title: 'Single cards work best',
        body: 'One card is ideal, but short want lists and focused parallels are still fair game.'
      },
      {
        title: 'Unknowns are fine',
        body: 'If you only know the set or part of the name, put that in the details and call out the gap.'
      },
      {
        title: 'Budget notes help',
        body: 'A rough ceiling or trade range keeps expensive surprises from wasting the follow-up.'
      }
    ]
  }
};

export const requestFormContent = {
  configMessage:
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live submissions from this form.',
  submittingMessage: 'Sending your request now...',
  successMessage: 'Request received. The card hunt is on the board.',
  errorMessage: 'The request did not save. Check the Supabase keys and table policy, then try again.',
  submitLabels: {
    idle: 'Send Request',
    submitting: 'Sending...'
  },
  labels: {
    collectorName: 'Name',
    email: 'Email',
    whatnotHandle: 'Whatnot handle',
    requestType: 'Request type',
    setName: 'Set or release',
    cardNumber: 'Card number',
    cardName: 'Card name',
    variation: 'Variation or parallel',
    conditionPreference: 'Condition target',
    budgetNotes: 'Budget or trade notes',
    requestDetails: 'Request details'
  },
  requestTypeOptions: [
    { value: 'single-card', label: 'Single card' },
    { value: 'want-list', label: 'Short want list' },
    { value: 'parallel-hunt', label: 'Parallel or variation hunt' },
    { value: 'set-help', label: 'Need help identifying the card' }
  ],
  conditionOptions: [
    { value: 'any-presentable', label: 'Any presentable copy' },
    { value: 'clean-raw', label: 'Clean raw copy' },
    { value: 'grader-ready', label: 'Grader-ready if possible' },
    { value: 'sealed-or-pack-fresh', label: 'Sealed or pack-fresh target' }
  ]
};
