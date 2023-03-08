import dynamicLinks from '@react-native-firebase/dynamic-links';
import notifee, {
  EventDetail,
  EventType,
  InitialNotification,
} from '@notifee/react-native';
import {appendOrigin} from './utils';

const resolveNotificationUrl = async (
  source: InitialNotification | EventDetail | null,
): Promise<string | undefined> => {
  const url = source?.notification?.data?.url as string;
  if (url) {
    return appendOrigin(
      (await dynamicLinks().resolveLink(url)).url,
      'notification',
    );
  }
};

export const getInitialURL = async () =>
  resolveNotificationUrl(await notifee.getInitialNotification());

export const addEventListener = (handler: (url: string) => void) =>
  notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      const url = await resolveNotificationUrl(detail);
      if (url) {
        handler(url);
      }
    }
  });
