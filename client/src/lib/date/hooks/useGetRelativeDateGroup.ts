import dayjs, {Dayjs} from 'dayjs';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

const useGetRelativeDateGroup = () => {
  const {t} = useTranslation('Component.RelativeDateGroup');

  return useCallback(
    (date: Dayjs) => {
      if (date.isToday()) {
        return t('today');
      }
      if (date.isTomorrow()) {
        return t('tomorrow');
      }
      if (date.isoWeek() === dayjs().isoWeek()) {
        return t('thisWeek');
      }
      if (date.isoWeek() === dayjs().add(1, 'week').isoWeek()) {
        return t('nextWeek');
      }

      return t('upcoming');
    },
    [t],
  );
};

export default useGetRelativeDateGroup;
