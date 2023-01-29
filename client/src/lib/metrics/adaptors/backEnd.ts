import {METRICS_ENDPOINT} from 'config';
import dayjs from 'dayjs';
import 'react-native-get-random-values';
import * as uuid from 'uuid';
import {getCorrelationId} from '../../sentry';
import useUserState from '../../user/state/state';
import {trimSlashes} from '../../utils/string';
import {
  Init,
  LogEvent,
  SetConsent,
  SetCoreProperties,
  SetUserProperties,
} from '../types/Adaptor';

const getMetricsUid = async () => {
  const {user, getCurrentUserState, setCurrentUserState} =
    useUserState.getState();

  if (user) {
    const uid = getCurrentUserState()?.metricsUid;

    if (uid) {
      return uid;
    }

    const newUid = uuid.v4();

    setCurrentUserState({metricsUid: newUid});

    return newUid;
  }
};

const metricsClient = async (input: string, init?: RequestInit | undefined) => {
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

let coreProperties = {};

export const init: Init = async () => {};

export const logEvent: LogEvent = async (event, properties) => {
  const uid = getMetricsUid();
  if (uid) {
    await metricsClient(`logEvent/${uid}`, {
      method: 'POST',
      body: JSON.stringify({
        timestamp: dayjs().toISOString(),
        event,
        properties: {
          ...coreProperties,
          ...properties,
        },
      }),
    });
  }
};

export const setConsent: SetConsent = async haveConsent => {};

export const setUserProperties: SetUserProperties = async properties => {
  const uid = getMetricsUid();
  if (uid) {
    await metricsClient(`userProperties/${uid}`, {
      method: 'POST',
      body: JSON.stringify(properties),
    });
  }
};

export const setCoreProperties: SetCoreProperties = async properties => {
  coreProperties = {...coreProperties, ...properties};
  await setUserProperties(properties);
};
