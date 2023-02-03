import React from 'react';
import {
  Init,
  LogEvent,
  LogFeedback,
  MetricsProvider as MetricsProviderType,
  SetConsent,
  SetCoreProperties,
  SetUserProperties,
} from './types/Adaptor';
import {PostHogMetricsProvider} from './adaptors/postHog';
import {BackEndMetricsProvider} from './adaptors/backEnd';
import * as postHog from './adaptors/postHog';
import * as backEnd from './adaptors/backEnd';

export const DEFAULT_CONSENT = true;

export const MetricsProvider: MetricsProviderType = ({children}) => (
  <BackEndMetricsProvider>
    <PostHogMetricsProvider>{children}</PostHogMetricsProvider>
  </BackEndMetricsProvider>
);

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

export const logFeedback: LogFeedback = async feedback => {
  await Promise.all([
    logEvent('Sharing Session Feedback', {
      'Exercise ID': feedback.exerciseId,
      'Sharing Session Completed': feedback.completed,
      'Sharing Session ID': feedback.sessionId,
      Host: feedback.host,
      'Feedback Question': feedback.question,
      'Feedback Answer': feedback.answer,
      'Feedback Comment': feedback.comment,
    }),
    postHog.logFeeback(feedback),
    backEnd.logFeeback(feedback),
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
