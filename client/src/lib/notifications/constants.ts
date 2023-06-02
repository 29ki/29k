import {
  AndroidChannel,
  AndroidImportance,
  NotificationAndroid,
  NotificationIOS,
} from '@notifee/react-native';
import {COLORS} from '../../../../shared/src/constants/colors';

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
      smallIcon: 'ic_small_icon',
      color: COLORS.PRIMARY,
    },
    ios: {
      interruptionLevel: 'timeSensitive',
    },
  },
  [NOTIFICATION_CHANNELS.PRACTICE_REMINDERS]: {
    channel: {
      importance: AndroidImportance.HIGH,
    },
    android: {
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_small_icon',
      color: COLORS.PRIMARY,
    },
    ios: {
      interruptionLevel: 'active',
    },
  },
};
