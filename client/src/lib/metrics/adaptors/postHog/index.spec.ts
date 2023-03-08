import PostHog from 'posthog-react-native';
import type * as PostHogType from '.';

const mockPostHogClient = {
  capture: jest.fn(),
  screen: jest.fn(),
  identify: jest.fn(),
  register: jest.fn(),
  optIn: jest.fn(),
  optOut: jest.fn(),
};
jest.mock('posthog-react-native', () => ({
  initAsync: jest.fn(() => mockPostHogClient),
}));

jest.mock('../../constants', () => ({
  DEFAULT_CONSENT: false,
}));

afterEach(() => {
  jest.clearAllMocks();
});

let postHog: typeof PostHogType;
beforeEach(() => {
  jest.isolateModules(() => {
    // PostHog library is unfortunately statefull
    postHog = require('./index');
  });
});

describe('init', () => {
  it('initializes postHog', async () => {
    await postHog.init();

    expect(PostHog.initAsync).toHaveBeenCalledTimes(1);
    expect(PostHog.initAsync).toHaveBeenCalledWith('some-posthog-api-key', {
      host: 'https://eu.posthog.com',
    });
  });

  it('never initializes twice', async () => {
    await postHog.init();
    await postHog.init();

    expect(PostHog.initAsync).toHaveBeenCalledTimes(1);
    expect(PostHog.initAsync).toHaveBeenCalledWith('some-posthog-api-key', {
      host: 'https://eu.posthog.com',
    });
  });

  it('sets default consent', async () => {
    await postHog.init();

    expect(mockPostHogClient.optOut).toHaveBeenCalledTimes(1);
    expect(mockPostHogClient.optIn).toHaveBeenCalledTimes(0);
  });
});

describe('setConsent', () => {
  it('makes sure postHog is initalized', async () => {
    await postHog.setConsent(true);

    expect(PostHog.initAsync).toHaveBeenCalledTimes(1);
  });

  it('calls optIn on true', async () => {
    await postHog.setConsent(true);
    expect(mockPostHogClient.optOut).toHaveBeenCalledTimes(1); // at init
    expect(mockPostHogClient.optIn).toHaveBeenCalledTimes(1);
  });

  it('calls optOut on false', async () => {
    await postHog.setConsent(false);
    expect(mockPostHogClient.optOut).toHaveBeenCalledTimes(2); // first at init
    expect(mockPostHogClient.optIn).toHaveBeenCalledTimes(0);
  });
});

describe('logEvent', () => {
  it('requires an init first', async () => {
    await postHog.logEvent('Screen', {'Screen Name': 'some-screen'});

    expect(mockPostHogClient.capture).toHaveBeenCalledTimes(0);
  });

  it('calls capture', async () => {
    await postHog.init();
    await postHog.logEvent('Screen', {'Screen Name': 'some-screen'});

    expect(mockPostHogClient.capture).toHaveBeenCalledTimes(1);
    expect(mockPostHogClient.capture).toHaveBeenCalledWith('Screen', {
      'Screen Name': 'some-screen',
    });
  });
});

describe('logNavigation', () => {
  it('requires an init first', async () => {
    await postHog.logNavigation('Some Screen');

    expect(mockPostHogClient.screen).toHaveBeenCalledTimes(0);
  });

  it('calls capture', async () => {
    await postHog.init();
    await postHog.logNavigation('Some Screen', {Origin: 'some-origin'});

    expect(mockPostHogClient.screen).toHaveBeenCalledTimes(1);
    expect(mockPostHogClient.screen).toHaveBeenCalledWith('Some Screen', {
      Origin: 'some-origin',
    });
  });
});

describe('setUserProperties', () => {
  it('requires an init first', async () => {
    await postHog.setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(mockPostHogClient.identify).toHaveBeenCalledTimes(0);
  });

  it('calls identify', async () => {
    await postHog.init();
    await postHog.setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(mockPostHogClient.identify).toHaveBeenCalledTimes(1);
    expect(mockPostHogClient.identify).toHaveBeenCalledWith(undefined, {
      'App Git Commit': 'some-git-commit',
    });
  });
});

describe('setCoreProperties', () => {
  it('requires an init first', async () => {
    await postHog.setCoreProperties({'App Git Commit': 'some-git-commit'});

    expect(mockPostHogClient.identify).toHaveBeenCalledTimes(0);
    expect(mockPostHogClient.register).toHaveBeenCalledTimes(0);
  });

  it('calls identify', async () => {
    await postHog.init();
    await postHog.setCoreProperties({'App Git Commit': 'some-git-commit'});

    expect(mockPostHogClient.identify).toHaveBeenCalledTimes(1);
    expect(mockPostHogClient.identify).toHaveBeenCalledWith(undefined, {
      'App Git Commit': 'some-git-commit',
    });
    expect(mockPostHogClient.register).toHaveBeenCalledTimes(1);
    expect(mockPostHogClient.register).toHaveBeenCalledWith({
      'App Git Commit': 'some-git-commit',
    });
  });
});
