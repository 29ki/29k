import React from 'react';
import PostHog, {PostHogProvider} from 'posthog-react-native';
import {POSTHOG_API_KEY} from 'config';
import {DEFAULT_CONSENT} from '../../constants';
import {
  Init,
  LogEvent,
  LogFeedback,
  LogNavigation,
  MetricsProvider,
  SetCoreProperties,
  SetUserProperties,
} from '../../types/Adaptor';

let postHog: PostHog | undefined;
let initPromise: Promise<PostHog> | undefined;

export const PostHogMetricsProvider: MetricsProvider = ({children}) => (
  <PostHogProvider
    client={postHog}
    autocapture={{
      captureTouches: false,
      captureLifecycleEvents: false, // Handled by MetricsProvider
      captureScreens: false, // Handled by MetricsProvider
    }}>
    {children}
  </PostHogProvider>
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

export const logNavigation: LogNavigation = async (screenName, properties) => {
  await postHog?.screen(screenName, properties);
};

export const logFeeback: LogFeedback = async () => {};

export const setUserProperties: SetUserProperties = async (
  properties,
  once = false, // Overwrite existing properties?
) => {
  await postHog?.identify(
    undefined,
    once
      ? {
          $set_once: properties,
        }
      : properties,
  );
};

export const setCoreProperties: SetCoreProperties = async properties => {
  await Promise.all([
    postHog?.register(properties),
    setUserProperties(properties),
  ]);
};
