import {
  AndroidChannel,
  AndroidImportance,
  NotificationAndroid,
  NotificationIOS,
} from '@notifee/react-native';

export enum NOTIFICATION_CHANNELS {
  SESSION_REMINDERS = 'session-reminders',
  PRACTICE_REMINDERS = 'practice-reminders',
}

export const NOTIFICATION_CHANNEL_CONFIG: {
  [key in NOTIFICATION_CHANNELS]: {
    channel: Partial<AndroidChannel>;
    android: Partial<NotificationAndroid>;
    ios: Partial<NotificationIOS>;
  };
} = {
  [NOTIFICATION_CHANNELS.SESSION_REMINDERS]: {
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
  [NOTIFICATION_CHANNELS.PRACTICE_REMINDERS]: {
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
