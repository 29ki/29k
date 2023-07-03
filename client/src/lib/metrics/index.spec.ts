import {
  init,
  logEvent,
  logNavigation,
  logFeedback,
  setConsent,
  setCoreProperties,
  setUserProperties,
} from '.';
import {SessionMode, SessionType} from '../../../../shared/src/schemas/Session';
import {getCurrentRouteName} from '../navigation/utils/routes';
import * as backEnd from './adaptors/backEnd';
import * as postHog from './adaptors/postHog';

const mockGetCurrentRouteName = jest.mocked(getCurrentRouteName);

jest.mock('../navigation/utils/routes');
jest.mock('./adaptors/backEnd');
jest.mock('./adaptors/postHog');

afterEach(() => {
  jest.clearAllMocks();
});

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

  it('adds Origin property as current route name', async () => {
    mockGetCurrentRouteName.mockReturnValueOnce('Some Origin');

    await logEvent('Screen', {'Screen Name': 'some-screen'});

    expect(backEnd.logEvent).toHaveBeenCalledTimes(1);
    expect(backEnd.logEvent).toHaveBeenCalledWith('Screen', {
      Origin: 'Some Origin',
      'Screen Name': 'some-screen',
    });
    expect(postHog.logEvent).toHaveBeenCalledTimes(1);
    expect(postHog.logEvent).toHaveBeenCalledWith('Screen', {
      Origin: 'Some Origin',
      'Screen Name': 'some-screen',
    });
  });

  it('allows override of Origin property', async () => {
    mockGetCurrentRouteName.mockReturnValueOnce('Some Origin');

    await logEvent('Screen', {
      Origin: 'Some Other Origin',
      'Screen Name': 'some-screen',
    });

    expect(backEnd.logEvent).toHaveBeenCalledTimes(1);
    expect(backEnd.logEvent).toHaveBeenCalledWith('Screen', {
      Origin: 'Some Other Origin',
      'Screen Name': 'some-screen',
    });
    expect(postHog.logEvent).toHaveBeenCalledTimes(1);
    expect(postHog.logEvent).toHaveBeenCalledWith('Screen', {
      Origin: 'Some Other Origin',
      'Screen Name': 'some-screen',
    });
  });
});

describe('logNavigation', () => {
  it('calls backEnd and postHog adaptors', async () => {
    await logNavigation('Some Screen', {Origin: 'some-origin'});

    expect(backEnd.logNavigation).toHaveBeenCalledTimes(1);
    expect(backEnd.logNavigation).toHaveBeenCalledWith('Some Screen', {
      Origin: 'some-origin',
    });
    expect(postHog.logNavigation).toHaveBeenCalledTimes(1);
    expect(postHog.logNavigation).toHaveBeenCalledWith('Some Screen', {
      Origin: 'some-origin',
    });
  });
});

describe('logFeedback', () => {
  it('calls backEnd and postHog adaptors', async () => {
    await logFeedback({
      exerciseId: 'some-exercise-id',
      completed: true,
      sessionId: 'some-session-id',
      host: true,

      question: 'Some question?',
      answer: true,
      comment: 'Some comment!',
      sessionType: SessionType.public,
      sessionMode: SessionMode.live,
    });

    expect(backEnd.logFeeback).toHaveBeenCalledTimes(1);
    expect(backEnd.logFeeback).toHaveBeenCalledWith({
      exerciseId: 'some-exercise-id',
      completed: true,
      sessionId: 'some-session-id',
      host: true,

      question: 'Some question?',
      answer: true,
      comment: 'Some comment!',
      sessionType: SessionType.public,
      sessionMode: SessionMode.live,
    });
    expect(postHog.logFeeback).toHaveBeenCalledTimes(1);
    expect(postHog.logFeeback).toHaveBeenCalledWith({
      exerciseId: 'some-exercise-id',
      completed: true,
      sessionId: 'some-session-id',
      host: true,

      question: 'Some question?',
      answer: true,
      comment: 'Some comment!',
      sessionType: SessionType.public,
      sessionMode: SessionMode.live,
    });

    expect(backEnd.logEvent).toHaveBeenCalledTimes(1);
    expect(backEnd.logEvent).toHaveBeenCalledWith('Sharing Session Feedback', {
      'Exercise ID': 'some-exercise-id',
      'Feedback Answer': true,
      'Feedback Comment': 'Some comment!',
      'Feedback Question': 'Some question?',
      Host: true,
      'Sharing Session Completed': true,
      'Sharing Session ID': 'some-session-id',
      'Sharing Session Type': SessionType.public,
      'Sharing Session Mode': SessionMode.live,
    });
    expect(postHog.logEvent).toHaveBeenCalledTimes(1);
    expect(postHog.logEvent).toHaveBeenCalledWith('Sharing Session Feedback', {
      'Exercise ID': 'some-exercise-id',
      'Feedback Answer': true,
      'Feedback Comment': 'Some comment!',
      'Feedback Question': 'Some question?',
      Host: true,
      'Sharing Session Completed': true,
      'Sharing Session ID': 'some-session-id',
      'Sharing Session Type': SessionType.public,
      'Sharing Session Mode': SessionMode.live,
    });
  });
});

describe('setUserProperties', () => {
  it('calls backEnd and postHog adaptors', async () => {
    await setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(backEnd.setUserProperties).toHaveBeenCalledTimes(1);
    expect(backEnd.setUserProperties).toHaveBeenCalledWith(
      {
        'App Git Commit': 'some-git-commit',
      },
      false,
    );
    expect(postHog.setUserProperties).toHaveBeenCalledTimes(1);
    expect(postHog.setUserProperties).toHaveBeenCalledWith(
      {
        'App Git Commit': 'some-git-commit',
      },
      false,
    );
  });

  it('supports setting user properties once (idempotent)', async () => {
    await setUserProperties({'App Git Commit': 'some-git-commit'}, true);

    expect(backEnd.setUserProperties).toHaveBeenCalledTimes(1);
    expect(backEnd.setUserProperties).toHaveBeenCalledWith(
      {
        'App Git Commit': 'some-git-commit',
      },
      true,
    );
    expect(postHog.setUserProperties).toHaveBeenCalledTimes(1);
    expect(postHog.setUserProperties).toHaveBeenCalledWith(
      {
        'App Git Commit': 'some-git-commit',
      },
      true,
    );
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
