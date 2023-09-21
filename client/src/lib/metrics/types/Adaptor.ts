import Events from './Events';
import CoreProperties from './CoreProperties';
import UserProperties from './UserProperties';
import React from 'react';

import {DefaultProperties} from './Properties';
import {DeviceInfo} from '../../utils/system';
import {FeedbackInput} from '../../../../../shared/src/types/Feedback';

type AnyUserProperty = Partial<UserProperties>;
type AnyCoreProperty = Partial<CoreProperties>;

export type MetricsProvider = React.FC<{children: React.ReactNode}>;

export type Init = () => Promise<void>;

export type SetConsent = (haveConsent: boolean) => Promise<void>;

export type LogEvent = <Event extends keyof Events>(
  event: Event,
  properties: Events[Event] extends object
    ? Events[Event] & DefaultProperties
    : DefaultProperties,
) => Promise<void>;

export type LogNavigation = (
  screenName: string,
  properties?: Omit<Events['Screen'], 'Screen Name'> & DefaultProperties,
) => Promise<void>;

export type LogFeedback = (
  feedback: FeedbackInput,
  deviceInfo?: DeviceInfo,
) => Promise<void>;

export type SetUserProperties = (
  properties: AnyUserProperty & AnyCoreProperty,
  once?: boolean,
) => Promise<void>;

export type SetCoreProperties = (properties: AnyCoreProperty) => Promise<void>;
