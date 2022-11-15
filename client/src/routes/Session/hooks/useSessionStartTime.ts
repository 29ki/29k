import {useEffect, useState} from 'react';
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

  useEffect(() => {
    if (active) {
      return;
    }

    if (startTime.isToday()) {
      setActive(true);
    }
  }, [active, now, startTime]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  const isStarted = () => {
    return now.isAfter(startTime);
  };

  const isStartingShortly = () => {
    return now.add(1, 'minute').isAfter(startTime);
  };

  const isReadyToJoin = () => {
    return now.add(10, 'minutes').isAfter(startTime);
  };

  const isInLessThanAnHour = () => {
    return now.add(1, 'hour').isAfter(startTime);
  };

  const getTime = () => {
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
  };

  return {
    isStartingShortly: isStartingShortly(),
    isReadyToJoin: isReadyToJoin(),
    isStarted: isStarted(),
    time: getTime(),
    isInLessThanAnHour: isInLessThanAnHour(),
  };
};

export default useSessionStartTime;
