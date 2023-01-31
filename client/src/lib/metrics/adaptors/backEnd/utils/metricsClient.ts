import {METRICS_ENDPOINT} from 'config';
import {getCorrelationId} from '../../../../sentry';
import {trimSlashes} from '../../../../utils/string';

const metricsClient = async (input: string, init?: RequestInit | undefined) => {
  if (!METRICS_ENDPOINT) {
    return;
  }

  const correlationId = getCorrelationId();

  return fetch(`${trimSlashes(METRICS_ENDPOINT)}/${trimSlashes(input)}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-ID': correlationId,
      ...init?.headers,
    },
  });
};

export default metricsClient;
