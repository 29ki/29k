import React from 'react';
import debug from 'debug';
import {
  Init,
  LogEvent,
  LogFeedback,
  LogNavigation,
  MetricsProvider as MetricsProviderType,
  SetConsent,
  SetCoreProperties,
  SetUserProperties,
} from './types/Adaptor';
import {PostHogMetricsProvider} from './adaptors/postHog';
import {BackEndMetricsProvider} from './adaptors/backEnd';
import * as postHog from './adaptors/postHog';
import * as backEnd from './adaptors/backEnd';
import {getCurrentRouteName} from '../navigation/utils/routes';
import useNavigationTracker from './hooks/useNavigationTracker';
import useLifecycleTracker from './hooks/useLifecycleTracker';

const logDebug = debug('client:metrics');

export const MetricsProvider: MetricsProviderType = ({children}) => {
  useLifecycleTracker();
  useNavigationTracker();
  return (
    <BackEndMetricsProvider>
      <PostHogMetricsProvider>{children}</PostHogMetricsProvider>
    </BackEndMetricsProvider>
  );
};

export const init: Init = async () => {
  await Promise.all([postHog.init(), backEnd.init()]);
};

export const setConsent: SetConsent = async (haveConsent: boolean) => {
  logDebug('setConsent', haveConsent);
  await Promise.all([
    postHog.setConsent(haveConsent),
    backEnd.setConsent(haveConsent),
  ]);
};

export const logEvent: LogEvent = async (event, properties) => {
  const props = {
    Origin: getCurrentRouteName(), // Do not override Origin if already set
    ...properties,
  };

  logDebug('logEvent %s %p', event, props);

  await Promise.all([
    postHog.logEvent(event, props),
    backEnd.logEvent(event, props),
  ]);
};

export const logNavigation: LogNavigation = async (screenName, properties) => {
  logDebug('logNavigation %s %p', screenName, properties);

  await Promise.all([
    postHog.logNavigation(screenName, properties),
    backEnd.logNavigation(screenName, properties),
  ]);
};

export const logFeedback: LogFeedback = async feedback => {
  logDebug('logFeedback %p', feedback);

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
  logDebug('setUserProperties %p', properties);

  await Promise.all([
    postHog.setUserProperties(properties),
    backEnd.setUserProperties(properties),
  ]);
};

export const setCoreProperties: SetCoreProperties = async properties => {
  logDebug('setCoreProperties %p', properties);

  await Promise.all([
    postHog.setCoreProperties(properties),
    backEnd.setCoreProperties(properties),
  ]);
};
