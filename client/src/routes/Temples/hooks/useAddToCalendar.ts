import {Dayjs} from 'dayjs';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import NS from '../../../lib/i18n/constants/namespaces';

const useAddToCalendar = () => {
  const {t} = useTranslation(NS.COMPONENT.ADD_TO_CALENDAR);

  return useCallback(
    (
      sessionName: string | undefined,
      exerciseName: string | undefined,
      startDate: Dayjs,
      endDate: Dayjs,
    ) => {
      const url = 'https://app.29k.org'; // TODO: deep link here

      AddCalendarEvent.presentEventCreatingDialog({
        title: t('title', {name: sessionName}),
        notes: t('notes', {
          name: exerciseName,
          url,
          interpolation: {escapeValue: false},
        }),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: t('location'),
        url, // iOS only
      });
    },
    [t],
  );
};

export default useAddToCalendar;
