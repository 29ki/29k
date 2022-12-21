import React from 'react';
import PostHog, {PostHogProvider} from 'posthog-react-native';
import {POSTHOG_API_KEY} from 'config';
import Events from './types/Events';
import CoreProperties from './types/CoreProperties';
import UserProperties from './types/UserProperties';

const DEFAULT_CONSENT = true;

let postHog: PostHog | undefined;
let initPromise: Promise<PostHog> | undefined;

export const init = async () => {
  if (!POSTHOG_API_KEY) {
    return initPromise;
  }

  if (!initPromise) {
    postHog = await (initPromise = PostHog.initAsync(POSTHOG_API_KEY, {
      host: 'https://eu.posthog.com',
    }));

    setConsent(DEFAULT_CONSENT);
  }

  return initPromise;
};

export const setConsent = async (haveConsent: boolean) =>
  haveConsent ? (await init())?.optIn() : (await init())?.optOut();

export const MetricsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => <PostHogProvider client={postHog}>{children}</PostHogProvider>;

type AnyUserProperty = Partial<UserProperties>;
type AnyCoreProperty = Partial<CoreProperties>;

// Posthog event user properties https://posthog.com/docs/integrate/user-properties
type EventUserProperties = {
  $set?: AnyUserProperty;
  $set_once?: AnyUserProperty;
  $unset?: [keyof UserProperties];
};

type LogEvent = <Event extends keyof Events>(
  event: Event,
  properties: Events[Event] extends object
    ? Events[Event] & EventUserProperties
    : undefined | EventUserProperties,
) => typeof postHog;

export const logEvent: LogEvent = (event, properties) =>
  postHog?.capture(event, properties);

export const setUserProperties = (
  properties: AnyUserProperty & AnyCoreProperty,
) => postHog?.identify(undefined, properties);

export const setCoreProperties = (properties: AnyCoreProperty) => {
  postHog?.register(properties);
  setUserProperties(properties);
};
