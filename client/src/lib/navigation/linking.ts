import {LinkingOptions, getStateFromPath} from '@react-navigation/native';
import {DEEP_LINK_SCHEME, DEEP_LINK_PREFIX} from 'config';
import {RootNavigationProps} from './constants/routes';

import * as airbridge from '../linking/airbridge';
import * as dynamicLinks from '../linking/dynamicLinks';
import * as notifications from '../linking/notifications';
import * as nativeLinks from '../linking/nativeLinks';

import useAppState from '../appState/state/state';

// Deep link configuration
const config: LinkingOptions<RootNavigationProps>['config'] = {
  initialRouteName: 'OverlayStack',
  screens: {
    UnlockCollectionModal: 'unlockCollection/:collectionId',
    AddSessionByInviteModal: 'joinSessionInvite/:inviteCode',
    HostSessionByInviteModal: 'hostSessionInvite/:hostingCode',
    UpgradeAccountModal: 'verifyPublicHostCode/:code',
    CreateSessionModal: 'sessions/:exerciseId',
    OverlayStack: {
      initialRouteName: 'App',
      screens: {
        App: {
          screens: {
            Tabs: {
              initialRouteName: 'ExploreStack',
              screens: {
                ExploreStack: {
                  initialRouteName: 'Explore',
                  screens: {
                    Collection: 'collections/:collectionId',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const linking: LinkingOptions<RootNavigationProps> = {
  config,

  prefixes: [`${DEEP_LINK_SCHEME}://`, ...DEEP_LINK_PREFIX.split(',')],

  async getInitialURL() {
    const airbridgeURL = await airbridge.getInitialURL();
    if (airbridgeURL) {
      return airbridgeURL;
    }

    const dynamicLinkURL = await dynamicLinks.getInitialURL();
    if (dynamicLinkURL) {
      return dynamicLinkURL;
    }

    const notificationURL = await notifications.getInitialURL();
    if (notificationURL) {
      return notificationURL;
    }

    const nativeLinkURL = await nativeLinks.getInitialURL();
    if (nativeLinkURL) {
      return nativeLinkURL;
    }
  },

  subscribe(listener) {
    const unsubscribeAirbridge = airbridge.addEventListener(listener);

    const unsubscribeDynamicLinks = dynamicLinks.addEventListener(listener);

    const unsubscribeNotifications = notifications.addEventListener(listener);

    const unsubscribeNativeLinks = nativeLinks.addEventListener(listener);

    return () => {
      unsubscribeAirbridge();
      unsubscribeDynamicLinks();
      unsubscribeNotifications();
      unsubscribeNativeLinks();
    };
  },

  getStateFromPath(path, options) {
    const state = getStateFromPath(path, options);
    if (state) {
      // If state is resolved from deep link - skip onboarding
      useAppState.getState().setSettings({showOnboarding: false});
    }
    return state;
  },
};

export default linking;
