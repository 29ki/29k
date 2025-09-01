process.env = Object.assign(process.env, {
  AIRBRIDGE_API_TOKEN: 'some-air-bridge-api-key',
  BACKUPS_BUCKET: 'some-backups-bucket',
  DAILY_API_KEY: 'some-api-endpoint',
  DAILY_DOMAIN_ID: 'some-domain-id',
  DAILY_ID_SALT: '4e2a60ed-0264-4435-8ea8-e42950633fa3',
  DEEP_LINK_SCHEME: 'some.deep.link.scheme',
  ENVIRONMENT: 'some-environment',
  GIT_COMMIT_SHORT: 'some-git-commit-short',
  OPENAI_API_KEY: 'some-openai-api-key',
  SENDGRID_API_KEY: 'some-sending-grid-api-key',
  SENTRY_DSN: 'some-sentry-dsn',
  SLACK_BOT_NAME: 'Some Bot',
  SLACK_FEEDBACK_CHANNEL: 'some-channel',
  SLACK_OAUTH_TOKEN: 'some-slack-oath-token',
  SLACK_PUBLIC_HOST_REQUESTS_CHANNEL: 'some-channel',
  SLACK_SHARING_POSTS_CHANNEL: 'some-channel',
  SLACK_SIGNING_SECRET: 'some-slack-signing-secret',
  STRIPE_API_KEY: 'some-stripe-api-key',
});

global.console = {
  ...console,
  error: jest.fn(),
};
