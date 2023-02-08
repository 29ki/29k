import React from 'react';
import PostHog, {PostHogProvider} from 'posthog-react-native';
import {POSTHOG_API_KEY} from 'config';
import {DEFAULT_CONSENT} from '../../constants';
import {
  Init,
  LogEvent,
  LogFeedback,
  MetricsProvider,
  SetCoreProperties,
  SetUserProperties,
} from '../../types/Adaptor';

let postHog: PostHog | undefined;
let initPromise: Promise<PostHog> | undefined;

export const PostHogMetricsProvider: MetricsProvider = ({children}) => (
  <PostHogProvider client={postHog}>{children}</PostHogProvider>
);

const initPostHog = async () => {
  if (!POSTHOG_API_KEY) {
    return;
  }

  if (!initPromise) {
    postHog = await (initPromise = PostHog.initAsync(POSTHOG_API_KEY, {
      host: 'https://eu.posthog.com',
    }));

    await setConsent(DEFAULT_CONSENT);
  }

  return initPromise;
};

export const init: Init = async () => {
  await initPostHog();
};

export const setConsent = async (haveConsent: boolean) =>
  haveConsent
    ? (await initPostHog())?.optIn()
    : (await initPostHog())?.optOut();

export const logEvent: LogEvent = async (event, properties) => {
  await postHog?.capture(event, properties);
};

export const logFeeback: LogFeedback = async () => {};

export const setUserProperties: SetUserProperties = async properties => {
  await postHog?.identify(undefined, properties);
};

export const setCoreProperties: SetCoreProperties = async properties => {
  await Promise.all([
    postHog?.register(properties),
    setUserProperties(properties),
  ]);
};
