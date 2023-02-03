import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import metricsClient from './metricsClient';

enableFetchMocks();

afterEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe('metricsClient', () => {
  it('adds default Content-Type header', async () => {
    await metricsClient('/some-path');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-metrics-endpoint/some-path', {
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': expect.any(String),
      },
    });
  });

  it('allows overriding Content-Type and authorization', async () => {
    await metricsClient('/some-path', {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('some-metrics-endpoint/some-path', {
      headers: {
        'Content-Type': 'text/plain',
        'X-Correlation-ID': expect.any(String),
      },
    });
  });
});
