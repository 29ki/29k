import {
  AndroidChannel,
  AndroidImportance,
  NotificationAndroid,
  NotificationIOS,
} from '@notifee/react-native';

export enum NOTIFICATION_CHANNELS {
  SESSION_REMINDER = 'session-reminder',
  PRACTICE_REMINDER = 'practice-reminder',
}

export const NOTIFICATION_CHANNEL_CONFIG: {
  [key in NOTIFICATION_CHANNELS]: {
    channel: Partial<AndroidChannel>;
    android: Partial<NotificationAndroid>;
    ios: Partial<NotificationIOS>;
  };
} = {
  [NOTIFICATION_CHANNELS.SESSION_REMINDER]: {
    channel: {
      importance: AndroidImportance.HIGH,
    },
    android: {
      importance: AndroidImportance.HIGH,
    },
    ios: {
      interruptionLevel: 'timeSensitive',
    },
  },
  [NOTIFICATION_CHANNELS.PRACTICE_REMINDER]: {
    channel: {
      importance: AndroidImportance.DEFAULT,
    },
    android: {
      importance: AndroidImportance.DEFAULT,
    },
    ios: {
      interruptionLevel: 'active',
    },
  },
};

export const DEFAULT_NUMBER_OF_PRACTICE_REMINDERS = 4;
