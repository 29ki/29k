import React from 'react';
import {
  Init,
  LogEvent,
  SetConsent,
  SetCoreProperties,
  SetUserProperties,
} from './types/Adaptor';
import {Provider as PostHogProvider} from './adaptors/postHog';
import * as postHog from './adaptors/postHog';
import * as backEnd from './adaptors/backEnd';

export const DEFAULT_CONSENT = true;

export const MetricsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => <PostHogProvider>{children}</PostHogProvider>;

export const init: Init = async () => {
  await Promise.all([postHog.init(), backEnd.init()]);
};

export const setConsent: SetConsent = async (haveConsent: boolean) => {
  await Promise.all([
    postHog.setConsent(haveConsent),
    backEnd.setConsent(haveConsent),
  ]);
};

export const logEvent: LogEvent = async (event, properties) => {
  await Promise.all([
    postHog.logEvent(event, properties),
    backEnd.logEvent(event, properties),
  ]);
};

export const setUserProperties: SetUserProperties = async properties => {
  await Promise.all([
    postHog.setUserProperties(properties),
    backEnd.setUserProperties(properties),
  ]);
};

export const setCoreProperties: SetCoreProperties = async properties => {
  await Promise.all([
    postHog.setCoreProperties(properties),
    backEnd.setCoreProperties(properties),
  ]);
};
