import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking} from 'react-native';
import useRestartApp from '../../codePush/hooks/useRestartApp';

const useRequestNotificationPermission = () => {
  const restartApp = useRestartApp();
  const {t} = useTranslation('Component.RequestNotificationPermission');

  const openSettings = useCallback(async () => {
    await Linking.openSettings();
    // Restart JS-bundle to let permissions come into effect
    restartApp();
  }, [restartApp]);

  const requestPermission = useCallback(async () => {
    const permission = await notifee.requestPermission();

    if (permission.authorizationStatus === AuthorizationStatus.DENIED) {
      Alert.alert(t('title'), t('message'), [
        {style: 'cancel', text: t('actions.cancel')},
        {
          style: 'default',
          text: t('actions.confirm'),
          onPress: openSettings,
        },
      ]);

      throw new Error('Notification permission denied');
    }

    return permission;
  }, [t, openSettings]);

  return requestPermission;
};

export default useRequestNotificationPermission;
