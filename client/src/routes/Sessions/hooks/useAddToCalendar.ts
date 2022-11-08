import {Dayjs} from 'dayjs';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

const useAddToCalendar = () => {
  const {t} = useTranslation('Component.AddToCalendar');

  return useCallback(
    (
      exerciseName: string | undefined,
      url: string | undefined,
      startDate: Dayjs,
      endDate: Dayjs,
    ) => {
      AddCalendarEvent.presentEventCreatingDialog({
        title: t('title', {name: exerciseName}),
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
