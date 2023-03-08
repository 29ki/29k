import type * as BackEndAdaptorType from '.';
import getMetricsUid from './utils/getMetricsUid';
import metricsClient from './utils/metricsClient';

jest.mock('./utils/getMetricsUid');
jest.mock('./utils/metricsClient');

jest.mock('../../index', () => ({
  DEFAULT_CONSENT: true,
}));

let backEnd: typeof BackEndAdaptorType;
beforeEach(() => {
  jest.isolateModules(() => {
    // Metrics library is unfortunately statefull with coreProperties
    backEnd = require('./index');
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('logEvent', () => {
  it('sends events to back-end', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-02-02'));
    jest.mocked(getMetricsUid).mockReturnValueOnce('some-metrics-uid');

    await backEnd.logEvent('Screen', {'Screen Name': 'foo'});

    expect(metricsClient).toHaveBeenCalledTimes(1);
    expect(metricsClient).toHaveBeenCalledWith('logEvent/some-metrics-uid', {
      body: '{"timestamp":"2022-02-02T00:00:00.000Z","event":"Screen","properties":{"Screen Name":"foo"}}',
      method: 'POST',
    });
  });

  it('does not send events if metricsUid is undefined', async () => {
    jest.mocked(getMetricsUid).mockReturnValueOnce(undefined);

    await backEnd.logEvent('Screen', {'Screen Name': 'foo'});

    expect(metricsClient).toHaveBeenCalledTimes(0);
  });

  it('does not send events if no consent is given', async () => {
    jest.mocked(getMetricsUid).mockReturnValueOnce('some-metrics-uid');
    backEnd.setConsent(false);

    await backEnd.logEvent('Screen', {'Screen Name': 'foo'});

    expect(metricsClient).toHaveBeenCalledTimes(0);
  });
});

describe('logNavigation', () => {
  it('logs Screen events', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-02-02'));
    jest.mocked(getMetricsUid).mockReturnValueOnce('some-metrics-uid');

    await backEnd.logNavigation('Some Screen', {Origin: 'some-origin'});

    expect(metricsClient).toHaveBeenCalledTimes(1);
    expect(metricsClient).toHaveBeenCalledWith('logEvent/some-metrics-uid', {
      body: '{"timestamp":"2022-02-02T00:00:00.000Z","event":"Screen","properties":{"Origin":"some-origin","Screen Name":"Some Screen"}}',
      method: 'POST',
    });
  });
});

describe('logFeedback', () => {
  it('sends feedback to back-end', async () => {
    await backEnd.logFeeback({
      exerciseId: 'some-exercise-id',
      completed: true,
      sessionId: 'some-session-id',
      host: true,

      question: 'Some question?',
      answer: true,
      comment: 'Some comment!',
    });

    expect(metricsClient).toHaveBeenCalledTimes(1);
    expect(metricsClient).toHaveBeenCalledWith('logFeedback', {
      body: '{"exerciseId":"some-exercise-id","completed":true,"sessionId":"some-session-id","host":true,"question":"Some question?","answer":true,"comment":"Some comment!"}',
      method: 'POST',
    });
  });
});

describe('setUserProperties', () => {
  it('sends properties to back-end', async () => {
    jest.mocked(getMetricsUid).mockReturnValueOnce('some-metrics-uid');

    await backEnd.setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(metricsClient).toHaveBeenCalledTimes(1);
    expect(metricsClient).toHaveBeenCalledWith(
      'userProperties/some-metrics-uid',
      {
        body: '{"App Git Commit":"some-git-commit"}',
        method: 'POST',
      },
    );
  });

  it('does not send properties if metricsUid is undefined', async () => {
    jest.mocked(getMetricsUid).mockReturnValueOnce(undefined);

    await backEnd.setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(metricsClient).toHaveBeenCalledTimes(0);
  });

  it('does not send events if no consent is given', async () => {
    jest.mocked(getMetricsUid).mockReturnValueOnce('some-metrics-uid');
    backEnd.setConsent(false);

    await backEnd.setUserProperties({'App Git Commit': 'some-git-commit'});

    expect(metricsClient).toHaveBeenCalledTimes(0);
  });
});

describe('setCoreProperties', () => {
  it('calls setUserProperties', async () => {
    jest.mocked(getMetricsUid).mockReturnValueOnce('some-metrics-uid');

    await backEnd.setCoreProperties({'App Git Commit': 'some-git-commit'});

    expect(metricsClient).toHaveBeenCalledTimes(1);
    expect(metricsClient).toHaveBeenCalledWith(
      'userProperties/some-metrics-uid',
      {
        body: '{"App Git Commit":"some-git-commit"}',
        method: 'POST',
      },
    );
  });

  it('caches properties that are also sent in logEvent', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-02-02'));
    jest
      .mocked(getMetricsUid)
      .mockReturnValueOnce('some-metrics-uid')
      .mockReturnValueOnce('some-metrics-uid');

    await backEnd.setCoreProperties({'App Git Commit': 'some-git-commit'});
    await backEnd.logEvent('Screen', {'Screen Name': 'some-screen'});

    expect(metricsClient).toHaveBeenCalledTimes(2);
    expect(metricsClient).toHaveBeenCalledWith(
      'userProperties/some-metrics-uid',
      {
        body: '{"App Git Commit":"some-git-commit"}',
        method: 'POST',
      },
    );
    expect(metricsClient).toHaveBeenCalledWith('logEvent/some-metrics-uid', {
      body: '{"timestamp":"2022-02-02T00:00:00.000Z","event":"Screen","properties":{"App Git Commit":"some-git-commit","Screen Name":"some-screen"}}',
      method: 'POST',
    });
  });

  it('does not send properties if metricsUid is undefined', async () => {
    jest.mocked(getMetricsUid).mockReturnValueOnce(undefined);

    await backEnd.setCoreProperties({'App Git Commit': 'some-git-commit'});

    expect(metricsClient).toHaveBeenCalledTimes(0);
  });
});
