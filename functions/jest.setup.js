process.env = Object.assign(process.env, {
  ENVIRONMENT: 'some-environment',
  GIT_COMMIT_SHORT: 'some-git-commit-short',
  BACKUPS_BUCKET: 'some-backups-bucket',
  SENTRY_DSN: 'some-sentry-dsn',
  DAILY_API_KEY: 'some-api-endpoint',
  DAILY_DOMAIN_ID: 'some-domain-id',
  DAILY_ID_SALT: '4e2a60ed-0264-4435-8ea8-e42950633fa3',
  DEEP_LINK_API_KEY: 'some-deep-link-api-key',
  DEEP_LINK_DOMAIN_URI_PREFIX: 'some-deep-link-domain-uri-prefix',
  DEEP_LINK_BASE_URL: 'http://some.deep/link/base/url',
  DEEP_LINK_ANDROID_PACKAGE_NAME: 'some-deep-link-android-package-name',
  DEEP_LINK_IOS_BUNDLE_ID: 'some-deep-link-ios-bundle-id',
  DEEP_LINK_IOS_APPSTORE_ID: 'some-deep-link-ios-appstore-id',
  SLACK_BOT_NAME: 'Some Bot',
  SLACK_PUBLIC_HOST_REQUESTS_CHANNEL: 'some-channel',
  SLACK_FEEDBACK_CHANNEL: 'some-channel',
  SLACK_SHARING_POSTS_CHANNEL: 'some-channel',
  SLACK_OAUTH_TOKEN: 'some-slack-oath-token',
  SLACK_SIGNING_SECRET: 'some-slack-signing-secret',
  SENDGRID_API_KEY: 'some-sending-grid-api-key',
});

global.console = {
  ...console,
  error: jest.fn(),
};
