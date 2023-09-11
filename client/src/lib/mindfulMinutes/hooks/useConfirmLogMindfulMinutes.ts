import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Platform} from 'react-native';
import {logEvent} from '../../metrics';
import useLogMindfulMinutes from './useLogMindfulMinutes';

const useConfirmLogMindfulMinutes = () => {
  const {t} = useTranslation('Component.ConfirmLogMindfulMinutes');
  const {
    mindfulMinutesAvailable,
    mindfulMinutesEnabled,
    setMindfulMinutesEnabled,
  } = useLogMindfulMinutes();

  const confirmLogMindfulMinutes = useCallback(async () => {
    if (mindfulMinutesAvailable && mindfulMinutesEnabled === undefined) {
      Alert.alert(
        t('title', {context: Platform.OS}),
        t('message', {context: Platform.OS}),
        [
          {
            text: t('actions.dismiss'),
            style: 'destructive',
            onPress: async () => {
              await setMindfulMinutesEnabled(false);
              logEvent('Decline Mindful Minutes Logging', undefined);
            },
          },
          {
            text: t('actions.cancel'),
            onPress: () => {
              logEvent('Postpone Mindful Minutes Logging', undefined);
            },
          },
          {
            text: t('actions.confirm'),
            onPress: async () => {
              await setMindfulMinutesEnabled(true);
              logEvent('Accept Mindful Minutes Logging', undefined);
            },
          },
        ],
      );
    }
  }, [t, mindfulMinutesEnabled, setMindfulMinutesEnabled]);

  return confirmLogMindfulMinutes;
};

export default useConfirmLogMindfulMinutes;
