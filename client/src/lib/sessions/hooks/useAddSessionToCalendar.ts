import {Dayjs} from 'dayjs';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking, Platform} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import * as Permissions from 'react-native-permissions';
import useRestartApp from '../../codePush/hooks/useRestartApp';

const useAddSessionToCalendar = () => {
  const {t} = useTranslation('Component.AddToCalendar');
  const {t: permissionT} = useTranslation(
    'Component.RequestCalendarPermission',
  );

  const restartApp = useRestartApp();

  const openSettings = useCallback(async () => {
    await Linking.openSettings();
    // Restart JS-bundle to let permissions come into effect
    restartApp();
  }, [restartApp]);

  return useCallback(
    async (
      exerciseName: string | undefined,
      host: string | undefined | null,
      url: string | undefined,
      startDate: Dayjs,
      endDate: Dayjs,
    ) => {
      const permission = await Permissions.request(
        Platform.select({
          ios: Permissions.PERMISSIONS.IOS.CALENDARS_WRITE_ONLY,
          default: Permissions.PERMISSIONS.ANDROID.WRITE_CALENDAR,
        }),
      );

      if (permission === Permissions.RESULTS.GRANTED) {
        AddCalendarEvent.presentEventCreatingDialog({
          title: t('title', {name: exerciseName}),
          notes: t('notes', {
            name: exerciseName,
            host,
            url,
            interpolation: {escapeValue: false},
          }),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          location: t('location'),
          url, // iOS only
        });
      } else {
        Alert.alert(permissionT('title'), permissionT('message'), [
          {style: 'cancel', text: permissionT('actions.cancel')},
          {
            style: 'default',
            text: permissionT('actions.confirm'),
            onPress: openSettings,
          },
        ]);
      }
    },
    [t, permissionT, openSettings],
  );
};

export default useAddSessionToCalendar;
