import dynamicLinks from '@react-native-firebase/dynamic-links';
import notifee, {
  EventDetail,
  EventType,
  InitialNotification,
} from '@notifee/react-native';
import {appendOrigin} from './utils/url';
import {NOTIFICATION_CHANNELS} from '../notifications/constants';
import {logEvent} from '../metrics';

const resolveNotificationUrl = async (
  source: InitialNotification | EventDetail | null,
): Promise<string | undefined> => {
  const url = source?.notification?.data?.url as string;
  if (url) {
    const dynamicLink = await dynamicLinks().resolveLink(url);
    return appendOrigin(
      dynamicLink.url,
      'notification',
      dynamicLink.utmParameters,
    );
  }
};

const sendMetricEvent = async (detail: EventDetail) => {
  const id = detail.notification?.id as string | undefined;
  const channelId = detail.notification?.data?.channelId as string | undefined;
  const contentId = (detail.notification?.data?.contentId as string) ?? '';

  if (id && channelId && contentId) {
    if (channelId === NOTIFICATION_CHANNELS.PRACTICE_REMINDERS) {
      logEvent('Press Practice Reminder', {
        'Notification ID': id,
        'Notification Channel ID': channelId,
        'Collection ID': contentId,
      });
    }

    if (channelId === NOTIFICATION_CHANNELS.SESSION_REMINDERS) {
      logEvent('Press Session Reminder', {
        'Notification ID': id,
        'Notification Channel ID': channelId,
        'Exercise ID': contentId,
      });
    }
  }
};

export const getInitialURL = async () =>
  await resolveNotificationUrl(await notifee.getInitialNotification());

export const addEventListener = (handler: (url: string) => void) =>
  notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      sendMetricEvent(detail);
      const url = await resolveNotificationUrl(detail);
      if (url) {
        handler(url);
      }
    }
  });
