import {
  init,
  logEvent,
  setConsent,
  setCoreProperties,
  setUserProperties,
} from '.';
import * as backEnd from './adaptors/backEnd';
import * as postHog from './adaptors/postHog';

jest.mock('./adaptors/backEnd');
jest.mock('./adaptors/postHog');

describe('init', () => {
  it('calls backEnd and postHog adaptors', async () => {
    await init();

    expect(backEnd.init).toHaveBeenCalledTimes(1);
    expect(postHog.init).toHaveBeenCalledTimes(1);
  });
});

describe('setConsent', () => {
  it('calls backEnd and postHog adaptors', async () => {
    await setConsent(true);

    expect(backEnd.setConsent).toHaveBeenCalledTimes(1);
    expect(backEnd.setConsent).toHaveBeenCalledWith(true);
    expect(postHog.setConsent).toHaveBeenCalledTimes(1);
    expect(postHog.setConsent).toHaveBeenCalledWith(true);
  });
});

describe('logEvent', () => {
  it('calls backEnd and postHog adaptors', async () => {
    await logEvent('Screen', {'Screen Name': 'some-screen'});

    expect(backEnd.logEvent).toHaveBeenCalledTimes(1);
    expect(backEnd.logEvent).toHaveBeenCalledWith('Screen', {
      'Screen Name': 'some-screen',
    });
    expect(postHog.logEvent).toHaveBeenCalledTimes(1);
    expect(postHog.logEvent).toHaveBeenCalledWith('Screen', {
      'Screen Name': 'some-screen',
    });
  });
});

describe('setUserProperties', () => {
  it('calls backEnd and postHog adaptors', async () => {
    await setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(backEnd.setUserProperties).toHaveBeenCalledTimes(1);
    expect(backEnd.setUserProperties).toHaveBeenCalledWith({
      'App Git Commit': 'some-git-commit',
    });
    expect(postHog.setUserProperties).toHaveBeenCalledTimes(1);
    expect(postHog.setUserProperties).toHaveBeenCalledWith({
      'App Git Commit': 'some-git-commit',
    });
  });
});

describe('setCoreProperties', () => {
  it('calls backEnd and postHog adaptors', async () => {
    await setCoreProperties({'App Git Commit': 'some-git-commit'});

    expect(backEnd.setCoreProperties).toHaveBeenCalledTimes(1);
    expect(backEnd.setCoreProperties).toHaveBeenCalledWith({
      'App Git Commit': 'some-git-commit',
    });
    expect(postHog.setCoreProperties).toHaveBeenCalledTimes(1);
    expect(postHog.setCoreProperties).toHaveBeenCalledWith({
      'App Git Commit': 'some-git-commit',
    });
  });
});
