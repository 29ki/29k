import {useCallback, useEffect, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isToday from 'dayjs/plugin/isToday';
import {useTranslation} from 'react-i18next';

dayjs.extend(duration);
dayjs.extend(isToday);

const useSessionStartTime = (startTime: dayjs.Dayjs) => {
  const {t} = useTranslation('Component.Counter');
  const [now, setNow] = useState(dayjs());
  const [active, setActive] = useState(false);

  const isStarted = useCallback(() => now.isAfter(startTime), [startTime, now]);

  const isStartingShortly = useCallback(
    () => now.add(1, 'minute').isAfter(startTime),
    [startTime, now],
  );

  const isReadyToJoin = useCallback(
    () => now.add(10, 'minutes').isAfter(startTime),
    [startTime, now],
  );

  const isInLessThanAnHour = useCallback(
    () => now.add(1, 'hour').isAfter(startTime),
    [now, startTime],
  );

  const getTime = useCallback(() => {
    const diff = dayjs.duration(startTime.diff(now));

    if (!startTime.isToday()) {
      return startTime.format('ddd, D MMM LT');
    }

    if (diff.hours() > 0) {
      return startTime.format('LT');
    }

    return t('inMinutes', {
      minutes: diff.minutes(),
      seconds: diff.seconds(),
    });
  }, [startTime, now, t]);

  useEffect(() => {
    const started = isStarted();

    if (started) {
      setActive(false);
    } else if (startTime.isToday()) {
      setActive(true);
    }
  }, [active, now, startTime, isStarted]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const interval = setInterval(() => setNow(dayjs()), 1000);

    return () => clearInterval(interval);
  }, [active]);

  return useMemo(
    () => ({
      isStartingShortly: isStartingShortly(),
      isReadyToJoin: isReadyToJoin(),
      isStarted: isStarted(),
      time: getTime(),
      isInLessThanAnHour: isInLessThanAnHour(),
    }),
    [isStartingShortly, isReadyToJoin, isStarted, isInLessThanAnHour, getTime],
  );
};

export default useSessionStartTime;
