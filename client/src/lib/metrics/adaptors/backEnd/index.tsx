import React from 'react';
import dayjs from 'dayjs';
import {
  Init,
  LogEvent,
  LogFeedback,
  MetricsProvider,
  SetConsent,
  SetCoreProperties,
  SetUserProperties,
} from '../../types/Adaptor';
import getMetricsUid from './utils/getMetricsUid';
import metricsClient from './utils/metricsClient';
import useNavigationTracker from './hooks/useNavigationTracker';
import {DEFAULT_CONSENT} from '../..';

let haveConsent = DEFAULT_CONSENT;

let coreProperties = {};

export const BackEndMetricsProvider: MetricsProvider = ({children}) => {
  useNavigationTracker();
  return <>{children}</>;
};

export const init: Init = async () => {};

export const setConsent: SetConsent = async enabled => {
  haveConsent = enabled;
};

export const logEvent: LogEvent = async (event, properties) => {
  const uid = getMetricsUid();
  if (uid && haveConsent) {
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

export const logFeeback: LogFeedback = async feedback => {
  await metricsClient('logFeedback', {
    method: 'POST',
    body: JSON.stringify(feedback),
  });
};

export const setUserProperties: SetUserProperties = async properties => {
  const uid = getMetricsUid();
  if (uid && haveConsent) {
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
