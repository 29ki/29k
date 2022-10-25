process.env = Object.assign(process.env, {
  ENVIRONMENT: 'some-environment',
  GIT_COMMIT_SHORT: 'some-git-commit-short',
  SENTRY_DSN: 'some-sentry-dsn',
  DAILY_API_KEY: 'some-api-endpoint',
  DEEP_LINK_API_KEY: 'some-deep-link-api-key',
  DEEP_LINK_DOMAIN_URI_PREFIX: 'some-deep-link-domain-uri-prefix',
  DEEP_LINK_BASE_URL: 'http://some.deep/link/base/url',
  DEEP_LINK_ANDROID_PACKAGE_NAME: 'some-deep-link-android-package-name',
  DEEP_LINK_IOS_BUNDLE_ID: 'some-deep-link-ios-bundle-id',
  DEEP_LINK_IOS_APPSTORE_ID: 'some-deep-link-ios-appstore-id',
  FUNCTIONS_SLACK_OAUTH_TOKEN: 'some-slack-oath-token',
  FUNCTIONS_SLACK_SIGNING_SECRET: 'some-slack-signing-secret',
});

global.console = {
  ...console,
  error: jest.fn(),
};
