const contributionTypes = {
  marketing: {
    symbol: '📣',
    description: 'Marketing',
  },
  userExperience: {
    symbol: '✨',
    description: 'User Experience',
  },
  people: {
    symbol: '👥',
    description: 'People',
  },
  coreTeam: {
    symbol: '🫂',
    description: 'Core Team',
  },
  a11y: {
    symbol: '️️️️♿️',
    description: 'Accessibility',
  },
  audio: {
    symbol: '🔊',
    description: 'Audio',
  },
  blog: {
    symbol: '📝',
    description: 'Blogposts',
  },
  bug: {
    symbol: '🐛',
    description: 'Bug reports',
  },
  business: {
    symbol: '💼',
    description: 'Business development',
  },
  code: {
    symbol: '💻',
    description: 'Code',
  },
  content: {
    symbol: '🖋',
    description: 'Content',
  },
  data: {
    symbol: '🔣',
    description: 'Data',
  },
  design: {
    symbol: '🎨',
    description: 'Design',
  },
  doc: {
    symbol: '📖',
    description: 'Documentation',
  },
  eventOrganizing: {
    symbol: '📋',
    description: 'Event Organizing',
  },
  example: {
    symbol: '💡',
    description: 'Examples',
  },
  financial: {
    symbol: '💵',
    description: 'Financial',
  },
  fundingFinding: {
    symbol: '🔍',
    description: 'Funding Finding',
  },
  ideas: {
    symbol: '🤔',
    description: 'Ideas, Planning, & Feedback',
  },
  infra: {
    symbol: '🚇',
    description: 'Infrastructure (Hosting, Build-Tools, etc)',
  },
  maintenance: {
    symbol: '🚧',
    description: 'Maintenance',
  },
  mentoring: {
    symbol: '🧑‍🏫',
    description: 'Mentoring',
  },
  platform: {
    symbol: '📦',
    description: 'Packaging/porting to new platform',
  },
  plugin: {
    symbol: '🔌',
    description: 'Plugin/utility libraries',
  },
  projectManagement: {
    symbol: '📆',
    description: 'Project Management',
  },
  question: {
    symbol: '💬',
    description: 'Answering Questions',
  },
  research: {
    symbol: '🔬',
    description: 'Research',
  },
  review: {
    symbol: '👀',
    description: 'Reviewed Pull Requests',
  },
  security: {
    symbol: '🛡️',
    description: 'Security',
  },
  talk: {
    symbol: '📢',
    description: 'Talks',
  },
  test: {
    symbol: '⚠️',
    description: 'Tests',
  },
  tool: {
    symbol: '🔧',
    description: 'Tools',
  },
  translation: {
    symbol: '🌍',
    description: 'Translation',
  },
  tutorial: {
    symbol: '✅',
    description: 'Tutorials',
  },
  userTesting: {
    symbol: '📓',
    description: 'User Testing',
  },
  video: {
    symbol: '📹',
    description: 'Videos',
  },
};

export default [
  {
    label: 'Contributors',
    label_singular: 'Contributor',
    name: 'contributors',
    widget: 'list',
    fields: [
      {
        label: 'Name',
        name: 'name',
        widget: 'string',
      },
      {
        label: 'Avatar',
        name: 'avatar_url',
        widget: 'image',
      },
      {
        label: 'Profile URL',
        name: 'profile',
        widget: 'string',
      },
      {
        label: 'GitHub username',
        name: 'login',
        widget: 'string',
        required: false,
      },
      {
        label: 'Contributions',
        name: 'contributions',
        widget: 'select',
        multiple: true,
        options: Object.entries(contributionTypes)
          .sort(([typeA], [typeB]) => (typeA > typeB ? 1 : -1))
          .map(([type, {symbol, description}]) => ({
            value: type,
            label: `${symbol} ${description}`,
          })),
      },
    ],
  },
];
