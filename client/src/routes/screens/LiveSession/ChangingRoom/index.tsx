import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Alert, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';

import {DailyContext} from '../../../../lib/daily/DailyProvider';
import {LiveSessionStackProps} from '../../../../lib/navigation/constants/routes';
import useLocalParticipant from '../../../../lib/daily/hooks/useLocalParticipant';
import useSubscribeToSessionIfFocused from '../../../../lib/session/hooks/useSubscribeToSessionIfFocused';
import {getSessionToken} from '../../../../lib/sessions/api/session';
import useLiveSessionMetricEvents from '../../../../lib/session/hooks/useLiveSessionMetricEvents';
import useIsAllowedToJoin from '../../../../lib/session/hooks/useIsAllowedToJoin';
import Loading from './components/Loading';
import SessionOnboarding from './components/SessionOnboarding';
import HairCheck from './components/HairCheck';
import {PERMISSIONS, checkMultiple} from 'react-native-permissions';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  default: PERMISSIONS.ANDROID.CAMERA,
});
const MICROPHONE_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.MICROPHONE,
  default: PERMISSIONS.ANDROID.RECORD_AUDIO,
});

const ChangingRoom = () => {
  const {t} = useTranslation('Screen.ChangingRoom');

  const {goBack} = useNavigation();
  const {preJoinMeeting} = useContext(DailyContext);

  const {
    params: {session},
  } = useRoute<RouteProp<LiveSessionStackProps, 'ChangingRoom'>>();

  const isAllowedToJoin = useIsAllowedToJoin();
  useSubscribeToSessionIfFocused(session);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const isFocused = useIsFocused();
  const me = useLocalParticipant();
  const logSessionMetricEvent = useLiveSessionMetricEvents();

  const checkPermissions = useCallback(async () => {
    const permissions = await checkMultiple([
      CAMERA_PERMISSION,
      MICROPHONE_PERMISSION,
    ]);
    /*
      Show session onboarding if all permissions have not yet been granted. 
      We use react-native-permissions here as Daily won't give us that information 
      until we've asked the user for permissions
    */
    setShowOnboarding(
      permissions[CAMERA_PERMISSION] !== 'granted' ||
        permissions[MICROPHONE_PERMISSION] !== 'granted',
    );
  }, [setShowOnboarding]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  useEffect(() => {
    setIsLoading(!me);
  }, [me]);

  useEffect(() => {
    logSessionMetricEvent('Enter Changing Room');
  }, [logSessionMetricEvent]);

  const preJoin = useCallback(
    async (url: string, id: string) => {
      try {
        const token = await getSessionToken(id);
        preJoinMeeting(url, token);
      } catch (e: any) {
        Alert.alert(t('errorTitle'), t(`errors.${e.code ?? e.message}`), [
          {
            onPress: goBack,
            style: 'cancel',
          },
        ]);
      }
    },
    [goBack, t, preJoinMeeting],
  );

  useEffect(() => {
    const run = async () => {
      // If switching between sessions, the session will first be the old one
      // and then beacome the current one by useSubscribeToSessionIfFocused.
      // Only pre join when the session is the same as passed in by params
      if (isFocused && session?.url && session?.id) {
        // Checks against the backend to see that the session is still available
        const allowedToJoin = await isAllowedToJoin(session.id);
        if (allowedToJoin) {
          preJoin(session.url, session.id);
        }
      }
    };
    run();
  }, [isFocused, session?.url, session?.id, preJoin, isAllowedToJoin]);

  const onHideOnboarding = useCallback(() => setShowOnboarding(false), []);

  if (isLoading) return <Loading />;

  if (showOnboarding)
    return <SessionOnboarding onHideOnboarding={onHideOnboarding} />;

  return <HairCheck />;
};

export default ChangingRoom;
