import {LinkingOptions} from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import notifee, {
  EventDetail,
  EventType,
  InitialNotification,
} from '@notifee/react-native';
import {Linking} from 'react-native';
import {utils} from '@react-native-firebase/app';
import {DEEP_LINK_SCHEMA, DEEP_LINK_PREFIX} from 'config';

import {RootNavigationProps} from './constants/routes';

const resolveNotificationUrl = async (
  source: InitialNotification | EventDetail | null,
): Promise<string | undefined> => {
  const url = source?.notification?.data?.url as string;
  if (url) {
    return (await dynamicLinks().resolveLink(url)).url;
  }
};

// Deep link configuration
const config: LinkingOptions<RootNavigationProps>['config'] = {
  initialRouteName: 'OverlayStack',
  screens: {
    AddSessionByInviteModal: 'joinSessionInvite/:inviteCode',
    UpgradeAccountModal: 'verifyPublicHostCode/:code',
  },
};

// Linking setup
const linking: LinkingOptions<RootNavigationProps> = {
  config,

  prefixes: [DEEP_LINK_SCHEMA, DEEP_LINK_PREFIX],

  // Custom function to get the URL which was used to open the app
  async getInitialURL() {
    // First, you would need to get the initial URL from your third-party integration
    // The exact usage depend on the third-party SDK you use
    // For example, to get to get the initial URL for Firebase Dynamic Links:
    const {isAvailable} = utils().playServicesAvailability;

    if (isAvailable) {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        return initialLink.url;
      }
    }

    // Second, check for the app being opened from a notification
    const notificationUrl = await resolveNotificationUrl(
      await notifee.getInitialNotification(),
    );
    if (notificationUrl) {
      return notificationUrl;
    }

    // As a fallback, you may want to do the default deep link handling
    const url = await Linking.getInitialURL();

    return url;
  },

  // Custom function to subscribe to incoming links
  subscribe(listener) {
    // Listen to incoming links from Firebase Dynamic Links
    const unsubscribeFirebase = dynamicLinks().onLink(({url}) => {
      listener(url);
    });

    // Listen to incoming links from Notifee notifications
    const unsubscribeNotifee = notifee.onForegroundEvent(
      async ({type, detail}) => {
        if (type === EventType.PRESS) {
          const url = await resolveNotificationUrl(detail);
          if (url) {
            listener(url);
          }
        }
      },
    );

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', ({url}) => {
      listener(url);
    });

    return () => {
      // Clean up the event listeners
      unsubscribeFirebase();
      unsubscribeNotifee();
      linkingSubscription.remove();
    };
  },
};

export default linking;
