import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(duration);
dayjs.extend(isToday);

type CounterProps = {
  startTime: dayjs.Dayjs;
};

const Counter: React.FC<CounterProps> = ({startTime}) => {
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

  const isStartingShortly = () => {
    return now.add(1, 'minute').isAfter(startTime);
  };

  const isStarted = () => {
    return now.isAfter(startTime);
  };

  const getTime = () => {
    const diff = dayjs.duration(startTime.diff(now));

    if (!startTime.isToday()) {
      return startTime.format('ddd, D MMM HH:mm');
    }

    if (diff.hours() > 0) {
      return startTime.format('HH:mm');
    }

    return t('inMinutes', {
      minutes: diff.minutes(),
      seconds: diff.seconds(),
    });
  };

  return (
    <>
      {isStarted()
        ? t('started')
        : isStartingShortly()
        ? t('shortly')
        : getTime()}
    </>
  );
};
export default Counter;
