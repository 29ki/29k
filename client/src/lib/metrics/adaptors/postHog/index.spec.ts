import PostHog from 'posthog-react-native';
import type * as PostHogType from '.';

jest.mock('posthog-react-native');

const optInMock = jest.spyOn(PostHog.prototype, 'optIn');
const optOutMock = jest.spyOn(PostHog.prototype, 'optOut');
const captureMock = jest.spyOn(PostHog.prototype, 'capture');
const screenMock = jest.spyOn(PostHog.prototype, 'screen');
const identifyMock = jest.spyOn(PostHog.prototype, 'identify');
const registerMock = jest.spyOn(PostHog.prototype, 'register');

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

    expect(PostHog).toHaveBeenCalledTimes(1);
    expect(PostHog).toHaveBeenCalledWith('some-posthog-api-key', {
      host: 'https://eu.posthog.com',
    });
  });

  it('never initializes twice', async () => {
    await postHog.init();
    await postHog.init();

    expect(PostHog).toHaveBeenCalledTimes(1);
    expect(PostHog).toHaveBeenCalledWith('some-posthog-api-key', {
      host: 'https://eu.posthog.com',
    });
  });

  it('sets default consent', async () => {
    await postHog.init();

    expect(optOutMock).toHaveBeenCalledTimes(1);
    expect(optInMock).toHaveBeenCalledTimes(0);
  });
});

describe('setConsent', () => {
  it('makes sure postHog is initalized', async () => {
    await postHog.setConsent(true);

    expect(PostHog).toHaveBeenCalledTimes(1);
  });

  it('calls optIn on true', async () => {
    await postHog.setConsent(true);
    expect(optOutMock).toHaveBeenCalledTimes(1); // at init
    expect(optInMock).toHaveBeenCalledTimes(1);
  });

  it('calls optOut on false', async () => {
    await postHog.setConsent(false);
    expect(optOutMock).toHaveBeenCalledTimes(2); // first at init
    expect(optInMock).toHaveBeenCalledTimes(0);
  });
});

describe('logEvent', () => {
  it('requires an init first', async () => {
    await postHog.logEvent('Screen', {'Screen Name': 'some-screen'});

    expect(captureMock).toHaveBeenCalledTimes(0);
  });

  it('calls capture', async () => {
    await postHog.init();
    await postHog.logEvent('Screen', {'Screen Name': 'some-screen'});

    expect(captureMock).toHaveBeenCalledTimes(1);
    expect(captureMock).toHaveBeenCalledWith('Screen', {
      'Screen Name': 'some-screen',
    });
  });
});

describe('logNavigation', () => {
  it('requires an init first', async () => {
    await postHog.logNavigation('Some Screen');

    expect(screenMock).toHaveBeenCalledTimes(0);
  });

  it('calls screen', async () => {
    await postHog.init();
    await postHog.logNavigation('Some Screen', {Origin: 'some-origin'});

    expect(screenMock).toHaveBeenCalledTimes(1);
    expect(screenMock).toHaveBeenCalledWith('Some Screen', {
      Origin: 'some-origin',
    });
  });
});

describe('setUserProperties', () => {
  it('requires an init first', async () => {
    await postHog.setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(identifyMock).toHaveBeenCalledTimes(0);
  });

  it('calls identify', async () => {
    await postHog.init();
    await postHog.setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(identifyMock).toHaveBeenCalledTimes(1);
    expect(identifyMock).toHaveBeenCalledWith(undefined, {
      'App Git Commit': 'some-git-commit',
    });
  });

  it('supports setting properties once (idempotent)', async () => {
    await postHog.init();
    await postHog.setUserProperties(
      {'App Git Commit': 'some-git-commit'},
      true,
    );

    expect(identifyMock).toHaveBeenCalledTimes(1);
    expect(identifyMock).toHaveBeenCalledWith(undefined, {
      $set_once: {
        'App Git Commit': 'some-git-commit',
      },
    });
  });
});

describe('setCoreProperties', () => {
  it('requires an init first', async () => {
    await postHog.setCoreProperties({'App Git Commit': 'some-git-commit'});

    expect(identifyMock).toHaveBeenCalledTimes(0);
    expect(registerMock).toHaveBeenCalledTimes(0);
  });

  it('calls identify', async () => {
    await postHog.init();
    await postHog.setCoreProperties({'App Git Commit': 'some-git-commit'});

    expect(identifyMock).toHaveBeenCalledTimes(1);
    expect(identifyMock).toHaveBeenCalledWith(undefined, {
      'App Git Commit': 'some-git-commit',
    });
    expect(registerMock).toHaveBeenCalledTimes(1);
    expect(registerMock).toHaveBeenCalledWith({
      'App Git Commit': 'some-git-commit',
    });
  });
});
