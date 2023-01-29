import Events from './Events';
import CoreProperties from './CoreProperties';
import UserProperties from './UserProperties';

type AnyUserProperty = Partial<UserProperties>;
type AnyCoreProperty = Partial<CoreProperties>;

export type Init = () => Promise<void>;

export type SetConsent = (haveConsent: boolean) => Promise<void>;

export type LogEvent = <Event extends keyof Events>(
  event: Event,
  properties: Events[Event] extends object ? Events[Event] : undefined,
) => Promise<void>;

export type SetUserProperties = (
  properties: AnyUserProperty & AnyCoreProperty,
) => Promise<void>;

export type SetCoreProperties = (properties: AnyCoreProperty) => Promise<void>;
