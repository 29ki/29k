import React from 'react';
import dayjs from 'dayjs';
import 'react-native-get-random-values';
import {
  Init,
  LogEvent,
  MetricsProvider,
  SetConsent,
  SetCoreProperties,
  SetUserProperties,
} from '../../types/Adaptor';
import getMetricsUid from './utils/getMetricsUid';
import metricsClient from './utils/metricsClient';
import useNavigationTracker from './hooks/useNavigationTracker';

let coreProperties = {};

export const BackEndMetricsProvider: MetricsProvider = ({children}) => {
  useNavigationTracker();
  return <>{children}</>;
};

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

export const setConsent: SetConsent = async () => {};

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
  await setUserProperties(coreProperties);
};
